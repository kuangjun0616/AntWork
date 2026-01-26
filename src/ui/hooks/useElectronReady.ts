/**
 * useElectronReady Hook
 * 确保 window.electron 已加载后再执行操作
 */

import { useEffect, useState } from 'react';

/**
 * 检查 window.electron 是否已准备好
 * @returns 是否已准备好
 */
export function useElectronReady(): boolean {
  const [isReady, setIsReady] = useState(() => !!window.electron);

  useEffect(() => {
    if (window.electron) {
      setIsReady(true);
      return;
    }

    // 如果未加载，等待一段时间后重试
    const timer = setTimeout(() => {
      if (window.electron) {
        setIsReady(true);
      } else {
        console.warn('[ElectronReady] window.electron still not available after 100ms');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return isReady;
}

/**
 * 安全地调用 window.electron 方法
 * @param fn 要执行的函数
 * @param fallback 如果 electron 未准备好时的回退值
 */
export function safeElectronCall<T>(
  fn: () => T,
  fallback?: T
): T | undefined {
  if (!window.electron) {
    console.warn('[ElectronCall] window.electron is not available');
    return fallback;
  }
  return fn();
}
