import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Path from "path";

console.log(Path.resolve(__dirname, "src"));
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": Path.resolve(__dirname, "src"),
    },
  },
});
