import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
const banners = [{
  id: 1,
  title: "PROS GET 5% EXTRA OFF + 5% EXTRA TRADE CREDIT",
  subtitle: "Compre e Venda Seus Games na UTI DOS GAMES!",
  buttonText: "Entre em Contato",
  gradient: "from-purple-600 via-red-600 to-orange-500",
  image: "/lovable-uploads/ab54f665-ca93-42fa-9bca-d93b35cc87f7.png"
}, {
  id: 2,
  title: "MAIS DE 10 ANOS NO MERCADO",
  subtitle: "Os Melhores Games e Consoles!",
  buttonText: "Ver Produtos",
  gradient: "from-red-700 via-red-600 to-red-500",
  image: "🎮"
}, {
  id: 3,
  title: "FRETE GRÁTIS ACIMA DE R$ 200",
  subtitle: "Entrega rápida e segura em todo o Brasil",
  buttonText: "Aproveitar",
  gradient: "from-blue-600 via-purple-600 to-red-600",
  image: "🚚"
}, {
  id: 4,
  title: "PARCELAMOS EM ATÉ 12X",
  subtitle: "Sem juros no cartão de crédito",
  buttonText: "Comprar Agora",
  gradient: "from-red-600 via-orange-500 to-yellow-500",
  image: "💳"
}, {
  id: 5,
  title: "WHATSAPP: (27) 99688-2090",
  subtitle: "Atendimento personalizado e rápido",
  buttonText: "Chamar no WhatsApp",
  gradient: "from-green-600 via-red-600 to-red-700",
  image: "📱"
}];
const HeroBannerCarousel = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting) {
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
    startAutoPlay();
    return () => stopAutoPlay();
  }, [isUserInteracting]);
  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % banners.length);
    resumeAutoPlayAfterDelay();
  };
  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);
    resumeAutoPlayAfterDelay();
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
  const banner = banners[currentBanner];
  return <section className="relative bg-gray-900 overflow-hidden">
      <div ref={carouselRef} className={`relative bg-gradient-to-br ${banner.gradient} text-white transition-all duration-500 ease-in-out transform`} style={{
      height: 'clamp(120px, 25vh, 200px)'
    }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={() => setIsDragging(false)}>
        <div className="px-4 py-6 relative h-full flex flex-col justify-center">
          <Button onClick={prevBanner} variant="ghost" size="sm" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0 z-10 transition-all duration-200">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button onClick={nextBanner} variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0 z-10 transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="inline-block bg-red-600 text-white font-bold mb-2 px-3 py-1 rounded-full text-xs mx-auto">
              ♦ {banner.title}
            </div>
            
            <h2 className="text-lg md:text-2xl font-bold mb-3 leading-tight px-4">
              {banner.subtitle}
            </h2>
            
            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-2 px-6 rounded-lg text-sm mx-auto transition-all duration-200" onClick={() => {
            if (banner.id === 5) {
              window.open('https://wa.me/5527996882090', '_blank');
            } else {
              document.getElementById('produtos')?.scrollIntoView({
                behavior: 'smooth'
              });
            }
          }}>
              {banner.buttonText}
            </Button>
          </div>
          
          <div className="hidden md:flex justify-center mt-4">
            <div className="relative">
              {banner.image.startsWith('/') ? <img src={banner.image} alt={banner.subtitle} className="w-60 h-20 object-cover rounded-lg" /> : <div className="w-60 h-20 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="text-4xl">{banner.image}</div>
                </div>}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => {})}
      </div>
    </section>;
};
export default HeroBannerCarousel;