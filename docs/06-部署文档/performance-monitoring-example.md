# 性能监控日志示例

## 概述

本文档展示会话启动流程中的性能监控日志输出示例，用于追踪各阶段的耗时情况。

## 日志格式

性能监控日志采用以下格式：

```
[Performance] <图标> <描述信息>
```

- 🔒 - 会话初始化开始
- ⏱️ - 阶段开始标记
- ✅ - 阶段完成（包含阶段耗时和总耗时）
- 🎯 - 会话初始化完成
- ⚠️ - 警告信息

## 日志示例

### 正常会话启动

```
[Performance] 🔒 Session initialization started
[Performance] ⏱️  Proxy Detection started
[Performance] ✅ Proxy Detection: 1234.56ms, Total: 1234.56ms
[Performance] ⏱️  SDK Config Loading started
[Performance] ✅ SDK Config Loading: 45.67ms, Total: 1280.23ms
[Performance] ⏱️  MCP Server Acquisition started
[Performance] ✅ MCP Server Acquisition: 89.12ms, Total: 1369.35ms
[Performance] 🎯 Session initialization completed in 1420.78ms
```

### 使用缓存的情况（快速启动）

```
[Performance] 🔒 Session initialization started
[Performance] ⏱️  Proxy Detection started
[Performance] ✅ Proxy Detection: 1200.45ms, Total: 1200.45ms
[Performance] ⏱️  SDK Config Loading started
[Performance] ✅ SDK Config Loading: 12.34ms, Total: 1212.79ms
[Performance] ⏱️  MCP Server Acquisition started
[Performance] ✅ MCP Server Acquisition: 15.67ms, Total: 1228.46ms
[Performance] 🎯 Session initialization completed in 1245.12ms
```

### 首次启动（未使用缓存）

```
[Performance] 🔒 Session initialization started
[Performance] ⏱️  Proxy Detection started
[Performance] ✅ Proxy Detection: 1500.23ms, Total: 1500.23ms
[Performance] ⏱️  SDK Config Loading started
[Performance] ✅ SDK Config Loading: 3500.67ms, Total: 5000.90ms
[Performance] ⏱️  MCP Server Acquisition started
[Performance] ✅ MCP Server Acquisition: 4500.89ms, Total: 9501.79ms
[Performance] 🎯 Session initialization completed in 9650.45ms
```

## 性能指标说明

### 1. Proxy Detection（代理检测）
- **作用**: 检测 API 是否需要代理模式
- **耗时**: 通常 1-2 秒（网络请求）
- **优化**: 使用缓存避免重复检测

### 2. SDK Config Loading（SDK 配置加载）
- **作用**: 加载插件、代理、权限等配置
- **耗时**:
  - 首次: 3-5 秒（扫描文件系统）
  - 缓存: 10-50 毫秒
- **优化**: 使用配置缓存显著减少耗时

### 3. MCP Server Acquisition（MCP 服务器获取）
- **作用**: 获取或创建 MCP 服务器实例
- **耗时**:
  - 首次: 5-10 秒（启动服务器）
  - 缓存: 10-100 毫秒
- **优化**: 使用服务器实例池复用

### 4. Total Time（总耗时）
- **优化前**: 10-15 秒
- **优化后**: 1-2 秒
- **提升**: 约 80-90%

## 性能基准

### 优秀性能
```
Proxy Detection: < 1500ms
SDK Config Loading: < 50ms
MCP Server Acquisition: < 100ms
Total Time: < 2000ms
```

### 可接受性能
```
Proxy Detection: < 3000ms
SDK Config Loading: < 100ms
MCP Server Acquisition: < 500ms
Total Time: < 4000ms
```

### 需要优化
```
Proxy Detection: > 3000ms
SDK Config Loading: > 500ms
MCP Server Acquisition: > 1000ms
Total Time: > 5000ms
```

## 监控位置

性能监控代码位于: `src/electron/libs/runner.ts`

### 关键监控点

1. **会话启动**: `runClaude` 函数入口
2. **代理检测**: `checkProxyNeeded` 调用前后
3. **SDK 配置**: `getCachedSdkNativeConfig` 调用前后
4. **MCP 服务器**: `acquireServers` 调用前后
5. **SDK 查询**: `query` 函数调用前

## 使用建议

1. **定期检查**: 观察性能日志，识别性能瓶颈
2. **对比优化**: 对比缓存前后的性能差异
3. **异常检测**: 如果某阶段耗时异常增加，检查相关配置
4. **持续监控**: 在不同环境（网络、硬件）下测试性能

## 故障排查

### Proxy Detection 耗时过长
- 检查网络连接
- 检查 API 服务器响应速度
- 检查防火墙设置

### SDK Config Loading 耗时过长
- 检查缓存是否生效
- 检查文件系统性能
- 检查插件配置文件大小

### MCP Server Acquisition 耗时过长
- 检查服务器实例池是否正常工作
- 检查 MCP 服务器启动速度
- 检查相关配置文件

---

**维护者**: Alan
**创建日期**: 2026-01-23
**最后更新**: 2026-01-23
