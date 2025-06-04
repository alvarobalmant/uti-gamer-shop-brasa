import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Changed to 0.0.0.0 to listen on all interfaces
    port: 8080,
    // Add the allowed host for external access
<<<<<<< HEAD
    allowedHosts: ["8080-iyih8moe5zgfzjzhpaqum-e2caa596.manusvm.computer"],
=======
    allowedHosts: ["8080-irlxbd46sr91dkznbemlj-b10e4af0.manusvm.computer"],
>>>>>>> 28eb0a050108c8bf4f6d8596fbf59c64752be981
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

