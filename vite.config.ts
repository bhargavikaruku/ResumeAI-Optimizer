import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // IMPORTANT: Replace 'your-repo-name' with your actual GitHub repository name
    // Example: If your repo is github.com/username/resumai-optimizer
    // Then use: base: '/resumai-optimizer/'
    base: '/ResumeAI-Optimizer/',    
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    
    plugins: [react()],
    
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    
    // Optimize build for production
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'chart-vendor': ['recharts'],
            'pdf-vendor': ['pdfjs-dist'],
          }
        }
      }
    }
  };
});
