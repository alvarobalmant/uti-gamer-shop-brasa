
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import Index from "./pages/Index";
import CartPage from "./pages/CartPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useScrollPosition();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/carrinho" element={<CartPage />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
