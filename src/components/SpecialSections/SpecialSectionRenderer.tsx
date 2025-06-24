
import React from 'react';
<<<<<<< HEAD
import { SpecialSection, BannerRowConfig, CarouselRowConfig } from '@/types/specialSections';
=======
import { SpecialSection } from '@/types/specialSections';
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { cn } from "@/lib/utils";
import ProductCard from '@/components/ProductCard';
<<<<<<< HEAD
import SpecialCarouselRow from './SpecialCarouselRow';
import { useIsMobile } from '@/hooks/use-mobile';
=======
import CarouselRowRenderer from './CarouselRowRenderer'; // NOVO: Import do componente de carrossel
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb

interface SpecialSectionRendererProps {
  section: SpecialSection;
  onProductCardClick: (productId: string) => void;
  reduceTopSpacing?: boolean;
}

const SpecialSectionRenderer: React.FC<SpecialSectionRendererProps> = React.memo(({ 
  section, 
  onProductCardClick,
  reduceTopSpacing = false 
}) => {
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
  
  // Log detalhado da ordem dos elementos (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development' && config.banner_rows && Array.isArray(config.banner_rows)) {
    console.log(`[SpecialSectionRenderer] Section "${section.title}" banner_rows order:`,
      config.banner_rows.map((row: any, index: number) => ({
        index,
        type: row.type,
        layout: row.layout,
        title: row.title,
        row_id: row.row_id
      }))
    );
  }

  const getProductsByIds = (ids: string[] = []): Product[] => {
    if (!ids || ids.length === 0) return [];
    if (productsLoading || !products || !Array.isArray(products)) return [];
    return products.filter(product => product && ids.includes(product.id));
  };

<<<<<<< HEAD
  // --- New Carousel Row Rendering Logic ---
  const renderCarouselRow = (carouselRowConfig: CarouselRowConfig, rowIndex: number) => {
    if (!carouselRowConfig) return null;

    const productIds = carouselRowConfig.product_ids || [];
    const carouselProducts = getProductsByIds(productIds);

    // Transform products to match SpecialCarouselRow expected format
    const transformedProducts = carouselProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.list_price,
      image: product.image || '/placeholder-product.png',
      platform: product.platform,
      isOnSale: product.is_on_sale,
      discount: product.discount_percentage
    }));

    const carouselConfig = {
      title: carouselRowConfig.title,
      products: transformedProducts,
      showTitle: carouselRowConfig.showTitle !== false, // Default to true
      titleAlignment: carouselRowConfig.titleAlignment || 'left'
    };

    return (
      <div key={carouselRowConfig.row_id || `carousel-${rowIndex}`} className="mb-6 md:mb-8">
        <SpecialCarouselRow
          config={carouselConfig}
          sectionBackgroundColor={section.background_value || '#f3f4f6'} // Passa cor de fundo da seção
          onCardClick={onProductCardClick}
          onAddToCart={(productId) => {
            const product = products?.find(p => p.id === productId);
            if (product) {
              addToCart(product);
            }
          }}
        />
      </div>
    );
  };
  // --- Legacy Carousel Rendering Logic (for backward compatibility) ---
  const renderLegacyCarousel = (carouselConfig: any, carouselKey: string) => {
=======
  // --- Carousel Rendering Logic (MANTIDO - não alterado) ---
  const renderCarousel = (carouselConfig: any, carouselKey: string) => {
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
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
  // --- End Legacy Carousel Rendering Logic ---

  // Determine background style
  const sectionStyle: React.CSSProperties = {};
  if (section.background_type === 'image' && section.background_value) {
    sectionStyle.backgroundImage = `url(${section.background_value})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = section.background_image_position || 'center';
    sectionStyle.backgroundRepeat = 'no-repeat';
  } else {
    sectionStyle.backgroundColor = section.background_value || '#003087';
  }

  // Determinar classes de espaçamento baseado no contexto da seção
  const getSpacingClasses = () => {
    const hasBackground = layoutSettings.show_background;
    
    if (reduceTopSpacing && !hasBackground) {
      // Seção especial sem fundo com espaçamento reduzido (usado em contextos específicos)
      return "py-2 md:py-3 my-1 md:my-2";
    } else if (hasBackground) {
      // Seções especiais com fundo precisam de mais espaço para destaque visual
      return "py-6 md:py-8 my-4 md:my-6";
    } else {
      // Seções especiais sem fundo devem ter espaçamento reduzido para melhor integração no fluxo
      return "py-3 md:py-4 my-2 md:my-3";
    }
  };

  return (
    <section aria-label={section.title} className="w-full">
      <div 
        style={sectionStyle} 
<<<<<<< HEAD
        className={`container mx-auto px-4 sm:px-6 lg:px-8 ${getSpacingClasses()} ${layoutSettings.show_background ? 'rounded-lg' : ''} overflow-hidden`}
      >
        {/* Dynamic Banner Rows and Carousel Rows (Unified System) */}
        {/* Suporte para ambos os formatos: config.rows (novo) e config.banner_rows (existente) */}
        {(config.rows || config.banner_rows || []).map((row: any, rowIndex: number) => {
          if (row.type === 'carousel') {
            // Render carousel row from unified system
            return renderCarouselRow(row, rowIndex);
          } else if (row.type === 'banner' || !row.type) {
            // Render banner row from unified system (inclui elementos sem type definido)
            let gridClass = '';
            
            if (row.layout === 'custom' && row.custom_sizes) {
              // Determinar se deve aplicar margem negativa para estender até as bordas
              const shouldExtendToBorders = row.margin_included_in_banner;
              const containerClass = shouldExtendToBorders 
                ? "flex justify-center items-start gap-3 md:gap-4 mb-4 md:mb-6 -mx-4 sm:-mx-6 lg:-mx-8" 
                : "flex justify-center items-start gap-3 md:gap-4 mb-4 md:mb-6";
              
              return (
                <div key={row.row_id || rowIndex} className={containerClass}>
                  {row.banners.map((banner: any, bannerIndex: number) => (
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
                            className={`w-full h-full object-cover ${!isMobile && banner.enable_hover_animation ? 'transition-transform duration-300' : ''}`}
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
              // Determinar se deve aplicar margem negativa para estender até as bordas
              const shouldExtendToBorders = row.margin_included_in_banner;
              
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

              const containerClass = shouldExtendToBorders 
                ? `grid ${gridClass} gap-3 md:gap-4 mb-4 md:mb-6 -mx-4 sm:-mx-6 lg:-mx-8`
                : `grid ${gridClass} gap-3 md:gap-4 mb-4 md:mb-6`;

              return (
                <div key={row.row_id || rowIndex} className={containerClass}>
                  {row.banners.map((banner: any, bannerIndex: number) => (
                    <div key={bannerIndex} className="relative overflow-hidden rounded-md group">
                      {banner.image_url && (
                        <Link to={banner.link_url || '#'}>
                          <img 
                            src={banner.image_url} 
                            alt={banner.title || `Banner ${rowIndex + 1}-${bannerIndex + 1}`} 
                            className={`w-full h-auto object-cover ${!isMobile && banner.enable_hover_animation ? 'transition-transform duration-300' : ''}`}
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
          }
          return null;
        })}

        {/* Legacy Dynamic Banner Rows (for backward compatibility) */}
        {/* REMOVIDO: Renderização separada que quebrava a ordem */}
=======
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

        {/* NOVO: Carrosseis Estilo GameStop */}
        {config.carousel_rows && Array.isArray(config.carousel_rows) && config.carousel_rows.map((carouselRow: any) => (
          <CarouselRowRenderer
            key={carouselRow.row_id}
            carouselRow={carouselRow}
            onProductCardClick={onProductCardClick}
          />
        ))}

        {/* Carrossel de Produtos 1 (MANTIDO - legacy) */}
        {renderCarousel(config.carrossel_1, 'carrossel_1')}

        {/* Carrossel de Produtos 2 (MANTIDO - legacy) */}
        {renderCarousel(config.carrossel_2, 'carrossel_2')}
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb

      </div>
    </section>
  );
});

export default SpecialSectionRenderer;
