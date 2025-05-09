import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    server: {
      port: 8200,
    },
    plugins: [tailwindcss()],
  };
});
