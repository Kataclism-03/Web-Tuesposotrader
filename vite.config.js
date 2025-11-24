import { defineConfig } from 'vite';
import { resolve } from 'path';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' && repositoryName;

export default defineConfig({
  root: 'src',
  // Serve assets under the repo path when building for GitHub Pages
  base: isGitHubPages ? `/${repositoryName}/` : '/',
  build: {
    outDir: resolve(__dirname, 'dist'),
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});