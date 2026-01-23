# Agent-T05: 审计存储层

## 任务描述
对所有存储模块进行全面审计，包括数据库操作和文件存储。

## 审计文件 (11个文件)
1. src/electron/storage/agents-store.ts
2. src/electron/storage/config-store.ts
3. src/electron/storage/fs-memory-store.ts
4. src/electron/storage/hooks-store.ts
5. src/electron/storage/mcp-store.ts
6. src/electron/storage/memvid-store.ts
7. src/electron/storage/output-store.ts
8. src/electron/storage/permissions-store.ts
9. src/electron/storage/rules-store.ts
10. src/electron/storage/session-store.ts
11. src/electron/storage/skills-store.ts

## 审计标准

### 1. 数据库安全
- [ ] SQL 注入防护
- [ ] 参数化查询
- [ ] 数据库连接安全
- [ ] 敏感数据加密
- [ ] 事务完整性

### 2. 文件操作
- [ ] 路径遍历防护
- [ ] 文件权限检查
- [ ] 临时文件清理
- [ ] 文件大小限制

### 3. 数据验证
- [ ] 输入验证
- [ ] 输出编码
- [ ] 数据类型验证

### 4. 并发控制
- [ ] 写锁机制
- [ ] 并发事务处理
- [ ] 数据竞争

## 输出格式

```json
{
  "group_id": "T-05",
  "group_name": "存储层",
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
    "total_files": 11,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": []
}
```

## 特别关注
- SQL 注入 (CWE-89)
- 路径遍历 (CWE-22)
- 数据库连接泄露
- 未加密敏感数据
- 并发数据损坏
