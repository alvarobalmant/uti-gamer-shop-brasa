
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const DesktopHeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: BannerSlide[] = [
    {
      id: '1',
      title: 'Jogos Incríveis',
      subtitle: 'Os melhores preços de Colatina',
      ctaText: 'Entre em Contato',
      ctaLink: 'https://wa.me/5527996882090',
      image: '/lovable-uploads/8cf1f59f-91ee-4e94-b333-02445409df1a.png',
    },
    {
      id: '2',
      title: 'UTI PRO',
      subtitle: 'Descontos exclusivos para membros',
      ctaText: 'Entre em Contato',
      ctaLink: 'https://wa.me/5527996882090',
      image: '/lovable-uploads/103e7d18-a70a-497f-a476-e6c513079b69.png',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleCTAClick = (link: string) => {
    window.open(link, '_blank');
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative hidden lg:block">
      <div className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {/* Banner com fundo vermelho sólido - DESIGN ORIGINAL */}
            <div className="w-full h-full bg-red-600 relative">
              {/* Content */}
              <div className="relative h-full flex items-center justify-center text-center px-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 mb-8 text-xl">
                    {slide.subtitle}
                  </p>
                  <Button
                    onClick={() => handleCTAClick(slide.ctaLink)}
                    className="bg-white hover:bg-gray-100 text-red-600 px-12 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {slide.ctaText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <Button
              onClick={goToPrevious}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={goToNext}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DesktopHeroBanner;
