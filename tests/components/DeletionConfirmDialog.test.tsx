/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * DeletionConfirmDialog 组件测试
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DeletionConfirmDialog } from '../../src/ui/components/DeletionConfirmDialog';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'deletion.title': '确认删除操作',
        'deletion.subtitle': '此操作不可逆',
        'deletion.description': 'AI 正在执行删除操作，请确认是否继续。',
        'deletion.commandLabel': '执行命令',
        'deletion.unknownCommand': '未知命令',
        'deletion.warning': '此操作将永久删除数据，请谨慎操作。',
        'deletion.deny': '拒绝',
        'deletion.deniedMessage': '用户拒绝了删除操作',
        'deletion.allow': '允许',
      };
      return translations[key] || key;
    },
  }),
}));

describe('DeletionConfirmDialog 组件', () => {
  const mockOnSubmit = vi.fn();
  const mockRequest = {
    toolUseId: 'test-tool-id',
    toolName: 'TestTool',
    input: {
      command: 'rm -rf /path/to/file',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染对话框', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('确认删除操作')).toBeInTheDocument();
    expect(screen.getByText('此操作不可逆')).toBeInTheDocument();
  });

  it('应该显示命令内容', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('rm -rf /path/to/file')).toBeInTheDocument();
  });

  it('应该显示警告提示', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/此操作将永久删除数据/)).toBeInTheDocument();
  });

  it('应该有拒绝和允许按钮', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('拒绝')).toBeInTheDocument();
    expect(screen.getByText('允许')).toBeInTheDocument();
  });

  it('点击拒绝应该调用 onSubmit 并传递拒绝结果', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const denyButton = screen.getByText('拒绝');
    fireEvent.click(denyButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      behavior: 'deny',
      message: '用户拒绝了删除操作',
    });
  });

  it('点击允许应该调用 onSubmit 并传递允许结果', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const allowButton = screen.getByText('允许');
    fireEvent.click(allowButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      behavior: 'allow',
      updatedInput: { command: 'rm -rf /path/to/file' },
    });
  });

  it('当命令不存在时显示未知命令', () => {
    const requestWithoutCommand = {
      ...mockRequest,
      input: {},
    };

    render(
      <DeletionConfirmDialog
        request={requestWithoutCommand}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('未知命令')).toBeInTheDocument();
  });

  it('应该显示警告图标', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    // 应该有警告 SVG 图标 - 检查页面中是否有 SVG 元素
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('对话框应该有正确的样式类', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const overlay = screen.getByText('确认删除操作').closest('.fixed');
    expect(overlay).toHaveClass('bg-ink-900/60', 'backdrop-blur-sm');
  });

  it('应该显示描述信息', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/AI 正在执行删除操作/)).toBeInTheDocument();
  });

  it('命令应该在代码块中显示', () => {
    render(
      <DeletionConfirmDialog
        request={mockRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const commandElement = screen.getByText('rm -rf /path/to/file');
    const preElement = commandElement.closest('pre');
    expect(preElement).toHaveClass('font-mono');
  });
});
