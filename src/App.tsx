import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import ScrollRestoration
import { BrowserRouter, Routes, Route, Navigate, ScrollRestoration } from "react-router-dom"; 
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import UTIPro from "./pages/UTIPro";

// Import the main Admin Panel component which now includes all tabs
import { AdminPanel } from "@/components/Admin/AdminPanel"; 

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
            {/* Add ScrollRestoration here */}
            <ScrollRestoration /> 
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/busca" element={<SearchResults />} />
              <Route path="/categoria/:category" element={<CategoryPage />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/uti-pro" element={<UTIPro />} />

              {/* Admin Route - Protected */}
              {/* The AdminPanel component itself handles the different admin sections via Tabs */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    {/* Render the main AdminPanel component directly */}
                    <AdminPanel /> 
                  </ProtectedAdminRoute>
                }
              />
              {/* No need for nested routes here if AdminPanel uses Tabs for navigation */}

              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

