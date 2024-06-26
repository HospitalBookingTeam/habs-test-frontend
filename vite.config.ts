import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		chunkSizeWarningLimit: 1600,
	},
	resolve: {
		alias: [{ find: '@', replacement: '/src' }],
	},
	plugins: [react()],
    server: {
        port: 3456
    }
})
