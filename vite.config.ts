import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// import { crx } from '@crxjs/vite-plugin';
// import manifest from './public/manifest.json';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            globals: {
                Buffer: true,
            },
            protocolImports: true,
        }),
        // crx({ manifest }),
    ],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    build: {
        rollupOptions: {
            input: {
                popup: 'index.html',
                content: 'src/content-script/index.ts',
                background: 'src/background-script/index.ts',
                provider: 'src/provider-script/index.ts',
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
});