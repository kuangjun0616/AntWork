/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * LanguageSwitcher 组件测试
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageSwitcher } from '../../src/ui/components/LanguageSwitcher';

// Mock react-i18next
const mockChangeLanguage = vi.fn();
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'language.en': 'English',
        'language.zh': '中文',
      };
      return translations[key] || key;
    },
    i18n: mockI18n,
  }),
}));

// Mock @radix-ui/react-dropdown-menu
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Trigger: ({ children, ...props }: any) => (
    <button {...props} data-testid="language-trigger">
      {children}
    </button>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Content: ({ children, className, ...props }: any) => (
    <div className={className} {...props} data-testid="language-dropdown">
      {children}
    </div>
  ),
  Item: ({ children, onClick, className, ...props }: any) => (
    <div
      className={className}
      onClick={onClick}
      {...props}
      data-testid="language-item"
    >
      {children}
    </div>
  ),
}));

describe('LanguageSwitcher 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockI18n.language = 'en';
  });

  it('应该渲染触发按钮', () => {
    render(<LanguageSwitcher />);

    const trigger = screen.getByTestId('language-trigger');
    expect(trigger).toBeInTheDocument();
  });

  it('应该显示当前语言为 English', () => {
    render(<LanguageSwitcher />);

    // 使用 getAllByText 因为可能有多个 "English" 文本
    const elements = screen.getAllByText('English');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('当前语言为中文时应该显示中文', () => {
    mockI18n.language = 'zh';
    render(<LanguageSwitcher />);

    const elements = screen.getAllByText('中文');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('应该包含下拉菜单', () => {
    render(<LanguageSwitcher />);

    const dropdown = screen.getByTestId('language-dropdown');
    expect(dropdown).toBeInTheDocument();
  });

  it('应该包含两个语言选项', () => {
    render(<LanguageSwitcher />);

    const items = screen.getAllByTestId('language-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('English');
    expect(items[1]).toHaveTextContent('中文');
  });

  it('当前语言应该高亮显示', () => {
    mockI18n.language = 'en';
    render(<LanguageSwitcher />);

    const items = screen.getAllByTestId('language-item');
    expect(items[0]).toHaveClass('bg-accent/10', 'text-accent', 'font-medium');
  });

  it('点击选项应该切换语言', () => {
    render(<LanguageSwitcher />);

    const items = screen.getAllByTestId('language-item');
    fireEvent.click(items[1]); // 点击中文

    expect(mockChangeLanguage).toHaveBeenCalledWith('zh');
  });

  it('应该包含地球图标', () => {
    render(<LanguageSwitcher />);

    const trigger = screen.getByTestId('language-trigger');
    const svg = trigger.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
