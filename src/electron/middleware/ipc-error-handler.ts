/**
 * IPC 错误处理中间件
 * 统一处理 IPC 处理器的错误，消除重复的 try-catch 模式
 */

import { log } from "../logger.js";

/**
 * IPC 处理器函数类型
 */
export type IpcHandler<T = unknown> = (...args: unknown[]) => T | Promise<T>;

/**
 * 包装 IPC 处理器，自动处理错误
 *
 * 特性：
 * - 成功时：直接返回原始数据（保持向后兼容）
 * - 失败时：返回 { success: false, error: string } 格式
 * - 自动记录错误日志
 *
 * @param channel IPC 通道名称（用于日志）
 * @param handler 实际的处理器函数
 * @returns 包装后的处理器
 *
 * @example
 * ```typescript
 * // 不使用包装器（重复代码）
 * ipcMainHandle("get-data", async () => {
 *   try {
 *     const data = await fetchData();
 *     return data;
 *   } catch (error) {
 *     log.error("[IPC] Failed to get data", error);
 *     return { success: false, error: error instanceof Error ? error.message : "未知错误" };
 *   }
 * });
 *
 * // 使用包装器（简洁）
 * ipcMainHandle("get-data", wrapIpcHandler("get-data", async () => {
 *   const data = await fetchData();
 *   return data;
 * }));
 * ```
 */
export function wrapIpcHandler<T = unknown>(
  channel: string,
  handler: IpcHandler<T>
): (...args: unknown[]) => Promise<any> {
  return async (...args: unknown[]): Promise<any> => {
    try {
      return await handler(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      log.error(`[IPC] Failed to ${channel}`, error);
      return { success: false, error: errorMessage };
    }
  };
}

/**
 * 包装返回 { success: true/false } 格式的 IPC 处理器
 * 适用于只需要知道成功/失败，不需要返回具体数据的操作
 *
 * @param channel IPC 通道名称
 * @param handler 实际的处理器函数
 * @returns 包装后的处理器
 *
 * @example
 * ```typescript
 * ipcMainHandle("delete-item", wrapIpcSuccessHandler("delete-item", async (itemId) => {
 *   await deleteItem(itemId);
 *   return { success: true };
 * }));
 * ```
 */
export function wrapIpcSuccessHandler(
  channel: string,
  handler: IpcHandler<{ success: true }>
): (...args: unknown[]) => Promise<any> {
  return async (...args: unknown[]): Promise<any> => {
    try {
      return await handler(...args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      log.error(`[IPC] Failed to ${channel}`, error);
      return { success: false, error: errorMessage };
    }
  };
}

/**
 * 创建带日志的 IPC 处理器包装器
 * 在处理器执行前后记录日志
 *
 * @param channel IPC 通道名称
 * @param handler 实际的处理器函数
 * @returns 包装后的处理器
 */
export function wrapIpcHandlerWithLogging<T = unknown>(
  channel: string,
  handler: IpcHandler<T>
): (...args: unknown[]) => Promise<T | { success: false; error: string }> {
  return async (...args: unknown[]): Promise<T | { success: false; error: string }> => {
    const startTime = Date.now();
    log.debug(`[IPC] ${channel} - 开始执行`);

    try {
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      log.debug(`[IPC] ${channel} - 成功 (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "未知错误";
      log.error(`[IPC] ${channel} - 失败 (${duration}ms)`, error);
      return { success: false, error: errorMessage };
    }
  };
}
