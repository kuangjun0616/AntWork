# Mac 开发环境 CSP 错误解决方案

## 问题描述

在 Mac 上运行开发环境时出现以下错误：

```
Executing inline script violates the following Content Security Policy directive: "script-src 'self' http://localhost:*"
Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
Uncaught Error: @vitejs/plugin-react can't detect preamble. Something is wrong.
at BrainIcon.tsx:26:26
```

## 根本原因

**Vite 的 React Fast Refresh 需要在页面中注入内联脚本**来实现热更新（HMR），但当前代码的 CSP 策略 `script-src 'self' http://localhost:*` 不允许内联脚本（缺少 `'unsafe-inline'`）。

Mac 版本的 Electron 对 CSP 策略的执行比 Windows 更严格，因此会触发此错误。

---

## 解决方案

### 方案 1：修改 CSP 配置（推荐，永久解决）

修改文件：`src/electron/main/window-manager.ts`

**找到第 80-82 行：**
```typescript
const csp = isDev()
    ? "default-src 'self' http://localhost:* ws://localhost:*; script-src 'self' http://localhost:*; ..."
    : "default-src 'self'; script-src 'self'; ..."
```

**修改为（在 script-src 中添加 'unsafe-inline' 'unsafe-eval'）：**
```typescript
const csp = isDev()
    ? "default-src 'self' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*; style-src 'self' 'unsafe-inline' http://localhost:*; img-src 'self' data: https: http://localhost:*; font-src 'self' data:; connect-src 'self' http://localhost:* ws://localhost:* https://api.anthropic.com https://*.anthropic.com;"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com https://*.anthropic.com;";
```

**修改说明：**
- `'unsafe-inline'`：允许内联脚本（Vite HMR 需要）
- `'unsafe-eval'`：允许 eval()（某些开发工具需要）
- 仅影响开发环境，生产环境保持严格的安全策略

**修改后重启开发服务器：**
```bash
pnpm dev
```

---

### 方案 2：清除缓存重装（如果方案 1 无效）

```bash
# 1. 停止开发服务器 (Ctrl+C)

# 2. 清除所有缓存和构建产物
rm -rf node_modules
rm -rf dist
rm -rf dist-electron
rm -rf dist-react

# 3. 重新安装依赖
pnpm install

# 4. 重新启动
pnpm dev
```

---

### 方案 3：检查本地环境

运行以下命令检查环境配置：

```bash
# 检查 Node.js 版本（建议 v18+）
node -v

# 检查 pnpm 版本
pnpm -v

# 检查端口 5173 是否被占用
lsof -i :5173

# 如果被占用，可以终止进程或更换端口
# 在 .env 文件中设置：PORT=3000
```

---

## 安全性说明

**这个修改是安全的，原因如下：**

1. **仅影响开发环境** - 生产环境仍然使用严格的 CSP 策略
2. **开发环境的权衡** - HMR 带来的开发效率提升远大于安全风险
3. **Electron 沙箱保护** - 应用的 `sandbox: true` 配置仍然有效

---

## 修改后的完整代码

如果你需要完整的修改后的 CSP 代码：

```typescript
// src/electron/main/window-manager.ts

function setupSecurityHeaders(): void {
    if (!mainWindow) return;

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        // CSP 策略：开发模式允许 unsafe-inline 以支持 Vite HMR
        // 生产环境严格限制，移除 unsafe-inline 和 unsafe-eval（安全性提升）
        const csp = isDev()
            ? "default-src 'self' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*; style-src 'self' 'unsafe-inline' http://localhost:*; img-src 'self' data: https: http://localhost:*; font-src 'self' data:; connect-src 'self' http://localhost:* ws://localhost:* https://api.anthropic.com https://*.anthropic.com;"
            : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com https://*.anthropic.com;";

        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [csp]
            }
        });
    });
}
```

---

## 联系支持

如果以上方案都无法解决问题，请提供以下信息：

1. 完整的错误堆栈信息
2. macOS 版本：`sw_vers`
3. Node.js 版本：`node -v`
4. pnpm 版本：`pnpm -v`
5. Electron 版本：查看 `package.json`

---

**文档创建时间：** 2025-01-24
**适用环境：** macOS 开发环境
**相关文件：** `src/electron/main/window-manager.ts`
