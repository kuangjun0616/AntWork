/**
 * 错误处理模块索引
 * 统一导出所有错误类型和处理器
 *
 * @author Claude Code
 * @created 2025-01-23
 * @copyright AGPL-3.0
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
