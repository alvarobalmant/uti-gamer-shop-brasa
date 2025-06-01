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
    banners.forEach(banner => {
      if (banner.image_url) {
        const img = new Image();
        img.src = banner.image_url;
      }
    });
  }, [banners]);

  const handleButtonClick = useCallback((buttonLink: string | undefined) => {
    if (!buttonLink) return;
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(buttonLink);
    }
  }, [navigate]);

  if (loading) {
    return (
      <section className="relative bg-uti-gray-light overflow-hidden border-b border-border/60">
        <Skeleton className="h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)] w-full" />
      </section>
    );
  }

  if (banners.length === 0) {
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
        >
          <CarouselContent className="-ml-0">
            {banners.map((banner, index) => {
              const hasImage = !!banner.image_url;
              return (
                <CarouselItem key={index} className="pl-0">
                  <div 
                    className={cn(
                      "relative text-white transition-opacity duration-500 ease-in-out",
                      "h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)]",
                      "flex items-center",
                      hasImage ? "bg-cover bg-center" : "bg-gradient-to-br from-uti-red via-red-700 to-red-800"
                    )}
                    style={hasImage ? { backgroundImage: `url(${banner.image_url})` } : {}}
                  >
                    {hasImage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70"></div>
                    )}
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
                          {banner.button_text && banner.button_link && (
                            <div>
                              <Button 
                                size="lg"
                                className={cn(
                                  "bg-uti-red text-primary-foreground hover:bg-uti-red/90 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
                                  isMobile ? "w-full sm:w-auto" : ""
                                )}
                                onClick={() => handleButtonClick(banner.button_link)}
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
          
          {/* Custom Banner Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? 'bg-white scale-110 ring-1 ring-white/50 ring-offset-2 ring-offset-black/20' 
                      : 'bg-white/40 hover:bg-white/70'
                  )}
                  aria-label={`Ir para o banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </section>
    </>
  );
};

export default HeroBannerCarousel;
