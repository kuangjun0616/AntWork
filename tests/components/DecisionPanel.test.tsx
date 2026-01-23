/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * DecisionPanel 组件测试
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DecisionPanel } from '../../src/ui/components/DecisionPanel';

describe('DecisionPanel 组件 - 权限请求模式', () => {
  const mockOnSubmit = vi.fn();
  const mockPermissionRequest = {
    toolUseId: 'test-tool-id',
    toolName: 'Bash',
    input: {
      command: 'ls -la',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染普通权限请求', () => {
    render(
      <DecisionPanel
        request={mockPermissionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Permission Request')).toBeInTheDocument();
    expect(screen.getByText(/Claude wants to use/)).toBeInTheDocument();
    expect(screen.getByText('Bash')).toBeInTheDocument();
  });

  it('应该显示请求的输入内容', () => {
    render(
      <DecisionPanel
        request={mockPermissionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const content = screen.getByText(/ls -la/);
    expect(content).toBeInTheDocument();
  });

  it('应该有 Allow 和 Deny 按钮', () => {
    render(
      <DecisionPanel
        request={mockPermissionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Allow')).toBeInTheDocument();
    expect(screen.getByText('Deny')).toBeInTheDocument();
  });

  it('点击 Allow 应该提交允许结果', () => {
    render(
      <DecisionPanel
        request={mockPermissionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const allowButton = screen.getByText('Allow');
    fireEvent.click(allowButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      behavior: 'allow',
      updatedInput: { command: 'ls -la' },
    });
  });

  it('点击 Deny 应该提交拒绝结果', () => {
    render(
      <DecisionPanel
        request={mockPermissionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const denyButton = screen.getByText('Deny');
    fireEvent.click(denyButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      behavior: 'deny',
      message: 'User denied the request',
    });
  });
});

describe('DecisionPanel 组件 - AskUserQuestion 模式', () => {
  const mockOnSubmit = vi.fn();
  const mockQuestionRequest = {
    toolUseId: 'question-tool-id',
    toolName: 'AskUserQuestion',
    input: {
      questions: [
        {
          question: '请选择编程语言',
          header: 'Language',
          options: [
            { label: 'JavaScript', description: 'Web 开发' },
            { label: 'Python', description: '数据科学' },
            { label: 'TypeScript', description: '类型安全' },
          ],
          multiSelect: false,
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染问题面板', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Question from Claude')).toBeInTheDocument();
    expect(screen.getByText('请选择编程语言')).toBeInTheDocument();
  });

  it('应该显示所有选项', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Web 开发')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('数据科学')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('类型安全')).toBeInTheDocument();
  });

  it('应该显示 header 标签', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  it('应该有 Other 输入框', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const otherInput = screen.getByPlaceholderText('Type your answer...');
    expect(otherInput).toBeInTheDocument();
  });

  it('单选模式下点击选项应该自动提交', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const javascriptOption = screen.getByText('JavaScript');
    fireEvent.click(javascriptOption);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      behavior: 'allow',
      updatedInput: {
        questions: mockQuestionRequest.input.questions,
        answers: { '请选择编程语言': 'JavaScript' },
      },
    });
  });

  it('应该在 Other 输入框中输入自定义答案', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const otherInput = screen.getByPlaceholderText('Type your answer...') as HTMLInputElement;
    fireEvent.change(otherInput, { target: { value: 'Rust' } });

    expect(otherInput.value).toBe('Rust');
  });

  it('多选模式下应该允许多个选项', () => {
    const multiSelectRequest = {
      ...mockQuestionRequest,
      input: {
        questions: [
          {
            question: '选择你感兴趣的技术',
            options: [
              { label: 'React' },
              { label: 'Vue' },
              { label: 'Angular' },
            ],
            multiSelect: true,
          },
        ],
      },
    };

    render(
      <DecisionPanel
        request={multiSelectRequest}
        onSubmit={mockOnSubmit}
      />
    );

    // 多选模式下不应该自动提交
    const reactOption = screen.getByText('React');
    fireEvent.click(reactOption);

    // 应该有选中样式
    expect(reactOption.closest('button')).toHaveClass('border-info/50', 'bg-info/5');

    // 不应该自动提交
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('多选模式下应该显示 Multiple selections allowed 提示', () => {
    const multiSelectRequest = {
      ...mockQuestionRequest,
      input: {
        questions: [
          {
            question: '选择你感兴趣的技术',
            options: [{ label: 'React' }],
            multiSelect: true,
          },
        ],
      },
    };

    render(
      <DecisionPanel
        request={multiSelectRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Multiple selections allowed.')).toBeInTheDocument();
  });

  it('多个问题情况下应该显示 Submit answers 和 Cancel 按钮', () => {
    const multiQuestionRequest = {
      ...mockQuestionRequest,
      input: {
        questions: [
          {
            question: '第一个问题',
            options: [{ label: 'A' }],
          },
          {
            question: '第二个问题',
            options: [{ label: 'B' }],
          },
        ],
      },
    };

    render(
      <DecisionPanel
        request={multiQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Submit answers')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('点击 Cancel 应该拒绝请求', () => {
    render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      behavior: 'deny',
      message: 'User canceled the question',
    });
  });

  it('应该在切换问题时重置选择', () => {
    const { rerender } = render(
      <DecisionPanel
        request={mockQuestionRequest}
        onSubmit={mockOnSubmit}
      />
    );

    // 选择一个选项
    const javascriptOption = screen.getByText('JavaScript');
    fireEvent.click(javascriptOption);

    // 切换到新的 toolUseId
    const newRequest = {
      ...mockQuestionRequest,
      toolUseId: 'new-tool-id',
    };

    rerender(
      <DecisionPanel
        request={newRequest}
        onSubmit={mockOnSubmit}
      />
    );

    // 状态应该重置
    expect(mockOnSubmit).toHaveBeenCalledTimes(1); // 只有第一次点击
  });
});
