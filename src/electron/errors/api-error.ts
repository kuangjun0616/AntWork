/**
 * API 错误类
 * 用于处理 API 请求过程中的错误
 *
 * @author Claude Code
 * @created 2025-01-23
 * @copyright AGPL-3.0
 */

import { AppError } from "./app-error.js";

/**
 * API 错误代码枚举
 */
export enum APICode {
  /** 网络错误 */
  NETWORK_ERROR = "API_NETWORK_ERROR",
  /** 请求超时 */
  TIMEOUT = "API_TIMEOUT",
  /** 未授权 */
  UNAUTHORIZED = "API_UNAUTHORIZED",
  /** 禁止访问 */
  FORBIDDEN = "API_FORBIDDEN",
  /** 未找到 */
  NOT_FOUND = "API_NOT_FOUND",
  /** 请求参数错误 */
  BAD_REQUEST = "API_BAD_REQUEST",
  /** 请求实体过大 */
  REQUEST_TOO_LARGE = "API_REQUEST_TOO_LARGE",
  /** 服务器错误 */
  SERVER_ERROR = "API_SERVER_ERROR",
  /** 服务不可用 */
  SERVICE_UNAVAILABLE = "API_SERVICE_UNAVAILABLE",
  /** 响应解析失败 */
  PARSE_ERROR = "API_PARSE_ERROR",
  /** 配置错误 */
  CONFIG_ERROR = "API_CONFIG_ERROR",
}

/**
 * HTTP 状态码到错误代码的映射
 */
const HTTP_STATUS_TO_CODE: Record<number, APICode> = {
  400: APICode.BAD_REQUEST,
  401: APICode.UNAUTHORIZED,
  403: APICode.FORBIDDEN,
  404: APICode.NOT_FOUND,
  413: APICode.REQUEST_TOO_LARGE,
  500: APICode.SERVER_ERROR,
  502: APICode.SERVICE_UNAVAILABLE,
  503: APICode.SERVICE_UNAVAILABLE,
  504: APICode.TIMEOUT,
};

/**
 * API 请求错误
 */
export class APIError extends AppError {
  readonly url?: string;
  readonly method?: string;
  readonly responseStatus?: number;
  readonly responseBody?: string;

  constructor(
    message: string,
    code: APICode,
    statusCode?: number,
    cause?: Error,
    metadata?: {
      url?: string;
      method?: string;
      responseStatus?: number;
      responseBody?: string;
    }
  ) {
    super(message, code, statusCode, cause);
    this.url = metadata?.url;
    this.method = metadata?.method;
    this.responseStatus = metadata?.responseStatus;
    this.responseBody = metadata?.responseBody;
  }

  /**
   * 从 HTTP 响应创建 API 错误
   */
  static fromHTTPResponse(
    url: string,
    method: string,
    status: number,
    body: string
  ): APIError {
    const code = HTTP_STATUS_TO_CODE[status] || APICode.SERVER_ERROR;
    return new APIError(
      `API request failed: ${status} ${status === 404 ? 'Not Found' : status === 500 ? 'Server Error' : 'Error'}`,
      code,
      status,
      undefined,
      { url, method, responseStatus: status, responseBody: body }
    );
  }

  toJSON(): {
    message: string;
    code: string;
    statusCode?: number;
    url?: string;
    method?: string;
    responseStatus?: number;
  } {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      url: this.url,
      method: this.method,
      responseStatus: this.responseStatus,
    };
  }
}
