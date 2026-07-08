import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
const r = (p) => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
    plugins: [react()],
    base: './',
    build: {
        outDir: 'dist/publish-viewer',
        emptyOutDir: true,
        rollupOptions: {
            input: r('./publish-preview.html'),
        },
    },
    resolve: {
        alias: {
            '@prototype/ui': r('./src/packages/ui'),
            '@prototype/patterns': r('./src/packages/patterns'),
            '@prototype/renderer': r('./src/packages/renderer'),
        },
    },
});
