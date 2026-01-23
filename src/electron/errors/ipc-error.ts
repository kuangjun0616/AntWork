/**
 * IPC 通信错误类
 * 用于处理 IPC 通道通信过程中的错误
 */

import { AppError } from "./app-error.js";

/**
 * IPC 错误代码枚举
 */
export enum IPCErrorCode {
  /** 通道未注册 */
  CHANNEL_NOT_REGISTERED = "IPC_CHANNEL_NOT_REGISTERED",
  /** 调用超时 */
  TIMEOUT = "IPC_TIMEOUT",
  /** 参数无效 */
  INVALID_PARAMS = "IPC_INVALID_PARAMS",
  /** 序列化失败 */
  SERIALIZATION_FAILED = "IPC_SERIALIZATION_FAILED",
  /** 反序列化失败 */
  DESERIALIZATION_FAILED = "IPC_DESERIALIZATION_FAILED",
  /** 渲染进程未就绪 */
  RENDERER_NOT_READY = "IPC_RENDERER_NOT_READY",
}

/**
 * IPC 通信错误
 */
export class IPCError extends AppError {
  readonly channel?: string;

  constructor(
    message: string,
    code: IPCErrorCode,
    channel?: string,
    cause?: Error
  ) {
    super(message, code, undefined, cause);
    this.channel = channel;
  }

  toJSON(): { message: string; code: string; channel?: string } {
    return {
      message: this.message,
      code: this.code,
      channel: this.channel,
    };
  }
}
