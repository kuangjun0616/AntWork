# Agent-T01: 审计 Electron 主进程核心文件

## 任务描述
对 Electron 主进程核心文件进行全面逐行审计。

## 审计文件
1. src/electron/main.ts
2. src/electron/ipc-handlers.ts
3. src/electron/main/ipc-registry.ts
4. src/electron/main/lifecycle.ts
5. src/electron/main/window-manager.ts

## 审计标准

### 1. 安全性
- [ ] 检查 IPC 处理器中的权限验证
- [ ] 检查窗口创建时的安全配置 (webPreferences)
- [ ] 检查是否有命令注入风险
- [ ] 检查敏感信息是否通过 IPC 泄露

### 2. 错误处理
- [ ] 检查异步操作的错误捕获
- [ ] 检查 IPC 调用的错误处理
- [ ] 检查窗口生命周期异常处理

### 3. 类型安全
- [ ] 检查 IPC 通道类型定义
- [ ] 检查 any 类型使用
- [ ] 检查类型断言安全性

### 4. 性能
- [ ] 检查事件监听器是否正确清理
- [ ] 检查是否有阻塞主线程的操作
- [ ] 检查内存泄漏风险

### 5. 最佳实践
- [ ] 检查 Electron 安全最佳实践
- [ ] 检查进程间通信模式
- [ ] 检查窗口管理策略

## 输出格式

```json
{
  "group_id": "T-01",
  "group_name": "Electron 主进程核心文件",
  "files_audited": [
    "src/electron/main.ts",
    "src/electron/ipc-handlers.ts",
    "src/electron/main/ipc-registry.ts",
    "src/electron/main/lifecycle.ts",
    "src/electron/main/window-manager.ts"
  ],
  "issues": [
    {
      "file": "文件路径",
      "line": 行号或行范围,
      "severity": "critical|high|medium|low",
      "category": "security|error_handling|type_safety|code_quality|performance|best_practice",
      "issue": "详细问题描述",
      "code_snippet": "问题代码片段",
      "recommendation": "具体修复建议",
      "cwe": "CWE-XXX (如适用)",
      "references": ["参考链接"]
    }
  ],
  "summary": {
    "total_files": 5,
    "total_lines": 总行数,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 0,
    "low_issues": 0
  },
  "positive_findings": [
    "发现的良好实践1",
    "发现的良好实践2"
  ]
}
```

## 特别关注

### Electron 安全检查清单
- [ ] nodeIntegration 是否禁用
- [ ] contextIsolation 是否启用
- [ ] sandbox 是否启用
- [ ] 危险的 IPC 通道是否有权限检查
- [ ] preload 脚本是否安全

### IPC 注册表检查
- [ ] 处理器注册是否类型安全
- [ ] 错误处理是否完善
- [ ] 是否有日志记录

## 执行指令
1. 首先使用 Read 工具读取所有文件
2. 逐行分析代码
3. 标记所有问题
4. 记录良好实践
5. 输出 JSON 格式的审计结果
