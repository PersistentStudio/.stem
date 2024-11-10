import routify from '@roxi/routify/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path, { resolve } from 'path';
import preprocess from 'svelte-preprocess';
import { defineConfig } from 'vite';

const production = process.env.NODE_ENV === 'production'

function fixSourceMaps () {
    let currentInterval = null
    return {
        name: 'fix-source-map',
        enforce: 'post',
        transform: function (source) {
            if (currentInterval) { return; }
        
            currentInterval = setInterval(function () {
                const nodeModulesPath = path.join(__dirname, 'node_modules', '.vite', 'deps');
                if (fs.existsSync(nodeModulesPath)) {
                    clearInterval(currentInterval);
                    currentInterval = null;
                    const files = fs.readdirSync(nodeModulesPath);
                    files.forEach(function (file) {
                    const mapFile = file + '.map';
                    const mapPath = path.join(nodeModulesPath, mapFile);
                    if (fs.existsSync(mapPath)) {
                        let mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
                        if (!mapData.sources || mapData.sources.length == 0) {
                        mapData.sources = [path.relative(mapPath, path.join(nodeModulesPath, file))];
                        fs.writeFileSync(mapPath, JSON.stringify(mapData), 'utf8');
                        }
                    }
                    });
                }
            }, 100);
            
            return source;
        }
    }
}

export default defineConfig({
    clearScreen: false,
    resolve: { alias: { 
                '@': resolve(__dirname, 'src'), 
                '$assets': resolve(__dirname, "public/assets"),
                '$lib': resolve(__dirname, "src/lib"),
                "$components": resolve(__dirname, "src/lib/components"),
            }},
    plugins: [
        fixSourceMaps(),
        routify({
            render: {
                ssr: { enable: false },
            },
        }),
        svelte({
            compilerOptions: {
                dev: !production,
                hydratable: !!process.env.ROUTIFY_SSR_ENABLE,
            },
            extensions: ['.svelte'],
            preprocess: [preprocess()],
        }),
    ],

    server: { port: 1337 },
})