
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResponsiveHeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      title: 'PlayStation 5',
      subtitle: 'A Nova Era do Gaming',
      description: 'Experimente a próxima geração de jogos com gráficos incríveis e carregamento ultrarrápido.',
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&h=600&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&h=300&fit=crop',
      cta: 'Ver PlayStation',
      path: '/categoria/playstation',
      gradient: 'from-blue-600/90 to-blue-800/90',
      price: 'A partir de R$ 3.999',
      badge: 'Disponível'
    },
    {
      id: 2,
      title: 'Xbox Series X|S',
      subtitle: 'Power Your Dreams',
      description: 'O console mais poderoso de todos os tempos. Jogue milhares de jogos de 4 gerações.',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&h=600&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop',
      cta: 'Ver Xbox',
      path: '/categoria/xbox',
      gradient: 'from-green-600/90 to-green-800/90',
      price: 'A partir de R$ 2.799',
      badge: 'Game Pass Incluído'
    },
    {
      id: 3,
      title: 'Nintendo Switch OLED',
      subtitle: 'Jogue em Casa ou Qualquer Lugar',
      description: 'A versão mais avançada do Switch com tela OLED vibrante e cores mais intensas.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      cta: 'Ver Nintendo',
      path: '/categoria/nintendo',
      gradient: 'from-red-600/90 to-red-800/90',
      price: 'A partir de R$ 2.299',
      badge: 'Edição OLED'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="relative h-[50vh] sm:h-[60vh] lg:h-[80vh] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={currentHero.mobileImage}
          />
          <img
            src={currentHero.image}
            alt={currentHero.title}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
        </picture>
        <div className={`absolute inset-0 bg-gradient-to-r ${currentHero.gradient}`}></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mb-4 animate-fade-in-up">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              {currentHero.badge}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {currentHero.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg sm:text-xl lg:text-2xl text-white/90 font-semibold mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {currentHero.subtitle}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-6 leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {currentHero.description}
            </p>

            {/* Price */}
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              {currentHero.price}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <Button
                onClick={() => navigate(currentHero.path)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
              >
                {currentHero.cta}
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-base font-semibold rounded-xl backdrop-blur-sm bg-white/10 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hidden sm:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hidden sm:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Swipe Indicator for Mobile */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/60 text-sm font-medium sm:hidden">
        Deslize para ver mais
      </div>
    </div>
  );
};

export default ResponsiveHeroBanner;
