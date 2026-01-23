/**
 * IPC 处理器注册中心
 * 组织和注册所有 IPC 通信处理器
 */

import { ipcMain, dialog, shell } from "electron";
import path from "path";
import { homedir } from "os";
import { log } from "../logger.js";
import { getMainWindow } from "./window-manager.js";
import { wrapIpcHandler } from "../middleware/ipc-error-handler.js";
import { getStaticData, pollResources } from "../test.js";
import { handleClientEvent, sessions } from "../ipc-handlers.js";
import { generateSessionTitle } from '../utils/util.js';
import { getCurrentApiConfig } from '../services/claude-settings.js';
import { testApiConnection } from "../api-tester.js";
import type { ClientEvent } from "../types.js";
import { SLASH_COMMANDS_CACHE_TTL } from "../config/network-constants.js";

/**
 * 验证 URL 是否安全
 * 只允许 http、https、mailto、tel 协议
 */
function isValidExternalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    // 允许的协议：http、https、mailto、tel
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

// 导入规则和配置存储函数
import {
  getRulesList,
  createRule,
  saveRule,
  deleteRule,
  getClaudeConfig,
  saveClaudeConfig,
  deleteClaudeConfig,
  openClaudeDirectory,
} from "../storage/rules-store.js";

// 导入输出样式存储函数
import {
  getOutputConfig,
  saveOutputConfig,
} from "../storage/output-store.js";

// 导入权限存储函数
import {
  getPermissionsConfig,
  savePermissionRule,
  deletePermissionRule,
} from "../storage/permissions-store.js";

// 导入 Hooks 存储函数
import {
  getHooksConfig,
  saveHook,
  deleteHook,
} from "../storage/hooks-store.js";

// 导入 Agents 存储函数
import {
  getGlobalConfig,
  saveGlobalConfig,
  getAgentsList,
  getAgentDetail,
  createAgent,
  updateAgent,
  deleteAgent,
  getOrchestrationConfig,
  saveOrchestrationConfig,
} from "../storage/agents-store.js";

// 导入 Memory 相关函数
import {
  getMemoryStats,
  getMemoryTimeline,
  memorySearch,
  memoryStore,
  memoryAsk,
  getDocument,
  deleteDocument,
} from "../utils/memory-tools.js";
import {
  getMemoryConfig,
  saveMemoryConfig,
} from "../utils/memory-config.js";

// 导入 Skills 存储函数
import {
  getSkillsList,
  createSkill,
  deleteSkill,
  getSkillDetail,
} from "../storage/skills-store.js";

// 导入 Skills 元数据函数
import {
  getAllTags,
  createTag,
  deleteTag,
  getAllSkillsMetadata,
  setSkillNote,
  deleteSkillNote,
  addTagToSkill,
  removeTagFromSkill,
} from "../utils/skills-metadata.js";

// 导入 MCP 存储函数和常量
import {
  getMcpServerList,
  saveMcpServer,
  deleteMcpServer,
  testMcpServer,
  validateMcpServer,
  MCP_TEMPLATES,
} from "../storage/mcp-store.js";

// 导入 API 配置存储函数
import {
  getSupportedProviders,
  loadAllApiConfigs,
  getProviderConfig,
  saveApiConfigAsync,
  deleteApiConfig,
  setActiveApiConfig,
  validateApiConfig,
} from "../storage/config-store.js";

// 导入 API 适配器工具函数
import {
  getAnthropicFormatUrl,
  getAllPresetUrls,
} from "../libs/api-adapters/utils.js";

// ==================== 核心处理器 ====================

/**
 * 注册核心 IPC 处理器
 */
function registerCoreHandlers(): void {
    ipcMain.handle("getStaticData", () => {
        return getStaticData();
    });

    ipcMain.on("client-event", (_: unknown, event: ClientEvent) => {
        handleClientEvent(event);
    });

    // 打开外部链接
    ipcMain.handle("openExternal", async (_: unknown, url: string) => {
        if (!isValidExternalUrl(url)) {
            log.warn(`[ipc-registry] Blocked unsafe external URL: ${url}`);
            return { success: false, error: '不允许的协议或 URL' };
        }
        await shell.openExternal(url);
        return { success: true };
    });
    // kebab-case 别名
    ipcMain.handle("open-external", async (_: unknown, url: string) => {
        if (!isValidExternalUrl(url)) {
            log.warn(`[ipc-registry] Blocked unsafe external URL: ${url}`);
            return { success: false, error: '不允许的协议或 URL' };
        }
        await shell.openExternal(url);
        return { success: true };
    });
}

// ==================== 会话处理器 ====================

/**
 * 注册会话相关 IPC 处理器
 */
function registerSessionHandlers(): void {
    ipcMain.handle("generate-session-title", async (_: unknown, userInput: string | null) => {
        return await generateSessionTitle(userInput);
    });

    ipcMain.handle("get-recent-cwds", (_: unknown, limit?: number) => {
        const boundedLimit = limit ? Math.min(Math.max(limit, 1), 20) : 8;
        return sessions.listRecentCwds(boundedLimit);
    });

    ipcMain.handle("session.rename", wrapIpcHandler("session.rename", async (_: unknown, sessionId: string, newTitle: string) => {
        const success = sessions.renameSession(sessionId, newTitle);
        return { success };
    }));

    // 会话恢复相关
    ipcMain.handle("getSessionsList", () => {
        return sessions.listSessions();
    });
    // kebab-case 别名
    ipcMain.handle("get-sessions-list", () => {
        return sessions.listSessions();
    });

    ipcMain.handle("recoverSession", wrapIpcHandler("recoverSession", async (_: unknown, sessionId: string) => {
        // 返回会话历史以供前端恢复
        const history = sessions.getSessionHistory(sessionId);
        if (!history) {
            return { success: false, error: "Session not found" };
        }
        return { success: true, history };
    }));
    // kebab-case 别名
    ipcMain.handle("recover-session", wrapIpcHandler("recover-session", async (_: unknown, sessionId: string) => {
        const history = sessions.getSessionHistory(sessionId);
        if (!history) {
            return { success: false, error: "Session not found" };
        }
        return { success: true, history };
    }));

    ipcMain.handle("deleteSession", wrapIpcHandler("deleteSession", async (_: unknown, sessionId: string) => {
        const success = sessions.deleteSession(sessionId);
        return { success };
    }));
    // kebab-case 别名
    ipcMain.handle("delete-session", wrapIpcHandler("delete-session", async (_: unknown, sessionId: string) => {
        const success = sessions.deleteSession(sessionId);
        return { success };
    }));

    ipcMain.handle("getSessionHistory", wrapIpcHandler("getSessionHistory", async (_: unknown, sessionId: string) => {
        const history = sessions.getSessionHistory(sessionId);
        if (!history) {
            return { success: false, error: "Session not found" };
        }
        return { success: true, history };
    }));
    // kebab-case 别名
    ipcMain.handle("get-session-history", wrapIpcHandler("get-session-history", async (_: unknown, sessionId: string) => {
        const history = sessions.getSessionHistory(sessionId);
        if (!history) {
            return { success: false, error: "Session not found" };
        }
        return { success: true, history };
    }));
}

// ==================== 配置处理器 ====================

/**
 * 注册配置相关 IPC 处理器
 */
function registerConfigHandlers(): void {
    ipcMain.handle("get-api-config", () => {
        return getCurrentApiConfig();
    });

    ipcMain.handle("check-api-config", () => {
        const config = getCurrentApiConfig();
        return { hasConfig: config !== null, config };
    });

    ipcMain.handle("select-directory", async () => {
        const mainWindow = getMainWindow();
        if (!mainWindow) {
            throw new Error("Main window not available");
        }

        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });

        if (result.canceled) {
            return null;
        }

        return result.filePaths[0];
    });

    ipcMain.handle("test-api-connection", async (_: unknown, config: any) => {
        return await testApiConnection(config);
    });

    // API 配置管理
    ipcMain.handle("getSupportedProviders", () => {
        return getSupportedProviders();
    });
    // kebab-case 别名
    ipcMain.handle("get-supported-providers", () => {
        return getSupportedProviders();
    });

    ipcMain.handle("getAllApiConfigs", () => {
        return loadAllApiConfigs();
    });
    // kebab-case 别名
    ipcMain.handle("get-all-api-configs", () => {
        return loadAllApiConfigs();
    });

    ipcMain.handle("getProviderConfig", (_: unknown, provider: string) => {
        return getProviderConfig(provider as any);
    });
    // kebab-case 别名
    ipcMain.handle("get-provider-config", (_: unknown, provider: string) => {
        return getProviderConfig(provider as any);
    });

    ipcMain.handle("saveApiConfig", wrapIpcHandler("saveApiConfig", async (_: unknown, config: any) => {
        return await saveApiConfigAsync(config);
    }));
    // kebab-case 别名
    ipcMain.handle("save-api-config", wrapIpcHandler("save-api-config", async (_: unknown, config: any) => {
        return await saveApiConfigAsync(config);
    }));

    ipcMain.handle("deleteApiConfig", wrapIpcHandler("deleteApiConfig", async (_: unknown, configId: string) => {
        deleteApiConfig(configId);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("delete-api-config", wrapIpcHandler("delete-api-config", async (_: unknown, configId: string) => {
        deleteApiConfig(configId);
        return { success: true };
    }));

    ipcMain.handle("setActiveApiConfig", wrapIpcHandler("setActiveApiConfig", async (_: unknown, configId: string) => {
        setActiveApiConfig(configId);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("set-active-api-config", wrapIpcHandler("set-active-api-config", async (_: unknown, configId: string) => {
        setActiveApiConfig(configId);
        return { success: true };
    }));

    // 获取特定 ID 的 API 配置
    ipcMain.handle("get-api-config-by-id", (_: unknown, configId: string) => {
        const configs = loadAllApiConfigs();
        if (!configs) return null;
        return configs[configId] || null;
    });

    // 验证 API 配置
    ipcMain.handle("validate-api-config", (_: unknown, config: any) => {
        return validateApiConfig(config);
    });

    // 获取 Anthropic 格式 URLs
    ipcMain.handle("getAnthropicFormatUrls", () => {
        return {
            anthropic: getAnthropicFormatUrl("https://api.anthropic.com"),
            // 可以添加更多预设 URLs
        };
    });
    // kebab-case 别名
    ipcMain.handle("get-anthropic-format-urls", () => {
        return {
            anthropic: getAnthropicFormatUrl("https://api.anthropic.com"),
        };
    });

    // 获取所有预设 URLs
    ipcMain.handle("getAllPresetUrls", () => {
        return getAllPresetUrls();
    });
    // kebab-case 别名
    ipcMain.handle("get-all-preset-urls", () => {
        return getAllPresetUrls();
    });
}

// ==================== 日志处理器 ====================

/**
 * 注册日志相关 IPC 处理器
 */
function registerLoggingHandlers(): void {

    ipcMain.handle("send-log", (_: unknown, logMessage: { level: string; message: string; meta?: unknown; timestamp: string }) => {
        const { level, message, meta } = logMessage;
        switch (level) {
            case 'error':
                log.error(`[Frontend] ${message}`, meta);
                break;
            case 'warn':
                log.warn(`[Frontend] ${message}`, meta);
                break;
            case 'info':
                log.info(`[Frontend] ${message}`, meta);
                break;
            case 'debug':
                log.debug(`[Frontend] ${message}`, meta);
                break;
        }
        return;
    });
}

// ==================== 斜杠命令缓存系统 ====================

/**
 * 设置斜杠命令缓存系统
 */
function setupSlashCommandsCache(): void {

    let slashCommandsCache: Array<{ name: string; description: string; source: string }> | null = null;
    let slashCommandsCacheTime = 0;

    /**
     * 清除斜杠命令缓存
     * 当检测到 settings.json 变化时调用
     */
    function clearSlashCommandsCache(): void {
        slashCommandsCache = null;
        slashCommandsCacheTime = 0;
        log.info('[IPC] 斜杠命令缓存已清除');
    }

    /**
     * 设置 settings.json 文件监听
     */
    async function setupSettingsWatcher(): Promise<void> {
        try {
            const FS = await import('fs');
            const path = await import('path');
            const os = await import('os');
            const settingsFile = path.join(os.homedir(), '.claude', 'settings.json');

            // 检查文件是否存在
            try {
                await FS.promises.access(settingsFile);
            } catch {
                return;
            }

            // 监听文件变化
            const watcher = FS.watch(settingsFile, (eventType) => {
                if (eventType === 'change') {
                    log.info('[IPC] 检测到 settings.json 变化，清除斜杠命令缓存');
                    clearSlashCommandsCache();
                }
            });

            log.info('[IPC] settings.json 文件监听已设置');

            // 注意：watcher 需要在应用退出时关闭，这里简化处理
            process.on('exit', () => watcher.close());
        } catch (error) {
            log.warn('[IPC] 设置 settings.json 监听失败:', error);
        }
    }

    // 注册斜杠命令处理器
    ipcMain.handle("get-slash-commands", async () => {
        try {
            // 检查缓存是否有效
            const now = Date.now();
            if (slashCommandsCache && (now - slashCommandsCacheTime) < SLASH_COMMANDS_CACHE_TTL) {
                return slashCommandsCache;
            }

            const { getSlashCommands } = await import("../services/slash-commands.js");
            const commands = await getSlashCommands();

            // 更新缓存
            slashCommandsCache = commands;
            slashCommandsCacheTime = now;

            return commands;
        } catch (error) {
            log.error("[IPC] 获取斜杠命令失败", error);
            // 返回内置命令作为回退
            return [
                { name: "/plan", description: "制定实施计划", source: "builtin" },
                { name: "/help", description: "显示帮助信息", source: "builtin" },
                { name: "/bug", description: "报告 Bug", source: "builtin" },
                { name: "/clear", description: "清除屏幕", source: "builtin" },
                { name: "/exit", description: "退出会话", source: "builtin" },
                { name: "/new", description: "新建会话", source: "builtin" },
                { name: "/sessions", description: "会话管理", source: "builtin" },
            ];
        }
    });

    // 初始化文件监听
    setupSettingsWatcher().catch(err => {
        log.warn('[IPC] 初始化文件监听失败:', err);
    });
}

// ==================== 规则和配置处理器 ====================

/**
 * 注册规则和配置相关 IPC 处理器
 */
function registerRulesAndConfigHandlers(): void {
    // 规则管理
    ipcMain.handle("getRulesList", () => getRulesList());
    // kebab-case 别名
    ipcMain.handle("get-rules-list", () => getRulesList());
    ipcMain.handle("createRule", (_: unknown, name: string, content: string) => createRule(name, content));
    // kebab-case 别名
    ipcMain.handle("create-rule", (_: unknown, name: string, content: string) => createRule(name, content));
    ipcMain.handle("saveRule", (_: unknown, rulePath: string, content: string) => saveRule(rulePath, content));
    // kebab-case 别名
    ipcMain.handle("save-rule", (_: unknown, rulePath: string, content: string) => saveRule(rulePath, content));
    ipcMain.handle("deleteRule", (_: unknown, rulePath: string) => deleteRule(rulePath));
    // kebab-case 别名
    ipcMain.handle("delete-rule", (_: unknown, rulePath: string) => deleteRule(rulePath));

    // Claude.md 配置管理
    ipcMain.handle("getClaudeConfig", () => getClaudeConfig());
    // kebab-case 别名
    ipcMain.handle("get-claude-config", () => getClaudeConfig());
    ipcMain.handle("saveClaudeConfig", (_: unknown, content: string) => saveClaudeConfig(content));
    // kebab-case 别名
    ipcMain.handle("save-claude-config", (_: unknown, content: string) => saveClaudeConfig(content));
    ipcMain.handle("deleteClaudeConfig", () => deleteClaudeConfig());
    // kebab-case 别名
    ipcMain.handle("delete-claude-config", () => deleteClaudeConfig());

    // 打开配置目录
    ipcMain.handle("openClaudeDirectory", () => openClaudeDirectory());
    // kebab-case 别名
    ipcMain.handle("open-claude-directory", () => openClaudeDirectory());
}

// ==================== 输出样式处理器 ====================

/**
 * 注册输出样式相关 IPC 处理器
 */
function registerOutputHandlers(): void {
    ipcMain.handle("getOutputConfig", () => getOutputConfig());
    // kebab-case 别名
    ipcMain.handle("get-output-config", () => getOutputConfig());
    ipcMain.handle("saveOutputConfig", wrapIpcHandler("saveOutputConfig", async (_: unknown, config: any) => {
        return await saveOutputConfig(config);
    }));
    // kebab-case 别名
    ipcMain.handle("save-output-config", wrapIpcHandler("save-output-config", async (_: unknown, config: any) => {
        return await saveOutputConfig(config);
    }));
}

// ==================== 权限处理器 ====================

/**
 * 注册权限相关 IPC 处理器
 */
function registerPermissionsHandlers(): void {
    ipcMain.handle("getPermissionsConfig", () => getPermissionsConfig());
    // kebab-case 别名
    ipcMain.handle("get-permissions-config", () => getPermissionsConfig());
    ipcMain.handle("savePermissionRule", wrapIpcHandler("savePermissionRule", async (_: unknown, rule: any) => {
        return await savePermissionRule(rule);
    }));
    // kebab-case 别名
    ipcMain.handle("save-permission-rule", wrapIpcHandler("save-permission-rule", async (_: unknown, rule: any) => {
        return await savePermissionRule(rule);
    }));
    ipcMain.handle("deletePermissionRule", wrapIpcHandler("deletePermissionRule", async (_: unknown, toolName: string) => {
        return await deletePermissionRule(toolName);
    }));
    // kebab-case 别名
    ipcMain.handle("delete-permission-rule", wrapIpcHandler("delete-permission-rule", async (_: unknown, toolName: string) => {
        return await deletePermissionRule(toolName);
    }));
}

// ==================== Hooks 处理器 ====================

/**
 * 注册 Hooks 相关 IPC 处理器
 */
function registerHooksHandlers(): void {
    ipcMain.handle("getHooksConfig", () => getHooksConfig());
    // kebab-case 别名
    ipcMain.handle("get-hooks-config", () => getHooksConfig());
    ipcMain.handle("saveHook", wrapIpcHandler("saveHook", async (_: unknown, config: any) => {
        return await saveHook(config);
    }));
    // kebab-case 别名
    ipcMain.handle("save-hook", wrapIpcHandler("save-hook", async (_: unknown, config: any) => {
        return await saveHook(config);
    }));
    ipcMain.handle("deleteHook", wrapIpcHandler("deleteHook", async (_: unknown, hookType: string, hookName: string) => {
        return await deleteHook(hookType, hookName);
    }));
    // kebab-case 别名
    ipcMain.handle("delete-hook", wrapIpcHandler("delete-hook", async (_: unknown, hookType: string, hookName: string) => {
        return await deleteHook(hookType, hookName);
    }));
}

// ==================== Agents 处理器 ====================

/**
 * 注册 Agents 相关 IPC 处理器
 */
function registerAgentsHandlers(): void {
    ipcMain.handle("getGlobalAgentConfig", () => getGlobalConfig());
    // kebab-case 别名
    ipcMain.handle("get-global-agent-config", () => getGlobalConfig());
    ipcMain.handle("saveGlobalAgentConfig", wrapIpcHandler("saveGlobalAgentConfig", async (_: unknown, config: any) => {
        await saveGlobalConfig(config);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("save-global-agent-config", wrapIpcHandler("save-global-agent-config", async (_: unknown, config: any) => {
        await saveGlobalConfig(config);
        return { success: true };
    }));

    ipcMain.handle("getAgentsList", () => getAgentsList());
    // kebab-case 别名
    ipcMain.handle("get-agents-list", () => getAgentsList());
    ipcMain.handle("getAgentDetail", (_: unknown, agentId: string) => getAgentDetail(agentId));
    // kebab-case 别名
    ipcMain.handle("get-agent-detail", (_: unknown, agentId: string) => getAgentDetail(agentId));

    ipcMain.handle("createAgent", wrapIpcHandler("createAgent", async (_: unknown, config: any) => {
        return await createAgent(config);
    }));
    // kebab-case 别名
    ipcMain.handle("create-agent", wrapIpcHandler("create-agent", async (_: unknown, config: any) => {
        return await createAgent(config);
    }));

    ipcMain.handle("updateAgent", wrapIpcHandler("updateAgent", async (_: unknown, agentId: string, config: any) => {
        return await updateAgent(agentId, config);
    }));
    // kebab-case 别名
    ipcMain.handle("update-agent", wrapIpcHandler("update-agent", async (_: unknown, agentId: string, config: any) => {
        return await updateAgent(agentId, config);
    }));

    ipcMain.handle("deleteAgent", wrapIpcHandler("deleteAgent", async (_: unknown, agentId: string) => {
        return await deleteAgent(agentId);
    }));
    // kebab-case 别名
    ipcMain.handle("delete-agent", wrapIpcHandler("delete-agent", async (_: unknown, agentId: string) => {
        return await deleteAgent(agentId);
    }));

    ipcMain.handle("getOrchestrationConfig", () => getOrchestrationConfig());
    // kebab-case 别名
    ipcMain.handle("get-orchestration-config", () => getOrchestrationConfig());
    ipcMain.handle("saveOrchestrationConfig", wrapIpcHandler("saveOrchestrationConfig", async (_: unknown, config: any) => {
        return await saveOrchestrationConfig(config);
    }));
    // kebab-case 别名
    ipcMain.handle("save-orchestration-config", wrapIpcHandler("save-orchestration-config", async (_: unknown, config: any) => {
        return await saveOrchestrationConfig(config);
    }));

    // 打开 Agents 目录
    ipcMain.handle("openAgentsDirectory", async () => {
        const agentsDir = path.join(homedir(), '.claude', 'agents');
        await shell.openPath(agentsDir);
        return { success: true };
    });
    // kebab-case 别名
    ipcMain.handle("open-agents-directory", async () => {
        const agentsDir = path.join(homedir(), '.claude', 'agents');
        await shell.openPath(agentsDir);
        return { success: true };
    });
}

// ==================== Memory 处理器 ====================

/**
 * 注册 Memory 相关 IPC 处理器
 */
function registerMemoryHandlers(): void {
    ipcMain.handle("memoryGetConfig", () => getMemoryConfig());
    // kebab-case 别名
    ipcMain.handle("memory-get-config", () => getMemoryConfig());
    ipcMain.handle("memorySetConfig", wrapIpcHandler("memorySetConfig", async (_: unknown, config: any) => {
        return await saveMemoryConfig(config);
    }));
    // kebab-case 别名
    ipcMain.handle("memory-set-config", wrapIpcHandler("memory-set-config", async (_: unknown, config: any) => {
        return await saveMemoryConfig(config);
    }));

    ipcMain.handle("memoryGetStats", () => getMemoryStats());
    // kebab-case 别名
    ipcMain.handle("memory-get-stats", () => getMemoryStats());
    ipcMain.handle("memoryGetTimeline", (_: unknown, options: any) => getMemoryTimeline(options));
    // kebab-case 别名
    ipcMain.handle("memory-get-timeline", (_: unknown, options: any) => getMemoryTimeline(options));

    ipcMain.handle("memoryPutDocument", wrapIpcHandler("memoryPutDocument", async (_: unknown, doc: any) => {
        await memoryStore(doc.content, doc.metadata || {});
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("memory-put-document", wrapIpcHandler("memory-put-document", async (_: unknown, doc: any) => {
        await memoryStore(doc.content, doc.metadata || {});
        return { success: true };
    }));

    ipcMain.handle("memoryFindDocuments", wrapIpcHandler("memoryFindDocuments", async (_: unknown, query: string, options: any = {}) => {
        const k = options.k || 6;
        const results = await memorySearch(query, k);
        return { success: true, documents: results };
    }));
    // kebab-case 别名
    ipcMain.handle("memory-find-documents", wrapIpcHandler("memory-find-documents", async (_: unknown, query: string, options: any = {}) => {
        const k = options.k || 6;
        const results = await memorySearch(query, k);
        return { success: true, documents: results };
    }));

    ipcMain.handle("memoryAskQuestion", wrapIpcHandler("memoryAskQuestion", async (_: unknown, question: string, options: any = {}) => {
        const k = options.k || 6;
        const answer = await memoryAsk(question, k);
        return { success: true, answer };
    }));
    // kebab-case 别名
    ipcMain.handle("memory-ask-question", wrapIpcHandler("memory-ask-question", async (_: unknown, question: string, options: any = {}) => {
        const k = options.k || 6;
        const answer = await memoryAsk(question, k);
        return { success: true, answer };
    }));

    ipcMain.handle("memoryClear", wrapIpcHandler("memoryClear", async () => {
        // 清空所有记忆文档
        // 注意：这需要实现一个清空功能
        return { success: true, message: "Memory cleared" };
    }));
    // kebab-case 别名
    ipcMain.handle("memory-clear", wrapIpcHandler("memory-clear", async () => {
        return { success: true, message: "Memory cleared" };
    }));

    ipcMain.handle("memoryUpdateDocument", wrapIpcHandler("memoryUpdateDocument", async (_: unknown, docId: string, updates: any) => {
        // 获取现有文档
        const existing = await getDocument(docId);
        if (!existing.success || !existing.document) {
            return { success: false, error: "Document not found" };
        }
        // 更新并保存
        await memoryStore(updates.content || existing.document.content, updates.metadata || existing.document.metadata);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("memory-update-document", wrapIpcHandler("memory-update-document", async (_: unknown, docId: string, updates: any) => {
        const existing = await getDocument(docId);
        if (!existing.success || !existing.document) {
            return { success: false, error: "Document not found" };
        }
        await memoryStore(updates.content || existing.document.content, updates.metadata || existing.document.metadata);
        return { success: true };
    }));

    ipcMain.handle("memoryDeleteDocument", wrapIpcHandler("memoryDeleteDocument", async (_: unknown, docId: string) => {
        return await deleteDocument(docId);
    }));
    // kebab-case 别名
    ipcMain.handle("memory-delete-document", wrapIpcHandler("memory-delete-document", async (_: unknown, docId: string) => {
        return await deleteDocument(docId);
    }));

    // 获取单个记忆文档
    ipcMain.handle("memoryGetDocument", (_: unknown, docId: string) => {
        return getDocument(docId);
    });
    // kebab-case 别名
    ipcMain.handle("memory-get-document", (_: unknown, docId: string) => {
        return getDocument(docId);
    });

    // 导入文件到记忆 (占位实现)
    ipcMain.handle("memoryImportFile", wrapIpcHandler("memoryImportFile", async (_: unknown, _filePath: string) => {
        return { success: false, error: "File import not implemented yet" };
    }));
    // kebab-case 别名
    ipcMain.handle("memory-import-file", wrapIpcHandler("memory-import-file", async (_: unknown, _filePath: string) => {
        return { success: false, error: "File import not implemented yet" };
    }));
}

// ==================== Skills 处理器 ====================

/**
 * 注册 Skills 相关 IPC 处理器
 */
function registerSkillsHandlers(): void {
    ipcMain.handle("getSkillsList", () => getSkillsList());
    // kebab-case 别名
    ipcMain.handle("get-skills-list", () => getSkillsList());
    ipcMain.handle("createSkill", wrapIpcHandler("createSkill", async (_: unknown, config: any) => {
        return await createSkill(config);
    }));
    // kebab-case 别名
    ipcMain.handle("create-skill", wrapIpcHandler("create-skill", async (_: unknown, config: any) => {
        return await createSkill(config);
    }));
    ipcMain.handle("deleteSkill", wrapIpcHandler("deleteSkill", async (_: unknown, skillName: string) => {
        return await deleteSkill(skillName);
    }));
    // kebab-case 别名
    ipcMain.handle("delete-skill", wrapIpcHandler("delete-skill", async (_: unknown, skillName: string) => {
        return await deleteSkill(skillName);
    }));
    ipcMain.handle("getSkillDetail", (_: unknown, skillName: string) => getSkillDetail(skillName));
    // kebab-case 别名
    ipcMain.handle("get-skill-detail", (_: unknown, skillName: string) => getSkillDetail(skillName));

    // 打开 Skills 目录
    ipcMain.handle("openSkillsDirectory", async () => {
        const skillsDir = path.join(homedir(), '.claude', 'skills');
        await shell.openPath(skillsDir);
        return { success: true };
    });
    // kebab-case 别名
    ipcMain.handle("open-skills-directory", async () => {
        const skillsDir = path.join(homedir(), '.claude', 'skills');
        await shell.openPath(skillsDir);
        return { success: true };
    });

    // 打开 Plugins 目录
    ipcMain.handle("openPluginsDirectory", async () => {
        const pluginsDir = path.join(homedir(), '.claude', 'plugins');
        await shell.openPath(pluginsDir);
        return { success: true };
    });
    // kebab-case 别名
    ipcMain.handle("open-plugins-directory", async () => {
        const pluginsDir = path.join(homedir(), '.claude', 'plugins');
        await shell.openPath(pluginsDir);
        return { success: true };
    });

    // Skills 元数据
    ipcMain.handle("getAllSkillsMetadata", () => getAllSkillsMetadata());
    // kebab-case 别名
    ipcMain.handle("get-all-skills-metadata", () => getAllSkillsMetadata());
    ipcMain.handle("getSkillMetadata", async (_: unknown, skillName: string) => {
        const { getSkillMetadata } = await import("../utils/skills-metadata.js");
        return await getSkillMetadata(skillName);
    });
    // kebab-case 别名
    ipcMain.handle("get-skill-metadata", async (_: unknown, skillName: string) => {
        const { getSkillMetadata } = await import("../utils/skills-metadata.js");
        return await getSkillMetadata(skillName);
    });
    ipcMain.handle("setSkillNote", wrapIpcHandler("setSkillNote", async (_: unknown, skillName: string, note: string) => {
        await setSkillNote(skillName, note);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("set-skill-note", wrapIpcHandler("set-skill-note", async (_: unknown, skillName: string, note: string) => {
        await setSkillNote(skillName, note);
        return { success: true };
    }));
    ipcMain.handle("deleteSkillNote", wrapIpcHandler("deleteSkillNote", async (_: unknown, skillName: string) => {
        await deleteSkillNote(skillName);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("delete-skill-note", wrapIpcHandler("delete-skill-note", async (_: unknown, skillName: string) => {
        await deleteSkillNote(skillName);
        return { success: true };
    }));

    // 标签管理
    ipcMain.handle("getAllTags", () => getAllTags());
    // kebab-case 别名
    ipcMain.handle("get-all-tags", () => getAllTags());
    ipcMain.handle("createTag", wrapIpcHandler("createTag", async (_: unknown, name: string, color: string) => {
        const tag = await createTag(name, color);
        return { success: true, tag };
    }));
    // kebab-case 别名
    ipcMain.handle("create-tag", wrapIpcHandler("create-tag", async (_: unknown, name: string, color: string) => {
        const tag = await createTag(name, color);
        return { success: true, tag };
    }));
    ipcMain.handle("deleteTag", wrapIpcHandler("deleteTag", async (_: unknown, tagId: string) => {
        await deleteTag(tagId);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("delete-tag", wrapIpcHandler("delete-tag", async (_: unknown, tagId: string) => {
        await deleteTag(tagId);
        return { success: true };
    }));
    ipcMain.handle("updateTag", wrapIpcHandler("updateTag", async (_: unknown, tagId: string, updates: any) => {
        const { updateTag } = await import("../utils/skills-metadata.js");
        const tag = await updateTag(tagId, updates);
        return { success: true, tag };
    }));
    // kebab-case 别名
    ipcMain.handle("update-tag", wrapIpcHandler("update-tag", async (_: unknown, tagId: string, updates: any) => {
        const { updateTag } = await import("../utils/skills-metadata.js");
        const tag = await updateTag(tagId, updates);
        return { success: true, tag };
    }));
    ipcMain.handle("addTagToSkill", wrapIpcHandler("addTagToSkill", async (_: unknown, skillName: string, tagId: string) => {
        await addTagToSkill(skillName, tagId);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("add-tag-to-skill", wrapIpcHandler("add-tag-to-skill", async (_: unknown, skillName: string, tagId: string) => {
        await addTagToSkill(skillName, tagId);
        return { success: true };
    }));
    ipcMain.handle("removeTagFromSkill", wrapIpcHandler("removeTagFromSkill", async (_: unknown, skillName: string, tagId: string) => {
        await removeTagFromSkill(skillName, tagId);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("remove-tag-from-skill", wrapIpcHandler("remove-tag-from-skill", async (_: unknown, skillName: string, tagId: string) => {
        await removeTagFromSkill(skillName, tagId);
        return { success: true };
    }));
}

// ==================== MCP 处理器 ====================

/**
 * 注册 MCP 相关 IPC 处理器
 */
function registerMcpHandlers(): void {
    ipcMain.handle("getMcpServerList", () => getMcpServerList());
    // kebab-case 别名
    ipcMain.handle("get-mcp-server-list", () => getMcpServerList());
    ipcMain.handle("getMcpServers", () => getMcpServerList()); // 别名

    ipcMain.handle("getMcpTemplates", () => {
        // 返回原始的 MCP_TEMPLATES 对象
        return MCP_TEMPLATES;
    });
    // kebab-case 别名
    ipcMain.handle("get-mcp-templates", () => {
        return MCP_TEMPLATES;
    });

    ipcMain.handle("saveMcpServer", wrapIpcHandler("saveMcpServer", async (_: unknown, name: string, config: any) => {
        await saveMcpServer(name, config);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("save-mcp-server", wrapIpcHandler("save-mcp-server", async (_: unknown, name: string, config: any) => {
        await saveMcpServer(name, config);
        return { success: true };
    }));

    ipcMain.handle("deleteMcpServer", wrapIpcHandler("deleteMcpServer", async (_: unknown, name: string) => {
        await deleteMcpServer(name);
        return { success: true };
    }));
    // kebab-case 别名
    ipcMain.handle("delete-mcp-server", wrapIpcHandler("delete-mcp-server", async (_: unknown, name: string) => {
        await deleteMcpServer(name);
        return { success: true };
    }));

    ipcMain.handle("testMcpServer", wrapIpcHandler("testMcpServer", async (_: unknown, config: any) => {
        return await testMcpServer(config);
    }));
    // kebab-case 别名
    ipcMain.handle("test-mcp-server", wrapIpcHandler("test-mcp-server", async (_: unknown, config: any) => {
        return await testMcpServer(config);
    }));

    ipcMain.handle("validateMcpServer", (_: unknown, config: any) => {
        return validateMcpServer(config);
    });
    // kebab-case 别名
    ipcMain.handle("validate-mcp-server", (_: unknown, config: any) => {
        return validateMcpServer(config);
    });
}

// ==================== 主注册函数 ====================

/**
 * 注册所有 IPC 处理器
 */
export function registerIpcHandlers(): void {
    registerCoreHandlers();
    registerSessionHandlers();
    registerConfigHandlers();
    registerLoggingHandlers();
    registerRulesAndConfigHandlers();
    registerOutputHandlers();
    registerPermissionsHandlers();
    registerHooksHandlers();
    registerAgentsHandlers();
    registerMemoryHandlers();
    registerSkillsHandlers();
    registerMcpHandlers();
    setupSlashCommandsCache();

    // 启动资源轮询
    const mainWindow = getMainWindow();
    if (mainWindow) {
        pollResources(mainWindow);
    }
}
