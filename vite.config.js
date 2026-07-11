import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { projectApiPlugin } from './vite/projectApiPlugin';
import { prototypeJsonPlugin } from './vite/prototypeJsonPlugin';
import { prototypeAliases } from './vite/aliases';
export default defineConfig({
    plugins: [prototypeJsonPlugin(), react(), projectApiPlugin()],
    resolve: {
        alias: prototypeAliases(),
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        if (id.includes('/packages/runtime/'))
                            return 'runtime';
                        if (id.includes('/packages/shell/'))
                            return 'shell';
                        return undefined;
                    }
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
