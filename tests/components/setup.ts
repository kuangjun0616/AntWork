/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-23
 * @updated     2026-01-23
 * @Email       None
 *
 * 组件测试环境设置
 * 为 React 组件测试提供必要的 mock 和配置
 */

import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 每个测试后清理
afterEach(() => {
  cleanup();
});

// Mock window.electron
Object.defineProperty(global.window, 'electron', {
  value: {
    generateSessionTitle: vi.fn(() => Promise.resolve('Test Session')),
    getSlashCommands: vi.fn(() => Promise.resolve([])),
    getOutputConfig: vi.fn(() => Promise.resolve({ renderer: 'enhanced' })),
  },
  writable: true,
  configurable: true,
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock @radix-ui/react-dropdown-menu
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="dropdown-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Content: ({ children, ...props }: any) => (
    <div data-testid="dropdown-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, onClick, ...props }: any) => (
    <div data-testid="dropdown-item" onClick={onClick} {...props}>
      {children}
    </div>
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Brain: ({ className }: { className?: string }) => (
    <svg data-testid="brain-icon" className={className} viewBox="0 0 24 24" />
  ),
}));

// Mock useAppStore
vi.mock('../../src/ui/store/useAppStore', () => ({
  useAppStore: () => ({
    prompt: '',
    cwd: '',
    activeSessionId: null,
    sessions: {},
    setPrompt: vi.fn(),
    setPendingStart: vi.fn(),
    setGlobalError: vi.fn(),
  }),
}));

// Mock logger
vi.mock('../../src/ui/utils/logger', () => ({
  log: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));
