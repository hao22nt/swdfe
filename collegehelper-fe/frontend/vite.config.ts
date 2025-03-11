import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net",
    },
  },
})

