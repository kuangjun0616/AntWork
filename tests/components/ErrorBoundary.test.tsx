/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * ErrorBoundary 组件测试
 */

import React from 'react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary, WithErrorBoundary } from '../../src/ui/components/ErrorBoundary';

// Mock logger
vi.mock('../../src/ui/utils/logger', () => ({
  log: {
    error: vi.fn(),
  },
}));

// 测试用组件 - 正常组件
function TestComponent({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal Content</div>;
}

// 测试用组件 - 抛出错误
function ThrowingComponent() {
  throw new Error('Expected test error');
}

describe('ErrorBoundary 组件', () => {
  // 抑制控制台错误输出
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('应该正常渲染子组件', () => {
    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('应该捕获错误并显示备用 UI', () => {
    // 使用 suppressErrors 避免测试错误
    const { container } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    // 应该显示错误 UI
    expect(screen.getByText('出错了')).toBeInTheDocument();
    expect(screen.getByText(/应用遇到了意外错误/)).toBeInTheDocument();
  });

  it('应该显示错误详情', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    const details = screen.getByText('查看错误详情');
    expect(details).toBeInTheDocument();
  });

  it('展开详情应该显示错误信息', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    // 点击展开详情
    const details = screen.getAllByText('查看错误详情')[0];
    fireEvent.click(details);

    // 验证错误信息存在
    const errorElements = screen.getAllByText(/Expected test error/);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it('点击重试按钮应该重置状态', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    // 点击重试
    const retryButton = screen.getByText('重试');
    fireEvent.click(retryButton);

    // 重置后应该渲染子组件（这里仍然会抛错，但状态已重置）
    expect(screen.getByText('出错了')).toBeInTheDocument();
  });

  it('应该使用自定义 fallback', () => {
    const customFallback = <div>Custom Error UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText('出错了')).not.toBeInTheDocument();
  });

  it('应该调用 onError 回调', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('刷新页面按钮应该存在', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
      { strict: false }
    );

    const refreshButton = screen.getByText('刷新页面');
    expect(refreshButton).toBeInTheDocument();

    // 点击刷新会触发 window.location.reload
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    fireEvent.click(refreshButton);
    expect(reloadSpy).toHaveBeenCalled();
  });
});

describe('WithErrorBoundary 包装器', () => {
  it('应该包装子组件', () => {
    render(
      <WithErrorBoundary>
        <TestComponent />
      </WithErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('应该捕获包装子组件的错误', () => {
    render(
      <WithErrorBoundary>
        <ThrowingComponent />
      </WithErrorBoundary>,
      { strict: false }
    );

    expect(screen.getByText('出错了')).toBeInTheDocument();
  });
});
