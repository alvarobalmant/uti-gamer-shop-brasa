import React, { useState, useRef } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/utils';
import FavoriteButton from '@/components/FavoriteButton';

interface RelatedProductsCarouselProps {
  currentProduct: Product;
  relatedProducts?: Product[];
  className?: string;
}

const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({
  currentProduct,
  relatedProducts = [],
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mock de produtos relacionados se não fornecidos
  const mockRelatedProducts: Product[] = [
    {
      id: '1',
      name: 'Horizon Forbidden West - PlayStation 5',
      price: 299.99,
      list_price: 349.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
      category: 'games',
      stock: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'FIFA 25 - PlayStation 5',
      price: 259.99,
      list_price: 299.99,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
      category: 'games',
      stock: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Spider-Man 2 - PlayStation 5',
      price: 279.99,
      list_price: 329.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      category: 'games',
      stock: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'God of War Ragnarök - PlayStation 5',
      price: 249.99,
      list_price: 299.99,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
      category: 'games',
      stock: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'The Last of Us Part I - PlayStation 5',
      price: 199.99,
      list_price: 249.99,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
      category: 'games',
      stock: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Ratchet & Clank: Rift Apart - PlayStation 5',
      price: 179.99,
      list_price: 229.99,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      category: 'games',
      stock: 25,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const products = relatedProducts.length > 0 ? relatedProducts : mockRelatedProducts;
  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const scrollLeft = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const scrollRight = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const handleProductClick = (product: Product) => {
    window.location.href = `/produto/${product.id}`;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Título */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Produtos Relacionados
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            disabled={currentIndex >= maxIndex}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {products.map((product, index) => {
            const discountPercentage = product.list_price 
              ? Math.round(((product.list_price - product.price) / product.list_price) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-1/4 group cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-red-300">
                  {/* Imagem do Produto */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {discountPercentage > 0 && (
                        <Badge className="bg-red-600 text-white font-bold text-xs">
                          -{discountPercentage}%
                        </Badge>
                      )}
                      {product.stock <= 5 && (
                        <Badge className="bg-orange-500 text-white font-bold text-xs">
                          Últimas unidades
                        </Badge>
                      )}
                    </div>

                    {/* Botão Favorito */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FavoriteButton 
                        productId={product.id} 
                        size="sm"
                      />
                    </div>

                    {/* Overlay de Hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  {/* Informações do Produto */}
                  <div className="p-4 space-y-3">
                    {/* Nome */}
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h4>

                    {/* Rating Mock */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">(4.2)</span>
                    </div>

                    {/* Preços */}
                    <div className="space-y-1">
                      {product.list_price && product.list_price > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(product.list_price)}
                        </div>
                      )}
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-xs text-gray-600">
                        12x de {formatPrice(product.price / 12)} sem juros
                      </div>
                    </div>

                    {/* UTI Coins */}
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">C</span>
                      </div>
                      <span>+{Math.floor(product.price * 0.02)} coins</span>
                    </div>

                    {/* Botão de Ação */}
                    <Button
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Adicionar ao carrinho
                      }}
                    >
                      Adicionar ao carrinho
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-red-600" : "bg-gray-300"
            )}
          />
        ))}
      </div>

      {/* Link Ver Mais */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50"
        >
          Ver todos os produtos similares
        </Button>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-800 mb-2">💡 Dica da UTI</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• Produtos relacionados são selecionados com base na sua navegação</div>
          <div>• Combine jogos para ganhar mais UTI Coins</div>
          <div>• Frete grátis para compras acima de R$ 99</div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsCarousel;

