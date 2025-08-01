import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/contexts/CartContext';
import { UTICoinsProvider } from '@/contexts/UTICoinsContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from './pages/Index';
import ProductPageSKU from './pages/ProductPageSKU';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <UTICoinsProvider>
            <CartProvider>
              <ProductProvider>
                <Router>
                <div className="min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/produto/:id" element={<ProductPageSKU />} />
                  </Routes>
                  <Toaster />
                </div>
                </Router>
              </ProductProvider>
            </CartProvider>
          </UTICoinsProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;