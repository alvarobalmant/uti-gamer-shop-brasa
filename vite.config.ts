import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    hmr: {
      host: "0.0.0.0",
      port: 8080,
    },
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendors - sempre carregados
          if (id.includes('react') && (id.includes('react-dom') || id.includes('react/'))) {
            return 'vendor-react';
          }
          if (id.includes('react-router-dom')) {
            return 'vendor-router';
          }
          if (id.includes('@supabase/supabase-js')) {
            return 'vendor-supabase';
          }
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          
          // UI components - carregados quando necessário
          if (id.includes('@radix-ui/')) {
            return 'ui-radix';
          }
          
          // ADMIN-ONLY chunks - carregados apenas para admins
          if (id.includes('@huggingface/transformers')) {
            return 'admin-ai';
          }
          if (id.includes('xlsx')) {
            return 'admin-excel';
          }
          
          // Admin components - detectar por path
          if (id.includes('/Admin/') || id.includes('/admin/') || 
              id.includes('AdminPanel') || id.includes('ProductManager') ||
              id.includes('SpecificationDiagnostic') || id.includes('ProductImageManager')) {
            return 'admin-core';
          }
          
          // Admin features específicas
          if (id.includes('BulkImageUpload') || id.includes('ProductImageManager') ||
              id.includes('ProductDesktopManager') || id.includes('SpecialSectionManager')) {
            return 'admin-features';
          }

          // Admin tabs - lazy loading individual
          if (id.includes('LazyAdminTabs') || id.includes('BulkProductUploadLazy')) {
            return 'admin-tabs';
          }

          // Performance monitoring
          if (id.includes('usePerformanceMonitoring') || id.includes('useBackgroundRemovalLazy')) {
            return 'admin-performance';
          }
          
          // Charts - lazy load
          if (id.includes('recharts')) {
            return 'vendor-charts';
          }
          
          // Forms - lazy load
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'vendor-forms';
          }
          
          // Date utilities - lazy load
          if (id.includes('date-fns')) {
            return 'vendor-date';
          }
          
          // Utils pequenos - podem ficar juntos
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'vendor-utils';
          }
          
          // Platform pages - lazy load por plataforma
          if (id.includes('/platforms/PlayStation')) {
            return 'platform-playstation';
          }
          if (id.includes('/platforms/Xbox')) {
            return 'platform-xbox';
          }
          if (id.includes('/platforms/Nintendo')) {
            return 'platform-nintendo';
          }
          if (id.includes('/platforms/')) {
            return 'platform-others';
          }
          
          // Product pages
          if (id.includes('ProductPage') || id.includes('/produto/')) {
            return 'product-pages';
          }
          
          // Client area
          if (id.includes('ClientArea') || id.includes('Wishlist') || id.includes('/area-cliente/')) {
            return 'client-area';
          }
          
          // UTI Coins system
          if (id.includes('UTI') || id.includes('Coins') || id.includes('/coins/')) {
            return 'uti-coins';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Mais conservador
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    // Otimizações conservadoras
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'lucide-react',
    ],
    exclude: [
      // Admin-only libraries - não pré-carregar
      '@huggingface/transformers',
      'xlsx',
      // Background removal for admins only
      '@/utils/backgroundRemoval',
      // Lazy admin components
      '@/components/Admin/LazyAdminTabs',
    ],
  },
}));

