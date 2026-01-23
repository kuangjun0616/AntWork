/**
 * 性能监控模块
 * 用于跟踪会话初始化和运行阶段的性能指标
 */

import { log } from "../../logger.js";

/**
 * 性能监控器类
 * 跟踪并记录各个阶段的耗时
 */
export class PerformanceMonitor {
  private markers: Map<string, number> = new Map();
  private startTime: number = 0;

  /**
   * 开始性能监控
   */
  start(): void {
    this.startTime = performance.now();
    this.markers.clear();
    log.info('[Performance] 🔒 Session initialization started');
  }

  /**
   * 标记某个阶段的开始时间
   * @param stage 阶段名称
   */
  mark(stage: string): void {
    this.markers.set(stage, performance.now());
    log.debug(`[Performance] ⏱️  ${stage} started`);
  }

  /**
   * 记录某个阶段的耗时
   * @param stage 阶段名称
   * @returns 该阶段的耗时（毫秒）
   */
  measure(stage: string): number {
    const startTime = this.markers.get(stage);
    if (!startTime) {
      log.warn(`[Performance] ⚠️  No start marker for stage: ${stage}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const totalDuration = endTime - this.startTime;

    log.info(`[Performance] ✅ ${stage}: ${duration.toFixed(2)}ms, Total: ${totalDuration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * 记录从开始到当前的耗时
   */
  measureTotal(): void {
    const totalDuration = performance.now() - this.startTime;
    log.info(`[Performance] 🎯 Session initialization completed in ${totalDuration.toFixed(2)}ms`);
  }
}
