
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import ScrollRestorationProvider from './components/ScrollRestorationProvider';

// Pages
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import Xbox4AdminPage from '@/pages/Xbox4AdminPage';
import ProductPage from '@/pages/ProductPage';
import SearchResults from '@/pages/SearchResults';
import CategoryPage from '@/pages/CategoryPage';
import NotFound from '@/pages/NotFound';
import UTIPro from '@/pages/UTIPro';
import TestPlatformPage from '@/pages/TestPlatformPage';
import SpecialSectionCarouselPage from '@/pages/SpecialSectionCarouselPage';

// Platform Pages
import PlatformPage from '@/components/PlatformPage';
import PlayStationPage from '@/pages/platforms/PlayStationPage';
import XboxPage from '@/pages/platforms/XboxPage';
import XboxPage3 from '@/pages/platforms/XboxPage3';
import XboxPage4 from '@/pages/platforms/XboxPage4';
import XboxPage5 from '@/pages/platforms/XboxPage5';
import XboxPage6 from '@/pages/platforms/XboxPage6';
import NintendoPage from '@/pages/platforms/NintendoPage';
import PCGamingPage from '@/pages/platforms/PCGamingPage';
import RetroGamingPage from '@/pages/platforms/RetroGamingPage';
import AreaGeekPage from '@/pages/platforms/AreaGeekPage';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <ScrollRestorationProvider>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/xbox4" element={<Xbox4AdminPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/uti-pro" element={<UTIPro />} />
                <Route path="/test-platform" element={<TestPlatformPage />} />
                <Route path="/special-section-carousel/:sectionId" element={<SpecialSectionCarouselPage />} />
                
                {/* Platform Pages */}
                <Route path="/playstation" element={<PlayStationPage />} />
                <Route path="/xbox" element={<XboxPage />} />
                <Route path="/xbox3" element={<XboxPage3 />} />
                <Route path="/xbox4" element={<XboxPage4 />} />
                <Route path="/xbox5" element={<XboxPage5 />} />
                <Route path="/xbox6" element={<XboxPage6 />} />
                <Route path="/nintendo" element={<NintendoPage />} />
                <Route path="/pc-gaming" element={<PCGamingPage />} />
                <Route path="/retro-gaming" element={<RetroGamingPage />} />
                <Route path="/area-geek" element={<AreaGeekPage />} />
                
                {/* Dynamic Platform Pages */}
                <Route path="/platform/:slug" element={<PlatformPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </ScrollRestorationProvider>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
