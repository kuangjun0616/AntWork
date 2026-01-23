import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const port = parseInt(env.PORT); // MUST BE LOWERCASE

	return {
		plugins: [react(), tailwindcss(), tsconfigPaths()],
		base: './',
		resolve: {
			alias: {
				'@/shared': path.resolve(__dirname, 'src/shared'),
			},
		},
		build: {
			outDir: 'dist-react',
			// 启用压缩
			minify: 'esbuild',
			// 目标浏览器
			target: 'es2020',
			// 代码分割优化
			rollupOptions: {
				output: {
					manualChunks: {
						// React 核心库单独打包
						'react-core': ['react', 'react-dom'],
						// UI 组件库单独打包
						'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
						// Markdown 相关单独打包
						'markdown': ['react-markdown', 'rehype-highlight', 'rehype-raw', 'remark-gfm', 'highlight.js'],
						// 状态管理单独打包
						'state': ['zustand'],
					},
				},
			},
			// chunk 大小警告阈值（KB）
			chunkSizeWarningLimit: 500,
		},
		server: {
			port, // MUST BE LOWERCASE
			strictPort: true,
		},
	};
});
