/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * BrainIcon 组件测试
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrainIcon } from '../../src/ui/components/BrainIcon';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Brain: ({ className }: { className?: string }) => (
    <svg data-testid="brain-icon" className={className} viewBox="0 0 24 24" />
  ),
}));

describe('BrainIcon 组件', () => {
  it('应该渲染默认图标', () => {
    render(<BrainIcon />);

    const icon = screen.getByTestId('brain-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.parentElement).toHaveClass('inline-flex');
  });

  it('应该应用自定义 className', () => {
    render(<BrainIcon className="custom-class" />);

    const wrapper = screen.getByTestId('brain-icon').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('应该应用 error 颜色', () => {
    render(<BrainIcon color="error" />);

    const wrapper = screen.getByTestId('brain-icon').parentElement;
    expect(wrapper).toHaveClass('text-error');
  });

  it('应该应用 success 颜色', () => {
    render(<BrainIcon color="success" />);

    const wrapper = screen.getByTestId('brain-icon').parentElement;
    expect(wrapper).toHaveClass('text-success');
  });

  it('应该应用 info 颜色', () => {
    render(<BrainIcon color="info" />);

    const wrapper = screen.getByTestId('brain-icon').parentElement;
    expect(wrapper).toHaveClass('text-info');
  });

  it('应该应用 muted 颜色', () => {
    render(<BrainIcon color="muted" />);

    const wrapper = screen.getByTestId('brain-icon').parentElement;
    expect(wrapper).toHaveClass('text-muted-light');
  });

  it('应该合并多个类名', () => {
    render(<BrainIcon className="size-4" color="success" />);

    const wrapper = screen.getByTestId('brain-icon').parentElement;
    expect(wrapper).toHaveClass('inline-flex', 'text-success', 'size-4');
  });
});
