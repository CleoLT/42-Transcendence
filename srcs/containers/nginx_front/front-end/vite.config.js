import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

/*export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist"
  }
})*/


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist"
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api_gateway:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
// creamos un server{} en vite para poder redirigir todas las requests que vienen de su puerto (http://localhost:5173) a
// la api-gateway , que esta abierta en el puerto 3000
// sin esto, el contenedor de 'dev' no funciona porque no hay nginx que redirija las requests de api a la api-gateway