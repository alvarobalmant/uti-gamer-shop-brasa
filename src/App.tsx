import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
// import Admin from "./pages/Admin"; // Replace with specific admin routes
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import UTIPro from "./pages/UTIPro";

// Import Admin components
import AdminLayout from "@/components/Admin/AdminLayout";
import AdminSections from "./pages/Admin/AdminSections";
// Import a placeholder Admin Dashboard if needed
// import AdminDashboard from "./pages/Admin/AdminDashboard";

const queryClient = new QueryClient();

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    // Optional: Add a loading spinner or skeleton screen
    return <div>Verificando autenticação...</div>;
  }

  if (!user || !isAdmin) {
    // Redirect to home or login page if not an authenticated admin
    return <Navigate to="/" replace />;
  }

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
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/busca" element={<SearchResults />} />
              <Route path="/categoria/:category" element={<CategoryPage />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/uti-pro" element={<UTIPro />} />

              {/* Admin Routes - Protected */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                {/* Default admin route (e.g., redirect to sections or show dashboard) */}
                <Route index element={<Navigate to="sections" replace />} /> 
                {/* <Route index element={<AdminDashboard />} /> */}
                <Route path="sections" element={<AdminSections />} />
                {/* Add other admin routes here */}
              </Route>

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

