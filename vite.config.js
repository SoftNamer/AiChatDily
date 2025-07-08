import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	esbuild: {
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
		jsxInject: `import { h } from 'vue'`
	},
	server: {
		port: 3000,
		proxy: {
			'/v1': {
				target: 'http://127.0.0.1',
				changeOrigin: true,
				secure: false
			}
		}
	}
})