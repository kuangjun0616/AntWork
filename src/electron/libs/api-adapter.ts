/**
 * API 适配器模块
 * 多厂商 API 转换和适配器工厂
 *
 * @author Claude Code
 * @created 2025-01-23
 * @Email noreply@anthropic.com
 * @copyright AGPL-3.0
 */

import type { ApiProvider } from '../config/constants.js';

// 重新导出新模块的内容
export * from './api-adapters/index.js';

// 重新导出 ApiProvider 类型
export type { ApiProvider } from '../config/constants.js';

/**
 * 获取 API 适配器
 * 返回 Anthropic 透传适配器（因为所有支持的厂商都兼容 Anthropic 格式）
 */
export function getApiAdapter(provider: ApiProvider): any {
  // 所有支持的厂商都使用 Anthropic 透传适配器
  return {
    transformRequest: (request: any, config: any) => ({
      url: `${config.baseURL}/v1/messages`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        ...config.customHeaders,
      },
      body: request,
    }),
    transformResponse: (response: any) => response,
  };
}

/**
 * 获取厂商默认配置
 */
export function getProviderDefaults(provider: ApiProvider): {
  baseURL: string;
  models: string[];
  defaultModel: string;
} {
  const defaults: Partial<Record<ApiProvider, { baseURL: string; models: string[]; defaultModel: string }>> = {
    anthropic: {
      baseURL: 'https://api.anthropic.com',
      models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
      defaultModel: 'claude-sonnet-4-20250514',
    },
    zhipu: {
      baseURL: 'https://open.bigmodel.cn/api/anthropic',
      models: ['glm-4', 'glm-4-flash', 'glm-3-turbo'],
      defaultModel: 'glm-4',
    },
    deepseek: {
      baseURL: 'https://api.deepseek.com/anthropic',
      models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
      defaultModel: 'deepseek-chat',
    },
    alibaba: {
      baseURL: 'https://dashscope.aliyuncs.com/apps/anthropic',
      models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-max-longcontext'],
      defaultModel: 'qwen-plus',
    },
    qiniu: {
      baseURL: 'https://api.qnaigc.com',
      models: ['qwen-plus', 'deepseek-chat', 'glm-4', 'claude-3-5-sonnet-20241022'],
      defaultModel: 'qwen-plus',
    },
    moonshot: {
      baseURL: 'https://api.moonshot.cn',
      models: ['moonshot-v1-128k', 'moonshot-v1-32k', 'moonshot-v1-8k'],
      defaultModel: 'moonshot-v1-128k',
    },
    n1n: {
      baseURL: 'https://api.n1n.ai',
      models: ['claude-sonnet-4-20250514', 'gpt-4o', 'glm-4'],
      defaultModel: 'claude-sonnet-4-20250514',
    },
    minimax: {
      baseURL: 'https://api.minimaxi.com',
      models: ['MiniMax-M2.1', 'MiniMax-M2.1-lightning', 'MiniMax-M2'],
      defaultModel: 'MiniMax-M2.1',
    },
  };

  return defaults[provider] || { baseURL: 'https://api.example.com', models: ['custom-model'], defaultModel: 'custom-model' };
}
