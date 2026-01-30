import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [react()],
    base: "/promo-toki-mobile-referral", // TODO Prod
    // base: "/promo-lunar-ny2025-pre", // TODO SSS
    // base: "/" // TODO Dev

    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        chunkSizeWarningLimit: 1000, // Increase limit

        rollupOptions: {
            output: {
                // Simpler approach - group by package
                manualChunks(id) {
                    // Only split Chakra UI (the largest package)
                    if (id.includes('@chakra-ui')) {
                        return 'chakra'
                    }

                    // Everything else in node_modules goes to vendor
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                },

                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
            },
        },
    },

    server: {
        port: 5173,
        host: true,
    },

    preview: {
        port: 4173,
    },
})