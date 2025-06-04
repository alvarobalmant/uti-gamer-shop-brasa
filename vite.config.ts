import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Listen on all interfaces
    // Removed fixed port to allow Vite to choose dynamically
    // Add the allowed host patterns for external access
    allowedHosts: [".manus.computer", ".manusvm.computer"], // Allow subdomains of both manus.computer AND manusvm.computer
    strictPort: false, // Allow Vite to try other ports if the default is busy
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

