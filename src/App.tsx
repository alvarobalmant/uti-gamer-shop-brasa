
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
<<<<<<< HEAD
import { ProductProvider } from "@/contexts/ProductContext";
import Index from "./pages/Index";
import ScrollRestorationProvider from "./components/ScrollRestorationProvider";
=======
import ScrollRestorationProvider from "@/components/ScrollRestorationProvider";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/components/ProductPage/ProductPage";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import AdminDashboard from "@/pages/AdminDashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

<<<<<<< HEAD
// Loading component otimizado
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Protected Route Component otimizado
const ProtectedAdminRoute = React.memo(({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollRestorationProvider>
                <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes - Index sem lazy loading por ser crítica */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Rotas com lazy loading */}
                  <Route path="/busca" element={<SearchResults />} />
                  <Route path="/categoria/:category" element={<CategoryPage />} />
                  
                  {/* Páginas de plataforma específicas */}
                  <Route path="/xbox" element={<XboxPage />} />
                  <Route path="/xbox3" element={<XboxPage3 />} />
                  <Route path="/xbox4" element={<XboxPage4 />} />
                  <Route path="/xbox5" element={<XboxPage5 />} />
                  <Route path="/xbox6" element={<XboxPage6 />} />
                  <Route path="/playstation" element={<PlayStationPageProfessionalV5 />} />
                  <Route path="/playstation-v2" element={<PlayStationPageProfessionalV2 />} />
                  <Route path="/playstation-v3" element={<PlayStationPageProfessionalV3 />} />
                  <Route path="/playstation-v4" element={<PlayStationPageProfessionalV4 />} />
                  <Route path="/nintendo" element={<NintendoPage />} />
                  <Route path="/pc-gaming" element={<PCGamingPage />} />
                  <Route path="/retro-gaming" element={<RetroGamingPage />} />
                  <Route path="/area-geek" element={<AreaGeekPage />} />
                  
                  {/* Product Page Route */}
                  <Route path="/produto/:id" element={<ProductPage />} />

                  {/* Dynamic Carousel Page Route */}
                  <Route 
                    path="/secao-especial/:sectionId/carrossel/:carouselIndex" 
                    element={<SpecialSectionCarouselPage />} 
                  />

                  {/* Admin Routes - Protected */}
                  <Route 
                    path="/admin" 
=======
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollRestorationProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Rotas Protegidas (Requer Autenticação) */}
                  <Route
                    path="/profile"
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmationPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rotas de Admin (Requer Autenticação e Role de Admin) */}
                  <Route
                    path="/admin/*"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </ScrollRestorationProvider>
<<<<<<< HEAD
          </BrowserRouter>
        </TooltipProvider>
      </ProductProvider>
    </CartProvider>
  </AuthProvider>
</QueryClientProvider>
);
=======
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
>>>>>>> 26ecb2a9b6c09826417241be6011cb7921889d8b

export default App;
