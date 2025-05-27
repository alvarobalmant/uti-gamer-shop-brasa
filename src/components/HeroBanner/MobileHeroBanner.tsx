
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
  mobileImage?: string;
}

const MobileHeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: BannerSlide[] = [
    {
      id: '1',
      title: 'Jogos Incríveis',
      subtitle: 'Os melhores preços de Colatina',
      ctaText: 'Ver Ofertas',
      ctaLink: '/categoria/ofertas',
      image: '/lovable-uploads/8cf1f59f-91ee-4e94-b333-02445409df1a.png',
    },
    {
      id: '2',
      title: 'UTI PRO',
      subtitle: 'Descontos exclusivos',
      ctaText: 'Saiba Mais',
      ctaLink: '/uti-pro',
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
    navigate(link);
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative lg:hidden">
      <div className="relative h-64 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center relative"
              style={{ 
                backgroundImage: `url(${slide.mobileImage || slide.image})`,
                backgroundPosition: 'center center'
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-white/90 mb-6 text-base">
                  {slide.subtitle}
                </p>
                <Button
                  onClick={() => handleCTAClick(slide.ctaLink)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-semibold rounded-lg min-h-[48px] shadow-lg"
                >
                  {slide.ctaText}
                </Button>
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={goToNext}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
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

export default MobileHeroBanner;
