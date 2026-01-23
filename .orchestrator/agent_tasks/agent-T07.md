# Agent-T07: 审计 UI 组件和页面

## 任务描述
对所有 React 组件和页面进行全面审计，关注前端安全和用户体验。

## 审计文件 (35+个文件)

### 核心组件
1. src/ui/App.tsx
2. src/ui/main.tsx
3. src/ui/components/DecisionPanel.tsx
4. src/ui/components/DeletionConfirmDialog.tsx
5. src/ui/components/LanguageSwitcher.tsx
6. src/ui/components/PromptInput.tsx
7. src/ui/components/StartSessionModal.tsx
8. src/ui/components/BrainIcon.tsx
9. src/ui/components/ErrorBoundary.tsx
10. src/ui/components/SettingsModal.tsx
11. src/ui/components/Sidebar.tsx
12. src/ui/components/EventCard.tsx
13. src/ui/components/SessionStatusIndicator.tsx

### 设置页面
14. src/ui/pages/SettingsPage/SettingsPage.tsx
15. src/ui/pages/SettingsPage/SettingsContent.tsx
16. src/ui/pages/SettingsPage/SettingsNavigation.tsx
17. src/ui/pages/SettingsPage/sections/AboutSection.tsx
18. src/ui/pages/SettingsPage/sections/AgentsSection.tsx
19. src/ui/pages/SettingsPage/sections/ApiSection.tsx
20. src/ui/pages/SettingsPage/sections/ClaudeMdSection.tsx
21. src/ui/pages/SettingsPage/sections/FeedbackSection.tsx
22. src/ui/pages/SettingsPage/sections/HelpSection.tsx
23. src/ui/pages/SettingsPage/sections/HooksSection.tsx
24. src/ui/pages/SettingsPage/sections/LanguageSection.tsx
25. src/ui/pages/SettingsPage/sections/McpSection.tsx
26. src/ui/pages/SettingsPage/sections/MemorySection.tsx
27. src/ui/pages/SettingsPage/sections/OutputSection.tsx
28. src/ui/pages/SettingsPage/sections/PermissionsSection.tsx
29. src/ui/pages/SettingsPage/sections/PluginsSection.tsx
30. src/ui/pages/SettingsPage/sections/RecoverySection.tsx
31. src/ui/pages/SettingsPage/sections/RulesSection.tsx
32. src/ui/pages/SettingsPage/sections/SkillsSection.tsx
33. src/ui/pages/SettingsPage/sections/skills/SkillsList.tsx
34. src/ui/pages/SettingsPage/sections/skills/SkillsDetail.tsx
35. src/ui/pages/SettingsPage/sections/skills/SkillsEdit.tsx
36. src/ui/pages/SettingsPage/sections/skills/TagsManage.tsx
37. src/ui/pages/SettingsPage/sections/skills/index.ts

## 审计标准

### 1. React 安全
- [ ] XSS 防护 (dangerouslySetInnerHTML 使用)
- [ ] 用户输入转义
- [ ] URL 注入防护
- [ ] React dangerouslySetInnerHTML 安全使用

### 2. 状态管理
- [ ] 状态更新正确性
- [ ] 副作用处理
- [ ] 依赖数组完整性

### 3. 性能
- [ ] 不必要的重渲染
- [ ] 大列表优化
- [ ] 图片/资源优化

### 4. 用户体验
- [ ] 加载状态处理
- [ ] 错误边界覆盖
- [ ] 表单验证

### 5. 代码质量
- [ ] Props 类型定义
- [ ] 组件拆分合理性
- [ ] Hook 使用规范

## 输出格式

```json
{
  "group_id": "T-07",
  "group_name": "UI 组件和页面",
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
    "total_files": 37,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": []
}
```

## 特别关注
- XSS 攻击 (CWE-79)
- CSRF 防护
- 敏感数据泄露到 UI
- Markdown 渲染安全
- API 密钥显示安全
