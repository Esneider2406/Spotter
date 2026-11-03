import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, el servidor de Vite reenvía /api al backend (evita CORS y puertos públicos)
export default defineConfig({
  plugins: [react()],
  server: { host: true, proxy: { '/api': 'http://localhost:4000' } },
});
