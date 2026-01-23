/**
 * 错误处理模块索引
 * 统一导出所有错误类型和处理器
 */

// 基础错误类
export { AppError } from "./app-error.js";

// IPC 错误
export { IPCError, IPCErrorCode } from "./ipc-error.js";

// API 错误
export { APIError, APICode } from "./api-error.js";

// 错误处理器
export {
  handleError,
  errorToIPCResponse,
  type ErrorHandlerOptions,
} from "./handler.js";
