/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * SessionStatusIndicator 组件测试
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionStatusIndicator, TimeoutWarning } from '../../src/ui/components/SessionStatusIndicator';

describe('SessionStatusIndicator 组件', () => {
  vi.useRealTimers();

  it('idle 状态不应该显示任何内容', () => {
    render(<SessionStatusIndicator status="idle" />);

    const container = screen.queryByText(/正在/);
    expect(container).not.toBeInTheDocument();
  });

  it('thinking 状态应该在延迟后显示思考动画', async () => {
    render(<SessionStatusIndicator status="thinking" />);

    // 初始不显示
    expect(screen.queryByText(/正在思考/)).not.toBeInTheDocument();

    // 等待 500ms 后应该显示
    await waitFor(() => {
      expect(screen.getByText(/正在思考/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('typing 状态应该在延迟后显示输入动画', async () => {
    render(<SessionStatusIndicator status="typing" />);

    await waitFor(() => {
      expect(screen.getByText(/正在输入/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('processing 状态应该在延迟后显示处理动画', async () => {
    render(<SessionStatusIndicator status="processing" />);

    await waitFor(() => {
      expect(screen.getByText(/正在处理/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('应该显示自定义消息', async () => {
    render(<SessionStatusIndicator status="thinking" message="自定义消息" />);

    await waitFor(() => {
      expect(screen.getByText('自定义消息')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('应该显示超时警告', async () => {
    render(
      <SessionStatusIndicator
        status="thinking"
        elapsedSeconds={35}
        timeoutThreshold={30}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/已响应 35 秒/)).toBeInTheDocument();
    }, { timeout: 1000 });

    const container = screen.getByText(/已响应 35 秒/).closest('div');
    expect(container).toHaveClass('text-amber-600');
  });

  it('应该应用自定义 className', async () => {
    render(
      <SessionStatusIndicator
        status="thinking"
        className="custom-class"
      />
    );

    await waitFor(() => {
      const container = screen.getByText(/正在思考/).closest('div');
      expect(container).toHaveClass('custom-class');
    }, { timeout: 1000 });
  });

  it('状态切换时应该更新显示内容', async () => {
    const { rerender } = render(<SessionStatusIndicator status="thinking" />);

    // 等待显示 thinking
    await waitFor(() => {
      expect(screen.getByText(/正在思考/)).toBeInTheDocument();
    }, { timeout: 1000 });

    // 切换到 typing 状态
    rerender(<SessionStatusIndicator status="typing" />);

    // 应该切换到 typing 状态
    await waitFor(() => {
      expect(screen.getByText(/正在输入/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});

describe('TimeoutWarning 组件', () => {
  it('visible=false 时不显示任何内容', () => {
    render(<TimeoutWarning visible={false} elapsedSeconds={30} />);

    expect(screen.queryByText(/响应时间较长/)).not.toBeInTheDocument();
  });

  it('visible=true 时显示警告', () => {
    render(<TimeoutWarning visible={true} elapsedSeconds={45} />);

    const warning = screen.getByText(/响应时间较长 \(45 秒\)/);
    expect(warning).toBeInTheDocument();
  });

  it('应该应用自定义 className', () => {
    render(
      <TimeoutWarning
        visible={true}
        elapsedSeconds={30}
        className="custom-class"
      />
    );

    const container = screen.getByText(/响应时间较长/).closest('div');
    expect(container).toHaveClass('custom-class');
  });
});
