/**
 * API 适配器模块索引
 * 统一导出所有适配器相关功能
 */

// 类型定义
export type {
  ApiConfig,
  ApiFormat,
  UrlFormatDetection,
  AnthropicMessage,
  AnthropicContentBlock,
  AnthropicRequest,
  AnthropicResponse,
  ApiAdapter,
} from './types.js';

// OpenAI 适配器
export { OpenAIAdapter } from './openai-adapter.js';

// 常量
export { VENDOR_ENDPOINTS, OPENAI_ENDPOINTS, ANTHROPIC_ENDPOINTS } from './constants.js';

// 工具函数
export {
  detectApiFormat,
  inferProviderFromUrl,
  getAnthropicFormatUrl,
  getAllPresetUrls,
} from './utils.js';

// 重新导出供其他模块使用
export { PROVIDER_MAX_TOKENS } from '../../config/constants.js';
