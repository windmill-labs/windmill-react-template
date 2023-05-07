import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "^/api/.*": {
        target: process.env.REMOTE ?? "https://app.windmill.dev/",
        changeOrigin: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
  plugins: [react(), cssInjectedByJsPlugin()],
  build: {
    lib: { entry: "src/main.tsx", formats: ["iife"], name: "app" },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  assetsInclude: ["scripts/**/*.ts"],
});
