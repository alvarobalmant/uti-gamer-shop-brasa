import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import HeroQuickLinks from './HeroQuickLinks'; // Assuming this component is also redesigned
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel" // Using shadcn Carousel
import Autoplay from "embla-carousel-autoplay" // Import Autoplay plugin

const HeroBannerCarousel = () => {
  const { banners, loading } = useBanners();
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Autoplay plugin instance
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  // Update current slide index on select
  useEffect(() => {
    if (!api) {
      return
    }
    setCurrentSlide(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap())
    })
  }, [api])

  // Preload images
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

  // --- Loading State ---
  if (loading) {
    return (
      <section className="relative bg-uti-gray-light overflow-hidden border-b border-border/60">
        {/* Use Skeleton for the carousel area */}
        <Skeleton className="h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)] w-full" />
        {/* Render QuickLinks below the skeleton */}
        <HeroQuickLinks />
      </section>
    );
  }

  // --- Fallback Content (No Banners) ---
  if (banners.length === 0) {
    return (
      <>
        {/* Use a simpler, static hero section if no banners */}
        <section className="relative bg-gradient-to-br from-uti-dark via-gray-900 to-uti-dark text-white overflow-hidden">
          <div className="relative h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)] flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-4xl text-center animate-fade-in">
              <img 
                src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" // Use logo
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
                  onClick={() => navigate('/')} // Navigate to home or a general products page
                >
                  Explorar Produtos
                </Button>
              </div>
            </div>
          </div>
        </section>
        <HeroQuickLinks />
      </>
    );
  }

  // --- Carousel Rendering ---
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-uti-gray-light"> {/* Fallback bg */}
        <Carousel 
          setApi={setApi}
          plugins={[plugin.current]} // Add autoplay plugin
          opts={{ 
            loop: true, 
            align: "start",
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent className="-ml-0"> {/* Remove negative margin if not needed */}
            {banners.map((banner, index) => {
              const hasImage = !!banner.image_url;
              return (
                <CarouselItem key={index} className="pl-0"> {/* Remove padding left if not needed */}
                  <div 
                    className={cn(
                      "relative text-white transition-opacity duration-500 ease-in-out",
                      "h-[300px] md:h-[450px] lg:h-[550px] xl:h-[clamp(500px,65vh,650px)]", // Responsive height
                      "flex items-center", // Use flex to center content vertically
                      hasImage ? "bg-cover bg-center" : "bg-gradient-to-br from-uti-red via-red-700 to-red-800" // Background logic
                    )}
                    style={hasImage ? { backgroundImage: `url(${banner.image_url})` } : {}}
                  >
                    {/* Overlay for better text readability on image backgrounds */}
                    {hasImage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70"></div>
                    )}

                    {/* Content Area */} 
                    <div className="absolute inset-0 z-10 flex items-center">
                      <div className="container mx-auto w-full">
                        <div className={cn(
                            "max-w-lg md:max-w-xl lg:max-w-2xl animate-fade-in-up",
                            // Adjust text alignment based on design preference (e.g., always left)
                            "text-left" 
                        )}>
                          {/* Title (Optional Tag) */}
                          {banner.title && (
                            <div className="inline-block bg-black/30 backdrop-blur-sm text-white font-semibold mb-3 md:mb-4 px-4 py-1.5 rounded-md text-xs sm:text-sm border border-white/20">
                              {banner.title}
                            </div>
                          )}
                          
                          {/* Subtitle (Main Heading) */}
                          {banner.subtitle && (
                            <h1 className={cn(
                                "font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg",
                                "text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                            )} style={{ animationDelay: '0.1s' }}>
                              {banner.subtitle}
                            </h1>
                          )}
                          
                          {/* Button */}
                          {banner.button_text && banner.button_link && (
                            <div style={{ animationDelay: '0.2s' }}>
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
          
          {/* Custom Navigation Arrows (More elegant - Hidden on Mobile) */}
          {banners.length > 1 && !isMobile && (
            <>
              <CarouselPrevious 
                className={cn(
                  "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20",
                  "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12", // Responsive size
                  "bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40",
                  "transition-all duration-200 backdrop-blur-sm rounded-full disabled:opacity-50"
                )}
              />
              <CarouselNext 
                className={cn(
                  "absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20",
                  "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12", // Responsive size
                  "bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-white/40",
                  "transition-all duration-200 backdrop-blur-sm rounded-full disabled:opacity-50"
                )}
              />
            </>
          )}

          {/* Custom Banner Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)} // Use API to scroll
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
      
      {/* Quick Links Section (Assuming it's also redesigned) */}
      <HeroQuickLinks />
    </>
  );
};

export default HeroBannerCarousel;

