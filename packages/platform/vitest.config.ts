import { defineConfig, mergeConfig } from 'vitest/config';

// .js extension required for NodeNext module resolution in tsconfig
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['inertia/**/*.test.{ts,tsx}'],
    },
  }),
);
