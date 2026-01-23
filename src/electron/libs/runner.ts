import { query, type SDKMessage, type PermissionResult } from "@anthropic-ai/claude-agent-sdk";
import type { ServerEvent } from "../types.js";
import type { Session } from "./session-store.js";
import { checkIfDeletionOperation } from "../../shared/deletion-detection.js";
import { RUNNER_TIMEOUT } from "../config/constants.js";

import { getCurrentApiConfig, buildEnvForConfig, buildEnvForConfigWithProxy, checkProxyNeeded, getClaudeCodePath } from "./claude-settings.js";
import { getEnhancedEnv } from "./util.js";
import { addLanguagePreference } from "../utils/language-detector.js";
import { transformSlashCommand } from "./slash-commands.js";
import { memoryStore, getMemoryToolConfig } from "./memory-tools.js";
import { createMemoryMcpServer } from "./memory-mcp-server.js";
import { createClaudeMemoryToolServer } from "./claude-memory-mcp-server.js";
import { loadSdkNativeConfig, type SdkNativeConfig } from "./sdk-native-loader.js";
import { loadMcpServers, type McpServerConfig } from "./mcp-store.js";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// ========== 全局缓存 - 跨会话复用 ==========
// MCP 服务器实例缓存（按名称存储）
const mcpServersCache: Record<string, any> = {};
// 记忆指南系统提示缓存
let memoryGuidancePromptCache: string | null = null;

/**
 * 清除全局缓存（在配置更改时调用）
 * 注意：这会关闭所有缓存的 MCP 服务器
 */
export function clearRunnerCache(): void {
  // 关闭所有缓存的 MCP 服务器
  for (const [name, server] of Object.entries(mcpServersCache)) {
    try {
      if (server?.close && typeof server.close === 'function') {
        server.close();
      }
    } catch (e) {
      /* 忽略关闭错误 */
    }
    delete mcpServersCache[name];
  }
  // 清除记忆提示缓存
  memoryGuidancePromptCache = null;
}


export type RunnerOptions = {
  prompt: string;
  session: Session;
  resumeSessionId?: string;
  onEvent: (event: ServerEvent) => void;
  onSessionUpdate?: (updates: Partial<Session>) => void;
};

export type RunnerHandle = {
  abort: () => void;
};

const DEFAULT_CWD = process.cwd();

// checkIfDeletionOperation 已从共享模块导入

/**
 * 触发自动记忆分析
 * 让 AI 清洗会话内容并提取关键信息存储到记忆
 */
async function triggerAutoMemoryAnalysis(
  session: Session,
  prompt: string,
  memConfig: { autoStoreCategories: string[]; defaultK: number },
  onEvent: (event: ServerEvent) => void
): Promise<void> {
  const { log } = await import("../logger.js");

  // 发送记忆分析开始状态（可选，用于显示分析中状态）
  // onEvent({
  //   type: "memory.status",
  //   payload: { sessionId: session.id, stored: false, message: "正在分析..." }
  // });

  try {
    // 只对特定分类的会话进行自动记忆
    if (!memConfig.autoStoreCategories.includes('project') && !memConfig.autoStoreCategories.includes('technical')) {
      // 发送未存储状态
      onEvent({
        type: "memory.status",
        payload: { sessionId: session.id, stored: false, message: "分类未启用自动存储" }
      });
      return;
    }

    log.info(`[Auto Memory] Starting analysis for session ${session.id}`);

    // 使用简单的关键词检测判断是否值得存储
    const hasValuableContent = /问题|解决|配置|实现|功能|错误|修复|decision|fix|implement/.test(prompt.toLowerCase());
    if (!hasValuableContent) {
      log.info(`[Auto Memory] Session skipped - no valuable content detected`);
      // 发送未存储状态
      onEvent({
        type: "memory.status",
        payload: { sessionId: session.id, stored: false, message: "无有价值内容" }
      });
      return;
    }

    // 构建分析提示
    const analysisPrompt = `
## 记忆提取任务

请分析以下会话，提取值得存储到长期记忆的关键信息。

**原始用户请求：**
${prompt}

**记忆存储规范（严格遵守）：**

应该存储：
- ✅ 重要的技术决策和架构选择
- ✅ 用户明确的偏好设置和工作习惯
- ✅ 项目特定的约定和规范
- ✅ 复杂问题的解决方案（经过提炼）
- ✅ 有用的命令和工具组合

不应该存储：
- ❌ 临时性对话和闲聊
- ❌ 重复的信息
- ❌ 过于琐碎的细节（文件路径、随机数字）
- ❌ 原始输出日志（需提炼后再存）
- ❌ AI 的通用知识（非项目特定）

**输出格式（JSON）：**
\`\`\`json
{
  "shouldStore": true/false,
  "title": "简短标题（10字以内）",
  "content": "结构化的记忆内容（Markdown格式，分点陈述）",
  "label": "project/preference/technical/custom"
}
\`\`\`

如果会话内容不值得存储，设置 shouldStore 为 false。

现在请分析并输出 JSON：
`;

    // 调用 AI API 进行分析
    const config = getCurrentApiConfig();
    if (!config) {
      log.warn('[Auto Memory] No API config available');
      return;
    }

    // 使用轻量级的 Anthropic API 调用
    const response = await fetch(`${config.baseURL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model || 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!response.ok) {
      log.error(`[Auto Memory] API error: ${response.status}`);
      return;
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    // 提取 JSON
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      log.warn('[Auto Memory] No JSON found in AI response');
      // 发送未存储状态
      onEvent({
        type: "memory.status",
        payload: { sessionId: session.id, stored: false, message: "AI响应格式错误" }
      });
      return;
    }

    const analysis = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    if (!analysis.shouldStore) {
      log.info('[Auto Memory] AI decided not to store this session');
      // 发送未存储状态
      onEvent({
        type: "memory.status",
        payload: { sessionId: session.id, stored: false, message: "AI判断无需存储" }
      });
      return;
    }

    // 存储到记忆
    const result = await memoryStore(
      analysis.title || `会话-${new Date().toLocaleDateString()}`,
      analysis.content || '',
      analysis.label || 'project'
    );

    log.info(`[Auto Memory] Stored: ${analysis.title} - ${result}`);

    // 发送存储成功状态
    onEvent({
      type: "memory.status",
      payload: { sessionId: session.id, stored: true, title: analysis.title, message: "已存储到记忆" }
    });

  } catch (error) {
    log.error('[Auto Memory] Failed:', error);
    // 发送存储失败状态
    onEvent({
      type: "memory.status",
      payload: { sessionId: session.id, stored: false, message: `存储失败: ${error instanceof Error ? error.message : String(error)}` }
    });
  }
}


export async function runClaude(options: RunnerOptions): Promise<RunnerHandle> {
  const { prompt, session, resumeSessionId, onEvent, onSessionUpdate } = options;
  const abortController = new AbortController();

  const sendMessage = (message: SDKMessage) => {
    onEvent({
      type: "stream.message",
      payload: { sessionId: session.id, message }
    });
  };

  const sendPermissionRequest = (toolUseId: string, toolName: string, input: unknown) => {
    onEvent({
      type: "permission.request",
      payload: { sessionId: session.id, toolUseId, toolName, input }
    });
  };

  // Start the query in the background
  (async () => {
    try {
      // 获取当前配置
      const config = getCurrentApiConfig();
      
      if (!config) {
        onEvent({
          type: "session.status",
          payload: { sessionId: session.id, status: "error", title: session.title, cwd: session.cwd, error: "API configuration not found. Please configure API settings." }
        });
        return;
      }
      
      // 使用 Anthropic SDK
      // 自动检测 API 是否需要代理模式（通过测试 /count_tokens 端点）
      // 程序在后台自动判断，无需用户手动选择
      const needsProxy = await checkProxyNeeded(config);
      const env = needsProxy
        ? buildEnvForConfigWithProxy(config)
        : buildEnvForConfig(config);

      const mergedEnv = {
        ...getEnhancedEnv(),
        ...env
      };
      
      // 添加语言偏好提示，优先使用用户输入的语言回复
      // 使用 extraArgs 传递系统提示，不影响用户输入的 prompt
      const enhancedPrompt = addLanguagePreference(prompt);
      const languageHint = enhancedPrompt !== prompt ? enhancedPrompt.split('\n\n')[0] : undefined;

      // 转换斜杠命令为 SDK 可识别的格式
      // - 内置命令（如 /commit）直接发送
      // - 用户技能（如 /git-commit）转换为"请使用 X 技能"
      const transformedPrompt = transformSlashCommand(prompt);

      // 获取记忆配置
      const memConfig = getMemoryToolConfig();

      // 发送初始记忆状态（表示记忆功能已启用）
      if (memConfig.enabled) {
        onEvent({
          type: "memory.status",
          payload: {
            sessionId: session.id,
            stored: false,
            message: memConfig.autoStore ? "会话结束后自动分析" : "记忆功能已启用"
          }
        });
      }

      // 加载 SDK 原生配置（插件、代理、权限、钩子等）
      const { log } = await import("../logger.js");
      const sdkNativeConfig: SdkNativeConfig = await loadSdkNativeConfig();
      log.info(`[Runner] SDK native config loaded: plugins=${sdkNativeConfig.plugins?.length || 0}, agents=${Object.keys(sdkNativeConfig.agents || {}).length}, allowedTools=${sdkNativeConfig.allowedTools?.length || 0}`);

      // 调试：记录 prompt 转换
      log.info(`[Runner] Original prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);
      if (transformedPrompt !== prompt) {
        log.info(`[Runner] Transformed prompt: "${transformedPrompt.substring(0, 100)}${transformedPrompt.length > 100 ? '...' : ''}"`);
      }
      if (languageHint) {
        log.info(`[Runner] Language hint: ${languageHint.substring(0, 50)}...`);
      }
      log.info(`[Runner] Memory enabled: ${memConfig.enabled}, autoStore: ${memConfig.autoStore}`);

      // 创建 MCP 服务器（包括记忆工具和 settings.json 中的 MCP 服务器）
      // 注意：每次会话创建新的服务器实例，避免复用已关闭的实例
      const mcpServers: Record<string, any> = {};

      // 1. 创建记忆 MCP 服务器（如果启用）
      if (memConfig.enabled) {
        // 并行创建两个 MCP 服务器
        const [memoryToolsServer, claudeMemoryServer] = await Promise.allSettled([
          createMemoryMcpServer(),
          createClaudeMemoryToolServer()
        ]);

        if (memoryToolsServer.status === 'fulfilled') {
          mcpServers["memory-tools"] = memoryToolsServer.value;
          log.info(`[Runner] Memory MCP server created: memory-tools`);
        } else {
          log.warn(`[Runner] Memory MCP server creation failed:`, memoryToolsServer.reason);
        }

        if (claudeMemoryServer.status === 'fulfilled') {
          mcpServers["memory"] = claudeMemoryServer.value;
          log.info(`[Runner] Claude Memory Tool MCP server created: memory`);
        } else {
          log.warn(`[Runner] Claude Memory Tool MCP server creation failed:`, claudeMemoryServer.reason);
        }

        // 如果都失败了，记录警告但不阻塞启动
        if (memoryToolsServer.status === 'rejected' && claudeMemoryServer.status === 'rejected') {
          log.warn('[Runner] Both memory MCP servers failed to initialize, continuing without memory');
        }
      }

      // 2. 加载 settings.json 中的 MCP 服务器
      try {
        const settingsMcpServers = await loadMcpServers();
        log.info(`[Runner] Found ${Object.keys(settingsMcpServers).length} MCP servers in settings.json`);

        for (const [serverName, serverConfig] of Object.entries(settingsMcpServers)) {
          // 跳过禁用的服务器
          if (serverConfig.disabled) {
            log.info(`[Runner] Skipping disabled MCP server: ${serverName}`);
            continue;
          }

          // 跳过已存在的（避免覆盖程序化创建的服务器）
          if (mcpServers[serverName]) {
            log.warn(`[Runner] MCP server '${serverName}' already exists, skipping settings.json config`);
            continue;
          }

          try {
            // 创建 SDK MCP 服务器包装器
            // 注意：SDK 需要实际的服务器实例，而不是配置对象
            // 对于外部 MCP 服务器（stdio/sse），SDK 会自动处理
            // 这里我们创建一个占位符配置，让 SDK 知道服务器的存在
            mcpServers[serverName] = {
              type: serverConfig.type || 'stdio',
              command: serverConfig.command,
              args: serverConfig.args,
              env: serverConfig.env,
              url: serverConfig.url,
            };
            log.info(`[Runner] Settings MCP server loaded: ${serverName} (${serverConfig.type})`);
          } catch (err) {
            log.error(`[Runner] Failed to load MCP server ${serverName}:`, err);
          }
        }
      } catch (error) {
        log.warn('[Runner] Failed to load MCP servers from settings.json:', error);
      }

      log.info(`[Runner] Total MCP servers: ${Object.keys(mcpServers).length}`, Object.keys(mcpServers));

      // 构建记忆使用指南系统提示（简化版，因为工具已通过 MCP 注册）
      // 优化：使用缓存，避免每次会话都重新构建
      let memoryGuidancePrompt: string | undefined;
      if (memConfig.enabled) {
        if (memoryGuidancePromptCache) {
          // 复用缓存
          memoryGuidancePrompt = memoryGuidancePromptCache;
          log.info(`[Runner] Reusing cached memory guidance prompt`);
        } else {
          // 构建并缓存
          memoryGuidancePrompt = `
## AI 记忆功能

你有访问两类记忆工具的权限，可以跨会话存储和检索信息。

### 1. 快速记忆工具（推荐）
- **memory_search** - 搜索已存储的记忆
- **memory_store** - 存储新记忆到知识库
- **memory_ask** - 基于记忆的问答（RAG）

### 2. 文件记忆工具
- **memory (view)** - 查看记忆目录或文件内容
- **memory (create)** - 创建新的记忆文件
- **memory (str_replace)** - 编辑现有记忆文件
- **memory (insert)** - 在文件中插入内容
- **memory (delete)** - 删除记忆文件
- **memory (rename)** - 重命名记忆文件

### 记忆存储规范：

**应该存储：**
- ✅ 重要的技术决策和架构选择
- ✅ 用户明确的偏好设置和工作习惯
- ✅ 项目特定的约定和规范
- ✅ 复杂问题的解决方案（经过提炼）

**不应该存储：**
- ❌ 临时性对话和闲聊
- ❌ 重复的信息
- ❌ 过于琐碎的细节
- ❌ 原始输出日志
- ❌ AI 的通用知识

**使用建议：**
- 存储前先用 memory_search 检查是否已存在类似内容
- 内容使用 Markdown 格式，分点陈述
- 选择合适的标签：project/preference/technical/context/custom
- 使用文件工具可以创建更结构化的记忆文件
`;
          memoryGuidancePromptCache = memoryGuidancePrompt;
          log.info(`[Runner] Memory guidance prompt created and cached`);
        }
      }

      // 合并系统提示（语言提示 + 记忆指南）
      const combinedSystemPrompt = memoryGuidancePrompt
        ? `${memoryGuidancePrompt}\n${languageHint || ''}`.trim()
        : languageHint;

      // 确定权限模式：
      // - 如果用户明确配置了 allowedTools 或 disallowedTools，使用 "default" 模式
      // - 否则使用 "acceptEdits" 模式以自动批准文件编辑并允许 MCP 工具
      // 注意：PermissionMode = 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan' | 'delegate' | 'dontAsk'
      const hasExplicitPermissions = (sdkNativeConfig.allowedTools && sdkNativeConfig.allowedTools.length > 0) ||
                                     (sdkNativeConfig.disallowedTools && sdkNativeConfig.disallowedTools.length > 0);
      const permissionMode: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan' | 'delegate' | 'dontAsk' = hasExplicitPermissions ? "default" : "acceptEdits";

      log.info(`[Runner] Permission mode: ${permissionMode}, hasExplicitPermissions: ${hasExplicitPermissions}`);

      const q = query({
        prompt: transformedPrompt,
        options: {
          cwd: session.cwd ?? DEFAULT_CWD,
          resume: resumeSessionId,
          abortController,
          env: mergedEnv,
          pathToClaudeCodeExecutable: getClaudeCodePath(),
          permissionMode,
          includePartialMessages: true,
          // 追加系统提示（语言偏好 + 记忆指南）
          ...(combinedSystemPrompt ? { extraArgs: { 'append-system-prompt': combinedSystemPrompt } } : {}),
          // 注册 MCP 服务器（记忆工具）
          ...(Object.keys(mcpServers).length > 0 ? { mcpServers } : {}),
          // SDK 原生配置（插件、代理、权限、钩子等）
          ...(sdkNativeConfig.plugins && sdkNativeConfig.plugins.length > 0 ? { plugins: sdkNativeConfig.plugins } : {}),
          ...(sdkNativeConfig.agents && Object.keys(sdkNativeConfig.agents).length > 0 ? { agents: sdkNativeConfig.agents } : {}),
          ...(sdkNativeConfig.agent ? { agent: sdkNativeConfig.agent } : {}),
          ...(sdkNativeConfig.allowedTools && sdkNativeConfig.allowedTools.length > 0 ? { allowedTools: sdkNativeConfig.allowedTools } : {}),
          ...(sdkNativeConfig.disallowedTools && sdkNativeConfig.disallowedTools.length > 0 ? { disallowedTools: sdkNativeConfig.disallowedTools } : {}),
          ...(sdkNativeConfig.hooks && Object.keys(sdkNativeConfig.hooks).length > 0 ? { hooks: sdkNativeConfig.hooks } : {}),
          ...(sdkNativeConfig.maxTurns ? { maxTurns: sdkNativeConfig.maxTurns } : {}),
          ...(sdkNativeConfig.maxBudgetUsd ? { maxBudgetUsd: sdkNativeConfig.maxBudgetUsd } : {}),
          ...(sdkNativeConfig.persistSession !== undefined ? { persistSession: sdkNativeConfig.persistSession } : {}),
          ...(sdkNativeConfig.enableFileCheckpointing !== undefined ? { enableFileCheckpointing: sdkNativeConfig.enableFileCheckpointing } : {}),
          canUseTool: async (toolName, input, { signal }) => {
            // 检测删除操作 - 需要用户确认
            const isDeletionOperation = checkIfDeletionOperation(toolName, input);

            // 记录所有工具调用（使用 info 级别确保输出）
            const { log } = await import("../logger.js");
            log.info(`[Tool] toolName=${toolName}, isDeletion=${isDeletionOperation}`);
            if (toolName === "Bash") {
              const cmd = (input as Record<string, unknown>).command;
              log.info(`[Tool] Bash command: ${cmd}`);
            }
            if (toolName === "Write") {
              const filePath = (input as Record<string, unknown>).path;
              const content = (input as Record<string, unknown>).content;
              log.info(`[Tool] Write file=${filePath}, contentLength=${String(content).length}`);
            }

            // AskUserQuestion 或删除操作都需要用户响应
            if (toolName === "AskUserQuestion" || isDeletionOperation) {
              const toolUseId = crypto.randomUUID();

              // 发送权限请求到前端
              sendPermissionRequest(toolUseId, toolName, input);

              // 创建一个 Promise，等待用户响应
              return new Promise<PermissionResult>((resolve) => {
                // 添加超时机制，防止 Promise 永不 resolve 导致内存泄漏
                const timeout = setTimeout(() => {
                  session.pendingPermissions.delete(toolUseId);
                  log.warn(`Permission request timeout for ${toolName}`, { toolUseId, toolName });
                  resolve({ behavior: "deny", message: "Permission request timeout" });
                }, RUNNER_TIMEOUT); // 5 分钟超时

                session.pendingPermissions.set(toolUseId, {
                  toolUseId,
                  toolName,
                  input,
                  resolve: (result) => {
                    clearTimeout(timeout);
                    session.pendingPermissions.delete(toolUseId);
                    resolve(result as PermissionResult);
                  }
                });

                // 处理中止
                signal.addEventListener("abort", () => {
                  clearTimeout(timeout);
                  session.pendingPermissions.delete(toolUseId);
                  resolve({ behavior: "deny", message: "Session aborted" });
                });
              });
            }

            // 自动批准其他工具
            return { behavior: "allow", updatedInput: input };
          }
        }
      });

      // Capture session_id from init message
      for await (const message of q) {
        // Extract session_id from system init message
        if (message.type === "system" && "subtype" in message && message.subtype === "init") {
          const sdkSessionId = message.session_id;
          if (sdkSessionId) {
            session.claudeSessionId = sdkSessionId;
            onSessionUpdate?.({ claudeSessionId: sdkSessionId });
          }
        }

        // 记录工具调用（用于调试）
        if (message.type === "assistant") {
          const assistantMsg = message as any;
          if (assistantMsg.message && assistantMsg.message.content) {
            for (const content of assistantMsg.message.content) {
              if (content.type === "tool_use") {
                const toolName = content.name;
                const toolInput = content.input;

                // 记忆工具调用（调试）
                if (memConfig.enabled) {
                  // 快速记忆工具
                  if (toolName === "memory_search" || toolName === "memory_store" || toolName === "memory_ask") {
                    const { log } = await import("../logger.js");
                    log.info(`[Memory Tool] Quick tool called: ${toolName}`, toolInput);

                    // 发送记忆状态更新（显示 AI 正在使用记忆工具）
                    if (toolName === "memory_store") {
                      onEvent({
                        type: "memory.status",
                        payload: {
                          sessionId: session.id,
                          stored: false,
                          message: `正在存储记忆: ${toolInput.title || '无标题'}`
                        }
                      });
                    } else if (toolName === "memory_search") {
                      onEvent({
                        type: "memory.status",
                        payload: {
                          sessionId: session.id,
                          stored: false,
                          message: `正在搜索记忆: ${toolInput.query?.substring(0, 30) || ''}...`
                        }
                      });
                    }
                  }
                  // Claude Memory Tool 命令
                  else if (toolName === "memory") {
                    const { log } = await import("../logger.js");
                    log.info(`[Memory Tool] File tool called: ${toolName}`, toolInput);

                    // 发送记忆状态更新（显示 AI 正在使用记忆工具）
                    const subCommand = toolInput?.command || toolInput?.subcommand;
                    if (subCommand === "create") {
                      onEvent({
                        type: "memory.status",
                        payload: {
                          sessionId: session.id,
                          stored: false,
                          message: `正在创建记忆文件`
                        }
                      });
                    }
                  }
                }

                // 记录删除操作（用于日志和调试）
                if (toolName === "Bash") {
                  const cmd = toolInput?.command;
                  if (cmd && checkIfDeletionOperation("Bash", { command: cmd })) {
                    const { log } = await import("../logger.js");
                    log.info(`[Deletion Detected] Tool use detected: ${cmd}`);
                  }
                }
              }
            }
          }
        }

        // Send message to frontend
        sendMessage(message);

        // Check for result to update session status
        if (message.type === "result") {
          const status = message.subtype === "success" ? "completed" : "error";
          onEvent({
            type: "session.status",
            payload: { sessionId: session.id, status, title: session.title }
          });
        }
      }

      // Query completed normally
      if (session.status === "running") {
        // 自动记忆：如果启用了自动存储，让 AI 清洗并存储关键信息
        if (memConfig.enabled && memConfig.autoStore) {
          await triggerAutoMemoryAnalysis(session, transformedPrompt, memConfig, onEvent);
        }

        onEvent({
          type: "session.status",
          payload: { sessionId: session.id, status: "completed", title: session.title }
        });
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // Session was aborted, don't treat as error
        return;
      }
      onEvent({
        type: "session.status",
        payload: { sessionId: session.id, status: "error", title: session.title, error: String(error) }
      });
    }
  })();

  return {
    abort: () => abortController.abort()
  };
}
