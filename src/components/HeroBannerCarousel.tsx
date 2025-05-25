import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
const HeroBannerCarousel = () => {
  const {
    banners,
    loading
  } = useBanners();
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
    }, 4000);
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
    return <section className="relative bg-gray-900 overflow-hidden">
        <div className="relative bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white h-32 flex items-center justify-center">
          <div className="text-white">Carregando...</div>
        </div>
      </section>;
  }
  if (banners.length === 0) {
    return <section className="relative bg-gray-900 overflow-hidden">
        <div className="relative bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white h-32 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-bold">UTI DOS GAMES</h2>
            <p className="text-sm">A loja de games mais tradicional de Colatina</p>
          </div>
        </div>
      </section>;
  }
  const banner = banners[currentBanner];
  const backgroundType = (banner as any).background_type || 'gradient';
  return <section className="relative bg-gray-900 overflow-hidden">
      <div ref={carouselRef} className={`relative text-white transition-all duration-500 ease-in-out transform ${backgroundType === 'image-only' ? 'bg-gray-800' : `bg-gradient-to-br ${banner.gradient}`}`} style={{
      height: 'clamp(120px, 25vh, 200px)',
      ...(backgroundType === 'image-only' && banner.image_url && {
        backgroundImage: `url(${banner.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={() => setIsDragging(false)}>
        <div className="px-4 py-6 relative h-full flex flex-col justify-center">
          {banners.length > 1 && <>
              <Button onClick={prevBanner} variant="ghost" size="sm" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0 z-10 transition-all duration-200">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button onClick={nextBanner} variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0 z-10 transition-all duration-200">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>}

          <div className="text-center flex-1 flex flex-col justify-center">
            {banner.title && <div className="inline-block bg-red-600 text-white font-bold mb-2 px-3 py-1 rounded-full text-xs mx-auto">
                ♦ {banner.title}
              </div>}
            
            {banner.subtitle && <h2 className="text-lg md:text-2xl font-bold mb-3 leading-tight px-4">
                {banner.subtitle}
              </h2>}
            
            {banner.button_text && banner.button_link && <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-2 px-6 rounded-lg text-sm mx-auto transition-all duration-200" onClick={() => handleButtonClick(banner.button_link)}>
                {banner.button_image_url && <img src={banner.button_image_url} alt="" className="w-4 h-4 mr-2" />}
                {banner.button_text}
              </Button>}
          </div>
          
          {banner.image_url && backgroundType === 'gradient' && <div className="hidden md:flex justify-center mt-4">
              <div className="relative">
                <img src={banner.image_url} alt={banner.subtitle || banner.title || 'Banner'} className="w-60 h-20 object-cover rounded-lg" onError={e => {
              e.currentTarget.style.display = 'none';
            }} />
              </div>
            </div>}
        </div>
      </div>

      {banners.length > 1 && <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => {})}
        </div>}
    </section>;
};
export default HeroBannerCarousel;