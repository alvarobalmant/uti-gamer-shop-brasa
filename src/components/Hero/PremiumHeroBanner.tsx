
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const PremiumHeroBanner = () => {
  const { banners, loading } = useBanners();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Premium banner data with responsive considerations
  const premiumBanners = [
    {
      id: 1,
      type: 'image',
      background: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      title: 'Nova Geração',
      subtitle: 'PlayStation 5 & Xbox Series X/S',
      description: 'Experimente o futuro dos jogos com gráficos 4K, Ray Tracing e carregamento ultra-rápido',
      cta: 'Explorar Consoles',
      ctaLink: '/categoria/consoles',
      textPosition: 'left'
    },
    {
      id: 2,
      type: 'image',
      background: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop',
      title: 'Assistência Especializada',
      subtitle: 'Mais de 10 anos de experiência',
      description: 'Conserto, manutenção e upgrade para todos os tipos de consoles',
      cta: 'Agendar Serviço',
      ctaLink: '/servicos/assistencia',
      textPosition: 'center'
    },
    {
      id: 3,
      type: 'gradient',
      background: 'linear-gradient(135deg, #FF073A 0%, #7000FF 100%)',
      title: 'Ofertas Imperdíveis',
      subtitle: 'Até 50% OFF em jogos selecionados',
      description: 'Amplie sua coleção com os melhores preços da região',
      cta: 'Ver Ofertas',
      ctaLink: '/categoria/ofertas',
      textPosition: 'right'
    }
  ];

  const totalBanners = premiumBanners.length;

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting && isPlaying) {
        setCurrentBanner(prev => (prev + 1) % totalBanners);
      }
    }, 6000);
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
      if (isPlaying) startAutoPlay();
    }, 8000);
  };

  useEffect(() => {
    if (isPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isPlaying, isUserInteracting]);

  // Funções de navegação corrigidas
  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % totalBanners);
    resumeAutoPlayAfterDelay();
  };

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + totalBanners) % totalBanners);
    resumeAutoPlayAfterDelay();
  };

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
    resumeAutoPlayAfterDelay();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleButtonClick = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  const currentData = premiumBanners[currentBanner] || premiumBanners[0];

  if (loading) {
    return (
      <section className={`relative ${isMobile ? 'h-[300px]' : 'h-screen'} bg-gradient-to-r from-red-600 to-purple-600 overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl font-medium">Carregando experiência premium...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative ${isMobile ? 'h-[300px]' : 'h-screen'} overflow-hidden`}>
      {/* Background */}
      <div className="absolute inset-0">
        {currentData.type === 'image' ? (
          <img
            key={currentData.id}
            src={currentData.background}
            alt={currentData.title}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
        ) : (
          <div
            key={currentData.id}
            className="w-full h-full"
            style={{ background: currentData.background }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl ${
            currentData.textPosition === 'center' ? 'mx-auto text-center' :
            currentData.textPosition === 'right' ? 'ml-auto text-right' :
            'text-left'
          }`}>
            {/* Badge */}
            <div className="inline-block mb-4 md:mb-6 animate-fade-in-up">
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-medium">
                ✨ {currentData.title}
              </div>
            </div>

            {/* Main Heading */}
            <h1 className={`${isMobile ? 'text-2xl' : 'text-5xl md:text-6xl'} font-bold text-white mb-4 md:mb-6 leading-tight animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
              {currentData.subtitle}
            </h1>

            {/* Description */}
            <p className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} text-white/90 mb-6 md:mb-10 max-w-2xl animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
              {currentData.description}
            </p>

            {/* CTA Buttons */}
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col sm:flex-row gap-4'} animate-fade-in-up`} style={{ animationDelay: '0.6s' }}>
              <Button
                onClick={() => handleButtonClick(currentData.ctaLink)}
                className={`bg-red-600 hover:bg-red-700 text-white font-semibold ${isMobile ? 'py-3 px-6' : 'text-lg px-10 py-6'} shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                {currentData.cta}
              </Button>
              <Button
                onClick={() => navigate('/categoria/inicio')}
                variant="outline"
                className={`border-2 border-white/30 text-white hover:bg-white/10 font-semibold ${isMobile ? 'py-3 px-6' : 'text-lg px-10 py-6'} backdrop-blur-xl transition-all duration-300`}
              >
                Ver Catálogo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        {/* Indicators - Funcionais */}
        <div className="flex space-x-3">
          {premiumBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentBanner 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause - Funcional */}
        <button
          onClick={togglePlayPause}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Side Navigation - Funcionais */}
      <button
        onClick={prevBanner}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextBanner}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-white/30 transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Scroll Indicator - Desktop Only */}
      {!isMobile && (
        <div className="absolute bottom-8 right-8 text-white animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm opacity-70">Role para explorar</span>
            <div className="w-px h-8 bg-white/40"></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PremiumHeroBanner;
