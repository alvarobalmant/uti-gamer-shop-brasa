
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import ScrollRestorationProvider from "./components/ScrollRestorationProvider";

// Lazy loading para páginas menos críticas
const SearchResults = lazy(() => import("./pages/SearchResults"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UTIPro = lazy(() => import("./pages/UTIPro"));

// Lazy loading para páginas de plataforma
const XboxPage = lazy(() => import("./pages/platforms/XboxPage"));
const PlayStationPageProfessionalV2 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV2"));
const PlayStationPageProfessionalV3 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV3"));
const PlayStationPageProfessionalV4 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV4"));
const PlayStationPageProfessionalV5 = lazy(() => import("./pages/platforms/PlayStationPageProfessionalV5"));
const NintendoPage = lazy(() => import("./pages/platforms/NintendoPage"));
const PCGamingPage = lazy(() => import("./pages/platforms/PCGamingPage"));
const RetroGamingPage = lazy(() => import("./pages/platforms/RetroGamingPage"));
const AreaGeekPage = lazy(() => import("./pages/platforms/AreaGeekPage"));

// Lazy loading para versões Xbox
const XboxPage3 = lazy(() => import("./pages/platforms/XboxPage3"));
const XboxPage4 = lazy(() => import("./pages/platforms/XboxPage4"));
const XboxPage5 = lazy(() => import("./pages/platforms/XboxPage5"));
const XboxPage6 = lazy(() => import("./pages/platforms/XboxPage6"));

// Lazy loading para admin
const AdminPanel = lazy(() => import("@/components/Admin/AdminPanel").then(module => ({ default: module.AdminPanel })));
const Xbox4AdminPage = lazy(() => import("./components/Admin/Xbox4AdminPage"));
const SpecialSectionCarouselPage = lazy(() => import("./pages/SpecialSectionCarouselPage"));
const PlatformPage = lazy(() => import("./components/PlatformPage"));

// Otimizar QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading component otimizado
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollRestorationProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes - Index sem lazy loading por ser crítica */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Rotas com lazy loading */}
                  <Route path="/busca" element={<SearchResults />} />
                  <Route path="/categoria/:category" element={<CategoryPage />} />
                  
                  {/* Páginas de plataforma específicas */}
                  <Route path="/xbox" element={<XboxPage />} />
                  <Route path="/xbox3" element={<XboxPage3 />} />
                  <Route path="/xbox4" element={<XboxPage4 />} />
                  <Route path="/xbox5" element={<XboxPage5 />} />
                  <Route path="/xbox6" element={<XboxPage6 />} />
                  <Route path="/playstation" element={<PlayStationPageProfessionalV5 />} />
                  <Route path="/playstation-v2" element={<PlayStationPageProfessionalV2 />} />
                  <Route path="/playstation-v3" element={<PlayStationPageProfessionalV3 />} />
                  <Route path="/playstation-v4" element={<PlayStationPageProfessionalV4 />} />
                  <Route path="/nintendo" element={<NintendoPage />} />
                  <Route path="/pc-gaming" element={<PCGamingPage />} />
                  <Route path="/retro-gaming" element={<RetroGamingPage />} />
                  <Route path="/area-geek" element={<AreaGeekPage />} />
                  
                  <Route path="/uti-pro" element={<UTIPro />} />

                  {/* Dynamic Carousel Page Route */}
                  <Route 
                    path="/secao-especial/:sectionId/carrossel/:carouselIndex" 
                    element={<SpecialSectionCarouselPage />} 
                  />

                  {/* Admin Routes - Protected */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedAdminRoute>
                        <AdminPanel /> 
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

                  {/* Dynamic Page Route */}
                  <Route 
                    path="/:slug" 
                    element={<PlatformPage slug={window.location.pathname.substring(1)} />} 
                  />

                  {/* Catch-all Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ScrollRestorationProvider>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
