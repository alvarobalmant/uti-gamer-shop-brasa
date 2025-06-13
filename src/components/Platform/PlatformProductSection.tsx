
import React from 'react';
import { ProductShowcase, PlatformTheme } from '@/types/platformPages';
import { Product } from '@/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface PlatformProductSectionProps {
  config: ProductShowcase;
  theme: PlatformTheme;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
  className?: string;
}

const PlatformProductSection: React.FC<PlatformProductSectionProps> = ({
  config,
  theme,
  products,
  onAddToCart,
  onProductClick,
  className = ''
}) => {
  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: theme.backgroundColor === '#FFFFFF' ? '#FAFAFA' : 'rgba(255, 255, 255, 0.05)',
      borderColor: theme.accentColor,
      borderRadius: theme.borderRadius,
    };

    switch (theme.brandElements?.cardStyle) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: `0 8px 25px ${theme.shadowColor}`,
          border: 'none',
        };
      case 'flat':
        return {
          ...baseStyles,
          boxShadow: 'none',
          border: 'none',
        };
      case 'outlined':
        return {
          ...baseStyles,
          boxShadow: 'none',
          border: `2px solid ${theme.accentColor}`,
        };
      default:
        return baseStyles;
    }
  };

  const getGridColumns = () => {
    const columns = config.columns || 4;
    const columnMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    };
    return columnMap[columns as keyof typeof columnMap] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderProductBadges = (product: Product) => {
    const badges = [];
    
    // Check for new product based on tags
    const isNew = product.tags?.some(tag => tag.name.toLowerCase().includes('novo'));
    if (isNew && config.showBadges) {
      badges.push(
        <Badge 
          key="new"
          className="absolute top-2 left-2 text-xs font-semibold"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.textColor,
          }}
        >
          NOVO
        </Badge>
      );
    }

    // Check for sale product based on tags
    const isOnSale = product.tags?.some(tag => tag.name.toLowerCase().includes('oferta'));
    if (isOnSale && config.showBadges) {
      badges.push(
        <Badge 
          key="sale"
          className="absolute top-2 right-2 text-xs font-semibold"
          style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
          }}
        >
          OFERTA
        </Badge>
      );
    }

    // Check for featured product based on tags
    const isFeatured = product.tags?.some(tag => tag.name.toLowerCase().includes('destaque'));
    if (isFeatured && config.showBadges) {
      badges.push(
        <Badge 
          key="featured"
          className="absolute top-2 left-2 text-xs font-semibold"
          style={{
            backgroundColor: theme.accentColor,
            color: theme.textColor,
          }}
        >
          DESTAQUE
        </Badge>
      );
    }

    return badges;
  };

  const renderProductCard = (product: Product) => (
    <Card 
      key={product.id}
      className="group cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden"
      style={getCardStyles()}
      onClick={() => onProductClick(product.id)}
    >
      <CardContent className="p-0">
        {/* Imagem do produto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Badges */}
          {renderProductBadges(product)}

          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onProductClick(product.id);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.textColor,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="p-4">
          <h3 
            className="font-semibold text-lg mb-2 line-clamp-2"
            style={{ color: theme.textColor }}
          >
            {product.name}
          </h3>

          {config.cardStyle === 'detailed' && (
            <p 
              className="text-sm mb-3 line-clamp-2 opacity-70"
              style={{ color: theme.textColor }}
            >
              {product.description}
            </p>
          )}

          {/* Preço */}
          {config.showPrices && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="text-lg font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Preço UTI Pro */}
              {product.pro_price && (
                <div className="mt-1">
                  <span className="text-xs opacity-70" style={{ color: theme.textColor }}>
                    UTI Pro: 
                  </span>
                  <span 
                    className="text-sm font-semibold ml-1"
                    style={{ color: theme.accentColor }}
                  >
                    {formatPrice(product.pro_price)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Botão de adicionar ao carrinho */}
          <Button
            className="w-full transition-all duration-300"
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.textColor,
              borderRadius: theme.borderRadius,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCarousel = () => (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <div key={product.id} className="flex-none w-80">
          {renderProductCard(product)}
        </div>
      ))}
    </div>
  );

  const renderGrid = () => (
    <div className={`grid ${getGridColumns()} gap-6`}>
      {products.map(renderProductCard)}
    </div>
  );

  const renderFeatured = () => {
    const featuredProduct = products[0];
    const otherProducts = products.slice(1);

    if (!featuredProduct) return renderGrid();

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Produto em destaque */}
        <div className="lg:col-span-2">
          <Card 
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden h-full"
            style={getCardStyles()}
            onClick={() => onProductClick(featuredProduct.id)}
          >
            <CardContent className="p-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Imagem grande */}
                <div className="relative aspect-square md:aspect-auto overflow-hidden">
                  <img
                    src={featuredProduct.image || '/placeholder-product.jpg'}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {renderProductBadges(featuredProduct)}
                </div>

                {/* Informações detalhadas */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h3 
                      className="text-2xl font-bold mb-4"
                      style={{ color: theme.textColor }}
                    >
                      {featuredProduct.name}
                    </h3>
                    <p 
                      className="text-base mb-6 opacity-80"
                      style={{ color: theme.textColor }}
                    >
                      {featuredProduct.description}
                    </p>
                  </div>

                  {config.showPrices && (
                    <div className="mb-6">
                      <span 
                        className="text-3xl font-bold"
                        style={{ color: theme.primaryColor }}
                      >
                        {formatPrice(featuredProduct.price)}
                      </span>
                      {featuredProduct.pro_price && (
                        <div className="mt-2">
                          <span className="text-sm opacity-70" style={{ color: theme.textColor }}>
                            UTI Pro: 
                          </span>
                          <span 
                            className="text-lg font-semibold ml-2"
                            style={{ color: theme.accentColor }}
                          >
                            {formatPrice(featuredProduct.pro_price)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="text-lg px-8 py-4"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.textColor,
                      borderRadius: theme.borderRadius,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(featuredProduct);
                    }}
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produtos menores */}
        <div className="space-y-6">
          {otherProducts.slice(0, 3).map(renderProductCard)}
        </div>
      </div>
    );
  };

  return (
    <section 
      className={`py-16 ${className}`}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ 
              fontFamily: theme.headingFont || theme.fontFamily,
              color: theme.textColor,
            }}
          >
            {config.title}
          </h2>
          {config.subtitle && (
            <p 
              className="text-xl"
              style={{ color: theme.accentColor }}
            >
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Renderizar produtos baseado no tipo */}
        {config.type === 'carousel' && renderCarousel()}
        {config.type === 'grid' && renderGrid()}
        {config.type === 'featured' && renderFeatured()}
        {config.type === 'comparison' && renderGrid()}
      </div>
    </section>
  );
};

export default PlatformProductSection;
