# Agent-T02: 审计错误处理和类型系统

## 任务描述
对错误处理框架和类型定义系统进行全面审计。

## 审计文件
1. src/electron/errors/app-error.ts
2. src/electron/errors/api-error.ts
3. src/electron/errors/handler.ts
4. src/electron/errors/index.ts
5. src/electron/errors/ipc-error.ts
6. src/electron/types.ts
7. src/electron/handlers/session-handlers.ts
8. src/electron/error-handling.ts

## 审计标准

### 1. 错误处理完整性
- [ ] 错误类层次结构是否合理
- [ ] 错误信息是否泄露敏感数据
- [ ] 错误堆栈跟踪是否完整
- [ ] 是否有统一的错误处理入口

### 2. 类型系统
- [ ] 类型定义是否覆盖所有用例
- [ ] 是否有类型循环依赖
- [ ] 泛型使用是否正确
- [ ] 联合类型是否完整

### 3. 会话处理
- [ ] 会话状态转换是否安全
- [ ] 并发会话处理
- [ ] 会话清理是否完整

## 输出格式

```json
{
  "group_id": "T-02",
  "group_name": "错误处理和类型系统",
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
    "total_files": 8,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": []
}
```

## 特别关注
- 错误序列化/反序列化安全性
- 类型断言使用
- 可选链和空值合并
- 错误码标准化
