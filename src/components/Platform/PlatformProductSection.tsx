import React from 'react';
import { ProductShowcase, PlatformTheme } from '@/types/platformPages';
import { Product } from '@/hooks/useProducts';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
=======
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244

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
<<<<<<< HEAD
  const getGridClasses = () => {
    const columns = config.columns || 4;
    const gridMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    };
    return gridMap[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: theme.backgroundColor === '#FFFFFF' ? '#FAFAFA' : 'rgba(255, 255, 255, 0.05)',
      borderColor: theme.accentColor,
      borderRadius: theme.borderRadius,
    };

=======
  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: theme.backgroundColor === '#FFFFFF' ? '#FAFAFA' : 'rgba(255, 255, 255, 0.05)',
      borderColor: theme.accentColor,
      borderRadius: theme.borderRadius,
    };

>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
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

<<<<<<< HEAD
  const getButtonStyles = () => {
    const baseStyles = {
      backgroundColor: theme.primaryColor,
      color: theme.textColor,
      borderRadius: theme.borderRadius,
    };

    switch (theme.brandElements?.buttonStyle) {
      case 'rounded':
        return { ...baseStyles, borderRadius: '8px' };
      case 'sharp':
        return { ...baseStyles, borderRadius: '4px' };
      case 'pill':
        return { ...baseStyles, borderRadius: '9999px' };
      default:
        return baseStyles;
    }
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

<<<<<<< HEAD
  const renderProductCard = (product: Product) => (
    <Card 
      key={product.id}
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
      style={getCardStyles()}
      onClick={() => onProductClick(product.id)}
    >
      <CardContent className="p-0">
<<<<<<< HEAD
        {/* Imagem do Produto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
=======
        {/* Imagem do produto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || '/placeholder-product.jpg'}
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Badges */}
<<<<<<< HEAD
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge 
                className="text-xs font-semibold"
                style={{
                  backgroundColor: theme.accentColor,
                  color: theme.backgroundColor,
                }}
              >
                NOVO
              </Badge>
            )}
            {product.isOnSale && (
              <Badge 
                className="text-xs font-semibold"
                style={{
                  backgroundColor: '#E60012',
                  color: '#FFFFFF',
                }}
              >
                OFERTA
              </Badge>
            )}
            {product.isFeatured && (
              <Badge 
                className="text-xs font-semibold"
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.textColor,
                }}
<<<<<<< HEAD
              >
                DESTAQUE
              </Badge>
            )}
          </div>

          {/* Ações rápidas */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: theme.accentColor,
              }}
            >
              <Heart className="h-4 w-4" style={{ color: theme.accentColor }} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: theme.accentColor,
              }}
            >
              <Eye className="h-4 w-4" style={{ color: theme.accentColor }} />
            </Button>
          </div>

          {/* Overlay de desconto */}
          {product.isOnSale && product.originalPrice && (
            <div 
              className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-bold"
              style={{
                backgroundColor: '#E60012',
                color: '#FFFFFF',
              }}
            >
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="p-4">
          <h3 
            className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]"
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
            style={{ color: theme.textColor }}
          >
            {product.name}
          </h3>

<<<<<<< HEAD
          {/* Avaliação */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!) 
                        ? 'fill-current' 
                        : 'fill-gray-300'
                    }`}
                    style={{ 
                      color: i < Math.floor(product.rating!) 
                        ? theme.accentColor 
                        : '#D1D5DB' 
                    }}
                  />
                ))}
              </div>
              <span 
                className="text-xs"
                style={{ color: theme.textColor, opacity: 0.7 }}
              >
                ({product.rating})
              </span>
            </div>
          )}

          {/* Preços */}
          <div className="mb-3">
            {config.showPrices && (
              <div className="flex items-center gap-2">
                <span 
                  className="font-bold text-lg"
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
                  style={{ color: theme.primaryColor }}
                >
                  {formatPrice(product.price)}
                </span>
<<<<<<< HEAD
                {product.originalPrice && product.originalPrice > product.price && (
                  <span 
                    className="text-sm line-through"
                    style={{ color: theme.textColor, opacity: 0.5 }}
                  >
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            )}
            
            {product.proPrice && (
              <div className="flex items-center gap-1 mt-1">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    borderColor: theme.accentColor,
                    color: theme.accentColor,
                  }}
                >
                  PRO
                </Badge>
                <span 
                  className="text-sm font-semibold"
                  style={{ color: theme.accentColor }}
                >
                  {formatPrice(product.proPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Botão de Adicionar ao Carrinho */}
          <Button
            className="w-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={getButtonStyles()}
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
<<<<<<< HEAD
            Adicionar
=======
            Adicionar ao Carrinho
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
          </Button>
        </div>
      </CardContent>
    </Card>
  );

<<<<<<< HEAD
  const renderGridLayout = () => (
    <div className={`grid ${getGridClasses()} gap-6`}>
      {products.map(renderProductCard)}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <div key={product.id} className="flex-none w-64">
=======
  const renderCarousel = () => (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {products.map((product) => (
        <div key={product.id} className="flex-none w-80">
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
          {renderProductCard(product)}
        </div>
      ))}
    </div>
  );

<<<<<<< HEAD
  const renderFeaturedLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Produto principal */}
      {products[0] && (
        <div className="lg:col-span-2">
          <Card 
            className="group cursor-pointer overflow-hidden"
            style={getCardStyles()}
            onClick={() => onProductClick(products[0].id)}
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square">
                  <img
                    src={products[0].imageUrl}
                    alt={products[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge 
                    className="mb-4 w-fit"
                    style={{
                      backgroundColor: theme.accentColor,
                      color: theme.backgroundColor,
                    }}
                  >
                    PRODUTO EM DESTAQUE
                  </Badge>
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: theme.textColor }}
                  >
                    {products[0].name}
                  </h3>
                  <p 
                    className="text-lg mb-6 opacity-80"
                    style={{ color: theme.textColor }}
                  >
                    {products[0].description}
                  </p>
                  <div className="mb-6">
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: theme.primaryColor }}
                    >
                      {formatPrice(products[0].price)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-fit"
                    style={getButtonStyles()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(products[0]);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
=======
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
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
<<<<<<< HEAD
      )}
      
      {/* Produtos secundários */}
      <div className="space-y-6">
        {products.slice(1, 4).map(renderProductCard)}
      </div>
    </div>
  );
=======

        {/* Produtos menores */}
        <div className="space-y-6">
          {otherProducts.slice(0, 3).map(renderProductCard)}
        </div>
      </div>
    );
  };
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244

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

<<<<<<< HEAD
        {/* Renderizar layout baseado no tipo */}
        {config.type === 'carousel' && renderCarouselLayout()}
        {config.type === 'featured' && renderFeaturedLayout()}
        {(config.type === 'grid' || !config.type) && renderGridLayout()}
=======
        {/* Renderizar produtos baseado no tipo */}
        {config.type === 'carousel' && renderCarousel()}
        {config.type === 'grid' && renderGrid()}
        {config.type === 'featured' && renderFeatured()}
        {config.type === 'comparison' && renderGrid()}
>>>>>>> b625912f6929f41cd101c2aad275766eb7552244
      </div>
    </section>
  );
};

export default PlatformProductSection;

