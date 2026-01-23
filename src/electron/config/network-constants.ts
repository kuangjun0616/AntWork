/**
 * 网络相关常量配置
 * @author Claude
 * @copyright AGCPA v3.0
 */

// ==================== 代理配置 ====================

/** 代理检测超时时间（从 5 秒优化到 2 秒） */
export const PROXY_CHECK_TIMEOUT = 2000;

/** 代理快速检测超时（1 秒，用于已知不支持端点的厂商） */
export const PROXY_CHECK_FAST_TIMEOUT = 1000;

/** 代理缓存有效期（24小时） */
export const PROXY_CACHE_TTL = 24 * 60 * 60 * 1000;

/** 代理服务器端口 */
export const PROXY_PORT = 35721;

// ==================== 开发服务器配置 ====================

/** 开发服务器端口 */
export const DEV_PORT = 5173;

// ==================== 缓存配置 ====================

/** 斜杠命令缓存有效期（30秒） */
export const SLASH_COMMANDS_CACHE_TTL = 30000;
