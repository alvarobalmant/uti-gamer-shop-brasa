import React from 'react';
import { SpecialSection } from '@/types/specialSections';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { cn } from "@/lib/utils";
import ProductCard from '@/components/ProductCard'; // Import the main ProductCard

interface SpecialSectionRendererProps {
  section: SpecialSection;
  onProductCardClick: (productId: string) => void; // Prop to handle product card clicks
}

const SpecialSectionRenderer: React.FC<SpecialSectionRendererProps> = ({ section, onProductCardClick }) => {
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();

  if (!section || !section.is_active) {
    return null;
  }

  if (!section.content_config) {
    console.warn(`[SpecialSectionRenderer] Section ${section.id} has no content_config.`);
    return (
      <div className="container mx-auto py-4">
        <p className="text-gray-500 text-center py-10">Esta seção especial ({section.title}) não possui configuração de conteúdo.</p>
      </div>
    );
  }

  const config = section.content_config as any;

  const getProductsByIds = (ids: string[] = []): Product[] => {
    if (!ids || ids.length === 0) return [];
    if (productsLoading || !products || !Array.isArray(products)) return [];
    return products.filter(product => product && ids.includes(product.id));
  };

  // --- Carousel Rendering Logic ---
  const renderCarousel = (carouselConfig: any, carouselKey: string) => {
    if (!carouselConfig?.title) return null;

    const productIds = carouselConfig.product_ids || [];
    const carouselProducts = getProductsByIds(productIds);
    const isLoading = productsLoading;

    return (
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-bold text-white">{carouselConfig.title}</h3>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`${carouselKey}-skel-${index}`} className="bg-white rounded-md overflow-hidden border border-gray-200">
                <Skeleton className="w-full aspect-square bg-gray-300" />
                <div className="p-2 sm:p-3">
                  <Skeleton className="h-3 w-3/4 mb-1 bg-gray-300" />
                  <Skeleton className="h-5 w-1/2 bg-gray-300" />
                </div>
              </div>
            ))
          ) : carouselProducts.length > 0 ? (
            carouselProducts.map(product => (
              <ProductCard 
                key={`${carouselKey}-${product.id}`} 
                product={product} 
                onAddToCart={() => addToCart(product)} 
                onCardClick={onProductCardClick} // Pass the click handler
              />
            ))
          ) : (
            <p className="text-gray-200 col-span-full text-center py-5">Nenhum produto encontrado para este carrossel.</p>
          )}
        </div>
      </div>
    );
  };
  // --- End Carousel Rendering Logic ---

  // Determine background style
  const sectionStyle: React.CSSProperties = {};
  if (section.background_type === 'image' && section.background_value) {
    sectionStyle.backgroundImage = `url(${section.background_value})`;
    sectionStyle.backgroundSize = 'cover'; // Always cover the section
    sectionStyle.backgroundPosition = section.background_image_position || 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else {
    sectionStyle.backgroundColor = section.background_value || '#003087'; // Default GameStop blue
  }

  return (
    <section aria-label={section.title} className="w-full">
      <div 
        style={sectionStyle} 
        className="container max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 rounded-lg my-4 md:my-6 overflow-hidden"
      >
        
        {/* Banner Principal */}
        {config.banner_principal?.image_url && (
          <div className="w-full mb-4 md:mb-6">
            <Link to={config.banner_principal.link_url || '#'}>
              <img 
                src={config.banner_principal.image_url} 
                alt="Banner Principal" 
                className="w-full h-auto rounded-md object-cover" 
                onError={(e) => (e.currentTarget.src = '/placeholder-banner.png')}
              />
            </Link>
          </div>
        )}

        {/* Banners Médios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          {config.banner_medio_1?.image_url && (
            <div className="relative overflow-hidden rounded-md group">
              <Link to={config.banner_medio_1.link_url || '#'}>
                <img 
                  src={config.banner_medio_1.image_url} 
                  alt={config.banner_medio_1.title || "Banner Médio 1"} 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = '/placeholder-banner.png')}
                />
                {(config.banner_medio_1.title || config.banner_medio_1.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    {config.banner_medio_1.title && <h3 className="text-md font-semibold text-white mb-0.5">{config.banner_medio_1.title}</h3>}
                    {config.banner_medio_1.subtitle && <p className="text-xs text-gray-100">{config.banner_medio_1.subtitle}</p>}
                  </div>
                )}
              </Link>
            </div>
          )}
          {config.banner_medio_2?.image_url && (
             <div className="relative overflow-hidden rounded-md group">
              <Link to={config.banner_medio_2.link_url || '#'}>
                <img 
                  src={config.banner_medio_2.image_url} 
                  alt={config.banner_medio_2.title || "Banner Médio 2"} 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = '/placeholder-banner.png')}
                />
                {(config.banner_medio_2.title || config.banner_medio_2.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    {config.banner_medio_2.title && <h3 className="text-md font-semibold text-white mb-0.5">{config.banner_medio_2.title}</h3>}
                    {config.banner_medio_2.subtitle && <p className="text-xs text-gray-100">{config.banner_medio_2.subtitle}</p>}
                  </div>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Banner Pequeno */}
        {config.banner_pequeno?.image_url && (
          <div className="w-full mb-6 md:mb-8">
            <Link to={config.banner_pequeno.link_url || '#'}>
              <img 
                src={config.banner_pequeno.image_url} 
                alt="Banner Promocional" 
                className="w-full h-auto rounded-md object-cover"
                onError={(e) => (e.currentTarget.src = '/placeholder-banner.png')}
              />
            </Link>
          </div>
        )}

        {/* Carrossel de Produtos 1 */}
        {renderCarousel(config.carrossel_1, 'carrossel_1')}

        {/* Carrossel de Produtos 2 */}
        {renderCarousel(config.carrossel_2, 'carrossel_2')}

      </div>
    </section>
  );
};

export default SpecialSectionRenderer;


