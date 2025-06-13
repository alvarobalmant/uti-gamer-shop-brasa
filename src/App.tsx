
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import XboxPage6 from '@/pages/platforms/XboxPage6';
import { AdminPanel } from '@/components/Admin/AdminPanel';
import ProductModal from '@/components/ProductModal';
import { LoginPage } from '@/components/Auth/LoginPage';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import custom mobile styles
import './styles/mobile-xbox.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/xbox4" element={<XboxPage6 />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/login" element={<LoginPage />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
