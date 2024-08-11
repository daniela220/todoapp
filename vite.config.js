
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/todoapp/', // Ajusta esto según el nombre de tu repositorio
})
