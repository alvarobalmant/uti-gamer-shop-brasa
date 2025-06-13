
import React, { useState } from 'react';
import { Page, PageLayoutItem } from '@/hooks/usePages';
import { Product } from '@/hooks/useProducts';
import PlatformSectionRenderer from './PlatformSectionRenderer';
import ProductModal from '@/components/ProductModal';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
<<<<<<< HEAD
=======
import { cn } from '@/lib/utils';
>>>>>>> ffa5ead17058abb361081e02332d31eceaad6320

interface PlatformPageContentProps {
  page: Page;
  layout: PageLayoutItem[];
  products: Product[];
  onAddToCart: (product: Product) => void;
  isModalOpen: boolean;
  selectedProductId: string | null;
  setIsModalOpen: (open: boolean) => void;
  handleProductCardClick: (productId: string) => void;
}

const PlatformPageContent: React.FC<PlatformPageContentProps> = ({
  page,
  layout,
  products,
  onAddToCart,
  isModalOpen,
  selectedProductId,
  setIsModalOpen,
  handleProductCardClick
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleCartOpen = () => {
    console.log('[PlatformPageContent] Cart opened');
    setIsCartOpen(true);
  };

  const handleAuthOpen = () => {
    console.log('[PlatformPageContent] Auth modal opened');
    setIsAuthOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleAuthClose = () => {
    setIsAuthOpen(false);
  };

  // Find the selected product by ID
  const selectedProduct = selectedProductId 
    ? products.find(product => product.id === selectedProductId) || null 
    : null;

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-black">
=======
    <div className="min-h-screen bg-black overflow-x-hidden">
>>>>>>> ffa5ead17058abb361081e02332d31eceaad6320
      <ProfessionalHeader 
        onCartOpen={handleCartOpen}
        onAuthOpen={handleAuthOpen}
      />

      <main className="pt-4">
        {layout.map((section) => (
          <PlatformSectionRenderer
            key={section.id}
            section={section}
            products={products}
            onAddToCart={onAddToCart}
            onProductClick={handleProductCardClick}
          />
        ))}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

<<<<<<< HEAD
      {/* Cart Modal - You may need to implement this component */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Carrinho de Compras</h2>
            <p className="text-gray-600 mb-4">Funcionalidade do carrinho será implementada.</p>
            <button 
              onClick={handleCartClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Fechar
            </button>
=======
      {/* Cart Modal - Mobile optimized */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={cn(
            "bg-white rounded-xl w-full mx-4",
            "max-w-md", // Consistent max-width
            "max-h-[90vh] overflow-y-auto", // Mobile: prevent overflow
            "shadow-2xl" // Enhanced shadow
          )}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Carrinho de Compras</h2>
              <p className="text-gray-600 mb-6 text-base">Funcionalidade do carrinho será implementada.</p>
              <button 
                onClick={handleCartClose}
                className={cn(
                  "bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full",
                  "min-h-[48px] px-6 py-3", // Better touch area
                  "transition-all duration-150 active:scale-95",
                  "font-medium text-base" // Better typography
                )}
              >
                Fechar
              </button>
            </div>
>>>>>>> ffa5ead17058abb361081e02332d31eceaad6320
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Auth Modal - You may need to implement this component */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Login / Cadastro</h2>
            <p className="text-gray-600 mb-4">Funcionalidade de autenticação será implementada.</p>
            <button 
              onClick={handleAuthClose}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Fechar
            </button>
=======
      {/* Auth Modal - Mobile optimized */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={cn(
            "bg-white rounded-xl w-full mx-4",
            "max-w-md", // Consistent max-width
            "max-h-[90vh] overflow-y-auto", // Mobile: prevent overflow
            "shadow-2xl" // Enhanced shadow
          )}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Login / Cadastro</h2>
              <p className="text-gray-600 mb-6 text-base">Funcionalidade de autenticação será implementada.</p>
              <button 
                onClick={handleAuthClose}
                className={cn(
                  "bg-green-500 text-white rounded-lg hover:bg-green-600 w-full",
                  "min-h-[48px] px-6 py-3", // Better touch area
                  "transition-all duration-150 active:scale-95",
                  "font-medium text-base" // Better typography
                )}
              >
                Fechar
              </button>
            </div>
>>>>>>> ffa5ead17058abb361081e02332d31eceaad6320
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformPageContent;
