
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
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

// Import the main Admin Panel component which now includes all tabs
import { AdminPanel } from "@/components/Admin/AdminPanel"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Verificando autenticação...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; 
};

const App = () => {
  console.log('App: Starting application');
  
  return (
    <ErrorBoundary>
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
                    <Route path="/playstation" element={<PlayStationPage />} />
                    <Route path="/nintendo" element={<NintendoPage />} />
                    
                    <Route path="/uti-pro" element={<UTIPro />} />

                    {/* Admin Route - Protected */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminPanel /> 
                        </ProtectedAdminRoute>
                      }
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
    </ErrorBoundary>
  );
};

export default App;
