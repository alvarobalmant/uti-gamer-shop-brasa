
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 1,
    title: "PROS GET 5% EXTRA OFF + 5% EXTRA TRADE CREDIT",
    subtitle: "Compre e Venda Seus Games na UTI DOS GAMES!",
    buttonText: "Entre em Contato",
    gradient: "from-purple-600 via-red-600 to-orange-500",
    image: "/lovable-uploads/ab54f665-ca93-42fa-9bca-d93b35cc87f7.png"
  },
  {
    id: 2,
    title: "MAIS DE 10 ANOS NO MERCADO",
    subtitle: "Os Melhores Games e Consoles!",
    buttonText: "Ver Produtos",
    gradient: "from-red-700 via-red-600 to-red-500",
    image: "🎮"
  },
  {
    id: 3,
    title: "FRETE GRÁTIS ACIMA DE R$ 200",
    subtitle: "Entrega rápida e segura em todo o Brasil",
    buttonText: "Aproveitar",
    gradient: "from-blue-600 via-purple-600 to-red-600",
    image: "🚚"
  },
  {
    id: 4,
    title: "PARCELAMOS EM ATÉ 12X",
    subtitle: "Sem juros no cartão de crédito",
    buttonText: "Comprar Agora",
    gradient: "from-red-600 via-orange-500 to-yellow-500",
    image: "💳"
  },
  {
    id: 5,
    title: "WHATSAPP: (27) 99688-2090",
    subtitle: "Atendimento personalizado e rápido",
    buttonText: "Chamar no WhatsApp",
    gradient: "from-green-600 via-red-600 to-red-700",
    image: "📱"
  }
];

const HeroBannerCarousel = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const banner = banners[currentBanner];

  return (
    <section className="relative bg-gray-900 overflow-hidden">
      {/* Banner Principal */}
      <div className={`relative bg-gradient-to-br ${banner.gradient} text-white transition-all duration-500`}>
        <div className="px-4 py-12 relative">
          {/* Controles de navegação */}
          <Button
            onClick={prevBanner}
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={nextBanner}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="text-center mb-8">
            {/* Badge do topo */}
            <div className="inline-block bg-red-600 text-white font-bold mb-4 px-4 py-2 rounded-full text-sm">
              ♦ {banner.title}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              {banner.subtitle}
            </h2>
            
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg"
              onClick={() => {
                if (banner.id === 5) {
                  window.open('https://wa.me/5527996882090', '_blank');
                } else {
                  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {banner.buttonText}
            </Button>
          </div>
          
          {/* Imagem/Emoji do banner */}
          <div className="flex justify-center">
            <div className="relative">
              {banner.image.startsWith('/') ? (
                <img 
                  src={banner.image} 
                  alt={banner.subtitle}
                  className="w-80 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-80 h-32 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="text-6xl">{banner.image}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de paginação */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentBanner ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBannerCarousel;
