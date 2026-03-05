import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mirror vite.config.ts aliases; default to Option_1 for unit tests
      '@nav': path.resolve(__dirname, 'Option_1'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    // Mirrors the declaration in src/vite-env.d.ts; provides a default for test compilation
    __ACTIVE_OPTION__: JSON.stringify('1'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'Option_1/**/*.{test,spec}.{ts,tsx}',
      'Option_2/**/*.{test,spec}.{ts,tsx}',
      'Option_3/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['node_modules', 'dist', 'playwright-report', 'test-results'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{ts,tsx}',
        'Option_1/**/*.{ts,tsx}',
        'Option_2/**/*.{ts,tsx}',
        'Option_3/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test/**',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/node_modules/**',
      ],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 75,
        statements: 80,
      },
    },
  },
});
