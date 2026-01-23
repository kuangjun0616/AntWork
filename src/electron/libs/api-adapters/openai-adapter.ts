/**
 * OpenAI 格式 API 适配器
 * 将 OpenAI 格式转换为 Anthropic 兼容格式
 */

import type { ApiProvider } from '../../config/constants.js';
import type { ApiAdapter, ApiConfig, AnthropicRequest, AnthropicResponse, AnthropicContentBlock } from './types.js';
import { OPENAI_ENDPOINTS } from './constants.js';

/**
 * OpenAI API 适配器
 */
export class OpenAIAdapter implements ApiAdapter {
  private apiType: ApiProvider = 'openai';

  constructor(apiType?: ApiProvider) {
    if (apiType) {
      this.apiType = apiType;
    }
  }

  transformRequest(request: AnthropicRequest, config: ApiConfig) {
    // 将 Anthropic 消息转换为 OpenAI 格式
    const messages = request.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: typeof msg.content === 'string'
        ? msg.content
        : this.convertContentBlocks(msg.content as Array<AnthropicContentBlock>)
    }));

    // OpenAI API 格式
    const body = {
      model: config.model,
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 4096,
      stream: request.stream ?? false,
      tools: request.tools ? this.convertTools(request.tools) : undefined,
    };

    // 移除 undefined 值
    (Object.keys(body) as Array<keyof typeof body>).forEach(key => {
      if (body[key] === undefined) {
        delete body[key];
      }
    });

    // 获取该厂商的端点路径
    const endpoint = OPENAI_ENDPOINTS[this.apiType] || '/v1/chat/completions';

    return {
      url: `${config.baseURL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        ...config.customHeaders,
      },
      body,
    };
  }

  transformResponse(response: unknown, config: ApiConfig): AnthropicResponse {
    const openaiResp = response as {
      id: string;
      choices: Array<{
        message: {
          role: string;
          content: string;
          tool_calls?: Array<{
            id: string;
            type: string;
            function: { name: string; arguments: string };
          }>;
        };
        finish_reason: string;
      }>;
      usage: { prompt_tokens: number; completion_tokens: number };
    };

    const choice = openaiResp.choices[0];
    const content: any[] = [];

    // 文本内容
    if (choice.message.content) {
      content.push({ type: 'text', text: choice.message.content });
    }

    // 工具调用
    if (choice.message.tool_calls) {
      for (const toolCall of choice.message.tool_calls) {
        content.push({
          type: 'tool_use',
          id: toolCall.id,
          name: toolCall.function.name,
          input: JSON.parse(toolCall.function.arguments),
        });
      }
    }

    return {
      id: openaiResp.id,
      type: 'message',
      role: 'assistant',
      content,
      stop_reason: this.mapStopReason(choice.finish_reason),
      usage: {
        input_tokens: openaiResp.usage.prompt_tokens,
        output_tokens: openaiResp.usage.completion_tokens,
      },
    };
  }

  transformStream(chunk: string, config: ApiConfig): string | null {
    // OpenAI 流式响应格式转换
    try {
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      let result = '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]?.delta?.content) {
            // 转换为 Anthropic SSE 格式
            const anthropicDelta = {
              type: 'content_block_delta',
              index: 0,
              delta: { type: 'text', text: parsed.choices[0].delta.content }
            };
            result += `data: ${JSON.stringify(anthropicDelta)}\n\n`;
          }
        }
      }

      return result || null;
    } catch {
      return null;
    }
  }

  private convertContentBlocks(blocks: Array<AnthropicContentBlock>): string {
    return blocks
      .filter(b => b.type === 'text')
      .map(b => b.text || '')
      .join('\n');
  }

  private convertTools(tools: any[]): any[] {
    // OpenAI 工具格式转换
    return tools?.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input_schema,
      },
    }));
  }

  private mapStopReason(reason: string): 'end_turn' | 'max_tokens' | 'stop_sequence' | null {
    const mapping: Record<string, 'end_turn' | 'max_tokens' | 'stop_sequence' | null> = {
      'stop': 'end_turn',
      'length': 'max_tokens',
      'content_filter': 'end_turn',
    };
    return mapping[reason] ?? 'end_turn';
  }
}
