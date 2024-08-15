import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import autoprefixer from 'autoprefixer';


const resolveAlias = (p) => resolve(__dirname, p);
const alias = { 
  "@": resolveAlias('./src'),
  "~": resolveAlias('./'),
}


export default defineConfig({
  plugins: [
    react(), 
    viteStaticCopy({
      targets: [
        {
          src: './src/assets',
          dest: './'
        }
      ]
    }),
  ], 
  server: {
    open: true,
  },
  css: {
    postcss: {
      plugins: [ 
        autoprefixer({}),
      ]
    }
  },
  resolve: {
    alias,
  },
});

