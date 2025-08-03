import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { SKUNavigation } from '@/hooks/useProducts/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Zap, Check, Star, Heart, Share2, ChevronLeft, ChevronRight, ZoomIn, Info, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import FavoriteButton from '@/components/FavoriteButton';

// Importar componentes especializados da MainContent
import ProductGalleryEnhanced from '../MainContent/ProductGalleryEnhanced';
import RelatedProductsCarousel from '../MainContent/RelatedProductsCarousel';
import ProductSpecificationsTable from '../MainContent/ProductSpecificationsTable';
import ProductDescriptionExpandable from '../MainContent/ProductDescriptionExpandable';
import ProductFAQSection from '../MainContent/ProductFAQSection';
import StorePickupBadge from '../MainContent/StorePickupBadge';

interface ProductMainContentProps {
  product: Product;
  skuNavigation?: SKUNavigation;
  layout?: 'gallery-vertical' | 'main-image' | 'product-info' | 'bottom-sections';
  className?: string;
}

const ProductMainContent: React.FC<ProductMainContentProps> = ({
  product,
  skuNavigation,
  layout = 'bottom-sections',
  className
}) => {
  const { addToCart, sendToWhatsApp } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Combinar imagem principal com imagens adicionais
  const allImages = [product.image, ...(product.additional_images || [])].filter(Boolean);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // COLUNA 1: Galeria Vertical
  if (layout === 'gallery-vertical') {
    return (
      <div className="space-y-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all block ${
              currentImageIndex === index
                ? 'border-red-600 ring-2 ring-red-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`${product.name} ${index + 1}`}
              className="w-full h-full object-contain bg-white"
            />
          </button>
        ))}
        
        {/* Indicador de mais imagens */}
        {allImages.length > 6 && (
          <div className="w-16 h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50">
            <span className="text-xs font-medium text-gray-600">
              +{allImages.length - 6}
            </span>
          </div>
        )}
      </div>
    );
  }

  // COLUNA 2: Imagem Principal
  if (layout === 'main-image') {
    return (
      <div className="space-y-4">
        {/* Imagem Principal */}
        <div className="relative group">
          <div className="aspect-square bg-white rounded-lg overflow-hidden relative">
            <img
              src={allImages[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-200 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            />
            
            {/* Zoom Overlay - Hover Effect como ML */}
            {isZoomed && (
              <div 
                className="absolute inset-0 bg-no-repeat pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  backgroundImage: `url(${allImages[currentImageIndex]})`,
                  backgroundSize: '200%',
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_featured && (
                <Badge className="bg-red-600 text-white font-bold">
                  DESTAQUE
                </Badge>
              )}
              {product.badge_visible && product.badge_text && (
                <Badge 
                  className="font-bold text-white"
                  style={{ backgroundColor: product.badge_color || '#DC2626' }}
                >
                  {product.badge_text}
                </Badge>
              )}
            </div>

            {/* Ícone de Zoom */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 rounded-full p-2">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails para Mobile */}
        {allImages.length > 1 && (
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? 'border-red-600 ring-2 ring-red-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-contain bg-white"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // COLUNA 3: Título, Preço, Avaliações, Condições, Plataformas
  if (layout === 'product-info') {
    return (
      <div className="space-y-6">
        {/* Retirada na Loja e Social Proof */}
        <div className="flex items-center justify-between">
          <StorePickupBadge />
          <div className="flex items-center gap-2">
            <FavoriteButton productId={product.id} size="sm" />
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>
        </div>

        {/* PREÇOS - ÚNICO E CORRETO */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-sm text-gray-500 line-through">
              R$ {(product.price * 1.2).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-3xl font-semibold text-gray-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <Badge className="bg-red-600 text-white">
              -12% OFF
            </Badge>
          </div>
          
          {/* Parcelamento */}
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros</p>
            <p>ou à vista no PIX com <span className="text-green-600 font-medium">5% desconto</span></p>
          </div>
        </div>

        {/* CONDIÇÕES - Novo/Usado/Digital */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Condição:
          </label>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Novo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Usado
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Digital
            </Button>
          </div>
        </div>

        {/* PLATAFORMAS */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Plataforma:
          </label>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              🎮 PlayStation
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            💡 Preços podem variar entre plataformas
          </p>
        </div>

        {/* Descrição básica do produto */}
        <div className="text-gray-600 mt-8">
          <p className="text-sm leading-relaxed">
            {product.description ? product.description.substring(0, 200) + '...' : 
             'Produto original, lacrado e com garantia. Entrega rápida e segura.'}
          </p>
        </div>

        {/* APENAS DESCRIÇÃO EXPANDÍVEL APÓS AVISO DE PREÇOS */}
        <div className="mt-8">
          <ProductDescriptionExpandable product={product} />
        </div>
      </div>
    );
  }


  // SEÇÕES INFERIORES (layout padrão) - Restaurar elementos removidos
  return (
    <div className={cn("space-y-8", className)}>
      {/* 1. Especificações Técnicas Dinâmicas */}
      <ProductSpecificationsTable product={product} />

      {/* 2. Perguntas Frequentes */}
      <ProductFAQSection product={product} />

      {/* 3. Informações Importantes */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
            <Info className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-800">Informações Importantes</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Especificações podem variar conforme atualizações do fabricante</li>
              <li>• Recursos online dependem de conexão com a internet</li>
              <li>• Algumas funcionalidades podem requerer assinatura de serviços</li>
              <li>• Verifique compatibilidade com sua versão do console</li>
              <li>• Garantia da UTI dos Games: conforme legislação vigente</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Comparação entre Plataformas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <span className="text-blue-600 text-lg">🎮</span>
          </div>
          <h4 className="text-lg font-semibold text-blue-900">Comparação entre Plataformas</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Recurso</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-600">PS5</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">PS4</th>
                <th className="text-center py-3 px-4 font-semibold text-green-600">Xbox Series X</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 text-blue-600 font-medium">Resolução 4K</td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-blue-600 font-medium">Ray Tracing</td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-blue-600 font-medium">Feedback Háptico</td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Produtos Relacionados */}
      <RelatedProductsCarousel 
        currentProduct={product}
      />

      {/* 6. Call-to-Action Final */}
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

