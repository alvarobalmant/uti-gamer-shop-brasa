import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Changed to 0.0.0.0 to listen on all interfaces
    port: 8080, // Updated port to 8080
    // This allowedHosts is for the dev server (`npm run dev`)
    allowedHosts: [
        "8080-ia7rp8j83n0fk28il71r1-f878a32f.manus.computer", // Add the new host for port 8080
    ],
  },
  preview: {
    host: "0.0.0.0", // Ensure preview server listens on all interfaces
    port: 4173, // Default preview port
    // Add the allowed host for external access during preview
    allowedHosts: ["4173-iwouq7408dg1jkwgigdus-814311ac.manusvm.computer"],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));


