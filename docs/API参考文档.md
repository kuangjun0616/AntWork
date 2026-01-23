# AICowork API 参考文档

> 版本：0.1.0
> 最后更新：2026-01-23

---

## 目录

1. [IPC API](#ipc-api)
2. [核心库 API](#核心库-api)
3. [类型定义](#类型定义)
4. [事件系统](#事件系统)
5. [错误处理](#错误处理)

---

## IPC API

### API 配置相关

#### `getApiConfig()`

获取当前激活的 API 配置。

**返回类型**: `Promise<ApiConfig | null>`

**示例**:
```typescript
const config = await window.electronAPI.getApiConfig();
console.log(config.model);  // 'claude-3-5-sonnet-20241022'
```

---

#### `saveApiConfig(config: ApiConfig)`

保存或更新 API 配置。

**参数**:
- `config`: ApiConfig 对象

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
const result = await window.electronAPI.saveApiConfig({
  id: 'cfg_123',
  name: '智谱 AI',
  apiKey: 'sk-xxx',
  baseURL: 'https://open.bigmodel.cn/api/paas/v4',
  model: 'glm-4',
  apiType: 'bigmodel'
});

if (result.success) {
  console.log('配置保存成功');
}
```

---

#### `deleteApiConfig(configId: string)`

删除指定的 API 配置。

**参数**:
- `configId`: 配置 ID

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.deleteApiConfig('cfg_123');
```

---

#### `getAllApiConfigs()`

获取所有 API 配置。

**返回类型**: `Promise<{ configs: ApiConfig[]; activeConfigId?: string }>`

**示例**:
```typescript
const { configs, activeConfigId } = await window.electronAPI.getAllApiConfigs();
configs.forEach(config => {
  console.log(`${config.name}: ${config.isActive ? '激活' : ''}`);
});
```

---

#### `testApiConnection(config: ApiConfig)`

测试 API 连接是否正常。

**参数**:
- `config`: 要测试的配置

**返回类型**: `Promise<{ success: boolean; message?: string; error?: string }>`

**示例**:
```typescript
const result = await window.electronAPI.testApiConnection(config);
if (result.success) {
  alert('连接成功！');
} else {
  alert(`连接失败: ${result.error}`);
}
```

---

### 记忆系统 API

#### `memoryPutDocument(input: MemoryDocumentInput)`

存储文档到记忆系统。

**参数**:
```typescript
interface MemoryDocumentInput {
  title: string;
  text: string;
  label?: 'project' | 'preference' | 'technical' | 'context' | 'custom';
  metadata?: Record<string, any>;
}
```

**返回类型**: `Promise<{ success: boolean; id?: string; error?: string }>`

**示例**:
```typescript
const result = await window.electronAPI.memoryPutDocument({
  title: '项目技术栈',
  text: '前端使用 React 19，后端使用 Node.js',
  label: 'project',
  metadata: { project: 'my-app' }
});
```

---

#### `memoryFindDocuments(query: string, options?: SearchOptions)`

搜索记忆文档。

**参数**:
```typescript
interface SearchOptions {
  limit?: number;       // 返回数量，默认 5
  threshold?: number;   // 相似度阈值，默认 0.7
  label?: string;       // 按标签筛选
}
```

**返回类型**: `Promise<{ success: boolean; results?: Document[]; error?: string }>`

**示例**:
```typescript
const { results } = await window.electronAPI.memoryFindDocuments(
  '技术栈',
  { limit: 10, threshold: 0.6 }
);

results.forEach(doc => {
  console.log(`${doc.title}: ${doc.similarity}`);
});
```

---

#### `memoryAskQuestion(question: string, options?: AskOptions)`

基于记忆的问答查询（RAG）。

**参数**:
```typescript
interface AskOptions {
  k?: number;           // 检索文档数量，默认 6
  format?: boolean;     // 是否格式化输出，默认 true
}
```

**返回类型**: `Promise<{ success: boolean; answer?: string; sources?: string[]; error?: string }>`

**示例**:
```typescript
const { answer, sources } = await window.electronAPI.memoryAskQuestion(
  '项目使用什么数据库？'
);

console.log(answer);     // "根据项目文档，该项目使用 PostgreSQL 数据库..."
console.log(sources);    // ["db-config.md", "architecture.md"]
```

---

#### `memoryGetStats()`

获取记忆系统统计信息。

**返回类型**: `Promise<{ success: boolean; stats?: MemoryStats; error?: string }>`

**MemoryStats**:
```typescript
interface MemoryStats {
  totalDocuments: number;
  documentsByLabel: Record<string, number>;
  oldestDocument?: number;
  newestDocument?: number;
}
```

**示例**:
```typescript
const { stats } = await window.electronAPI.memoryGetStats();
console.log(`总文档数: ${stats.totalDocuments}`);
console.log(`项目文档: ${stats.documentsByLabel.project}`);
```

---

#### `memoryClear()`

清空所有记忆。

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
if (confirm('确定要清空所有记忆吗？')) {
  await window.electronAPI.memoryClear();
}
```

---

### 技能管理 API

#### `getSkillsList()`

获取所有已安装的技能列表。

**返回类型**: `Promise<Skill[]>`

**Skill**:
```typescript
interface Skill {
  name: string;
  description: string;
  prompt: string;
  script?: {
    type: 'javascript' | 'python';
    content?: string;
    path?: string;
  };
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}
```

**示例**:
```typescript
const skills = await window.electronAPI.getSkillsList();
skills.forEach(skill => {
  console.log(`${skill.name}: ${skill.description}`);
});
```

---

#### `createSkill(config: SkillConfig)`

创建新技能。

**参数**:
```typescript
interface SkillConfig {
  name: string;
  description: string;
  prompt: string;
  script?: {
    type: 'javascript' | 'python';
    content?: string;
    path?: string;
  };
}
```

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.createSkill({
  name: 'code-review',
  description: '代码审查技能',
  prompt: '请审查以下代码：\n\n{{code}}',
  script: {
    type: 'javascript',
    content: 'console.log("审查中...");'
  }
});
```

---

#### `deleteSkill(skillName: string)`

删除指定技能。

**参数**:
- `skillName`: 技能名称

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.deleteSkill('code-review');
```

---

### MCP 服务器 API

#### `getMcpServers()`

获取所有 MCP 服务器配置。

**返回类型**: `Promise<Record<string, McpServerConfig>>`

**McpServerConfig**:
```typescript
interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  enabled?: boolean;
}
```

**示例**:
```typescript
const servers = await window.electronAPI.getMcpServers();
Object.values(servers).forEach(server => {
  console.log(`${server.name}: ${server.enabled ? '启用' : '禁用'}`);
});
```

---

#### `saveMcpServer(name: string, config: McpServerConfig)`

保存 MCP 服务器配置。

**参数**:
- `name`: 服务器名称
- `config`: 服务器配置

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.saveMcpServer('github', {
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  env: {
    GITHUB_TOKEN: 'ghp_xxx'
  },
  enabled: true
});
```

---

#### `testMcpServer(config: McpServerConfig)`

测试 MCP 服务器连接。

**返回类型**: `Promise<{ success: boolean; message?: string; details?: string }>`

**示例**:
```typescript
const result = await window.electronAPI.testMcpServer(config);
if (result.success) {
  alert(`服务器测试成功: ${result.message}`);
}
```

---

### 代理管理 API

#### `getAgentsList()`

获取所有代理列表。

**返回类型**: `Promise<Agent[]>`

**Agent**:
```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  allowedTools: string[];
  temperature: number;
  createdAt: number;
  updatedAt: number;
}
```

**示例**:
```typescript
const agents = await window.electronAPI.getAgentsList();
agents.forEach(agent => {
  console.log(`${agent.name}: ${agent.description}`);
});
```

---

#### `createAgent(config: AgentConfig)`

创建新代理。

**参数**:
```typescript
interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  systemPrompt: string;
  allowedTools: string[];
  temperature?: number;
}
```

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.createAgent({
  name: 'code-reviewer',
  description: '代码审查专家',
  systemPrompt: '你是一个代码审查专家...',
  allowedTools: ['Read', 'Grep'],
  temperature: 0.3
});
```

---

#### `deleteAgent(agentId: string)`

删除指定代理。

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.deleteAgent('agent-123');
```

---

### 会话管理 API

#### `getSessionsList()`

获取所有会话列表。

**返回类型**: `Promise<Session[]>`

**Session**:
```typescript
interface Session {
  sessionId: string;
  title: string;
  cwd?: string;
  status: 'idle' | 'running';
  createdAt: number;
  updatedAt: number;
}
```

**示例**:
```typescript
const sessions = await window.electronAPI.getSessionsList();
sessions.sort((a, b) => b.updatedAt - a.updatedAt);
```

---

#### `getSessionHistory(sessionId: string)`

获取指定会话的历史记录。

**参数**:
- `sessionId`: 会话 ID

**返回类型**: `Promise<{ session: Session; messages: Message[] } | null>`

**示例**:
```typescript
const history = await window.electronAPI.getSessionHistory('sess-123');
if (history) {
  console.log(`会话标题: ${history.session.title}`);
  console.log(`消息数: ${history.messages.length}`);
}
```

---

#### `recoverSession(sessionId: string)`

恢复已删除或丢失的会话。

**参数**:
- `sessionId`: 会话 ID

**返回类型**: `Promise<{ success: boolean; sessionId?: string; error?: string }>`

**示例**:
```typescript
const result = await window.electronAPI.recoverSession('sess-123');
if (result.success) {
  console.log('会话已恢复');
}
```

---

#### `deleteSession(sessionId: string)`

删除指定会话。

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.deleteSession('sess-123');
```

---

#### `session.rename(sessionId: string, newTitle: string)`

重命名会话。

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.sessionRename('sess-123', '新标题');
```

---

### 其他 API

#### `selectDirectory()`

打开目录选择对话框。

**返回类型**: `Promise<string | null>`

**示例**:
```typescript
const directory = await window.electronAPI.selectDirectory();
if (directory) {
  console.log(`选择的目录: ${directory}`);
}
```

---

#### `openExternal(url: string)`

在默认浏览器中打开 URL。

**参数**:
- `url`: 要打开的 URL

**返回类型**: `Promise<{ success: boolean; error?: string }>`

**示例**:
```typescript
await window.electronAPI.openExternal('https://github.com/Pan519/AICowork');
```

---

#### `getStaticData()`

获取静态数据（系统信息）。

**返回类型**: `Promise<{ platform: string; arch: string; version: string }>`

**示例**:
```typescript
const data = await window.electronAPI.getStaticData();
console.log(`平台: ${data.platform}`);
console.log(`架构: ${data.arch}`);
```

---

#### `generateSessionTitle(userInput: string | null)`

自动生成会话标题。

**参数**:
- `userInput`: 用户输入的第一条消息

**返回类型**: `Promise<string>`

**示例**:
```typescript
const title = await window.electronAPI.generateSessionTitle('如何学习 Python？');
console.log(title);  // "Python 学习指南"
```

---

## 核心库 API

### ConfigStore

```typescript
import { loadAllApiConfigs, saveApiConfig } from './config-store.js';

// 加载所有配置
const { configs, activeConfigId } = loadAllApiConfigs();

// 保存配置
saveApiConfig({
  id: 'cfg_123',
  name: 'My Config',
  apiKey: 'sk-xxx',
  baseURL: 'https://api.example.com',
  model: 'model-name',
  apiType: 'anthropic'
});

// 删除配置
deleteApiConfig('cfg_123');

// 设置激活配置
setActiveApiConfig('cfg_123');

// 验证配置
const result = validateApiConfig(config);
console.log(result.valid);  // true/false
console.log(result.errors);  // 错误列表
```

### SessionStore

```typescript
import sessions from './session-store.js';

// 创建会话
const session = sessions.createSession('sess-123', '/path/to/project');

// 获取会话
const session = sessions.getSession('sess-123');

// 列出所有会话
const all = sessions.listSessions();

// 添加消息
sessions.addMessage('sess-123', 'user', '你好');

// 获取历史
const history = sessions.getSessionHistory('sess-123');

// 删除会话
sessions.deleteSession('sess-123');

// 重命名会话
sessions.renameSession('sess-123', '新标题');
```

### MemoryTools

```typescript
import { putDocument, findDocuments, askQuestion } from './memory-tools.js';

// 存储文档
await putDocument({
  title: '技术栈',
  text: 'React + Node.js',
  label: 'project'
});

// 搜索文档
const { results } = await findDocuments('React', {
  limit: 10,
  threshold: 0.7
});

// 问答查询
const { answer, sources } = await askQuestion('使用什么框架？');

// 获取统计
const stats = await getMemoryStats();

// 获取时间线
const timeline = await getMemoryTimeline({
  limit: 20,
  label: 'project'
});

// 清空记忆
await clearAllMemory();
```

### SkillsStore

```typescript
import { getSkillsList, createSkill, deleteSkill } from './skills-store.js';

// 获取技能列表
const skills = await getSkillsList();

// 创建技能
await createSkill({
  name: 'my-skill',
  description: '我的技能',
  prompt: '帮助用户：{{query}}'
});

// 删除技能
await deleteSkill('my-skill');

// 获取技能元数据
const metadata = await getSkillMetadata('my-skill');

// 获取所有技能元数据
const allMetadata = await getAllSkillsMetadata();
```

### McpStore

```typescript
import { loadMcpServers, saveMcpServer, testMcpServer } from './mcp-store.js';

// 加载服务器
const servers = loadMcpServers();

// 保存服务器
saveMcpServer('github', {
  name: 'github',
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-github'],
  env: { GITHUB_TOKEN: 'xxx' }
});

// 测试服务器
const result = await testMcpServer(config);

// 获取模板
const templates = getMcpTemplates();
```

### AgentsStore

```typescript
import { getAgentsList, createAgent } from './agents-store.js';

// 获取代理列表
const agents = await getAgentsList();

// 创建代理
await createAgent({
  name: 'coder',
  description: '编程助手',
  systemPrompt: '你是一个编程专家...',
  allowedTools: ['Read', 'Write', 'Edit']
});

// 获取编排配置
const orchConfig = getOrchestrationConfig();

// 保存编排配置
await saveOrchestrationConfig({
  mode: 'parallel',
  maxConcurrency: 3,
  stopOnFailure: true
});
```

---

## 类型定义

### ApiConfig

```typescript
interface ApiConfig {
  id: string;                              // 唯一 ID
  name: string;                            // 配置名称
  apiKey: string;                          // API 密钥
  baseURL: string;                         // 基础 URL
  model: string;                           // 模型名称
  apiType: ApiProvider;                    // 厂商类型
  isActive?: boolean;                      // 是否激活
  resourceName?: string;                   // Azure: 资源名称
  deploymentName?: string;                 // Azure: 部署名称
  customHeaders?: Record<string, string>;  // 自定义请求头
  forceOpenaiFormat?: boolean;             // 强制 OpenAI 格式
  modelLimits?: {                          // 模型限制
    max_tokens?: number;
    min_tokens?: number;
    max_temperature?: number;
    min_temperature?: number;
  };
  createdAt?: number;                      // 创建时间戳
  updatedAt?: number;                      // 更新时间戳
}
```

### ApiProvider

```typescript
type ApiProvider =
  // 国内
  | 'anthropic' | 'bigmodel' | 'deepseek' | 'qwen'
  | 'ernie' | 'hunyuan' | 'spark' | 'pangu'
  | 'moonshot' | 'minimax' | 'baichuan'
  // 国外
  | 'openai' | 'gemini' | 'cohere' | 'mistral'
  // 本地
  | 'ollama' | 'vllm' | 'localai'
  // 代理
  | 'openrouter' | 'n1n'
  // Azure
  | 'azure';
```

### MemoryDocument

```typescript
interface MemoryDocument {
  title: string;                           // 文档标题
  text: string;                            // 文档内容
  label?: 'project' | 'preference' | 'technical' | 'context' | 'custom';
  metadata?: Record<string, any>;          // 元数据
  similarity?: number;                     // 相似度（搜索结果）
  createdAt?: number;                      // 创建时间
}
```

### Session

```typescript
interface Session {
  id: string;                              // 会话 ID
  title: string;                           // 会话标题
  cwd?: string;                            // 工作目录
  status: 'idle' | 'running';              // 状态
  createdAt: number;                       // 创建时间
  updatedAt: number;                       // 更新时间
  messageCount: number;                    // 消息数量
}
```

### Message

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';   // 角色
  content: string;                         // 内容
  timestamp: number;                       // 时间戳
  toolUse?: ToolUse[];                     // 工具调用
  metadata?: Record<string, any>;          // 元数据
}

interface ToolUse {
  id: string;
  name: string;
  input: Record<string, any>;
  result?: any;
}
```

### Skill

```typescript
interface Skill {
  name: string;                            // 技能名称（唯一）
  description: string;                     // 描述
  prompt: string;                          // 提示词模板
  script?: {                               // 可选脚本
    type: 'javascript' | 'python';
    content?: string;
    path?: string;
  };
  tags?: string[];                         // 标签
  createdAt: number;                       // 创建时间
  updatedAt: number;                       // 更新时间
}
```

### Agent

```typescript
interface Agent {
  id: string;                              // 代理 ID
  name: string;                            // 名称
  description: string;                     // 描述
  systemPrompt: string;                    // 系统提示词
  allowedTools: string[];                  // 允许的工具
  temperature: number;                     // 温度参数
  createdAt: number;                       // 创建时间
  updatedAt: number;                       // 更新时间
}
```

### McpServerConfig

```typescript
interface McpServerConfig {
  name: string;                            // 服务器名称
  command: string;                         // 启动命令
  args: string[];                          // 命令参数
  env?: Record<string, string>;            // 环境变量
  enabled?: boolean;                       // 是否启用
}
```

---

## 事件系统

### 服务器事件 (Server Events)

通过 `window.electronAPI.onServerEvent` 监听：

#### `session.list`

会话列表更新事件。

```typescript
window.electronAPI.onServerEvent((eventStr) => {
  const event = JSON.parse(eventStr);
  if (event.type === 'session.list') {
    const { sessions } = event.payload;
    console.log('会话列表已更新:', sessions);
  }
});
```

#### `session.history`

会话历史加载事件。

```typescript
if (event.type === 'session.history') {
  const { sessionId, status, messages } = event.payload;
  console.log(`会话 ${sessionId} 的历史已加载`);
}
```

#### `message.delta`

消息流式传输事件（增量更新）。

```typescript
if (event.type === 'message.delta') {
  const { delta } = event.payload;
  // 更新消息内容
  appendToMessage(delta);
}
```

#### `message.done`

消息完成事件。

```typescript
if (event.type === 'message.done') {
  const { message } = event.payload;
  console.log('消息完成:', message);
}
```

#### `error`

错误事件。

```typescript
if (event.type === 'error') {
  const { error } = event.payload;
  console.error('服务器错误:', error);
}
```

### 客户端事件 (Client Events)

通过 `window.electronAPI.sendClientEvent` 发送：

```typescript
// 创建新会话
window.electronAPI.sendClientEvent({
  type: 'session.create',
  payload: { cwd: '/path/to/project' }
});

// 发送消息
window.electronAPI.sendClientEvent({
  type: 'message.send',
  payload: {
    sessionId: 'sess-123',
    content: '你好'
  }
});

// 停止响应
window.electronAPI.sendClientEvent({
  type: 'response.stop',
  payload: { sessionId: 'sess-123' }
});
```

---

## 错误处理

### 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: string;          // 错误消息
  code?: string;          // 错误代码
  details?: any;          // 详细信息
}
```

### 常见错误代码

| 代码 | 说明 | 处理方法 |
|------|------|----------|
| `CONFIG_NOT_FOUND` | 配置不存在 | 创建新配置 |
| `INVALID_API_KEY` | API Key 无效 | 更新配置 |
| `NETWORK_ERROR` | 网络错误 | 检查网络连接 |
| `RATE_LIMIT_EXCEEDED` | 超出速率限制 | 稍后重试 |
| `STORAGE_ERROR` | 存储错误 | 检查磁盘空间 |
| `PERMISSION_DENIED` | 权限被拒绝 | 检查权限设置 |

### 错误处理示例

```typescript
try {
  const result = await window.electronAPI.saveApiConfig(config);
  if (!result.success) {
    // 处理错误
    switch (result.error) {
      case 'INVALID_API_KEY':
        alert('API Key 无效，请检查');
        break;
      case 'NETWORK_ERROR':
        alert('网络连接失败，请检查网络');
        break;
      default:
        alert(`保存失败: ${result.error}`);
    }
  }
} catch (error) {
  console.error('未知错误:', error);
  alert('发生未知错误');
}
```

---

**最后更新：2026-01-23**
**维护者：AICowork 开发团队**
