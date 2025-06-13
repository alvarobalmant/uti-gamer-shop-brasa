
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import XboxPage6 from '@/pages/platforms/XboxPage6';
import AdminPanel from '@/components/Admin/AdminPanel';
import ProductModal from '@/components/ProductModal';
import LoginPage from '@/components/Auth/LoginPage';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import custom mobile styles
import './styles/mobile-xbox.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/xbox4" element={<XboxPage6 />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
