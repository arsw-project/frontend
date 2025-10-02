import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	server: {
		proxy: {
			'/api': {
				// Proxy API requests to the backend server. ONLY FOR DEVELOPMENT!
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
