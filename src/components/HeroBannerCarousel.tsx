import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useBanners } from '@/hooks/useBanners';
import { usePromotionalRibbon } from '@/hooks/usePromotionalRibbon';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import PromotionalRibbon from '@/components/PromotionalRibbon';
import { LogoImage } from '@/components/OptimizedImage/LogoImage';

const HeroBannerCarousel = React.memo(() => {
  const { banners, loading } = useBanners();
  const { mobileConfig, desktopConfig, loading: ribbonLoading } = usePromotionalRibbon();
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Memoizar configuração ativa da fita promocional
  const activeRibbonConfig = useMemo(() => 
    isMobile ? mobileConfig : desktopConfig, 
    [isMobile, mobileConfig, desktopConfig]
  );

  // Memoizar banners filtrados por dispositivo
  const deviceBanners = useMemo(() => {
    return banners.filter(banner => {
      const deviceType = (banner as any).device_type;
      if (isMobile) {
        return deviceType === 'mobile' || (!deviceType && banner.image_url_mobile);
      } else {
        return deviceType === 'desktop' || (!deviceType && !banner.image_url_mobile);
      }
    });
  }, [banners, isMobile]);

  // Configuração do autoplay memoizada
  const plugin = useRef(
    Autoplay({ 
      delay: 3500, 
      stopOnInteraction: false 
    })
  );

  useEffect(() => {
    if (!api) return;
    
    setCurrentSlide(api.selectedScrollSnap());
    
    const handleSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);
    
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Preload de imagens otimizado - apenas quando deviceBanners mudar
  useEffect(() => {
    if (deviceBanners.length === 0) return;
    
    const preloadImages = () => {
      deviceBanners.forEach(banner => {
        const imageUrl = isMobile 
          ? banner.image_url_mobile || banner.image_url_desktop || banner.image_url 
          : banner.image_url_desktop || banner.image_url_mobile || banner.image_url;
        
        if (imageUrl) {
          const img = new Image();
          img.src = imageUrl;
        }
      });
    };
    
    // Usar requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 100);
    }
  }, [deviceBanners, isMobile]);

  const handleButtonClick = useCallback((banner) => {
    const buttonLink = isMobile 
      ? banner.button_link_mobile || banner.button_link_desktop || banner.button_link 
      : banner.button_link_desktop || banner.button_link_mobile || banner.button_link;
    
    if (!buttonLink) return;
    
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(buttonLink);
    }
  }, [navigate, isMobile]);

  const handleScrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const handleScrollNext = useCallback(() => api?.scrollNext(), [api]);
  const handleScrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  // Memoizar componente de fita promocional
  const promotionalRibbonComponent = useMemo(() => {
    if (!activeRibbonConfig || !activeRibbonConfig.is_active) return null;
    
    return (
      <div className="mt-[36px]">
        <PromotionalRibbon 
          isVisible={true}
          text={activeRibbonConfig.text}
          backgroundColor={activeRibbonConfig.background_color}
          textColor={activeRibbonConfig.text_color}
          link={activeRibbonConfig.link_url}
          backgroundType={activeRibbonConfig.background_type}
          gradientColors={activeRibbonConfig.gradient_colors}
        />
      </div>
    );
  }, [activeRibbonConfig]);

  // Memoizar espaçamento quando não há fita
  const spacingComponent = useMemo(() => {
    if (activeRibbonConfig && activeRibbonConfig.is_active) return null;
    return <div className="h-[38px]" />;
  }, [activeRibbonConfig]);

  if (loading) {
    return (
      <>
        {promotionalRibbonComponent}
        {spacingComponent}
        <section className="relative bg-uti-gray-light overflow-hidden border-b border-border/60">
          <Skeleton className="w-full aspect-[4.4/1] min-h-[240px] max-h-[400px]" />
        </section>
      </>
    );
  }

  if (deviceBanners.length === 0) {
    return (
      <>
        {promotionalRibbonComponent}
        {spacingComponent}
        <section className="relative bg-gradient-to-br from-uti-dark via-gray-900 to-uti-dark text-white overflow-hidden">
          <div className="relative w-full aspect-[4.4/1] min-h-[240px] max-h-[400px] flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-4xl text-center animate-fade-in">
              <LogoImage 
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png"
                alt="UTI DOS GAMES" 
                className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-5 drop-shadow-md"
                priority={true}
              />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md leading-tight">
                Bem-vindo à UTI DOS GAMES
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-medium text-white/80 mb-8 drop-shadow-sm max-w-2xl mx-auto">
                Sua loja de games favorita em Colatina. Explore nossas novidades e ofertas!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg"
                  className="bg-uti-red text-primary-foreground hover:bg-uti-red/90 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  onClick={() => navigate('/categoria/ofertas')}
                >
                  Ver Ofertas
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  onClick={() => navigate('/')}
                >
                  Explorar Produtos
                </Button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {promotionalRibbonComponent}
      {spacingComponent}
      
      <section className="relative overflow-hidden bg-uti-gray-light">
        <Carousel 
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ 
            loop: true, 
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {deviceBanners.map((banner, index) => {
              const imageUrl = isMobile 
                ? banner.image_url_mobile || banner.image_url_desktop || banner.image_url 
                : banner.image_url_desktop || banner.image_url_mobile || banner.image_url;
              const buttonLink = isMobile 
                ? banner.button_link_mobile || banner.button_link_desktop || banner.button_link 
                : banner.button_link_desktop || banner.button_link_mobile || banner.button_link;
              const hasImage = !!imageUrl;
              
              return (
                <CarouselItem key={index} className="pl-0">
                  <div 
                    className={cn(
                      "relative text-white transition-opacity duration-500 ease-in-out",
                      "w-full aspect-[4.4/1]", // Proporção baseada na GameStop (4.4:1)
                      "min-h-[240px] max-h-[400px]", // Altura mínima e máxima para controle
                      "flex items-center",
                      "overflow-hidden" // Garante que o conteúdo não vaze
                    )}
                  >
                    {/* Imagem de fundo como elemento separado para melhor controle */}
                    {hasImage && (
                      <img 
                        src={imageUrl}
                        alt={banner.title || banner.subtitle || 'Banner'}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    )}
                    {/* Gradiente de fundo quando não há imagem */}
                    {!hasImage && (
                      <div className="absolute inset-0 bg-gradient-to-br from-uti-red via-red-700 to-red-800" />
                    )}
                    <div className="absolute inset-0 z-10 flex items-center">
                      <div className="container mx-auto w-full">
                        <div className={cn(
                            "max-w-lg md:max-xl lg:max-w-2xl md:animate-fade-in-up", 
                            "text-left" 
                        )}>
                          {banner.title && (
                            <div className="inline-block bg-black/30 backdrop-blur-sm text-white font-semibold mb-3 md:mb-4 px-4 py-1.5 rounded-md text-xs sm:text-sm border border-white/20">
                              {banner.title}
                            </div>
                          )}
                          {banner.subtitle && (
                            <h1 className={cn(
                                "font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg",
                                "text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                            )}>
                              {banner.subtitle}
                            </h1>
                          )}
                          {banner.button_text && buttonLink && (
                            <div>
                              <Button 
                                size="lg"
                                className={cn(
                                  "bg-uti-red text-primary-foreground hover:bg-uti-red/90 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
                                  isMobile ? "w-full sm:w-auto" : ""
                                )}
                                onClick={() => handleButtonClick(banner)}
                              >
                                {banner.button_text}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          {deviceBanners.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
                  onClick={handleScrollPrev}
                  aria-label="Banner anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
                  onClick={handleScrollNext}
                  aria-label="Próximo banner"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Button>
              </div>
            </>
          )}
        </Carousel>
        
        {/* Custom Banner Indicators - Posicionados fora do banner */}
        {deviceBanners.length > 1 && (
          <div className="flex justify-center pt-4 pb-2">
            <div className="flex gap-2">
              {deviceBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleScrollTo(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? "bg-gray-800 scale-110" 
                      : "bg-gray-400 hover:bg-gray-600"
                  )}
                  aria-label={`Ir para o banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
});

export default HeroBannerCarousel;

