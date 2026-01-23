/**
 * 应用服务初始化器
 * 在应用启动时预加载关键资源
 * @author Claude
 * @copyright AGCPA v3.0
 */

import { log } from '../logger.js';

/**
 * 初始化所有应用服务（在应用启动时执行）
 * 在后台异步执行，不阻塞窗口显示
 */
export async function initializeAppServices(): Promise<void> {
  log.info('[AppInit] Initializing app services...');
  const startTime = Date.now();

  // 并行初始化各项服务（使用 Promise.allSettled 确保稳定）
  const results = await Promise.allSettled([
    initializeSdkConfigCache(),
    prewarmMcpServers(),
    precheckProxySettings(),
  ]);

  // 记录初始化结果
  results.forEach((result, index) => {
    const serviceName = ['SDK Config Cache', 'MCP Servers', 'Proxy Settings'][index];
    if (result.status === 'fulfilled') {
      log.info(`[AppInit] ✓ ${serviceName} initialized`);
    } else {
      log.warn(`[AppInit] ✗ ${serviceName} initialization failed:`, result.reason);
    }
  });

  const duration = Date.now() - startTime;
  log.info(`[AppInit] ✓ Services initialized in ${duration}ms`);
}

/**
 * 初始化 SDK 配置缓存
 */
async function initializeSdkConfigCache(): Promise<void> {
  try {
    const { initializeConfigCache } = await import('../managers/sdk-config-cache.js');
    await initializeConfigCache();
    log.info('[AppInit] SDK config cache initialized');
  } catch (error) {
    log.warn('[AppInit] SDK config cache initialization failed (non-critical):', error);
  }
}

/**
 * 预热 MCP 服务器
 * 后台异步启动，不阻塞应用启动
 */
async function prewarmMcpServers(): Promise<void> {
  try {
    const { getMcpServerManager } = await import('../managers/mcp-server-manager.js');
    const mcpManager = getMcpServerManager();

    // 预热服务器（会话启动时直接使用）
    await mcpManager.acquireServers();

    log.info('[AppInit] MCP servers pre-warmed');
  } catch (error) {
    log.warn('[AppInit] MCP pre-warm failed (non-critical):', error);
  }
}

/**
 * 预检测代理设置
 * 后台异步检测，不阻塞应用启动
 */
async function precheckProxySettings(): Promise<void> {
  try {
    const { precheckProxyNeeds } = await import('../services/claude-settings.js');
    await precheckProxyNeeds();
    log.info('[AppInit] Proxy pre-check completed');
  } catch (error) {
    log.warn('[AppInit] Proxy pre-check failed (non-critical):', error);
  }
}
