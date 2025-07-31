import React from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Importar componentes especializados da MainContent
import ProductGalleryEnhanced from '../MainContent/ProductGalleryEnhanced';
import RelatedProductsCarousel from '../MainContent/RelatedProductsCarousel';
import ProductSpecificationsTable from '../MainContent/ProductSpecificationsTable';
import ProductDescriptionExpandable from '../MainContent/ProductDescriptionExpandable';
import ProductFAQSection from '../MainContent/ProductFAQSection';

interface ProductMainContentProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  className?: string;
}

const ProductMainContent: React.FC<ProductMainContentProps> = ({
  product,
  skuNavigation,
  className
}) => {
  const { addToCart, sendToWhatsApp } = useCart();

  const handleAddToCart = () => {
    // Usar a funcionalidade real do carrinho
    addToCart(product);
    console.log('Produto adicionado ao carrinho:', product.name);
  };

  const handleBuyNow = () => {
    // Adicionar ao carrinho e abrir WhatsApp para finalização
    addToCart(product);
    
    // Pequeno delay para garantir que o item foi adicionado ao carrinho
    setTimeout(() => {
      sendToWhatsApp();
    }, 100);
    
    console.log('Compra imediata via WhatsApp:', product.name);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* 1. Galeria de Imagens - Destaque Principal */}
      <ProductGalleryEnhanced product={product} />

      {/* 2. Produtos Relacionados */}
      <RelatedProductsCarousel 
        currentProduct={product}
        // relatedProducts={[]} // Pode ser passado via props quando disponível
      />

      {/* 3. Especificações Técnicas */}
      <ProductSpecificationsTable product={product} />

      {/* 4. Descrição Expandível */}
      <ProductDescriptionExpandable product={product} />

      {/* 5. Perguntas Frequentes */}
      <ProductFAQSection product={product} />

      {/* 6. Seção Final - Produtos Relacionados Adicional */}
      <div className="border-t border-gray-200 pt-8">
        <RelatedProductsCarousel 
          currentProduct={product}
          // relatedProducts={[]} // Segunda seção com produtos diferentes
        />
      </div>

      {/* 7. Call-to-Action Final - Com Funcionalidade Real */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-8 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <h4 className="text-2xl font-bold text-slate-900 mb-3">
            Gostou deste produto?
          </h4>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            Adicione ao carrinho agora e aproveite nossas condições especiais!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button 
              onClick={handleAddToCart}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
            
            <Button 
              onClick={handleBuyNow}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Comprar pelo WhatsApp
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Frete grátis</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Garantia</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>UTI Coins</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Suporte</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              💬 Finalizamos todas as vendas pelo WhatsApp para melhor atendimento!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMainContent;

