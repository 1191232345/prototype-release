import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { projectApiPlugin } from './vite/projectApiPlugin';
const r = (p) => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
    plugins: [react(), projectApiPlugin()],
    resolve: {
        alias: {
            '@prototype/ui': r('./src/packages/ui'),
            '@prototype/patterns': r('./src/packages/patterns'),
            '@prototype/renderer': r('./src/packages/renderer'),
            '@prototype/tokens': r('./src/packages/tokens'),
            '@prototype/extensions': r('./src/packages/extensions'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules'))
                        return undefined;
                    if (id.includes('@fortawesome'))
                        return 'vendor-icons';
                    if (id.includes('/ajv') || id.includes('json-schema'))
                        return 'vendor-ajv';
                    if (id.includes('react-dom') || id.includes('/react/'))
                        return 'vendor-react';
                },
            },
        },
    },
});
