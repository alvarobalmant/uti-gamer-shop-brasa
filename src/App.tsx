
import { Helmet } from "react-helmet";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProviderOptimized } from '@/contexts/ProductContextOptimized';
import { ProductProvider } from '@/contexts/ProductContext';
import { UTICoinsProvider } from '@/contexts/UTICoinsContext';
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalNavigationProvider } from "@/contexts/GlobalNavigationContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import { setupErrorInterception } from "@/utils/errorCorrection";
import GlobalNavigationOverlay from "@/components/GlobalNavigationOverlay";
// Removed optimized components
import Index from "./pages/Index";
import ScrollRestorationProvider from "./components/ScrollRestorationProvider";
import { SecurityProvider } from "@/contexts/SecurityContext";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import { JWTErrorMonitor } from "@/components/ErrorMonitor/JWTErrorMonitor";
import SmartAuthProvider from "@/components/SmartAuthProvider";
import { useEffect } from "react";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 80947bebedca2ff3c2faf1993fe4d001d405e519

// Providers otimizados
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AppWithPreloader } from "@/components/AppWithPreloader";

// Pages com lazy loading
import { lazy, Suspense } from "react";
import { HomepageSkeleton } from "@/components/skeletons/AdvancedSkeletons";

// Lazy load das páginas para otimizar bundle splitting
const IndexWithPreloader = lazy(() => import("./pages/IndexWithPreloader"));
const ProductPage = lazy(() => import("./pages/Product"));
const CategoryPage = lazy(() => import("./pages/Category"));

// Configuração otimizada do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache mais agressivo para melhor performance
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos (antiga cacheTime)
      retry: 1, // Menos tentativas para falhar mais rápido
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
      <AuthProvider>
        <SecurityProvider>
          <SecurityHeaders />
          <UTICoinsProvider>
            <CartProvider>
              <ProductProviderOptimized>
                <LoadingProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <AppWithPreloader>
                        <GlobalNavigationProvider>
                          <ScrollRestorationProvider>
                              <LoadingOverlay />
                              <GlobalNavigationOverlay />
                              <JWTErrorMonitor />
                              <SessionManager />
                              <SmartAuthProvider>
                             <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes - Index sem lazy loading por ser crítica */}
                  <Route path="/" element={<Index />} />
=======
      <SessionProvider supabaseClient={supabase}>
        <AuthProvider>
          <CartProvider>
            <AppWithPreloader>
              <TooltipProvider>
                <BrowserRouter>
                  <Helmet>
                    <title>UTI dos Games - Sua loja de games favorita</title>
                    <meta name="description" content="A melhor loja de games do Brasil. Consoles, jogos e acessórios com os melhores preços." />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    
                    {/* Preload de recursos críticos */}
                    <link rel="preload" href="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" as="image" />
                    <link rel="preconnect" href="https://pmxnfpnnvtuuiedoxuxc.supabase.co" />
                    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                    
                    {/* PWA e performance hints */}
                    <meta name="theme-color" content="#1f2937" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                  </Helmet>
>>>>>>> 80947bebedca2ff3c2faf1993fe4d001d405e519
                  
                  <div className="min-h-screen bg-background text-foreground">
                    <Suspense fallback={<HomepageSkeleton />}>
                      <Routes>
                        <Route path="/" element={<IndexWithPreloader />} />
                        <Route path="/produto/:id" element={<ProductPage />} />
                        <Route path="/categoria/:category" element={<CategoryPage />} />
                        {/* Outras rotas podem ser adicionadas aqui */}
                      </Routes>
                    </Suspense>
                  </div>
                  
                  <Toaster />
                  <Sonner />
                </BrowserRouter>
              </TooltipProvider>
            </AppWithPreloader>
          </CartProvider>
        </AuthProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
