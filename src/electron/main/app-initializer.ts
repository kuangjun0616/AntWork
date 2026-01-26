/**
 * 应用服务初始化器
 * 在应用启动时预加载关键资源
 */

import { log } from '../logger.js';
import { setAILanguagePreference } from '../services/language-preference-store.js';
import { registerLanguageHandlers } from '../ipc-handlers.js';

/**
 * 初始化所有应用服务（在应用启动时执行）
 * 在后台异步执行，不阻塞窗口显示
 */
export async function initializeAppServices(): Promise<void> {
  log.info('[AppInit] Initializing app services...');
  const startTime = Date.now();

  // 注册语言偏好 IPC 处理器（必须在主进程中注册）
  registerLanguageHandlers();

  // 并行初始化各项服务（使用 Promise.allSettled 确保稳定）
  const results = await Promise.allSettled([
    initializeSdkConfigCache(),
    prewarmMcpServers(),
    initializeLanguagePreference(),
  ]);

  // 记录初始化结果
  results.forEach((result, index) => {
    const serviceName = ['SDK Config Cache', 'MCP Servers', 'Language Preference'][index];
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
 * 注意：MCP 服务器实例管理由 SDK 处理，无需预热
 * 此函数仅用于验证 MCP 配置可正常加载
 */
async function prewarmMcpServers(): Promise<void> {
  try {
    const { getMcpServers } = await import('../managers/mcp-server-manager.js');
    const servers = await getMcpServers();

    log.info(`[AppInit] MCP configs loaded: ${Object.keys(servers).length} servers`);
  } catch (error) {
    log.warn('[AppInit] MCP config loading failed (non-critical):', error);
  }
}

/**
 * 初始化语言偏好设置
 * 默认使用中文，后续会通过前端 IPC 调用更新
 */
async function initializeLanguagePreference(): Promise<void> {
  try {
    // 设置默认语言为中文
    setAILanguagePreference('zh');
    log.info('[AppInit] Language preference initialized (default: zh)');
  } catch (error) {
    log.warn('[AppInit] Language preference initialization failed (non-critical):', error);
  }
}
