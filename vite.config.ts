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
          // PHASE 4B: Smart Bundle Splitting
          
          // Critical core - always loaded
          if (id.includes('react') && (id.includes('react-dom') || id.includes('react/'))) {
            return 'core-react';
          }
          if (id.includes('react-router-dom')) {
            return 'core-router';
          }
          if (id.includes('@supabase/supabase-js')) {
            return 'core-supabase';
          }
          
          // Smart bundle detection
          if (id.includes('smartBundleSplitter') || id.includes('useSmartBundleLoader')) {
            return 'core-smart-loader';
          }
          
          // Production essentials
          if (id.includes('productionLogger') || id.includes('timerManager')) {
            return 'core-production';
          }
          
          // Modular Radix UI - split by component type
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-alert-dialog')) {
            return 'ui-modals';
          }
          if (id.includes('@radix-ui/react-dropdown-menu') || id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-popover')) {
            return 'ui-dropdowns';
          }
          if (id.includes('@radix-ui/react-tabs') || id.includes('@radix-ui/react-accordion') || id.includes('@radix-ui/react-collapsible')) {
            return 'ui-navigation';
          }
          if (id.includes('@radix-ui/react-checkbox') || id.includes('@radix-ui/react-radio-group') || id.includes('@radix-ui/react-switch')) {
            return 'ui-inputs';
          }
          if (id.includes('@radix-ui/react-toast') || id.includes('@radix-ui/react-tooltip') || id.includes('@radix-ui/react-hover-card')) {
            return 'ui-feedback';
          }
          if (id.includes('@radix-ui/')) {
            return 'ui-radix-misc';
          }
          
          // Platform-specific splitting
          if (id.includes('/Mobile/') || id.includes('mobile') || id.includes('touch')) {
            return 'platform-mobile';
          }
          if (id.includes('/Desktop/') || id.includes('desktop') || id.includes('keyboard')) {
            return 'platform-desktop';
          }
          if (id.includes('/Tablet/') || id.includes('tablet') || id.includes('hybrid')) {
            return 'platform-tablet';
          }
          
          // ADMIN ISOLATION - Complete separation
          if (id.includes('@huggingface/transformers')) {
            return 'admin-ai-isolated';
          }
          if (id.includes('xlsx')) {
            return 'admin-excel-isolated';
          }
          if (id.includes('/Admin/') || id.includes('/admin/') || 
              id.includes('AdminPanel') || id.includes('ProductManager') ||
              id.includes('SpecificationDiagnostic') || id.includes('ProductImageManager') ||
              id.includes('TagManager') || id.includes('Xbox4Admin') ||
              id.includes('BulkImageUpload') || id.includes('SpecialSectionManager')) {
            return 'admin-complete-isolated';
          }
          if (id.includes('LazyAdminTabs') || id.includes('BulkProductUploadLazy')) {
            return 'admin-tabs-isolated';
          }
          if (id.includes('usePerformanceMonitoring') || id.includes('useBackgroundRemovalLazy') || id.includes('adminHelpers')) {
            return 'admin-utils-isolated';
          }
          
          // Feature-based chunking
          if (id.includes('recharts')) {
            return 'feature-charts';
          }
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'feature-forms';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'feature-query';
          }
          if (id.includes('framer-motion')) {
            return 'feature-motion';
          }
          if (id.includes('date-fns')) {
            return 'feature-date';
          }
          
          // Search functionality
          if (id.includes('/Search/') || id.includes('searchHelpers') || id.includes('SearchComponents')) {
            return 'feature-search';
          }
          
          // Product system
          if (id.includes('/Products/') || id.includes('productHelpers') || id.includes('ProductComponents')) {
            return 'feature-products';
          }
          if (id.includes('ProductPage') || id.includes('/produto/')) {
            return 'page-product';
          }
          
          // Platform pages - more granular
          if (id.includes('/platforms/PlayStation')) {
            return 'page-playstation';
          }
          if (id.includes('/platforms/Xbox')) {
            return 'page-xbox';
          }
          if (id.includes('/platforms/Nintendo')) {
            return 'page-nintendo';
          }
          if (id.includes('/platforms/')) {
            return 'page-platforms-other';
          }
          
          // UTI Coins system - isolated
          if (id.includes('/UTI/') || id.includes('CoinsComponents') || id.includes('coinsHelpers') || id.includes('/coins/')) {
            return 'feature-coins-isolated';
          }
          
          // Client area
          if (id.includes('ClientArea') || id.includes('Wishlist') || id.includes('/area-cliente/')) {
            return 'page-client-area';
          }
          
          // Small utilities - keep together
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils-styling';
          }
          if (id.includes('lucide-react')) {
            return 'utils-icons';
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
      // PHASE 4B: Aggressive exclusions for smart loading
      
      // Admin-only libraries - never preload
      '@huggingface/transformers',
      'xlsx',
      '@/utils/backgroundRemoval',
      '@/components/Admin/LazyAdminTabs',
      '@/components/Admin/ProductManager',
      '@/components/Admin/TagManager',
      '@/components/Admin/Xbox4Admin',
      
      // Platform-specific bundles
      '@/components/Mobile/MobileLayouts',
      '@/components/Desktop/DesktopLayouts', 
      '@/components/Tablet/TabletLayouts',
      '@/utils/touchHandlers',
      '@/utils/keyboardHandlers',
      '@/utils/hybridHandlers',
      
      // Heavy feature bundles
      'recharts',
      '@tanstack/react-query',
      'react-hook-form',
      '@hookform/resolvers',
      
      // Smart bundle loaders
      '@/lib/smartBundleSplitter',
      '@/hooks/useSmartBundleLoader',
      
      // UTI Coins - lazy load completely
      '@/components/UTI/CoinsComponents',
      '@/utils/coinsHelpers',
    ],
  },
}));

