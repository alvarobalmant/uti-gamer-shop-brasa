import React from 'react';
import { SpecialSection, BannerRowConfig } from '@/types/specialSections';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpecialSectionRendererProps {
  section: SpecialSection;
  onProductCardClick: (productId: string) => void;
}

const SpecialSectionRenderer: React.FC<SpecialSectionRendererProps> = ({ section, onProductCardClick }) => {
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

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
                onCardClick={onProductCardClick}
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
  const layoutSettings = config.layout_settings || { 
    show_background: true, 
    carousel_display: 'both', 
    device_visibility: { mobile: true, tablet: true, desktop: true } 
  };
  const sectionStyle: React.CSSProperties = {};
  
  if (layoutSettings.show_background) {
    if (section.background_type === 'image' && section.background_value) {
      sectionStyle.backgroundImage = `url(${section.background_value})`;
      sectionStyle.backgroundSize = 'cover';
      sectionStyle.backgroundPosition = section.background_image_position || 'center';
      sectionStyle.backgroundRepeat = 'no-repeat';
    } else {
      sectionStyle.backgroundColor = section.background_value || '#003087';
    }
  }

  // Determine which carousels to show
  const shouldShowCarousel1 = layoutSettings.carousel_display === 'both' || layoutSettings.carousel_display === 'carousel1_only';
  const shouldShowCarousel2 = layoutSettings.carousel_display === 'both' || layoutSettings.carousel_display === 'carousel2_only';

  // Determine device visibility
  const deviceVisibility = layoutSettings.device_visibility || { mobile: true, tablet: true, desktop: true };
  
  // Check if section should be visible on current device
  const shouldShowOnCurrentDevice = () => {
    // Para mobile (até 768px)
    if (isMobile) {
      return deviceVisibility.mobile;
    }
    // Para tablet (768px - 1024px) e desktop (1024px+)
    // Consideramos tablet e desktop juntos por simplicidade
    else {
      return deviceVisibility.tablet || deviceVisibility.desktop;
    }
  };

  // Don't render if not visible on current device
  if (!shouldShowOnCurrentDevice()) {
    return null;
  }

  return (
    <section aria-label={section.title} className="w-full">
      <div 
        style={sectionStyle} 
        className={`container max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 ${layoutSettings.show_background ? 'rounded-lg' : ''} my-4 md:my-6 overflow-hidden`}
      >
        {/* Dynamic Banner Rows */}
        {config.banner_rows && config.banner_rows.map((row: BannerRowConfig, rowIndex: number) => {
          let gridClass = '';
          let customStyle: React.CSSProperties = {};

          if (row.layout === 'custom' && row.custom_sizes) {
            // Para layout customizado, usar flexbox com larguras e alturas específicas
            // Sempre centralizar horizontalmente
            return (
              <div key={row.row_id || rowIndex} className="flex justify-center items-start gap-3 md:gap-4 mb-4 md:mb-6">
                {row.banners.map((banner, bannerIndex) => (
                  <div 
                    key={bannerIndex} 
                    className="relative overflow-hidden rounded-md group"
                    style={{ 
                      width: `${row.custom_sizes?.[bannerIndex]?.width || 'auto'}${row.custom_sizes?.[bannerIndex]?.widthUnit || ''}`,
                      height: row.custom_sizes?.[bannerIndex]?.height || 'auto'
                    }}
                  >
                    {banner.image_url && (
                      <Link to={banner.link_url || '#'}>
                        <img 
                          src={banner.image_url} 
                          alt={banner.title || `Banner ${rowIndex + 1}-${bannerIndex + 1}`} 
                          className={`w-full h-full object-cover ${!isMobile && banner.enable_hover_animation ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
                          onError={(e) => (e.currentTarget.src = '/placeholder-banner.png')}
                        />
                        {(banner.title || banner.subtitle) && (
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                            {banner.title && <h3 className="text-md font-semibold text-white mb-0.5">{banner.title}</h3>}
                            {banner.subtitle && <p className="text-xs text-gray-100">{banner.subtitle}</p>}
                          </div>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            );
          } else {
            // Para layouts pré-definidos, usar grid
            switch (row.layout) {
              case '1_col_full':
                gridClass = 'grid-cols-1';
                break;
              case '2_col_half':
                gridClass = 'grid-cols-1 md:grid-cols-2';
                break;
              case '3_col_third':
                gridClass = 'grid-cols-1 md:grid-cols-3';
                break;
              case '4_col_quarter':
                gridClass = 'grid-cols-1 md:grid-cols-4';
                break;
              default:
                gridClass = 'grid-cols-1';
            }

            return (
              <div key={row.row_id || rowIndex} className={`grid ${gridClass} gap-3 md:gap-4 mb-4 md:mb-6`}>
                {row.banners.map((banner, bannerIndex) => (
                  <div key={bannerIndex} className="relative overflow-hidden rounded-md group">
                    {banner.image_url && (
                      <Link to={banner.link_url || '#'}>
                        <img 
                          src={banner.image_url} 
                        alt={banner.title || `Banner ${rowIndex + 1}-${bannerIndex + 1}`} 
                        className={`w-full h-auto object-cover ${!isMobile && banner.enable_hover_animation ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
                        onError={(e) => (e.currentTarget.src = '/placeholder-banner.png')}
                      />
                      {(banner.title || banner.subtitle) && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                          {banner.title && <h3 className="text-md font-semibold text-white mb-0.5">{banner.title}</h3>}
                          {banner.subtitle && <p className="text-xs text-gray-100">{banner.subtitle}</p>}
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            );
          }
        })}

        {/* Carrossel de Produtos 1 */}
        {shouldShowCarousel1 && renderCarousel(config.carrossel_1, 'carrossel_1')}

        {/* Carrossel de Produtos 2 */}
        {shouldShowCarousel2 && renderCarousel(config.carrossel_2, 'carrossel_2')}

      </div>
    </section>
  );
};

export default SpecialSectionRenderer;



