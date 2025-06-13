
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

// Import platform pages
import NintendoPage from './pages/platforms/NintendoPage';
import PlayStationPage from './pages/platforms/PlayStationPage';
import XboxPage from './pages/platforms/XboxPage';
import PCGamingPage from './pages/platforms/PCGamingPage';
import RetroGamingPage from './pages/platforms/RetroGamingPage';
import AreaGeekPage from './pages/platforms/AreaGeekPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
