# AICowork 项目全面代码审计计划

## 请求
> 对 AICowork 项目进行全面逐行代码审计，覆盖所有源文件，生成最严格的审计报告

## 审计标准（通用）

### 1. 安全性 (Security)
- **注入攻击**: SQL注入、命令注入、XSS、路径遍历
- **敏感数据泄露**: API密钥、密码、token硬编码
- **权限绕过**: 缺少权限检查、不安全的默认值
- **输入验证**: 用户输入未经验证直接使用

### 2. 错误处理 (Error Handling)
- **异常捕获**: try-catch 覆盖完整性
- **错误传播**: 错误是否正确向上传播
- **静默失败**: catch块为空或只打印日志
- **错误信息**: 是否泄露敏感信息

### 3. 类型安全 (Type Safety)
- **类型定义**: interface/type 定义是否完整
- **any类型**: 过度使用 any
- **类型断言**: 不安全的类型断言
- **null/undefined**: 可空值处理

### 4. 代码质量 (Code Quality)
- **重复代码**: DRY原则违反
- **复杂度**: 圈复杂度过高
- **命名规范**: 变量/函数命名是否清晰
- **注释**: 必要的注释是否存在

### 5. 性能 (Performance)
- **内存泄漏**: 事件监听器未清理、闭包问题
- **资源清理**: 文件句柄、连接是否正确关闭
- **阻塞操作**: 同步操作阻塞主线程
- **优化**: 不必要的重复计算

### 6. 最佳实践 (Best Practices)
- **异步处理**: 正确使用 async/await
- **事件监听**: 添加和清理配对
- **状态管理**: 状态更新是否不可变
- **依赖注入**: 硬编码依赖

---

## 任务分解

| ID | 任务描述 | 文件组 | 依赖 | 状态 |
|----|----------|--------|------|------|
| T-01 | 审计 Electron 主进程核心文件 | 组1: main.ts, ipc-handlers.ts, main/ipc-registry.ts, main/lifecycle.ts, main/window-manager.ts | None | 🟡 |
| T-02 | 审计错误处理和类型系统 | 组2: errors/*.ts, types.ts, handlers/session-handlers.ts | None | 🟡 |
| T-03 | 审计 API 适配器层 | 组3: libs/api-adapter.ts, libs/api-adapters/*.ts, api-proxy/*.ts | None | 🟡 |
| T-04 | 审计 Runner 核心模块 | 组4: libs/runner/index.ts, permission-handler.ts, memory-manager.ts, performance-monitor.ts, types.ts | None | 🟡 |
| T-05 | 审计存储层 | 组5: storage/*.ts (20+ 文件) | None | 🟡 |
| T-06 | 审计工具和实用程序 | 组6: utils/*.ts, util.ts, config/*.ts, middleware/*.ts, services/*.ts, managers/*.ts | None | 🟡 |
| T-07 | 审计 UI 组件和页面 | 组7: components/*.tsx, pages/**/*.tsx (30+ 文件) | None | 🟡 |
| T-08 | 审计 UI 配置和工具 | 组8: hooks/*.ts, store/*.ts, i18n/**/*.ts, utils/*.ts, render/*.tsx, types.ts | None | 🟡 |
| T-09 | 审计共享代码和配置 | 组9: shared/**/*.ts, 根配置文件 | None | 🟡 |
| T-10 | 汇总审计报告 | 汇总所有组结果 | T-01~T-09 | ⏸️ |

---

## 文件清单

### 组1: Electron 主进程核心 (5个文件)
- src/electron/main.ts
- src/electron/ipc-handlers.ts
- src/electron/main/ipc-registry.ts
- src/electron/main/lifecycle.ts
- src/electron/main/window-manager.ts

### 组2: 错误处理和类型 (8个文件)
- src/electron/errors/app-error.ts
- src/electron/errors/api-error.ts
- src/electron/errors/handler.ts
- src/electron/errors/index.ts
- src/electron/errors/ipc-error.ts
- src/electron/types.ts
- src/electron/handlers/session-handlers.ts
- src/electron/error-handling.ts

### 组3: API 适配器层 (6个文件)
- src/electron/libs/api-adapter.ts
- src/electron/libs/api-adapters/index.ts
- src/electron/libs/api-adapters/openai-adapter.ts
- src/electron/libs/api-adapters/utils.ts
- src/electron/libs/api-adapters/constants.ts
- src/electron/libs/api-adapters/types.ts
- src/electron/api-proxy/server.ts
- src/electron/api-proxy/index.ts
- src/electron/api-proxy/token-counter.ts

### 组4: Runner 核心 (5个文件)
- src/electron/libs/runner/index.ts
- src/electron/libs/runner/permission-handler.ts
- src/electron/libs/runner/memory-manager.ts
- src/electron/libs/runner/performance-monitor.ts
- src/electron/libs/runner/types.ts

### 组5: 存储层 (20个文件)
- src/electron/storage/agents-store.ts
- src/electron/storage/config-store.ts
- src/electron/storage/fs-memory-store.ts
- src/electron/storage/hooks-store.ts
- src/electron/storage/mcp-store.ts
- src/electron/storage/memvid-store.ts
- src/electron/storage/output-store.ts
- src/electron/storage/permissions-store.ts
- src/electron/storage/rules-store.ts
- src/electron/storage/session-store.ts
- src/electron/storage/skills-store.ts

### 组6: 工具和实用程序 (25个文件)
- src/electron/util.ts
- src/electron/logger.ts
- src/electron/pathResolver.ts
- src/electron/test.ts
- src/electron/config/constants.ts
- src/electron/config/env.ts
- src/electron/config/network-constants.ts
- src/electron/middleware/ipc-error-handler.ts
- src/electron/managers/mcp-server-manager.ts
- src/electron/managers/sdk-config-cache.ts
- src/electron/services/slash-commands.ts
- src/electron/services/claude-settings.ts
- src/electron/utils/auto-memory-manager.ts
- src/electron/utils/claude-memory-mcp-server.ts
- src/electron/utils/claude-memory-tool.ts
- src/electron/utils/env-file.ts
- src/electron/utils/language-detector.ts
- src/electron/utils/memory-config.ts
- src/electron/utils/memory-mcp-server.ts
- src/electron/utils/memory-tools.ts
- src/electron/utils/platform.ts
- src/electron/utils/skills-metadata.ts
- src/electron/utils/type-guards.ts
- src/electron/utils/util.ts
- src/electron/utils/sdk-native-loader.ts
- src/electron/libs/runner.ts
- src/electron/api-tester.ts

### 组7: UI 组件和页面 (30个文件)
- src/ui/App.tsx
- src/ui/main.tsx
- src/ui/components/DecisionPanel.tsx
- src/ui/components/DeletionConfirmDialog.tsx
- src/ui/components/LanguageSwitcher.tsx
- src/ui/components/PromptInput.tsx
- src/ui/components/StartSessionModal.tsx
- src/ui/components/BrainIcon.tsx
- src/ui/components/ErrorBoundary.tsx
- src/ui/components/SettingsModal.tsx
- src/ui/components/Sidebar.tsx
- src/ui/components/EventCard.tsx
- src/ui/components/SessionStatusIndicator.tsx
- src/ui/pages/SettingsPage/SettingsPage.tsx
- src/ui/pages/SettingsPage/SettingsContent.tsx
- src/ui/pages/SettingsPage/SettingsNavigation.tsx
- src/ui/pages/SettingsPage/sections/AboutSection.tsx
- src/ui/pages/SettingsPage/sections/AgentsSection.tsx
- src/ui/pages/SettingsPage/sections/ApiSection.tsx
- src/ui/pages/SettingsPage/sections/ClaudeMdSection.tsx
- src/ui/pages/SettingsPage/sections/FeedbackSection.tsx
- src/ui/pages/SettingsPage/sections/HelpSection.tsx
- src/ui/pages/SettingsPage/sections/HooksSection.tsx
- src/ui/pages/SettingsPage/sections/LanguageSection.tsx
- src/ui/pages/SettingsPage/sections/McpSection.tsx
- src/ui/pages/SettingsPage/sections/MemorySection.tsx
- src/ui/pages/SettingsPage/sections/OutputSection.tsx
- src/ui/pages/SettingsPage/sections/PermissionsSection.tsx
- src/ui/pages/SettingsPage/sections/PluginsSection.tsx
- src/ui/pages/SettingsPage/sections/RecoverySection.tsx
- src/ui/pages/SettingsPage/sections/RulesSection.tsx
- src/ui/pages/SettingsPage/sections/SkillsSection.tsx
- src/ui/pages/SettingsPage/sections/skills/*.tsx

### 组8: UI 配置和工具 (15个文件)
- src/ui/hooks/useIPC.ts
- src/ui/hooks/useMessageWindow.ts
- src/ui/store/useAppStore.ts
- src/ui/i18n/config.ts
- src/ui/i18n/types.ts
- src/ui/i18n/locales/*.ts (11个语言文件)
- src/ui/utils/logger.ts
- src/ui/render/markdown.tsx
- src/ui/render/markdown-enhanced.tsx
- src/ui/types.ts
- src/ui/config/constants.ts
- src/ui/electron.d.ts
- src/ui/vite-env.d.ts
- src/ui/index.css
- src/ui/App.css

### 组9: 共享代码和配置 (5个文件)
- src/shared/types/index.ts
- src/shared/deletion-detection.ts
- package.json
- tsconfig.json
- 各种配置文件

---

## 输出格式

每个审计组返回 JSON 格式：

```json
{
  "group_id": "T-XX",
  "group_name": "组名称",
  "files_audited": ["文件路径列表"],
  "issues": [
    {
      "file": "文件路径",
      "line": 行号,
      "severity": "critical|high|medium|low",
      "category": "security|error_handling|type_safety|code_quality|performance|best_practice",
      "issue": "问题描述",
      "code_snippet": "代码片段",
      "recommendation": "修复建议",
      "cwe": "CWE编号(如适用)"
    }
  ],
  "summary": {
    "total_files": N,
    "critical_issues": N,
    "high_issues": N,
    "medium_issues": N,
    "low_issues": N
  },
  "positive_findings": [
    "发现的良好实践"
  ]
}
```

---

**状态说明**: 🟡 Pending · 🔵 Running · ✅ Done · ❌ Failed · ⏸️ Waiting
