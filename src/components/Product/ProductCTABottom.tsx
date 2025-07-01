
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { ShoppingCart, MessageCircle, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCTABottomProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCTABottom: React.FC<ProductCTABottomProps> = ({ product, onAddToCart }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const message = `Olá! Quero comprar: ${product.name} - R$ ${product.price.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Resumo do Produto */}
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
            />
            <div>
              <h3 className="font-bold text-gray-900 truncate max-w-xs">
                {product.name}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-red-600">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-sm text-gray-500">
                  ou R$ {(product.price * 0.95).toFixed(2).replace('.', ',')} no PIX
                </span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={scrollToTop}
              className="hidden sm:flex"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Voltar ao Topo
            </Button>
            
            <Button
              variant="outline"
              onClick={handleWhatsApp}
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>

            <Button
              onClick={() => onAddToCart(product)}
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </div>

        {/* Urgência */}
        <div className="mt-3 text-center">
          <p className="text-sm text-red-600 font-medium">
            🔥 Oferta por tempo limitado • Apenas {Math.floor(Math.random() * 8) + 2} unidades restantes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCTABottom;
