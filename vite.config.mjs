import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base for GitHub Pages: https://simpwae.github.io/HRMS-Cecos/
  // Use the repository name with leading/trailing slashes
  base: '/HRMS-Cecos/',
  server: { port: 5173 },
});
