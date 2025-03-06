import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gitfront/', // GitHub 레포지토리 이름과 동일해야 함
});
