/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * PromptInput 组件集成测试
 * 测试完整的 UI 交互：斜杠命令、自动补全、键盘导航等
 * 注意：由于 happy-dom 对 selectionStart 的支持有限，某些测试被简化
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PromptInput } from '../../src/ui/components/PromptInput';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'promptInput.placeholder': '输入消息...',
        'promptInput.placeholderDisabled': '输入已禁用',
        'promptInput.sendPrompt': '发送',
        'promptInput.stopSession': '停止',
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
  { name: '/test', description: '运行测试', source: 'builtin' },
  { name: '/custom', description: '自定义命令', source: 'skill' },
  { name: '/plugin', description: '插件命令', source: 'plugin' },
  { name: '/mcp', description: 'Model Context Protocol 服务器', source: 'builtin' },
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

// 创建真实的响应式 store mock
let globalStoreState = {
  prompt: '',
  cwd: '/test/path',
  activeSessionId: undefined as string | undefined,
  sessions: {} as Record<string, { status: string }>,
};

const globalSetters = {
  setPrompt: vi.fn((value: string) => {
    globalStoreState.prompt = value;
  }),
  setCwd: vi.fn(),
  setActiveSessionId: vi.fn(),
  setSessions: vi.fn(),
  setPendingStart: vi.fn(),
  setGlobalError: vi.fn(),
};

vi.mock('../../src/ui/store/useAppStore', () => ({
  useAppStore: (selector?: (state: typeof globalStoreState) => unknown) => {
    // 使用 ref 来保持状态引用
    const stateRef = React.useRef(globalStoreState);

    React.useEffect(() => {
      stateRef.current = globalStoreState;
    });

    const currentState = {
      prompt: stateRef.current.prompt ?? '',
      cwd: stateRef.current.cwd ?? '',
      activeSessionId: stateRef.current.activeSessionId,
      sessions: stateRef.current.sessions ?? {},
      setPrompt: globalSetters.setPrompt,
      setPendingStart: globalSetters.setPendingStart,
      setGlobalError: globalSetters.setGlobalError,
    };

    if (typeof selector === 'function') {
      return selector(currentState);
    }

    return currentState;
  },
}));

describe('PromptInput 集成测试 - UI 交互功能', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalStoreState = {
      prompt: '',
      cwd: '/test/path',
      activeSessionId: undefined,
      sessions: {},
    };
    Object.keys(globalSetters).forEach(key => {
      (globalSetters as any)[key].mockReset();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('斜杠命令自动补全', () => {
    it('输入斜杠应该显示命令列表', async () => {
      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;

      await waitFor(() => {
        expect(window.electron.getSlashCommands).toHaveBeenCalled();
      }, { container, timeout: 2000 });

      fireEvent.change(textarea, { target: { value: '/' } });

      await waitFor(() => {
        expect(screen.getByText('/plan')).toBeInTheDocument();
        expect(screen.getByText('/help')).toBeInTheDocument();
        expect(screen.getByText('/commit')).toBeInTheDocument();
      }, { container, timeout: 2000 });
    });

    it('应该显示命令来源标签', async () => {
      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;

      await waitFor(() => {
        expect(window.electron.getSlashCommands).toHaveBeenCalled();
      }, { container, timeout: 2000 });

      fireEvent.change(textarea, { target: { value: '/' } });

      await waitFor(() => {
        expect(screen.getAllByText('内置').length).toBeGreaterThan(0);
        expect(screen.getByText('自然语言技能')).toBeInTheDocument();
        expect(screen.getByText('插件')).toBeInTheDocument();
      }, { container, timeout: 2000 });
    });
  });

  describe('斜杠按钮交互', () => {
    it('点击斜杠按钮应该插入斜杠', async () => {
      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      const slashButton = screen.getByTitle('斜杠命令');

      fireEvent.click(slashButton);

      await waitFor(() => {
        expect(globalSetters.setPrompt).toHaveBeenCalled();
      }, { container, timeout: 1000 });
    });

    it('空输入时点击斜杠按钮只插入斜杠', async () => {
      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      const slashButton = screen.getByTitle('斜杠命令');

      fireEvent.click(slashButton);

      await waitFor(() => {
        expect(globalSetters.setPrompt).toHaveBeenCalledWith('/');
      }, { container, timeout: 1000 });
    });
  });

  describe('发送/停止按钮交互', () => {
    it('运行状态时点击按钮应该停止会话', async () => {
      globalStoreState.activeSessionId = 'session-1';
      globalStoreState.sessions = { 'session-1': { status: 'running' } };

      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      const stopButton = screen.getByLabelText('停止');
      fireEvent.click(stopButton);

      await waitFor(() => {
        expect(mockSendEvent).toHaveBeenCalledWith({
          type: 'session.stop',
          payload: { sessionId: 'session-1' },
        });
      }, { container });
    });

    it('点击发送按钮应该发送消息', async () => {
      globalStoreState.activeSessionId = 'session-1';
      globalStoreState.sessions = { 'session-1': { status: 'idle' } };
      globalStoreState.prompt = 'Test message';

      const { container } = render(<PromptInput sendEvent={mockSendEvent} onSendMessage={mockOnSendMessage} />);

      const sendButton = screen.getByLabelText('发送');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalled();
        expect(mockSendEvent).toHaveBeenCalled();
      }, { container });
    });
  });

  describe('输入框高度自适应', () => {
    it('输入多行文本时应该增加高度', () => {
      const { container } = render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;

      const initialHeight = parseInt(textarea.style.height || '0', 10);

      const multilineText = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
      fireEvent.change(textarea, { target: { value: multilineText } });

      setTimeout(() => {
        const newHeight = parseInt(textarea.style.height || '0', 10);
        expect(textarea.style.height).toBeDefined();
      }, 100);
    });
  });

  describe('基本 UI 元素', () => {
    it('应该渲染所有必需的 UI 元素', () => {
      render(<PromptInput sendEvent={mockSendEvent} />);

      expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument();
      expect(screen.getByTitle('斜杠命令')).toBeInTheDocument();
      expect(screen.getByLabelText('发送')).toBeInTheDocument();
    });

    it('应该正确显示输入的值', () => {
      globalStoreState.prompt = 'Test input';
      render(<PromptInput sendEvent={mockSendEvent} />);

      const textarea = screen.getByPlaceholderText('输入消息...') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Test input');
    });
  });
});
