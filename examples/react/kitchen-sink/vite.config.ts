import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        "@tanstack-query-firebase/react/auth",
        "@tanstack-query-firebase/react/firestore",
        "@tanstack-query-firebase/react/data-connect",
      ],
    },
  },
});
