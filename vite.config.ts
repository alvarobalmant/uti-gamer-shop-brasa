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
        "8080-ilbtoswv6dslzakui24z6-0fb3bda1.manusvm.computer",
        "8080-i99wp7okhgwt2i5jx06di-2ab66ca5.manus.computer",
        "8081-ijgmkwfok50gh2m84lph8-2ab66ca5.manus.computer", // Add the new host for port 8081
        "8080-ikx3apra83mu2dzlameai-2ab66ca5.manus.computer", // Add the current host
        "8080-ik3kpjzy2inctgydlzw1a-82dc8031.manusvm.computer", // Add the current host
        "8081-igmv19nvkoa2092m27yjq-82dc8031.manusvm.computer", // Add the new host for port 8081
        "8082-il0zt2d2l2nrr2doaqbev-82dc8031.manusvm.computer", // Add the current host for port 8082
        "8080-il0zt2d2l2nrr2doaqbev-82dc8031.manusvm.computer", // Add the current host for port 8080
        "8080-ioymk933dhxhu81ucia1w-386328be.manusvm.computer", // Add the current host for port 8082
        "8080-idd2p9ujg40rxdy66s6ff-3bc6acb2.manusvm.computer", // Add the current host for port 8080
        "8081-ixjf743vmhujk04kryovt-21becea3.manusvm.computer", // Add the new host for port 8081
        "8082-ixjf743vmhujk04kryovt-21becea3.manusvm.computer" // Add the new host for port 8082
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


