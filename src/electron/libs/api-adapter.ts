/**
 * API 适配器模块
 * 多厂商 API 转换和适配器工厂
 */

import type { ApiProvider } from '../config/constants.js';
import { OpenAIAdapter } from './api-adapters/openai-adapter.js';

// 重新导出新模块的内容
export * from './api-adapters/index.js';

// 重新导出 ApiProvider 类型
export type { ApiProvider } from '../config/constants.js';

/**
 * 获取 API 适配器
 * 根据厂商类型返回正确的适配器
 */
export function getApiAdapter(provider: ApiProvider): any {
  // OpenAI 格式的提供商
  const openAIFormatProviders: ApiProvider[] = [
    'huawei', 'ollama', 'openai', 'xingchen', 'tencent', 'iflytek',
    'spark', 'sensetime', 'stepfun', 'lingyi', '01ai', 'abd',
    'bestex', 'puyu', 'volcengine', 'doubao', 'hunyuan', 'wenxin',
    'baichuan', 'google', 'cohere', 'mistral', 'meta', 'replicate',
    'together', 'anyscale', 'fireworks', 'baseten', 'octoai', 'lamini',
    'forefront', 'perplexity', 'you', 'phind', 'poe', 'character',
    'vllm', 'textgen', 'localai', 'fastchat', 'lmstudio', 'jan',
    'openrouter', 'togetherai', 'anywb', 'aiproxy', 'gptapi', 'api2d',
    'closeai', 'custom',
  ];

  // 判断是否为 OpenAI 格式
  const isOpenAIFormat = openAIFormatProviders.includes(provider);

  if (isOpenAIFormat) {
    // 使用 OpenAI 适配器
    return new OpenAIAdapter(provider);
  }

  // Anthropic 格式的提供商（透传适配器）
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
    // Anthropic 格式提供商
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
    // OpenAI 格式提供商
    ollama: {
      baseURL: 'http://localhost:11434',
      models: ['llama3', 'llama2', 'mistral', 'codellama'],
      defaultModel: 'llama3',
    },
    openai: {
      baseURL: 'https://api.openai.com',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4o',
    },
    huawei: {
      baseURL: 'https://maas-model.cn-north-4.myhuaweicloud.com',
      models: ['glm-4', 'glm-3-turbo'],
      defaultModel: 'glm-4',
    },
    xingchen: {
      baseURL: 'https://api.baichuan.com',
      models: ['Baichuan2-Turbo', 'Baichuan2-53B'],
      defaultModel: 'Baichuan2-Turbo',
    },
    tencent: {
      baseURL: 'https://api.hunyuan.cloudapi.com',
      models: ['hunyuan-lite', 'hunyuan-standard', 'hunyuan-pro'],
      defaultModel: 'hunyuan-standard',
    },
    iflytek: {
      baseURL: 'https://spark-api.xf-yun.com',
      models: ['spark-lite', 'spark-pro', 'spark-max'],
      defaultModel: 'spark-pro',
    },
    spark: {
      baseURL: 'https://spark-api.xf-yun.com',
      models: ['spark-lite', 'spark-pro', 'spark-max'],
      defaultModel: 'spark-pro',
    },
    sensetime: {
      baseURL: 'https://api.sensetime.com',
      models: ['sensechat-lite', 'sensechat-pro', 'sensechat-turbo'],
      defaultModel: 'sensechat-pro',
    },
    stepfun: {
      baseURL: 'https://api.stepfun.com',
      models: ['step-1v', 'step-2-16k'],
      defaultModel: 'step-1v',
    },
    lingyi: {
      baseURL: 'https://api.lingyiwanwu.com',
      models: ['yi-34b-chat', 'yi-6b-chat'],
      defaultModel: 'yi-34b-chat',
    },
    '01ai': {
      baseURL: 'https://api.01.ai',
      models: ['yi-34b-chat', 'yi-6b-chat'],
      defaultModel: 'yi-34b-chat',
    },
    abd: {
      baseURL: 'https://api.abd.ai',
      models: ['abd-chat', 'abd-coder'],
      defaultModel: 'abd-chat',
    },
    bestex: {
      baseURL: 'https://api.bestex.ai',
      models: ['bestex-chat', 'bestex-turbo'],
      defaultModel: 'bestex-chat',
    },
    puyu: {
      baseURL: 'https://puyu.intern-ai.org.cn',
      models: ['puyu-chat', 'puyu-turbo'],
      defaultModel: 'puyu-chat',
    },
    volcengine: {
      baseURL: 'https://ark.cn-beijing.volces.com',
      models: ['doubao-pro', 'doubao-lite'],
      defaultModel: 'doubao-pro',
    },
    doubao: {
      baseURL: 'https://ark.cn-beijing.volces.com',
      models: ['doubao-pro', 'doubao-lite'],
      defaultModel: 'doubao-pro',
    },
    hunyuan: {
      baseURL: 'https://hunyuan.tencentcloudapi.com',
      models: ['hunyuan-lite', 'hunyuan-standard', 'hunyuan-pro'],
      defaultModel: 'hunyuan-standard',
    },
    wenxin: {
      baseURL: 'https://aip.baidubce.com',
      models: ['ernie-bot', 'ernie-bot-turbo'],
      defaultModel: 'ernie-bot',
    },
    baichuan: {
      baseURL: 'https://api.baichuan-ai.com',
      models: ['baichuan2-turbo', 'baichuan2-53b'],
      defaultModel: 'baichuan2-turbo',
    },
  };

  return defaults[provider] || { baseURL: 'https://api.example.com', models: ['custom-model'], defaultModel: 'custom-model' };
}
