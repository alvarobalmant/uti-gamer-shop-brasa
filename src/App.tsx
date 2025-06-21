
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import UTIPro from "./pages/UTIPro";
import ScrollRestorationProvider from "./components/ScrollRestorationProvider";

// Importações para as novas páginas de categoria específicas
import XboxPage from "./pages/platforms/XboxPage";
import PlayStationPage from "./pages/platforms/PlayStationPage";
import NintendoPage from "./pages/platforms/NintendoPage";
import PCGamingPage from "./pages/platforms/PCGamingPage";
import RetroGamingPage from "./pages/platforms/RetroGamingPage";
import AreaGeekPage from "./pages/platforms/AreaGeekPage";

// Importações para as versões incrementais da página Xbox
import XboxPage3 from "./pages/platforms/XboxPage3";
import XboxPage4 from "./pages/platforms/XboxPage4";
import XboxPage5 from "./pages/platforms/XboxPage5";
import XboxPage6 from "./pages/platforms/XboxPage6";
import Xbox4AdminPage from "./components/Admin/Xbox4AdminPage"; // Import the new Xbox4AdminPage

// Import the main Admin Panel component which now includes all tabs
import { AdminPanel } from "@/components/Admin/AdminPanel"; 

// Import the new dynamic carousel page
import SpecialSectionCarouselPage from "./pages/SpecialSectionCarouselPage";

// Import the dynamic platform page component
import PlatformPage from "./components/PlatformPage";

const queryClient = new QueryClient();

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Verificando autenticação...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render the children (AdminPanel in this case) if authenticated and admin
  return <>{children}</>; 
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollRestorationProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/busca" element={<SearchResults />} />
                <Route path="/categoria/:category" element={<CategoryPage />} />
                
                {/* Novas rotas para páginas de plataforma específicas */}
                <Route path="/xbox" element={<XboxPage />} />
                <Route path="/xbox3" element={<XboxPage3 />} />
                <Route path="/xbox4" element={<XboxPage4 />} />
                <Route path="/xbox5" element={<XboxPage5 />} />
                <Route path="/xbox6" element={<XboxPage6 />} />
                <Route path="/playstation" element={<PlayStationPage />} />
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

                {/* Admin Route - Protected */}
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

                {/* Dynamic Page Route - This will catch any slug that matches a dynamic page */}
                <Route 
                  path="/:slug" 
                  element={<PlatformPage slug={window.location.pathname.substring(1)} />} 
                />

                {/* Catch-all Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ScrollRestorationProvider>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
