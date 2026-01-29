import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind()],
  site: 'https://yourusername.github.io',
  base: '/virtual-dr880',
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  }
});
