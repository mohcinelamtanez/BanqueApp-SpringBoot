import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards /api/* to the Spring Boot backend during `vite dev` so the
    // browser sees same-origin requests — no backend CORS config needed.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
