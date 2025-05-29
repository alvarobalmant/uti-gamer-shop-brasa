import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import HeroQuickLinks from './HeroQuickLinks';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const HeroBannerCarousel = () => {
  const { banners, loading } = useBanners();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Preload images - simplified
  useEffect(() => {
    banners.forEach(banner => {
      if (banner.image_url) {
        const img = new Image();
        img.src = banner.image_url;
      }
    });
  }, [banners]);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting && !isPaused && banners.length > 1) { // Only autoplay if more than 1 banner
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }
    }, 5000); // 5 seconds interval
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const resumeAutoPlayAfterDelay = () => {
    setIsUserInteracting(true);
    stopAutoPlay();
    setTimeout(() => {
      setIsUserInteracting(false);
      if (!isPaused) startAutoPlay();
    }, 10000); // Resume after 10 seconds of inactivity
  };

  useEffect(() => {
    if (banners.length > 1 && !isPaused) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isUserInteracting, banners.length, isPaused]);

  const nextBanner = () => {
    if (banners.length > 0) {
      setCurrentBanner(prev => (prev + 1) % banners.length);
      resumeAutoPlayAfterDelay();
    }
  };

  const prevBanner = () => {
    if (banners.length > 0) {
      setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);
      resumeAutoPlayAfterDelay();
    }
  };

  // Touch and mouse handlers (simplified)
  const handleInteractionStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
    setIsPaused(true); // Pause autoplay on interaction
  };

  const handleInteractionEnd = (clientX: number) => {
    if (!isDragging) return;
    const endX = clientX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 50) { // Threshold for swipe
      if (diffX > 0) {
        nextBanner();
      } else {
        prevBanner();
      }
    }
    setIsDragging(false);
    // Don't immediately resume autoplay, let resumeAutoPlayAfterDelay handle it
    // setIsPaused(false); 
  };

  const handleTouchStart = (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => handleInteractionEnd(e.changedTouches[0].clientX);
  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX);
  const handleMouseUp = (e: React.MouseEvent) => handleInteractionEnd(e.clientX);

  const handleMouseEnter = () => {
    if (!isMobile) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsPaused(false);
      setIsDragging(false); // Ensure dragging stops if mouse leaves while pressed
    }
  };

  const handleButtonClick = (buttonLink: string | undefined) => {
    if (!buttonLink) return;
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(buttonLink);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <section className="relative bg-gray-100 overflow-hidden">
        <Skeleton className="h-[300px] md:h-[500px] lg:h-[600px] xl:h-[clamp(500px,60vh,700px)] w-full" />
        <HeroQuickLinks /> {/* Show quick links even when loading */}
      </section>
    );
  }

  // --- Fallback Content (No Banners) ---
  if (banners.length === 0) {
    return (
      <>
        <section className="relative bg-gradient-to-br from-uti-red via-red-600 to-red-700 text-white overflow-hidden">
          <div className="relative h-[300px] md:h-[500px] lg:h-[600px] xl:h-[clamp(500px,60vh,700px)] flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" // Assuming this is the logo
                alt="UTI DOS GAMES" 
                className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-4 drop-shadow-md"
              />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md leading-tight">
                Bem-vindo à UTI DOS GAMES
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-medium text-white/90 mb-8 drop-shadow-sm max-w-2xl mx-auto">
                A sua loja de games em Colatina. Explore nossas ofertas!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/categoria/ofertas')}
                  size="lg"
                  className="bg-white text-uti-red hover:bg-gray-100 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Ver Ofertas
                </Button>
                <Button 
                  onClick={() => navigate('/')} // Navigate to home or a general products page
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
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
  const banner = banners[currentBanner];
  const hasImage = !!banner.image_url;

  return (
    <>
      <section className="relative overflow-hidden bg-gray-200"> {/* Fallback bg */}
        <div 
          ref={carouselRef}
          className={cn(
            "relative text-white transition-opacity duration-500 ease-in-out",
            "h-[300px] md:h-[500px] lg:h-[600px] xl:h-[clamp(500px,60vh,700px)]", // Responsive height
            hasImage ? "bg-cover bg-center" : "bg-gradient-to-br from-uti-red via-red-600 to-red-700" // Background logic
          )}
          style={hasImage ? { backgroundImage: `url(${banner.image_url})` } : {}}
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => isDragging && e.preventDefault()} // Prevent scroll while dragging
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => isDragging && e.preventDefault()} // Prevent text selection
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Overlay for better text readability on image backgrounds */}
          {hasImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
          )}

          {/* Content Area */} 
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {/* Adjust alignment based on needs, maybe always center/left for consistency? */}
              <div className={cn(
                  "max-w-lg md:max-w-xl lg:max-w-2xl",
                  isMobile ? "mx-auto text-center" : "text-left" // Example: Left align on desktop, center on mobile
              )}>
                {/* Title (Optional Tag) */}
                {banner.title && (
                  <div className="inline-block bg-white/10 backdrop-blur-sm text-white font-semibold mb-3 md:mb-4 px-3 py-1 rounded-full text-xs sm:text-sm border border-white/20 animate-fade-in-up">
                    {banner.title}
                  </div>
                )}
                
                {/* Subtitle (Main Heading) */}
                {banner.subtitle && (
                  <h1 className={cn(
                      "font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg animate-fade-in-up",
                      isMobile ? "text-3xl md:text-4xl" : "text-4xl lg:text-5xl xl:text-6xl"
                  )} style={{ animationDelay: '0.1s' }}>
                    {banner.subtitle}
                  </h1>
                )}
                
                {/* Button */}
                {banner.button_text && banner.button_link && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Button 
                      size="lg"
                      className={cn(
                        "bg-white text-uti-red hover:bg-gray-100 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200",
                        isMobile ? "w-full sm:w-auto" : ""
                      )}
                      onClick={() => handleButtonClick(banner.button_link)}
                    >
                      {/* Optional button icon can be added here */}
                      {banner.button_text}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          {banners.length > 1 && !isMobile && (
            <>
              <Button 
                onClick={prevBanner}
                variant="ghost" 
                size="icon"
                className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 md:w-12 md:h-12 p-0 z-20 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-105"
                aria-label="Previous Banner"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
              </Button>
              
              <Button 
                onClick={nextBanner}
                variant="ghost" 
                size="icon"
                className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 md:w-12 md:h-12 p-0 z-20 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:scale-105"
                aria-label="Next Banner"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </Button>
            </>
          )}

          {/* Banner Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2.5 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentBanner(index);
                    resumeAutoPlayAfterDelay();
                  }}
                  className={cn(
                    "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300",
                    index === currentBanner 
                      ? 'bg-white scale-110 shadow-md' 
                      : 'bg-white/40 hover:bg-white/70'
                  )}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Quick Links Section */}
      <HeroQuickLinks />
    </>
  );
};

export default HeroBannerCarousel;

