/**
 * API 厂商端点配置
 * 定义各厂商的 API 端点路径和默认格式
 */

import type { ApiProvider } from '../../config/constants.js';

/**
 * 厂商端点配置
 * 每个厂商可以同时支持 Anthropic 和 OpenAI 格式
 */
export const VENDOR_ENDPOINTS: Partial<Record<ApiProvider, {
  /** Anthropic 兼容端点路径 */
  anthropic?: string;
  /** OpenAI 兼容端点路径 */
  openai?: string;
  /** 默认使用的端点类型 */
  default: 'anthropic' | 'openai';
}>> = {
  // Anthropic 官方
  anthropic: {
    anthropic: '/v1/messages',
    default: 'anthropic',
  },

  // 国内厂商
  zhipu: {
    anthropic: '/v1/messages',
    default: 'anthropic',
  },
  deepseek: {
    anthropic: '/v1/messages',
    openai: '/v1/chat/completions',
    default: 'anthropic',
  },
  alibaba: {
    anthropic: '/apps/anthropic/v1/messages',
    openai: '/compatible-mode/v1/chat/completions',
    default: 'anthropic',
  },
  qiniu: {
    anthropic: '/v1/messages',
    openai: '/v1/chat/completions',
    default: 'anthropic',
  },
  moonshot: {
    anthropic: '/v1/messages',
    openai: '/v1/chat/completions',
    default: 'anthropic',
  },
  huawei: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  minimax: {
    anthropic: '/v1/messages',
    openai: '/v1/chat/completions',
    default: 'anthropic',
  },
  baichuan: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  xingchen: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  tencent: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  iflytek: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  spark: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  sensetime: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  stepfun: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  lingyi: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  '01ai': {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  abd: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  bestex: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  puyu: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  volcengine: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  doubao: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  hunyuan: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  wenxin: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },

  // 国外厂商
  openai: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  google: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  cohere: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  mistral: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  meta: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  replicate: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  together: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  anyscale: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  fireworks: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  baseten: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  octoai: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  lamini: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  forefront: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  perplexity: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  you: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  phind: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  poe: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  character: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },

  // 本地/私有部署
  ollama: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  vllm: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  textgen: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  localai: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  fastchat: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  lmstudio: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  jan: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },

  // 代理/中转服务
  n1n: {
    anthropic: '/v1/messages',
    openai: '/v1/chat/completions',
    default: 'anthropic',
  },
  openrouter: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  togetherai: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  anywb: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  aiproxy: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  gptapi: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  api2d: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
  closeai: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },

  // 自定义
  custom: {
    openai: '/v1/chat/completions',
    default: 'openai',
  },
};

/**
 * 各厂商的 OpenAI 格式端点映射（用于向后兼容）
 */
export const OPENAI_ENDPOINTS: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(VENDOR_ENDPOINTS)
      .filter(([, v]) => v.openai)
      .map(([k, v]) => [k, v.openai!])
  ),
};

/**
 * 各厂商的 Anthropic 格式端点映射
 */
export const ANTHROPIC_ENDPOINTS: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(VENDOR_ENDPOINTS)
      .filter(([, v]) => v.anthropic)
      .map(([k, v]) => [k, v.anthropic!])
  ),
};
