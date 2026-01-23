# Agent-T08: 审计 UI 配置和工具

## 任务描述
对 UI 层的 hooks、状态管理、国际化、渲染和工具函数进行全面审计。

## 审计文件 (25+个文件)

### Hooks
1. src/ui/hooks/useIPC.ts
2. src/ui/hooks/useMessageWindow.ts

### 状态管理
3. src/ui/store/useAppStore.ts

### 国际化
4. src/ui/i18n/config.ts
5. src/ui/i18n/types.ts
6. src/ui/i18n/locales/en.ts
7. src/ui/i18n/locales/zh.ts
8. src/ui/i18n/locales/zh-TW.ts
9. src/ui/i18n/locales/ja.ts
10. src/ui/i18n/locales/ko.ts
11. src/ui/i18n/locales/de.ts
12. src/ui/i18n/locales/es.ts
13. src/ui/i18n/locales/fr.ts
14. src/ui/i18n/locales/pt.ts
15. src/ui/i18n/locales/ru.ts

### 渲染
16. src/ui/render/markdown.tsx
17. src/ui/render/markdown-enhanced.tsx

### 工具和配置
18. src/ui/utils/logger.ts
19. src/ui/types.ts
20. src/ui/config/constants.ts
21. src/ui/electron.d.ts
22. src/ui/vite-env.d.ts
23. src/ui/index.css
24. src/ui/App.css

## 审计标准

### 1. IPC 通信安全
- [ ] IPC 调用权限检查
- [ ] 参数验证
- [ ] 响应数据清理

### 2. 状态管理
- [ ] 状态持久化安全
- [ ] 敏感数据存储
- [ ] 状态同步问题

### 3. Markdown 渲染
- [ ] XSS 防护
- [ ] 危险内容过滤
- [ ] iframe/script 标签处理

### 4. 国际化
- [ ] 翻译完整性
- [ ] 格式化安全性
- [ ] locale 注入

### 5. 类型定义
- [ ] 类型覆盖
- [ ] Electron API 类型安全

## 输出格式

```json
{
  "group_id": "T-08",
  "group_name": "UI 配置和工具",
  "files_audited": ["完整文件列表"],
  "issues": [
    {
      "file": "文件路径",
      "line": 行号,
      "severity": "critical|high|medium|low",
      "category": "security|error_handling|type_safety|code_quality|performance|best_practice",
      "issue": "问题描述",
      "code_snippet": "代码片段",
      "recommendation": "修复建议",
      "cwe": "CWE-XXX"
    }
  ],
  "summary": {
    "total_files": 24,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": []
}
```

## 特别关注
- Markdown XSS (CWE-79)
- IPC 注入
- 状态泄露
- 类型定义不完整
