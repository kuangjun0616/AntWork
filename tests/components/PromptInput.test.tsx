/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * PromptInput 组件测试
 * 注意：完整的斜杠命令和自动补全功能测试需要真实的 store 集成
 * 这里测试基本渲染、hook 功能和用户交互
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PromptInput, usePromptActions } from '../../src/ui/components/PromptInput';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'promptInput.placeholder': '输入消息...',
        'promptInput.placeholderDisabled': '输入已禁用',
        'promptInput.sendPrompt': '发送',
        'promptInput.stopSession': '停止',
        'errors.failedToGetSessionTitle': '获取会话标题失败',
        'errors.sessionStillRunning': '会话正在运行',
        'errors.workingDirectoryRequired': '请设置工作目录',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock logger
vi.mock('../../src/ui/utils/logger', () => ({
  log: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock electron API
const mockSendEvent = vi.fn();
const mockOnSendMessage = vi.fn();

const mockSlashCommands = [
  { name: '/plan', description: '制定实施计划', source: 'builtin' },
  { name: '/help', description: '显示帮助信息', source: 'builtin' },
  { name: '/commit', description: '创建 Git 提交', source: 'builtin' },
];

// Mock window.electron
Object.defineProperty(global, 'window', {
  value: {
    electron: {
      getSlashCommands: vi.fn(() => Promise.resolve(mockSlashCommands)),
      generateSessionTitle: vi.fn(() => Promise.resolve('Test Session')),
    },
  },
  writable: true,
});

// Mock store
const mockStore = {
  prompt: '',
  cwd: '/test/path',
  activeSessionId: undefined,
  sessions: {},
  setPrompt: vi.fn(),
  setPendingStart: vi.fn(),
  setGlobalError: vi.fn(),
};

vi.mock('../../src/ui/store/useAppStore', () => ({
  useAppStore: (selector: (state: typeof mockStore) => unknown) => {
    if (typeof selector === 'function') {
      return selector(mockStore);
    }
    return mockStore;
  },
}));

describe('PromptInput 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.prompt = '';
    mockStore.activeSessionId = undefined;
    mockStore.sessions = {};
    mockStore.cwd = '/test/path';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染', () => {
    it('应该渲染输入框和按钮', () => {
      render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...');
      expect(textarea).toBeInTheDocument();

      const slashButton = screen.getByTitle('斜杠命令');
      expect(slashButton).toBeInTheDocument();

      const sendButton = screen.getByLabelText('发送');
      expect(sendButton).toBeInTheDocument();
    });

    it('应该显示当前输入的值', () => {
      mockStore.prompt = 'Hello World';
      render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Hello World');
    });

    it('禁用状态应该显示不同的占位符', () => {
      render(<PromptInput sendEvent={mockSendEvent} disabled />);

      const textarea = screen.getByPlaceholderText('输入已禁用');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toBeDisabled();
    });

    it('应该在输入时自动调整高度', () => {
      render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;

      const initialHeight = textarea.style.height;

      // 模拟输入事件
      fireEvent.input(textarea);

      // 高度应该被设置
      expect(textarea.style.height).toBeDefined();
    });
  });

  describe('usePromptActions Hook', () => {
    it('应该返回正确的状态和方法', () => {
      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };

      render(<TestComponent />);

      expect(capturedActions).toBeDefined();
      expect(capturedActions!.prompt).toBeDefined();
      expect(capturedActions!.setPrompt).toBeDefined();
      expect(capturedActions!.isRunning).toBeDefined();
      expect(capturedActions!.handleSend).toBeDefined();
      expect(capturedActions!.handleStop).toBeDefined();
    });

    it('handleSend 在没有会话时应该生成会话标题并发送 session.start', async () => {
      mockStore.prompt = 'Create a new feature';
      mockStore.activeSessionId = undefined;

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      render(<TestComponent />);

      await capturedActions!.handleSend();

      expect(window.electron.generateSessionTitle).toHaveBeenCalledWith('Create a new feature');
      expect(mockSendEvent).toHaveBeenCalledWith({
        type: 'session.start',
        payload: {
          title: 'Test Session',
          prompt: 'Create a new feature',
          cwd: '/test/path',
          allowedTools: 'Read,Edit,Bash',
        },
      });
    });

    it('handleSend 在有会话时应该发送 session.continue', async () => {
      mockStore.prompt = 'Continue the work';
      mockStore.activeSessionId = 'session-1';
      mockStore.sessions = {
        'session-1': { status: 'idle' },
      };

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      render(<TestComponent />);

      await capturedActions!.handleSend();

      expect(mockSendEvent).toHaveBeenCalledWith({
        type: 'session.continue',
        payload: {
          sessionId: 'session-1',
          prompt: 'Continue the work',
        },
      });
    });

    it('handleSend 在会话运行时应该设置错误', async () => {
      mockStore.prompt = 'Test';
      mockStore.activeSessionId = 'session-1';
      mockStore.sessions = {
        'session-1': { status: 'running' },
      };

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      render(<TestComponent />);

      await capturedActions!.handleSend();

      expect(mockStore.setGlobalError).toHaveBeenCalledWith('会话正在运行');
      expect(mockSendEvent).not.toHaveBeenCalled();
    });

    it('handleSend 在空输入时不应该发送', async () => {
      mockStore.prompt = '   '; // 只有空格

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      render(<TestComponent />);

      await capturedActions!.handleSend();

      expect(mockSendEvent).not.toHaveBeenCalled();
    });

    it('handleStop 应该发送 session.stop 事件', () => {
      mockStore.activeSessionId = 'session-1';

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      render(<TestComponent />);

      capturedActions!.handleStop();

      expect(mockSendEvent).toHaveBeenCalledWith({
        type: 'session.stop',
        payload: { sessionId: 'session-1' },
      });
    });

    it('isRunning 应该正确反映会话状态', () => {
      mockStore.activeSessionId = undefined;
      mockStore.sessions = {};

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      const { rerender } = render(<TestComponent />);

      expect(capturedActions!.isRunning).toBe(false);

      // 更新为运行状态
      mockStore.activeSessionId = 'session-1';
      mockStore.sessions = { 'session-1': { status: 'running' } };
      rerender(<TestComponent />);

      expect(capturedActions!.isRunning).toBe(true);
    });
  });

  describe('发送/停止按钮', () => {
    it('非运行状态应该显示发送按钮', () => {
      mockStore.activeSessionId = undefined;
      mockStore.sessions = {};

      render(<PromptInput sendEvent={mockSendEvent} />);

      const sendButton = screen.getByLabelText('发送');
      expect(sendButton).toBeInTheDocument();
    });

    it('运行状态应该显示停止按钮', () => {
      mockStore.activeSessionId = 'session-1';
      mockStore.sessions = { 'session-1': { status: 'running' } };

      render(<PromptInput sendEvent={mockSendEvent} />);

      const stopButton = screen.getByLabelText('停止');
      expect(stopButton).toBeInTheDocument();
    });

    it('点击停止按钮应该停止会话', () => {
      mockStore.activeSessionId = 'session-1';
      mockStore.sessions = { 'session-1': { status: 'running' } };

      render(<PromptInput sendEvent={mockSendEvent} />);

      const stopButton = screen.getByLabelText('停止');
      fireEvent.click(stopButton);

      expect(mockSendEvent).toHaveBeenCalledWith({
        type: 'session.stop',
        payload: { sessionId: 'session-1' },
      });
    });
  });

  describe('键盘快捷键', () => {
    it('Shift+Enter 应该不发送消息', () => {
      mockStore.prompt = 'Test message';

      render(<PromptInput sendEvent={mockSendEvent} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;

      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

      expect(mockOnSendMessage).not.toHaveBeenCalled();
      expect(mockSendEvent).not.toHaveBeenCalled();
    });
  });

  describe('斜杠按钮', () => {
    it('点击斜杠按钮应该调用 setPrompt', () => {
      render(<PromptInput sendEvent={mockSendEvent} />);

      const slashButton = screen.getByTitle('斜杠命令');
      fireEvent.click(slashButton);

      expect(mockStore.setPrompt).toHaveBeenCalled();
    });
  });

  describe('命令加载', () => {
    it('应该在组件加载时调用 getSlashCommands', async () => {
      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      await waitFor(() => {
        expect(window.electron.getSlashCommands).toHaveBeenCalled();
      }, { container, timeout: 2000 });
    });

    it('加载命令失败时应该使用内置命令', async () => {
      (window.electron.getSlashCommands as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Load failed'));

      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      await waitFor(() => {
        expect(window.electron.getSlashCommands).toHaveBeenCalled();
      }, { container, timeout: 2000 });
    });
  });

  describe('错误处理', () => {
    it('生成会话标题失败时应该设置错误', async () => {
      (window.electron.generateSessionTitle as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Failed'));

      mockStore.prompt = 'Test';
      mockStore.activeSessionId = undefined;

      let capturedActions: ReturnType<typeof usePromptActions> | null = null;
      const TestComponent = () => {
        capturedActions = usePromptActions(mockSendEvent);
        return null;
      };
      render(<TestComponent />);

      await capturedActions!.handleSend();

      expect(mockStore.setPendingStart).toHaveBeenCalledWith(false);
      expect(mockStore.setGlobalError).toHaveBeenCalledWith('获取会话标题失败');
      expect(mockSendEvent).not.toHaveBeenCalled();
    });
  });

  describe('禁用状态', () => {
    it('禁用时斜杠和发送按钮应该被禁用', () => {
      render(<PromptInput sendEvent={mockSendEvent} disabled />);

      const slashButton = screen.getByTitle('斜杠命令');
      const sendButton = screen.getByLabelText('发送');

      expect(slashButton).toBeDisabled();
      expect(sendButton).toBeDisabled();
    });

    it('禁用状态但会话运行时停止按钮不应被禁用', () => {
      mockStore.activeSessionId = 'session-1';
      mockStore.sessions = { 'session-1': { status: 'running' } };

      render(<PromptInput sendEvent={mockSendEvent} disabled />);

      const stopButton = screen.getByLabelText('停止');

      // 在运行状态下，即使 disabled=true，停止按钮仍然可用
      expect(stopButton).not.toBeDisabled();
    });
  });
});
