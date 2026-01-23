# Agent-T06: 审计工具和实用程序

## 任务描述
对所有工具类、配置、中间件、服务和模块管理器进行全面审计。

## 审计文件 (25个文件)
1. src/electron/util.ts
2. src/electron/logger.ts
3. src/electron/pathResolver.ts
4. src/electron/test.ts
5. src/electron/libs/runner.ts
6. src/electron/api-tester.ts
7. src/electron/config/constants.ts
8. src/electron/config/env.ts
9. src/electron/config/network-constants.ts
10. src/electron/middleware/ipc-error-handler.ts
11. src/electron/managers/mcp-server-manager.ts
12. src/electron/managers/sdk-config-cache.ts
13. src/electron/services/slash-commands.ts
14. src/electron/services/claude-settings.ts
15. src/electron/utils/auto-memory-manager.ts
16. src/electron/utils/claude-memory-mcp-server.ts
17. src/electron/utils/claude-memory-tool.ts
18. src/electron/utils/env-file.ts
19. src/electron/utils/language-detector.ts
20. src/electron/utils/memory-config.ts
21. src/electron/utils/memory-mcp-server.ts
22. src/electron/utils/memory-tools.ts
23. src/electron/utils/platform.ts
24. src/electron/utils/skills-metadata.ts
25. src/electron/utils/type-guards.ts
26. src/electron/utils/util.ts
27. src/electron/utils/sdk-native-loader.ts

## 审计标准

### 1. 日志系统
- [ ] 敏感信息记录
- [ ] 日志注入
- [ ] 日志轮转
- [ ] 日志级别控制

### 2. 路径处理
- [ ] 路径遍历
- [ ] 路径规范化
- [ ] 符号链接处理

### 3. 环境变量
- [ ] 环境变量注入
- [ ] 默认值安全
- [ ] 敏感变量保护

### 4. MCP 服务器
- [ ] 命令执行安全
- [ ] 模块加载安全
- [ ] 沙箱隔离

### 5. 配置管理
- [ ] 配置验证
- [ ] 配置注入
- [ ] 默认配置安全

## 输出格式

```json
{
  "group_id": "T-06",
  "group_name": "工具和实用程序",
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
    "total_files": 27,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": []
}
```

## 特别关注
- 命令注入 (CWE-77)
- 路径遍历 (CWE-22)
- 日志注入 (CWE-117)
- 不安全的反序列化
- 动态代码执行
