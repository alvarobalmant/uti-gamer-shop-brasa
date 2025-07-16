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
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
  plugins: [
    react({
      // Otimizações do SWC
      jsxImportSource: '@emotion/react',
      plugins: [
        // Plugin para otimizar re-renders
        ['@swc/plugin-emotion', {}],
      ],
    }),
    mode === "development" && componentTagger(),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // Melhor visualização
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Configurações de build otimizadas
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    
    // Configurações de chunk
    chunkSizeWarningLimit: 300,
    
    rollupOptions: {
      output: {
        // Estratégia de chunking otimizada
        manualChunks: (id) => {
          // Vendor chunks - bibliotecas externas
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            
            // UI Libraries
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            
            // Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            
            // Supabase
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }
            
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            
            // Forms
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-forms';
            }
            
            // Charts
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            
            // Utilities
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }
            
            // Icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            
            // Date utilities
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            
            // Outras bibliotecas pequenas
            return 'vendor-misc';
          }
          
          // Feature chunks - funcionalidades específicas
          if (id.includes('/pages/Admin')) {
            return 'feature-admin';
          }
          
          if (id.includes('/pages/ProductPageSKU')) {
            return 'feature-product';
          }
          
          if (id.includes('/components/Auth/')) {
            return 'feature-auth';
          }
          
          if (id.includes('/components/Cart')) {
            return 'feature-cart';
          }
          
          if (id.includes('/components/Product/')) {
            return 'feature-product-components';
          }
          
          if (id.includes('/hooks/useProducts') || id.includes('/hooks/useOptimizedProducts')) {
            return 'feature-products-logic';
          }
          
          // Shared components
          if (id.includes('/components/ui/')) {
            return 'shared-ui';
          }
          
          if (id.includes('/components/Header/') || id.includes('/components/Footer')) {
            return 'shared-layout';
          }
          
          if (id.includes('/hooks/') || id.includes('/lib/') || id.includes('/utils/')) {
            return 'shared-utils';
          }
        },
        
        // Nomes de arquivo otimizados
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          
          return `assets/[name]-[hash].${ext}`;
        },
      },
      
      // Otimizações de tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    
    // Configurações de CSS
    cssMinify: true,
    
    // Configurações de assets
    assetsInlineLimit: 4096, // 4KB
  },
  
  // Otimizações do esbuild
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
    treeShaking: true,
  },
  
  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [
      // Excluir dependências que devem ser carregadas dinamicamente
      '@huggingface/transformers',
    ],
  },
  
  // Configurações de CSS
  css: {
    devSourcemap: mode === 'development',
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        ...(mode === 'production' ? [
          require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              colormin: true,
              convertValues: true,
              discardDuplicates: true,
              discardEmpty: true,
              mergeRules: true,
              minifyFontValues: true,
              minifyParams: true,
              minifySelectors: true,
              reduceIdents: true,
              reduceTransforms: true,
              svgo: true,
              uniqueSelectors: true,
            }],
          }),
        ] : []),
      ],
    },
  },
  
  // Configurações de performance
  define: {
    // Remover checks de desenvolvimento em produção
    __DEV__: mode === 'development',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  
  // Configurações de worker
  worker: {
    format: 'es',
    plugins: [react()],
  },
}));

