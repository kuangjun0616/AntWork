/**
 * API 适配器工具函数
 * 提供 API 格式检测和厂商推断功能
 *
 * @author Claude Code
 * @created 2025-01-23
 * @Email noreply@anthropic.com
 * @copyright AGPL-3.0
 */

import type { ApiProvider } from '../../config/constants.js';
import type { UrlFormatDetection, ApiFormat } from './types.js';

/**
 * 从 URL 中检测 API 格式
 */
export function detectApiFormat(baseURL: string): UrlFormatDetection {
  const url = new URL(baseURL);
  const pathname = url.pathname;

  // 格式检测模式
  const formatPatterns: Array<{ pattern: RegExp; format: ApiFormat }> = [
    // 显式格式路径
    { pattern: /\/anthropic\/?$/, format: 'anthropic' },
    // Anthropic 特定路径
    { pattern: /\/v1\/messages\/?$/, format: 'anthropic' },
    { pattern: /\/v1\/beta\/messages\/?$/, format: 'anthropic' },
  ];

  // 检测格式
  for (const { pattern, format } of formatPatterns) {
    if (pattern.test(pathname)) {
      const match = pathname.match(pattern);
      const detectedPath = match ? match[0] : '';
      const cleanPathname = pathname.replace(pattern, '').replace(/\/+$/, '') || '';
      const cleanBaseURL = `${url.origin}${cleanPathname}`;

      return {
        format,
        cleanBaseURL,
        detectedPath,
      };
    }
  }

  // 未检测到明确格式，返回原始 URL
  return {
    format: 'unknown',
    cleanBaseURL: baseURL.replace(/\/+$/, ''),
    detectedPath: '',
  };
}

/**
 * 从 URL 路径自动推断 API 厂商
 */
export function inferProviderFromUrl(baseURL: string): ApiProvider | null {
  const url = new URL(baseURL);
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();

  // 厂商域名映射
  const domainProviders: Array<{ pattern: RegExp; provider: ApiProvider }> = [
    { pattern: /anthropic\.com/, provider: 'anthropic' },
    { pattern: /aliyuncs\.com/, provider: 'alibaba' },
    { pattern: /bigmodel\.cn/, provider: 'zhipu' },
    { pattern: /moonshot\.cn/, provider: 'moonshot' },
    { pattern: /deepseek\.(com|cn)/, provider: 'deepseek' },
    { pattern: /qnaigc\.com/, provider: 'qiniu' },
    { pattern: /volcengine\.com/, provider: 'huawei' },
    { pattern: /volces\.com/, provider: 'huawei' },
    { pattern: /n1n\.ai/, provider: 'n1n' },
    { pattern: /minimax/i, provider: 'minimax' },
  ];

  // 按域名匹配
  for (const { pattern, provider } of domainProviders) {
    if (pattern.test(hostname)) {
      return provider;
    }
  }

  // 按路径格式推断
  if (pathname.includes('/anthropic')) {
    return 'custom';
  }

  return null;
}

/**
 * 获取 Anthropic 格式的完整 URL
 */
export function getAnthropicFormatUrl(baseURL: string): string {
  const detection = detectApiFormat(baseURL);
  if (detection.format === 'anthropic') {
    return detection.cleanBaseURL + (detection.detectedPath || '/v1/messages');
  }
  return baseURL;
}

/**
 * 获取预设的 URL 列表
 */
export function getAllPresetUrls(): Array<{ name: string; url: string; format: string }> {
  return [
    { name: 'Anthropic 官方', url: 'https://api.anthropic.com', format: 'anthropic' },
    { name: '智谱 AI (GLM)', url: 'https://open.bigmodel.cn/api/anthropic', format: 'anthropic' },
    { name: 'DeepSeek', url: 'https://api.deepseek.com', format: 'anthropic' },
    { name: '阿里云百炼', url: 'https://dashscope.aliyuncs.com', format: 'anthropic' },
    { name: '月之暗面 (Kimi)', url: 'https://api.moonshot.cn', format: 'anthropic' },
    { name: 'N1N.AI', url: 'https://api.n1n.ai', format: 'anthropic' },
  ];
}
