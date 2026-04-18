import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tokenomics: resolve(__dirname, 'tokenomics.html'),
        roadmap: resolve(__dirname, 'roadmap.html'),
        team: resolve(__dirname, 'team.html'),
        partners: resolve(__dirname, 'partners.html'),
      },
    },
  },
});
