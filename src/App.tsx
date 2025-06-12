<<<<<<< HEAD

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
=======
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './contexts/CartContext';
import ScrollRestorationProvider from './components/ScrollRestorationProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from './pages/Index';
import Admin from './pages/Admin';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import UTIPro from './pages/UTIPro';
import TestPlatformPage from './pages/TestPlatformPage';
import SpecialSectionCarouselPage from './pages/SpecialSectionCarouselPage';
import CustomPlatformPage from './components/Platform/CustomPlatformPage';
import { Toaster } from './components/ui/toaster';
import './App.css';

<<<<<<< HEAD
// Importações para as versões incrementais da página Xbox
import XboxPage3 from "./pages/platforms/XboxPage3";
import XboxPage4 from "./pages/platforms/XboxPage4";
import XboxPage5 from "./pages/platforms/XboxPage5";
import XboxPage6 from "./pages/platforms/XboxPage6";

// Import the main Admin Panel component which now includes all tabs
import { AdminPanel } from "@/components/Admin/AdminPanel"; 
=======
// Import platform pages
import NintendoPage from './pages/platforms/NintendoPage';
import PlayStationPage from './pages/platforms/PlayStationPage';
import XboxPage from './pages/platforms/XboxPage';
import PCGamingPage from './pages/platforms/PCGamingPage';
import RetroGamingPage from './pages/platforms/RetroGamingPage';
import AreaGeekPage from './pages/platforms/AreaGeekPage';
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

<<<<<<< HEAD
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
=======
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <ScrollRestorationProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/produto/:id" element={<ProductPage />} />
                  <Route path="/categoria/:category" element={<CategoryPage />} />
                  <Route path="/busca" element={<SearchResults />} />
                  <Route path="/uti-pro" element={<UTIPro />} />
                  <Route path="/test-platform" element={<TestPlatformPage />} />
                  <Route path="/secao/:sectionId" element={<SpecialSectionCarouselPage />} />
                  
                  {/* Platform Pages */}
                  <Route path="/nintendo" element={<NintendoPage />} />
                  <Route path="/playstation" element={<PlayStationPage />} />
                  <Route path="/xbox" element={<XboxPage />} />
                  <Route path="/pc-gaming" element={<PCGamingPage />} />
                  <Route path="/retro-gaming" element={<RetroGamingPage />} />
                  <Route path="/area-geek" element={<AreaGeekPage />} />
                  
                  {/* Dynamic Platform Pages */}
                  <Route path="/xbox3" element={<CustomPlatformPage pageSlug="xbox3" />} />
                  <Route path="/xbox4" element={<CustomPlatformPage pageSlug="xbox4" />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </ScrollRestorationProvider>
        </Router>
>>>>>>> 9c7e4654651ff7d7c107d8331a3addc477ed799b
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
