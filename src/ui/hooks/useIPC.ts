import { useCallback, useEffect, useRef, useState } from "react";
import type { ServerEvent, ClientEvent } from "../types";

export function useIPC(onEvent: (event: ServerEvent) => void) {
  const [connected, setConnected] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // 安全检查：确保 window.electron 已加载
    if (!window.electron) {
      console.warn('[IPC] window.electron is not available yet, retrying...');
      const timer = setTimeout(() => {
        setConnected(false);
      }, 100);
      return () => clearTimeout(timer);
    }

    // Subscribe to server events
    const unsubscribe = window.electron.onServerEvent((event: ServerEvent) => {
      onEvent(event);
    });
    
    unsubscribeRef.current = unsubscribe;
    setConnected(true);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setConnected(false);
    };
  }, [onEvent]);

  const sendEvent = useCallback((event: ClientEvent) => {
    if (!window.electron) {
      console.error('[IPC] window.electron is not available');
      return;
    }
    window.electron.sendClientEvent(event);
  }, []);

  return { connected, sendEvent };
}
