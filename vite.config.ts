import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import vercel from "vite-plugin-vercel";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vike(), react(), vercel()],
});
