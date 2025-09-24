import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
<<<<<<< Updated upstream
import Path from "path";
=======
import path from "path";
>>>>>>> Stashed changes

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< Updated upstream
  base: "./",
  resolve: {
    alias: {
      "@": Path.resolve(__dirname, "src"),
    },
  },
=======
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
>>>>>>> Stashed changes
});
