import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two HTML entries: the animated portfolio and the standalone resume
      // viewer that serves the original PDF at /resume.
      input: {
        main: "index.html",
        resume: "resume.html",
      },
    },
  },
});
