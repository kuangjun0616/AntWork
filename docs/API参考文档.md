# AICowork API 参考文档

> **版本**: v0.1.0
> **作者**: Alan <none>
> **创建日期**: 2026-01-24
> **最后更新**: 2026-01-24
> **协议**: IPC (Inter-Process Communication)

---

## 📋 目录

1. [API 概述](#api-概述)
2. [IPC 通信协议](#ipc-通信协议)
3. [客户端 API](#客户端-api)
4. [服务端事件](#服务端事件)
5. [类型定义](#类型定义)
6. [错误处理](#错误处理)
7. [使用示例](#使用示例)

---

## API 概述

### 架构设计

AICowork 使用 Electron 的 IPC (Inter-Process Communication) 机制实现渲染进程与主进程之间的通信：

```
┌─────────────────┐                    ┌─────────────────┐
│  渲染进程        │                    │  主进程         │
│  (Renderer)     │                    │  (Main)         │
│                 │                    │                 │
│  React UI       │                    │  业务逻辑       │
│                 │                    │                 │
│  ┌───────────┐  │   IPC Messages     │  ┌───────────┐  │
│  │  Window   │  │ ←────────────────→ │  │Handlers   │  │
│  │  .api     │  │                    │  │           │  │
│  └───────────┘  │                    │  └───────────┘  │
│                 │                    │                 │
└─────────────────┘                    └─────────────────┘
```

### 通信模式

| 模式 | 方向 | 用途 |
|-----|------|------|
| **Request-Response** | 渲染进程 → 主进程 → 渲染进程 | 调用主进程功能，等待返回结果 |
| **Event (Uni-directional)** | 主进程 → 渲染进程 | 主进程主动推送状态更新 |

---

## IPC 通信协议

### 客户端事件 (Client Events)

客户端（渲染进程）发送到服务端（主进程）的事件。

#### 事件类型定义

```typescript
type ClientEvent =
  | { type: "session.list"; payload?: never }
  | { type: "session.history"; payload: { sessionId: string } }
  | { type: "session.start"; payload: StartSessionPayload }
  | { type: "session.continue"; payload: { sessionId: string; prompt: string } }
  | { type: "session.stop"; payload: { sessionId: string } }
  | { type: "session.delete"; payload: { sessionId: string } }
  | { type: "permission.response"; payload: PermissionResponsePayload };
```

---

### 服务端事件 (Server Events)

服务端（主进程）发送到客户端（渲染进程）的事件。

#### 事件类型定义

```typescript
type ServerEvent =
  | { type: "session.list"; payload: { sessions: Session[] } }
  | { type: "session.history"; payload: { sessionId: string; messages: Message[] } }
  | { type: "session.created"; payload: { session: Session } }
  | { type: "session.deleted"; payload: { sessionId: string } }
  | { type: "session.status"; payload: { sessionId: string; status: SessionStatus } }
  | { type: "stream.message"; payload: StreamMessagePayload }
  | { type: "stream.user_prompt"; payload: { sessionId: string; prompt: string } }
  | { type: "permission.request"; payload: PermissionRequestPayload }
  | { type: "error"; payload: { message: string } };
```

---

## 客户端 API

### Preload API

通过 `contextBridge` 暴露给渲染进程的安全 API。

```typescript
// src/electron/preload.cts
contextBridge.exposeInMainWorld('api', {
  // 会话管理
  session: {
    list: () => Promise<Session[]>;
    history: (sessionId: string) => Promise<Message[]>;
    start: (config: StartSessionConfig) => Promise<string>;
    continue: (sessionId: string, prompt: string) => Promise<void>;
    stop: (sessionId: string) => Promise<void>;
    delete: (sessionId: string) => Promise<void>;
  },

  // 权限管理
  permission: {
    respond: (requestId: string, decision: boolean) => Promise<void>;
  },

  // 事件监听
  on: (event: ServerEventType, callback: (payload: any) => void) => void;
  off: (event: ServerEventType, callback: (payload: any) => void) => void;
});
```

---

### 会话管理 API

#### 1. session.list()

获取所有会话列表。

**签名**:
```typescript
session.list(): Promise<Session[]>
```

**返回值**:
```typescript
interface Session {
  id: string;
  title: string;
  status: "idle" | "running" | "stopped" | "error";
  created_at: number;
  updated_at: number;
}
```

**使用示例**:
```typescript
// React 组件中使用
const loadSessions = async () => {
  const sessions = await window.api.session.list();
  setSessions(sessions);
};
```

---

#### 2. session.history()

获取指定会话的历史消息。

**签名**:
```typescript
session.history(sessionId: string): Promise<Message[]>
```

**参数**:
- `sessionId`: 会话 ID

**返回值**:
```typescript
type Message =
  | { type: "user_prompt"; prompt: string }
  | { type: "text"; role: "assistant" | "user"; content: string }
  | { type: "tool_use"; id: string; name: string; input: Record<string, any> }
  | { type: "tool_result"; id: string; content: string; isError?: boolean };
```

**使用示例**:
```typescript
const loadHistory = async (sessionId: string) => {
  const messages = await window.api.session.history(sessionId);
  setMessages(messages);
};
```

---

#### 3. session.start()

创建并启动一个新会话。

**签名**:
```typescript
session.start(config: StartSessionConfig): Promise<string>
```

**参数**:
```typescript
interface StartSessionConfig {
  title?: string;
  apiKey?: string;
  model?: string;
  provider?: string;
  baseUrl?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}
```

**返回值**:
- `sessionId`: 新创建的会话 ID

**使用示例**:
```typescript
const startNewSession = async () => {
  const sessionId = await window.api.session.start({
    title: "新对话",
    model: "glm-4-flash",
    provider: "zhipu"
  });

  setCurrentSession(sessionId);
};
```

---

#### 4. session.continue()

向会话发送新消息。

**签名**:
```typescript
session.continue(sessionId: string, prompt: string): Promise<void>
```

**参数**:
- `sessionId`: 会话 ID
- `prompt`: 用户输入的提示词

**使用示例**:
```typescript
const sendMessage = async (sessionId: string, content: string) => {
  await window.api.session.continue(sessionId, content);

  // 监听流式响应
  window.api.on("stream.message", (payload) => {
    if (payload.sessionId === sessionId) {
      // 处理消息片段
      appendMessage(payload.message);
    }
  });
};
```

---

#### 5. session.stop()

停止正在运行的会话。

**签名**:
```typescript
session.stop(sessionId: string): Promise<void>
```

**参数**:
- `sessionId`: 会话 ID

**使用示例**:
```typescript
const stopSession = async (sessionId: string) => {
  await window.api.session.stop(sessionId);
};
```

---

#### 6. session.delete()

删除指定会话。

**签名**:
```typescript
session.delete(sessionId: string): Promise<void>
```

**参数**:
- `sessionId`: 会话 ID

**使用示例**:
```typescript
const deleteSession = async (sessionId: string) => {
  if (confirm("确定要删除这个会话吗？")) {
    await window.api.session.delete(sessionId);

    // 从列表中移除
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }
};
```

---

### 权限管理 API

#### permission.respond()

响应权限请求。

**签名**:
```typescript
permission.respond(requestId: string, decision: boolean): Promise<void>
```

**参数**:
- `requestId`: 权限请求 ID
- `decision`: `true` = 允许，`false` = 拒绝

**使用示例**:
```typescript
// 显示权限请求对话框
window.api.on("permission.request", (payload) => {
  const { requestId, toolName, toolInput } = payload;

  const confirmed = confirm(
    `AI 想要使用工具 ${toolName}\n` +
    `输入参数: ${JSON.stringify(toolInput, null, 2)}\n\n` +
    `是否允许？`
  );

  window.api.permission.respond(requestId, confirmed);
});
```

---

## 服务端事件

### 会话事件

#### session.created

新会话创建时触发。

```typescript
{
  type: "session.created";
  payload: {
    session: Session;
  };
}
```

**使用示例**:
```typescript
window.api.on("session.created", ({ payload }) => {
  // 添加到会话列表
  setSessions(prev => [...prev, payload.session]);

  // 切换到新会话
  setCurrentSession(payload.session.id);
});
```

---

#### session.deleted

会话删除时触发。

```typescript
{
  type: "session.deleted";
  payload: {
    sessionId: string;
  };
}
```

**使用示例**:
```typescript
window.api.on("session.deleted", ({ payload }) => {
  // 从会话列表中移除
  setSessions(prev => prev.filter(s => s.id !== payload.sessionId));

  // 如果删除的是当前会话，清空消息
  if (currentSessionId === payload.sessionId) {
    setCurrentSession(null);
    setMessages([]);
  }
});
```

---

#### session.status

会话状态变化时触发。

```typescript
{
  type: "session.status";
  payload: {
    sessionId: string;
    status: "idle" | "running" | "stopped" | "error";
  };
}
```

**状态说明**:
- `idle`: 会话空闲，可以接收新消息
- `running`: AI 正在生成回复
- `stopped`: 会话已停止
- `error`: 会话出错

**使用示例**:
```typescript
window.api.on("session.status", ({ payload }) => {
  // 更新会话状态
  setSessions(prev => prev.map(s =>
    s.id === payload.sessionId
      ? { ...s, status: payload.status }
      : s
  ));

  // 显示/隐藏加载指示器
  if (payload.status === "running") {
    showLoadingIndicator();
  } else {
    hideLoadingIndicator();
  }
});
```

---

### 消息事件

#### stream.message

AI 回复的消息片段（流式响应）。

```typescript
{
  type: "stream.message";
  payload: {
    sessionId: string;
    message: {
      type: "text";
      role: "assistant" | "user";
      content: string;
    }
  };
}
```

**使用示例**:
```typescript
window.api.on("stream.message", ({ payload }) => {
  if (payload.sessionId === currentSessionId) {
    // 追加消息内容
    appendMessage(payload.message.content);
  }
});
```

---

#### stream.user_prompt

用户提示词确认（用于长消息确认）。

```typescript
{
  type: "stream.user_prompt";
  payload: {
    sessionId: string;
    prompt: string;
  };
}
```

**使用示例**:
```typescript
window.api.on("stream.user_prompt", ({ payload }) => {
  // 显示用户提示词确认
  setUserPrompt(payload.prompt);
});
```

---

### 权限事件

#### permission.request

AI 请求使用工具时的权限请求。

```typescript
{
  type: "permission.request";
  payload: {
    requestId: string;
    sessionId: string;
    toolName: string;
    toolInput: Record<string, any>;
  };
}
```

**使用示例**:
```typescript
window.api.on("permission.request", ({ payload }) => {
  const { requestId, toolName, toolInput } = payload;

  // 显示权限请求对话框
  showPermissionDialog({
    toolName,
    toolInput,
    onAllow: () => window.api.permission.respond(requestId, true),
    onDeny: () => window.api.permission.respond(requestId, false)
  });
});
```

---

### 错误事件

#### error

发生错误时触发。

```typescript
{
  type: "error";
  payload: {
    message: string;
  };
}
```

**使用示例**:
```typescript
window.api.on("error", ({ payload }) => {
  // 显示错误提示
  toast.error(payload.message);

  // 记录错误日志
  console.error("IPC Error:", payload.message);
});
```

---

## 类型定义

### Session

```typescript
interface Session {
  id: string;                    // 会话唯一 ID
  title: string;                 // 会话标题
  status: SessionStatus;         // 会话状态
  created_at: number;            // 创建时间戳
  updated_at: number;            // 更新时间戳
}

type SessionStatus =
  | "idle"       // 空闲
  | "running"    // 运行中
  | "stopped"    // 已停止
  | "error";     // 错误
```

---

### Message

```typescript
type Message =
  // 用户提示词
  | {
      type: "user_prompt";
      prompt: string;
    }

  // 文本消息（助手或用户）
  | {
      type: "text";
      role: "assistant" | "user";
      content: string;
    }

  // 工具使用请求
  | {
      type: "tool_use";
      id: string;
      name: string;
      input: Record<string, any>;
    }

  // 工具执行结果
  | {
      type: "tool_result";
      id: string;
      content: string;
      isError?: boolean;
    };
```

---

### StartSessionConfig

```typescript
interface StartSessionConfig {
  title?: string;           // 会话标题（可选）
  apiKey?: string;          // API Key（可选，使用配置中的 Key）
  model?: string;           // 模型名称（可选）
  provider?: string;        // 提供商（可选）
  baseUrl?: string;         // API 基础 URL（可选）
  systemPrompt?: string;    // 系统提示词（可选）
  temperature?: number;     // 温度参数 0-1（可选）
  maxTokens?: number;       // 最大 Token 数（可选）
}
```

---

### PermissionRequestPayload

```typescript
interface PermissionRequestPayload {
  requestId: string;                    // 请求唯一 ID
  sessionId: string;                    // 会话 ID
  toolName: string;                     // 工具名称
  toolInput: Record<string, any>;       // 工具输入参数
}
```

---

## 错误处理

### 错误类型

#### 1. 会话错误

```typescript
interface SessionError {
  type: "session.not_found";
  message: "会话不存在";
  sessionId: string;
}

// 处理示例
try {
  await window.api.session.continue(sessionId, prompt);
} catch (error) {
  if (error.type === "session.not_found") {
    toast.error("会话不存在，请重新创建");
  }
}
```

---

#### 2. API 错误

```typescript
interface ApiError {
  type: "api.error";
  message: string;
  statusCode?: number;
}

// 处理示例
window.api.on("error", ({ payload }) => {
  if (payload.message.includes("API key")) {
    toast.error("API Key 配置错误，请检查设置");
  } else if (payload.message.includes("network")) {
    toast.error("网络连接失败，请检查网络");
  } else {
    toast.error(payload.message);
  }
});
```

---

#### 3. 权限错误

```typescript
interface PermissionError {
  type: "permission.denied";
  message: "权限被拒绝";
  toolName: string;
}

// 处理示例
window.api.on("error", ({ payload }) => {
  if (payload.message.includes("permission")) {
    toast.error("操作被拒绝，请检查权限设置");
  }
});
```

---

### 错误处理最佳实践

```typescript
// React Hook 示例
function useSessionApi() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (sessionId: string, prompt: string) => {
    setLoading(true);
    setError(null);

    try {
      await window.api.session.continue(sessionId, prompt);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, error, loading };
}
```

---

## 使用示例

### 示例 1: 创建会话并发送消息

```typescript
import { useState } from 'react';

export function ChatComponent() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // 创建新会话
  const handleNewSession = async () => {
    const newSessionId = await window.api.session.start({
      title: '新对话'
    });
    setSessionId(newSessionId);
    setMessages([]);
  };

  // 发送消息
  const handleSend = async () => {
    if (!sessionId || !input.trim()) return;

    // 添加用户消息
    setMessages(prev => [...prev, {
      type: 'text',
      role: 'user',
      content: input
    }]);

    const userMessage = input;
    setInput('');

    try {
      // 发送到 AI
      await window.api.session.continue(sessionId, userMessage);
    } catch (error) {
      console.error('发送失败:', error);
    }
  };

  // 监听 AI 响应
  useEffect(() => {
    const handleMessage = ({ payload }: ServerEvent) => {
      if (payload.type === 'stream.message' && payload.sessionId === sessionId) {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];

          // 如果最后一条是助手消息，追加内容
          if (lastMessage?.type === 'text' && lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + payload.message.content }
            ];
          }

          // 否则添加新消息
          return [...prev, payload.message];
        });
      }
    };

    window.api.on('stream.message', handleMessage);

    return () => {
      window.api.off('stream.message', handleMessage);
    };
  }, [sessionId]);

  return (
    <div>
      <button onClick={handleNewSession}>新对话</button>

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
    </div>
  );
}
```

---

### 示例 2: 加载会话列表

```typescript
import { useState, useEffect } from 'react';

export function SessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // 加载会话列表
  useEffect(() => {
    const loadSessions = async () => {
      const list = await window.api.session.list();
      setSessions(list);
    };

    loadSessions();

    // 监听新会话创建
    const handleCreated = ({ payload }: ServerEvent) => {
      if (payload.type === 'session.created') {
        setSessions(prev => [...prev, payload.session]);
      }
    };

    // 监听会话删除
    const handleDeleted = ({ payload }: ServerEvent) => {
      if (payload.type === 'session.deleted') {
        setSessions(prev => prev.filter(s => s.id !== payload.sessionId));
      }
    };

    // 监听状态更新
    const handleStatus = ({ payload }: ServerEvent) => {
      if (payload.type === 'session.status') {
        setSessions(prev => prev.map(s =>
          s.id === payload.sessionId
            ? { ...s, status: payload.status }
            : s
        ));
      }
    };

    window.api.on('session.created', handleCreated);
    window.api.on('session.deleted', handleDeleted);
    window.api.on('session.status', handleStatus);

    return () => {
      window.api.off('session.created', handleCreated);
      window.api.off('session.deleted', handleDeleted);
      window.api.off('session.status', handleStatus);
    };
  }, []);

  // 删除会话
  const handleDelete = async (sessionId: string) => {
    if (confirm('确定要删除这个会话吗？')) {
      await window.api.session.delete(sessionId);
    }
  };

  return (
    <ul>
      {sessions.map(session => (
        <li
          key={session.id}
          className={currentId === session.id ? 'active' : ''}
          onClick={() => setCurrentId(session.id)}
        >
          <span>{session.title}</span>
          <span className="status">{session.status}</span>
          <button onClick={() => handleDelete(session.id)}>删除</button>
        </li>
      ))}
    </ul>
  );
}
```

---

### 示例 3: 权限处理

```typescript
import { useState, useEffect } from 'react';

export function PermissionHandler() {
  const [pendingRequest, setPendingRequest] = useState<PermissionRequestPayload | null>(null);

  useEffect(() => {
    const handleRequest = ({ payload }: ServerEvent) => {
      if (payload.type === 'permission.request') {
        setPendingRequest(payload);
      }
    };

    window.api.on('permission.request', handleRequest);

    return () => {
      window.api.off('permission.request', handleRequest);
    };
  }, []);

  const handleResponse = (decision: boolean) => {
    if (!pendingRequest) return;

    window.api.permission.respond(pendingRequest.requestId, decision);
    setPendingRequest(null);
  };

  if (!pendingRequest) return null;

  return (
    <div className="permission-dialog">
      <h3>权限请求</h3>
      <p>AI 想要使用工具: <strong>{pendingRequest.toolName}</strong></p>
      <pre>{JSON.stringify(pendingRequest.toolInput, null, 2)}</pre>
      <div className="actions">
        <button onClick={() => handleResponse(true)}>允许</button>
        <button onClick={() => handleResponse(false)}>拒绝</button>
      </div>
    </div>
  );
}
```

---

## 附录

### 完整的类型定义文件

```typescript
// src/ui/electron.d.ts

interface ElectronAPI {
  session: {
    list: () => Promise<Session[]>;
    history: (sessionId: string) => Promise<Message[]>;
    start: (config: StartSessionConfig) => Promise<string>;
    continue: (sessionId: string, prompt: string) => Promise<void>;
    stop: (sessionId: string) => Promise<void>;
    delete: (sessionId: string) => Promise<void>;
  };

  permission: {
    respond: (requestId: string, decision: boolean) => Promise<void>;
  };

  on: (event: ServerEventType, callback: (payload: any) => void) => void;
  off: (event: ServerEventType, callback: (payload: any) => void) => void;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}

export {};
```

---

**文档维护**: Alan
**最后更新**: 2026-01-24
**许可证**: AGPL-3.0
