import React, { Suspense, lazy } from "react";
import './utils/categoryTestSimple';
import './utils/n7ErrorSuppressor'; // ← NOVO: Supressor de erro n7.map
import './styles/n7ErrorSuppression.css'; // ← NOVO: CSS para suprimir erro n7.map
import { Toaster } from "@/components/ui/toaster";
import SessionRecoveryToast from "@/components/ErrorMonitor/SessionRecoveryToast";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { useEffect } from "react";

// Componentes de preloading inteligente
import { AppWithPreloader } from "@/components/AppWithPreloader";

// Hook minimalista para prevenir layout shift sem interferir no scroll
const usePreventLayoutShift = () => {
  useEffect(() => {
    // Apenas configuração básica, sem interferir no scroll restoration
    document.body.style.overflowX = 'hidden';
    
    // Observer mais específico - apenas para mudanças críticas
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          if (target === document.body) {
            // Apenas remove padding/margin que causam layout shift, SEM tocar no overflow-y
            if (target.style.paddingRight || target.style.marginRight) {
              target.style.paddingRight = '';
              target.style.marginRight = '';
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};

// Lazy loading para páginas menos críticas
const SearchResults = lazy(() => import("./pages/SearchResultsFinal"));
const SectionPage = lazy(() => import("./pages/SectionPage"));
const PrimePage = lazy(() => import("./pages/PrimePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UTIPro = lazy(() => import("./pages/UTIPro"));

// Lazy loading para páginas de plataforma
const PlayStationPageProfessionalV2 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV2"));
const PlayStationPageProfessionalV3 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV3"));
const PlayStationPageProfessionalV4 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV4"));
const PlayStationPageProfessionalV5 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV5"));
const NintendoPage = lazy(() => import("./pages/platforms/NintendoPage"));
const PCGamingPage = lazy(() => import("./pages/platforms/PCGamingPage"));
const RetroGamingPage = lazy(() => import("./pages/platforms/RetroGamingPage"));
const AreaGeekPage = lazy(() => import("./pages/platforms/AreaGeekPage"));

// Lazy loading para Xbox4 (única versão mantida)
const XboxPage4 = lazy(() => import("./pages/platforms/XboxPage4"));

// Lazy loading para admin
const AdminPanel = lazy(() => import("@/components/Admin/AdminPanel").then(module => ({ default: module.AdminPanel })));
const Xbox4AdminPage = lazy(() => import("./components/Admin/Xbox4AdminPage"));
const SpecialSectionCarouselPage = lazy(() => import("./pages/SpecialSectionCarouselPage"));
const PlatformPage = lazy(() => import("./components/PlatformPage"));

// Lazy loading para páginas de produto
const ProductPageSKU = lazy(() => import("./pages/ProductPageSKU"));
const TestProduct = lazy(() => import("./pages/TestProduct"));

// Lazy loading para páginas de cliente
const ClientArea = lazy(() => import("./pages/ClientArea"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const MeusCoins = lazy(() => import("./pages/MeusCoins"));
// Import direto para páginas críticas de auth
import ConfirmarConta from "./pages/ConfirmarConta";
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AdminAutoLogin = lazy(() => import("./pages/AdminAutoLogin").then(module => ({ default: module.AdminAutoLogin })));

// Lazy loading para páginas de UTI Coins
const CoinsShop = lazy(() => import("./pages/CoinsShop"));
const CoinsHistory = lazy(() => import("./pages/CoinsHistory"));

// Otimizar QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading component otimizado
const PageLoader = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
));
PageLoader.displayName = 'PageLoader';

// Protected Route Component otimizado
const ProtectedAdminRoute = React.memo(({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});
ProtectedAdminRoute.displayName = 'ProtectedAdminRoute';

const App = () => {
  // Hook para prevenir layout shift globalmente
  usePreventLayoutShift();
  
  // Setup de interceptação de erros 404
  React.useEffect(() => {
    setupErrorInterception();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
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
                             <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes - Index sem lazy loading por ser crítica */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Product Page Routes - MUST come before dynamic routes */}
                  <Route path="/produto/:id" element={<ProductPageSKU />} />
                  <Route path="/teste-produto/:id" element={<TestProduct />} />

                   {/* Client Area Routes */}
                  <Route path="/area-cliente" element={<ClientArea />} />
                  <Route path="/lista-desejos" element={<WishlistPage />} />
                  <Route path="/meus-coins" element={<MeusCoins />} />
                  
                  {/* Email Confirmation Route */}
                  <Route path="/confirmar-conta/:codigo" element={<ConfirmarConta />} />
                  
                  {/* Registration Route */}
                  <Route path="/cadastro" element={<RegisterPage />} />
                  
                  {/* UTI Coins Routes */}
                  <Route path="/coins/loja" element={<CoinsShop />} />
                  <Route path="/coins/historico" element={<CoinsHistory />} />

                  {/* Admin Auto Login Route - MUST come before admin routes */}
                  <Route path="/admin-login/:token" element={<AdminAutoLogin />} />

                  {/* Admin Routes - Protected - MUST come before dynamic routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedAdminRoute>
                        <ProductProvider>
                          <AdminPanel /> 
                        </ProductProvider>
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route 
                    path="/admin/xbox4" 
                    element={
                      <ProtectedAdminRoute>
                        <Xbox4AdminPage /> 
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* Special routes - MUST come before dynamic routes */}
                  <Route path="/busca" element={<SearchResults />} />
                  <Route path="/secao/:sectionKey" element={<SectionPage />} />
                  <Route path="/categoria/:category" element={<CategoryPage />} />
                  
                  {/* Dynamic Carousel Page Route */}
                  <Route 
                    path="/secao-especial/:sectionId/carrossel/:carouselIndex" 
                    element={<SpecialSectionCarouselPage />} 
                  />
                  
                  {/* Páginas de plataforma específicas - MUST come before dynamic routes */}
                  <Route path="/xbox4" element={<XboxPage4 />} />
                  <Route path="/playstation" element={<PlayStationPageProfessionalV5 />} />
                  <Route path="/playstation-v2" element={<PlayStationPageProfessionalV2 />} />
                  <Route path="/playstation-v3" element={<PlayStationPageProfessionalV3 />} />
                  <Route path="/playstation-v4" element={<PlayStationPageProfessionalV4 />} />
                  <Route path="/nintendo" element={<NintendoPage />} />
                  <Route path="/pc-gaming" element={<PCGamingPage />} />
                  <Route path="/retro-gaming" element={<RetroGamingPage />} />
                  <Route path="/area-geek" element={<AreaGeekPage />} />

                  {/* Prime Pages Route - MUST come before dynamic routes */}
                  <Route path="/prime/:slug" element={<PrimePage />} />

                  {/* Dynamic Page Route - MUST be last before catch-all */}
                  <Route 
                    path="/:slug" 
                    element={<PlatformPage slug={window.location.pathname.substring(1)} />} 
                  />

                  {/* Catch-all Not Found Route - MUST be absolute last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                            </Suspense>
                          </ScrollRestorationProvider>
                        </GlobalNavigationProvider>
                      </AppWithPreloader>
                    </BrowserRouter>
                  </TooltipProvider>
                </LoadingProvider>
              </ProductProviderOptimized>
            </CartProvider>
          </UTICoinsProvider>
        </SecurityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
