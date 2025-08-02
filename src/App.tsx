
import { Helmet } from "react-helmet";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simplified context providers
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AppWithPreloader } from "@/components/AppWithPreloader";

// Pages with lazy loading
import { lazy, Suspense } from "react";

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-white">Carregando...</div>
  </div>
);

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));

// Simplified QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppWithPreloader>
            <TooltipProvider>
              <BrowserRouter>
                <Helmet>
                  <title>UTI dos Games - Sua loja de games favorita</title>
                  <meta name="description" content="A melhor loja de games do Brasil. Consoles, jogos e acessórios com os melhores preços." />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Helmet>
                
                <div className="min-h-screen bg-background text-foreground">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
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
    </QueryClientProvider>
  );
}

export default App;
