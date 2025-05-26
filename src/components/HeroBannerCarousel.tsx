
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';

const HeroBannerCarousel = () => {
  const { banners, loading } = useBanners();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting && banners.length > 0) {
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
      startAutoPlay();
    }, 10000);
  };

  useEffect(() => {
    if (banners.length > 0) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isUserInteracting, banners.length]);

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
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
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
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
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
      <section className="relative bg-gradient-to-br from-uti-red via-red-600 to-red-700 text-white overflow-hidden">
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
          <div className="container-professional text-center">
            <div className="max-w-3xl mx-auto">
              <img 
                src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                alt="UTI DOS GAMES" 
                className="h-24 w-24 mx-auto mb-6 drop-shadow-lg" 
              />
              <h1 className="text-hero font-heading text-white mb-6 drop-shadow-lg">
                UTI DOS GAMES
              </h1>
              <p className="text-xl md:text-2xl font-medium text-white/90 mb-8 drop-shadow-md">
                A loja de games mais tradicional de Colatina
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/categoria/ofertas')}
                  className="btn-secondary bg-white text-uti-red border-white hover:bg-gray-100"
                >
                  Ver Ofertas
                </Button>
                <Button 
                  onClick={() => navigate('/categoria/inicio')}
                  className="btn-dark border-white/20 hover:bg-white hover:text-uti-red"
                >
                  Explorar Produtos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const banner = banners[currentBanner];
  const backgroundType = (banner as any).background_type || 'gradient';
  
  const showButton = banner.button_text && banner.button_link;

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

  return (
    <section className="relative overflow-hidden">
      <div 
        ref={carouselRef}
        className={`relative text-white transition-all duration-700 ease-in-out ${
          backgroundType === 'image-only' ? 'bg-gray-900' : gradientClass
        }`}
        style={{
          height: 'clamp(400px, 50vh, 600px)',
          ...backgroundStyle
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        {backgroundType === 'image-only' && (
          <div className="absolute inset-0 bg-black/40"></div>
        )}

        {/* Content */}
        <div className="container-professional h-full flex items-center relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {banner.title && (
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white font-bold mb-4 px-6 py-2 rounded-full text-sm border border-white/30 animate-fade-in-up">
                ♦ {banner.title}
              </div>
            )}
            
            {banner.subtitle && (
              <h1 className="text-hero font-heading mb-8 leading-tight px-4 drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {banner.subtitle}
              </h1>
            )}
            
            {showButton && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  className="btn-primary text-base px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
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
          
          {banner.image_url && backgroundType === 'gradient' && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block animate-fade-in-right">
              <img 
                src={banner.image_url} 
                alt={banner.subtitle || banner.title || 'Banner'} 
                className="max-w-md max-h-80 object-contain drop-shadow-2xl rounded-lg"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls - Aligned at bottom */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="flex items-center justify-center gap-4">
            {/* Left Arrow */}
            <Button 
              onClick={prevBanner}
              variant="ghost" 
              size="sm"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 md:w-12 md:h-12 p-0 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Button>

            {/* Banner Indicators */}
            <div className="flex gap-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentBanner(index);
                    resumeAutoPlayAfterDelay();
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentBanner 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <Button 
              onClick={nextBanner}
              variant="ghost" 
              size="sm"
              className="bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 md:w-12 md:h-12 p-0 transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBannerCarousel;
