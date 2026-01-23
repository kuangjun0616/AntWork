/**
 * 会话状态指示器组件
 * 显示 AI 当前状态：思考中、输入中等
 *
 * @author Claude
 * @created 2025-01-23
 */

import { useEffect, useState } from "react";

export type SessionStatusType = 'idle' | 'thinking' | 'typing' | 'processing';

interface SessionStatusIndicatorProps {
  status: SessionStatusType;
  message?: string;
  className?: string;
  /** 响应时间（秒），超过阈值时显示超时提示 */
  elapsedSeconds?: number;
  /** 显示超时警告的阈值（秒），默认 30 秒 */
  timeoutThreshold?: number;
}

const STATUS_MESSAGES: Record<SessionStatusType, string> = {
  idle: '',
  thinking: '正在思考...',
  typing: '正在输入...',
  processing: '正在处理...',
};

const DEFAULT_TIMEOUT_THRESHOLD = 30;

/**
 * 打字机动画光标组件
 */
function TypingCursor() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <span className="w-1 h-4 bg-accent rounded-sm animate-pulse" />
      <span className="w-1 h-4 bg-accent rounded-sm animate-pulse delay-75" />
      <span className="w-1 h-4 bg-accent rounded-sm animate-pulse delay-150" />
    </span>
  );
}

/**
 * 思考动画组件
 */
function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100" />
      <span className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
    </span>
  );
}

/**
 * 会话状态指示器
 */
export function SessionStatusIndicator({
  status,
  message,
  elapsedSeconds,
  timeoutThreshold = DEFAULT_TIMEOUT_THRESHOLD,
  className = ''
}: SessionStatusIndicatorProps) {
  const [visible, setVisible] = useState(false);

  // 只有在状态持续超过 500ms 时才显示，避免闪烁
  useEffect(() => {
    if (status === 'idle') {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [status]);

  if (!visible || status === 'idle') {
    return null;
  }

  const displayMessage = message || STATUS_MESSAGES[status];

  // 检查是否超时
  const isTimeout = elapsedSeconds !== undefined && elapsedSeconds > timeoutThreshold;

  // 合并显示：超时时在一个状态栏中显示所有信息
  const finalMessage = isTimeout
    ? `${displayMessage} (已响应 ${elapsedSeconds} 秒)`
    : displayMessage;

  // 根据是否超时选择样式
  const containerClassName = isTimeout
    ? `flex items-center gap-1.5 text-xs text-amber-600 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 ${className}`
    : `flex items-center gap-1.5 text-xs text-muted px-2 py-1 rounded-md bg-surface-secondary/50 border border-ink-900/5 ${className}`;

  return (
    <div className={containerClassName}>
      {status === 'thinking' && <ThinkingDots />}
      {status === 'typing' && <TypingCursor />}
      {status === 'processing' && (
        <svg className="h-3 w-3 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {isTimeout && (
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )}
      <span>{finalMessage}</span>
    </div>
  );
}

/**
 * 超时警告组件
 */
interface TimeoutWarningProps {
  visible: boolean;
  elapsedSeconds: number;
  className?: string;
}

export function TimeoutWarning({ visible, elapsedSeconds, className = '' }: TimeoutWarningProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 text-sm text-amber-600 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 ${className}`}
    >
      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <span>响应时间较长 ({elapsedSeconds} 秒)，请稍候...</span>
    </div>
  );
}
