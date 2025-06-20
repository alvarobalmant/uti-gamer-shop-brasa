
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBanners } from '@/hooks/useBanners';
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

const HeroBannerCarousel = () => {
  const { banners, loading } = useBanners();
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Filtrar banners baseado no dispositivo
  const deviceBanners = banners.filter(banner => {
    const deviceType = (banner as any).device_type;
    if (isMobile) {
      return deviceType === 'mobile' || (!deviceType && banner.image_url_mobile);
    } else {
      return deviceType === 'desktop' || (!deviceType && !banner.image_url_mobile);
    }
  });

  // Configuração do autoplay para funcionar em todas as plataformas
  const plugin = useRef(
    Autoplay({ 
      delay: 3500, 
      stopOnInteraction: false 
    })
  )

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrentSlide(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
<<<<<<< HEAD
    deviceBanners.forEach(banner => {
      const imageUrl = isMobile ? banner.image_url_mobile || banner.image_url_desktop || banner.image_url : banner.image_url_desktop || banner.image_url_mobile || banner.image_url;
      if (imageUrl) {
=======
    banners.forEach(banner => {
      // Preload all banner images
      if (banner.image_url) {
>>>>>>> 3115b4af09afdf7170071f97b16f5f3adc77cb0f
        const img = new Image();
        img.src = imageUrl;
      }
      if ((banner as any).image_url_desktop) {
        const img = new Image();
        img.src = (banner as any).image_url_desktop;
      }
      if ((banner as any).image_url_mobile) {
        const img = new Image();
        img.src = (banner as any).image_url_mobile;
      }
    });
  }, [deviceBanners, isMobile]);

<<<<<<< HEAD
  const handleButtonClick = useCallback((banner) => {
    const buttonLink = isMobile ? banner.button_link_mobile || banner.button_link_desktop || banner.button_link : banner.button_link_desktop || banner.button_link_mobile || banner.button_link;
    if (!buttonLink) return;
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(buttonLink);
    }
  }, [navigate, isMobile]);
=======
  const handleButtonClick = useCallback((banner: any) => {
    // Determine which link to use based on device and available links
    let linkToUse = banner.button_link;
    
    if (isMobile && banner.button_link_mobile) {
      linkToUse = banner.button_link_mobile;
    } else if (!isMobile && banner.button_link_desktop) {
      linkToUse = banner.button_link_desktop;
    }
    
    if (!linkToUse) return;
    
    if (linkToUse.startsWith('http')) {
      window.open(linkToUse, '_blank', 'noopener,noreferrer');
    } else {
      navigate(linkToUse);
    }
  }, [navigate, isMobile]);

  const getBannerImage = useCallback((banner: any) => {
    // Priority: responsive image > general image
    if (isMobile && banner.image_url_mobile) {
      return banner.image_url_mobile;
    }
    if (!isMobile && banner.image_url_desktop) {
      return banner.image_url_desktop;
    }
    return banner.image_url;
  }, [isMobile]);
>>>>>>> 3115b4af09afdf7170071f97b16f5f3adc77cb0f

  if (loading) {
    return (
      <section className="relative bg-uti-gray-light overflow-hidden border-b border-border/60">
        <Skeleton className="h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)] w-full" />
      </section>
    );
  }

  if (deviceBanners.length === 0) {
    return (
      <>
        <section className="relative bg-gradient-to-br from-uti-dark via-gray-900 to-uti-dark text-white overflow-hidden">
          <div className="relative h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)] flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-4xl text-center animate-fade-in">
              <img 
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png"
                alt="UTI DOS GAMES" 
                className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-5 drop-shadow-md"
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
      <section className="relative overflow-hidden border-b border-border/60 bg-uti-gray-light">
        <Carousel 
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ 
            loop: true, 
            align: "start",
          }}
          className="w-full"
<<<<<<< HEAD
        >          <CarouselContent className="-ml-0">
            {deviceBanners.map((banner, index) => {
              const imageUrl = isMobile ? banner.image_url_mobile || banner.image_url_desktop || banner.image_url : banner.image_url_desktop || banner.image_url_mobile || banner.image_url;
              const buttonLink = isMobile ? banner.button_link_mobile || banner.button_link_desktop || banner.button_link : banner.button_link_desktop || banner.button_link_mobile || banner.button_link;
              const hasImage = !!imageUrl;
=======
        >
          <CarouselContent className="-ml-0">
            {banners.map((banner, index) => {
              const bannerImage = getBannerImage(banner);
              const hasImage = !!bannerImage;
              const hasText = banner.title || banner.subtitle || banner.button_text;
              const hasButton = banner.button_text && (banner.button_link || (banner as any).button_link_desktop || (banner as any).button_link_mobile);
              
>>>>>>> 3115b4af09afdf7170071f97b16f5f3adc77cb0f
              return (
                <CarouselItem key={index} className="pl-0">
                  <div 
                    className={cn(
                      "relative text-white transition-opacity duration-500 ease-in-out",
                      "h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)]",
                      "flex items-center",
                      hasImage ? "bg-cover bg-center" : "bg-gradient-to-br from-uti-red via-red-700 to-red-800"
                    )}
<<<<<<< HEAD
                    style={hasImage ? { backgroundImage: `url(${imageUrl})` } : {}}
                  >
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
=======
                    style={hasImage ? { backgroundImage: `url(${bannerImage})` } : {}}
                  >
                    {hasImage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70"></div>
                    )}
                    
                    {hasText && (
                      <div className="absolute inset-0 z-10 flex items-center">
                        <div className="container mx-auto w-full">
                          <div className={cn(
                              "max-w-lg md:max-w-xl lg:max-w-2xl md:animate-fade-in-up", 
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
                            {hasButton && (
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
>>>>>>> 3115b4af09afdf7170071f97b16f5f3adc77cb0f
                        </div>
                      </div>
                    )}
                    
                    {/* For image-only banners without text, show a subtle overlay for better readability of indicators */}
                    {!hasText && hasImage && (
                      <div className="absolute inset-0 bg-black/20"></div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {/* Custom Banner Indicators */}
          {deviceBanners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {deviceBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? "bg-white scale-110 ring-1 ring-white/50 ring-offset-2 ring-offset-black/20" 
                      : "bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Ir para o banner ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {deviceBanners.length > 1 && (
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
                onClick={() => api?.scrollPrev()}
                aria-label="Banner anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Button>
            </div>
          )}
          {deviceBanners.length > 1 && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200"
                onClick={() => api?.scrollNext()}
                aria-label="Próximo banner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Button>
            </div>
          )}
        </Carousel>
      </section>
    </>
  );
};

export default HeroBannerCarousel;

