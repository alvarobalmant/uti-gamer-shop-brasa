
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import HeroQuickLinks from './HeroQuickLinks';

const HeroBannerCarousel = () => {
  const { banners, loading } = useBanners();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<{ [key: string]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Preload images
  useEffect(() => {
    banners.forEach(banner => {
      if (banner.image_url && !preloadedImages[banner.image_url]) {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => ({ ...prev, [banner.image_url!]: true }));
        };
        img.src = banner.image_url;
      }
    });
  }, [banners, preloadedImages]);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting && !isPaused && banners.length > 0) {
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }
    }, 5000);
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
    }, 10000);
  };

  useEffect(() => {
    if (banners.length > 0 && !isPaused) {
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

  // Touch and mouse handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextBanner();
      } else {
        prevBanner();
      }
    }
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setStartX(e.clientX);
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isMobile) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || isMobile) return;
    const endX = e.clientX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextBanner();
      } else {
        prevBanner();
      }
    }
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsPaused(false);
      setIsDragging(false);
    }
  };

  const handleButtonClick = (buttonLink: string) => {
    if (buttonLink.startsWith('http')) {
      window.open(buttonLink, '_blank');
    } else {
      navigate(buttonLink);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-gray-100 overflow-hidden">
        <div className="relative h-[300px] md:h-[500px] lg:h-[600px] xl:h-[clamp(500px,60vh,700px)] flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="text-gray-500 font-medium">Carregando banners...</div>
          </div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <>
        <section className="relative bg-gradient-to-br from-uti-red via-red-600 to-red-700 text-white overflow-hidden">
          <div className="relative h-[300px] md:h-[500px] lg:h-[600px] xl:h-[clamp(500px,60vh,700px)] flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-6xl text-center">
              <div className="max-w-4xl mx-auto">
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-6 drop-shadow-lg animate-fade-in-up" 
                />
                <h1 className="text-[32px] md:text-[48px] lg:text-[64px] font-heading text-white mb-6 drop-shadow-lg leading-tight animate-fade-in-up">
                  UTI DOS GAMES
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/90 mb-8 drop-shadow-md max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  A loja de games mais tradicional de Colatina
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button 
                    onClick={() => navigate('/categoria/ofertas')}
                    className="h-12 px-8 bg-white text-uti-red border-white hover:bg-gray-100 text-base font-semibold rounded-button transition-all duration-300 hover:scale-105"
                  >
                    Ver Ofertas
                  </Button>
                  <Button 
                    onClick={() => navigate('/categoria/inicio')}
                    className="h-12 px-8 bg-transparent border-2 border-white/20 hover:bg-white hover:text-uti-red text-base font-semibold rounded-button transition-all duration-300 hover:scale-105"
                  >
                    Explorar Produtos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HeroQuickLinks />
      </>
    );
  }

  const banner = banners[currentBanner];
  const backgroundType = (banner as any).background_type || 'gradient';
  
  // Determine if button should be shown
  const showButton = banner.button_text && banner.button_link;

  // Create background style based on type
  const getBackgroundStyle = () => {
    if (backgroundType === 'image-only' && banner.image_url) {
      return {
        backgroundImage: `url(${banner.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  const backgroundStyle = getBackgroundStyle();
  const gradientClass = backgroundType === 'gradient' && banner.gradient 
    ? `bg-gradient-to-br ${banner.gradient}` 
    : 'bg-gradient-to-br from-uti-red via-red-600 to-red-700';

  const contentAlignment = currentBanner % 2 === 0 ? 'justify-start text-left' : 'justify-end text-right';
  const imageAlignment = currentBanner % 2 === 0 ? 'right-8' : 'left-8';

  return (
    <>
      <section className="relative overflow-hidden">
        <div 
          ref={carouselRef}
          className={`relative text-white transition-all duration-700 ease-in-out ${
            backgroundType === 'image-only' ? 'bg-gray-900' : gradientClass
          }`}
          style={{
            height: 'clamp(300px, 60vh, 700px)',
            minHeight: '300px',
            ...backgroundStyle
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Overlay for better text readability */}
          {backgroundType === 'image-only' && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          )}

          {/* Desktop Navigation Arrows */}
          {banners.length > 1 && !isMobile && (
            <>
              <Button 
                onClick={prevBanner}
                variant="ghost" 
                size="icon"
                className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-[60px] h-[60px] p-0 z-20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              
              <Button 
                onClick={nextBanner}
                variant="ghost" 
                size="icon"
                className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-[60px] h-[60px] p-0 z-20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Content */}
          <div className="container mx-auto px-4 max-w-6xl h-full flex items-center relative z-10">
            <div className={`max-w-4xl mx-auto w-full flex ${isMobile ? 'justify-center text-center' : contentAlignment}`}>
              <div className={`${isMobile ? 'max-w-lg' : 'max-w-2xl'}`}>
                {/* Title */}
                {banner.title && (
                  <div className="inline-block bg-white/20 backdrop-blur-sm text-white font-bold mb-4 md:mb-6 px-4 md:px-6 py-2 rounded-full text-sm border border-white/30 animate-fade-in-up">
                    ♦ {banner.title}
                  </div>
                )}
                
                {/* Subtitle */}
                {banner.subtitle && (
                  <h1 className={`font-heading mb-6 md:mb-8 leading-tight drop-shadow-lg animate-fade-in-up ${
                    isMobile ? 'text-[32px] md:text-[36px]' : 'text-[48px] lg:text-[64px]'
                  }`} style={{ animationDelay: '0.2s' }}>
                    {banner.subtitle}
                  </h1>
                )}
                
                {/* Button */}
                {showButton && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Button 
                      className={`bg-white text-uti-red hover:bg-gray-100 font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-button ${
                        isMobile ? 'w-[80%] h-12 text-base' : 'h-[50px] md:h-[60px] px-8 md:px-12 text-base md:text-lg min-w-[180px] md:min-w-[220px]'
                      }`}
                      onClick={() => handleButtonClick(banner.button_link)}
                    >
                      {banner.button_image_url && (
                        <img 
                          src={banner.button_image_url} 
                          alt="" 
                          className="w-5 h-5 mr-2" 
                        />
                      )}
                      {banner.button_text}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Desktop Secondary Image */}
            {banner.image_url && backgroundType === 'gradient' && !isMobile && (
              <div className={`absolute ${imageAlignment} top-1/2 transform -translate-y-1/2 hidden xl:block animate-fade-in-right`}>
                <img 
                  src={banner.image_url} 
                  alt={banner.subtitle || banner.title || 'Banner'} 
                  className="max-w-sm max-h-80 object-contain drop-shadow-2xl rounded-lg"
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Banner Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentBanner(index);
                  resumeAutoPlayAfterDelay();
                }}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                  index === currentBanner 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Quick Links Section */}
      <HeroQuickLinks />
    </>
  );
};

export default HeroBannerCarousel;
