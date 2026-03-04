import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const option = process.env.VITE_OPTION ?? '1';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @nav always resolves to whichever Option_X is active
      '@nav': path.resolve(__dirname, `Option_${option}`),
      // @/ for shared src imports
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __ACTIVE_OPTION__: JSON.stringify(option),
  },
  server: {
    port: 5170 + Number(option), // dev:1 → 5171, dev:2 → 5172, dev:3 → 5173
  },
});
