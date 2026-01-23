# Agent-T09: 审计共享代码和配置文件

## 任务描述
对共享代码、配置文件和依赖进行安全审计。

## 审计文件和配置

### 共享代码
1. src/shared/types/index.ts
2. src/shared/deletion-detection.ts

### 配置文件
3. package.json
4. tsconfig.json
5. tsconfig.app.json
6. tsconfig.node.json
7. tsconfig.electron.json
8. vite.config.ts
9. electron-builder.yml
10. eslint.config.js
11. .eslintrc.*
12. .gitignore
13. 各种环境配置

### 依赖分析
- 所有 dependencies 和 devDependencies
- 检查已知漏洞
- 检查过期包
- 检查许可证兼容性

## 审计标准

### 1. 配置安全
- [ ] 敏感配置泄露
- [ ] 不安全的开发配置
- [ ] 生产环境配置

### 2. 依赖安全
- [ ] 已知漏洞 (CVE)
- [ ] 过期依赖
- [ ] 可疑依赖
- [ ] 许可证风险

### 3. 类型定义
- [ ] 共享类型完整性
- [ ] 类型一致性
- [ ] 版本兼容

### 4. 构建配置
- [ ] 源码泄露风险
- [ ] 环境变量注入
- [ ] 调试信息泄露

## 输出格式

```json
{
  "group_id": "T-09",
  "group_name": "共享代码和配置",
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
      "cwe": "CWE-XXX",
      "cve": "CVE-XXXX-XXXX"
    }
  ],
  "summary": {
    "total_files": N,
    "total_dependencies": N,
    "vulnerable_dependencies": N,
    "outdated_dependencies": N,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": [],
  "dependency_analysis": {
    "total": N,
    "with_vulnerabilities": [
      {
        "name": "package-name",
        "version": "x.x.x",
        "vulnerabilities": ["CVE-XXXX-XXXX"],
        "severity": "critical/high/medium/low",
        "recommendation": "升级到 x.x.x 或更高版本"
      }
    ],
    "outdated": [
      {
        "name": "package-name",
        "current": "x.x.x",
        "latest": "y.y.y",
        "recommendation": "考虑升级"
      }
    ]
  }
}
```

## 特别关注
- 依赖漏洞 (CVE 扫描)
- 配置文件中的硬编码密钥
- 开发工具泄露
- 构建产物泄露
