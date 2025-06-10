
import React from 'react';
import { Page, PageLayoutItem } from '@/hooks/usePages';
import { Product } from '@/hooks/useProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import PlatformSectionRenderer from './PlatformSectionRenderer';

interface PlatformPageContentProps {
  page: Page;
  layout: PageLayoutItem[];
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  isModalOpen: boolean;
  selectedProductId: string | null;
  setIsModalOpen: (isOpen: boolean) => void;
  handleProductCardClick: (productId: string) => void;
}

// Main content component for platform pages
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
  // Apply page theme
  const pageStyle = {
    '--primary-color': page.theme.primaryColor,
    '--secondary-color': page.theme.secondaryColor,
    '--accent-color': page.theme.accentColor || page.theme.primaryColor,
  } as React.CSSProperties;

  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  return (
    <div style={pageStyle} className="platform-page min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Render sections in defined order */}
        {layout.length > 0 ? (
          layout.map(section => (
            <PlatformSectionRenderer
              key={section.id}
              section={section}
              page={page}
              products={products}
              onAddToCart={onAddToCart}
              onProductCardClick={handleProductCardClick}
            />
          ))
        ) : (
          <div className="container mx-auto py-16 text-center">
            <p className="text-muted-foreground">
              Esta página ainda não possui seções configuradas.
            </p>
          </div>
        )}
      </main>
      <Footer />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default PlatformPageContent;
