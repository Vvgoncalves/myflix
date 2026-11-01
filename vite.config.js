import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Permite que todos os assets funcionem perfeitamente no GitHub Pages
  server: {
    port: 3000,
    open: false
  }
});
