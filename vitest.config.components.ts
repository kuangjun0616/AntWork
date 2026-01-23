/**
 * 组件测试 Vitest 配置
 * 使用 happy-dom 环境运行 React 组件测试
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/components/**/*.{test,spec}.{ts,tsx}', 'tests/integration/prompt-input-ui.test.tsx'],
    exclude: ['node_modules', 'dist', 'dist-electron', 'dist-react'],
    setupFiles: ['./tests/setup.ts'],
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
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});
