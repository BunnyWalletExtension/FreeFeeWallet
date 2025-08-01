import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            globals: {
                Buffer: true,
            },
            protocolImports: true,
        }),
        crx({ manifest }),
    ],
    server: {
        port: 3000,
    },
    build: {
        rollupOptions: {
            input: {
                popup: 'index.html',
                contentScript: 'src/content-script/index.ts',
                background: 'src/background-script/index.ts',
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
});