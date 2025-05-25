
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanners } from '@/hooks/useBanners';
import { useNavigate } from 'react-router-dom';

const PremiumHeroBanner = () => {
  const { banners, loading } = useBanners();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Premium banner data with video backgrounds
  const premiumBanners = [
    {
      id: 1,
      type: 'video',
      background: 'https://player.vimeo.com/external/373424663.sd.mp4?s=e90dcaba73c19c6c9d0ee2ecc2b8fb82e6e2da9a&profile_id=164&oauth2_token_id=57447761',
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
      background: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
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

  const currentData = premiumBanners[currentBanner] || premiumBanners[0];

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isUserInteracting && isPlaying) {
        setCurrentBanner(prev => (prev + 1) % premiumBanners.length);
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

  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % premiumBanners.length);
    resumeAutoPlayAfterDelay();
  };

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + premiumBanners.length) % premiumBanners.length);
    resumeAutoPlayAfterDelay();
  };

  const handleButtonClick = (link: string) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen bg-gradient-hero overflow-hidden">
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
    <section className="relative h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {currentData.type === 'video' ? (
          <video
            key={currentData.id}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src={currentData.background} type="video/mp4" />
          </video>
        ) : currentData.type === 'image' ? (
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
        <div className="container-premium">
          <div className={`max-w-4xl ${
            currentData.textPosition === 'center' ? 'mx-auto text-center' :
            currentData.textPosition === 'right' ? 'ml-auto text-right' :
            'text-left'
          }`}>
            {/* Badge */}
            <div className="inline-block mb-6 animate-fade-in-up">
              <div className="glass-effect text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-xl">
                ✨ {currentData.title}
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-hero text-white mb-6 leading-none animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {currentData.subtitle}
            </h1>

            {/* Description */}
            <p className="text-body-large text-white/90 mb-10 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {currentData.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button
                onClick={() => handleButtonClick(currentData.ctaLink)}
                className="btn-primary text-lg px-10 py-6 shadow-2xl"
              >
                {currentData.cta}
              </Button>
              <Button
                onClick={() => navigate('/categoria/inicio')}
                className="btn-ghost text-white border-2 border-white/30 hover:bg-white/10 text-lg px-10 py-6 backdrop-blur-xl"
              >
                Ver Catálogo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        {/* Indicators */}
        <div className="flex space-x-3">
          {premiumBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentBanner(index);
                resumeAutoPlayAfterDelay();
              }}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentBanner 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="glass-effect text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Side Navigation */}
      <button
        onClick={prevBanner}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 glass-effect text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextBanner}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 glass-effect text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-xl"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm opacity-70">Role para explorar</span>
          <div className="w-px h-8 bg-white/40"></div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHeroBanner;
