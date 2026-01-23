/**
 * @author      Alan
 * @copyright   AGCPA v3.0
 * @created     2026-01-20
 * @updated     2026-01-21
 * @Email       None
 *
 * Vitest 测试配置
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    // 默认使用 node 环境以支持 Electron/fs 等 mock
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}', '!tests/components/**/*', '!tests/integration/prompt-input-ui.test.tsx'],
    exclude: ['node_modules', 'dist', 'dist-electron', 'dist-react'],
    setupFiles: ['./tests/setup.ts'],
    // 配置 JSX 处理
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        'dist-react/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Mock Electron to prevent installation issues
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});
