import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';


export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5173,  // O el puerto que prefieras
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/Main.jsx'],
            refresh: true,
        }),
        react(),
    ],
});

