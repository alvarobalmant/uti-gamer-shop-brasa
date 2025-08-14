import { useServiceCards } from "@/hooks/useServiceCards";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Gamepad2, Wrench, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const SpecializedServicesUltraCompact = () => {
  const { serviceCards, loading } = useServiceCards();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleCardClick = (linkUrl: string) => {
    if (linkUrl.startsWith("http")) {
      window.open(linkUrl, "_blank");
    } else {
      navigate(linkUrl);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Ícones únicos para cada serviço
  const serviceIcons = [Gamepad2, Wrench, Search, Settings];

  // Cores alinhadas com o design da UTI dos Games
  const cardGradients = [
    "from-red-500 via-red-600 to-red-700",
    "from-blue-500 via-blue-600 to-blue-700", 
    "from-green-500 via-green-600 to-green-700",
    "from-purple-500 via-purple-600 to-purple-700"
  ];

  const cardBorders = [
    "border-red-200 hover:border-red-300 shadow-red-500/10",
    "border-blue-200 hover:border-blue-300 shadow-blue-500/10",
    "border-green-200 hover:border-green-300 shadow-green-500/10", 
    "border-purple-200 hover:border-purple-300 shadow-purple-500/10"
  ];

  const cardBackgrounds = [
    "bg-red-50/50 hover:bg-red-50",
    "bg-blue-50/50 hover:bg-blue-50",
    "bg-green-50/50 hover:bg-green-50", 
    "bg-purple-50/50 hover:bg-purple-50"
  ];

  return (
    <section className="relative py-6 md:py-8 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Elementos decorativos sutis - reduzidos */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-4 left-4 w-12 h-12 bg-red-100 rounded-full opacity-30"></div>
        <div className="absolute top-6 right-6 w-10 h-10 bg-blue-100 rounded-full opacity-40"></div>
        <div className="absolute bottom-6 left-1/4 w-8 h-8 bg-green-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-4 right-1/3 w-10 h-10 bg-purple-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header ultra-compacto */}
        <div className="text-center mb-6 md:mb-8">
          {/* Título ultra-compacto */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent">
              Serviços
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Especializados
            </span>
          </h2>
          
          {/* Subtítulo ultra-compacto */}
          <div className="max-w-xl mx-auto">
            <p className="text-base md:text-lg text-gray-700 leading-snug">
              Mais de <span className="font-black text-red-600 text-lg md:text-xl">10 anos</span> oferecendo
              os melhores serviços em games para <span className="font-bold text-red-600">Colatina e região</span>
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 md:h-36 w-full bg-gray-200 rounded-xl" />
            ))}
          </div>
        )}

        {!loading && serviceCards.length > 0 && (
          <div className="relative">
            {/* Grid ultra-compacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              {serviceCards.map((card, index) => {
                const IconComponent = serviceIcons[index % 4];
                
                return (
                  <div 
                    key={card.id} 
                    className="group relative transform transition-all duration-300 hover:scale-[1.01]"
                  >
                    {/* Card ultra-compacto */}
                    <Card
                      onClick={() => handleCardClick(card.link_url)}
                      className={cn(
                        "relative rounded-xl h-full cursor-pointer overflow-hidden border transition-all duration-300 shadow-md",
                        cardBorders[index % 4],
                        cardBackgrounds[index % 4],
                        "hover:shadow-lg hover:-translate-y-0.5"
                      )}
                    >
                      <CardContent className="p-4 md:p-5 h-full relative">
                        
                        {/* Número sutil no fundo - menor */}
                        <div className="absolute top-1 right-1 opacity-6">
                          <span className="text-4xl md:text-5xl font-black text-gray-200">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        
                        {/* Header do card ultra-compacto */}
                        <div className="relative mb-3">
                          <div className={cn(
                            "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 mb-3",
                            cardGradients[index % 4]
                          )}>
                            {!imageErrors[card.id] && card.image_url ? (
                              <img
                                src={card.image_url}
                                alt={card.title}
                                className="w-6 h-6 md:w-7 md:h-7 object-contain filter brightness-0 invert"
                                loading="lazy"
                                onError={() => handleImageError(card.id)}
                              />
                            ) : (
                              <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            )}
                          </div>
                        </div>
                        
                        {/* Conteúdo do card ultra-compacto */}
                        <div className="relative z-10">
                          <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-red-700 transition-colors duration-300">
                            {card.title}
                          </h3>
                          
                          <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-3 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
                            {card.description}
                          </p>
                          
                          {/* Call to action ultra-compacto */}
                          <div className={cn(
                            "inline-flex items-center gap-1.5 bg-gradient-to-r text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-md text-xs md:text-sm",
                            cardGradients[index % 4]
                          )}>
                            <span>Saiba mais</span>
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                        
                        {/* Elemento decorativo sutil - menor */}
                        <div className={cn(
                          "absolute -bottom-2 -right-2 w-8 h-8 rounded-full opacity-5 transition-all duration-300 group-hover:scale-125 group-hover:opacity-10",
                          cardGradients[index % 4].replace('to-', 'to-transparent from-')
                        )}></div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Call to action final ultra-compacto */}
            <div className="text-center">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-black py-3 px-6 rounded-xl text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Descubra Todos os Nossos Serviços</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && serviceCards.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-base">Nenhum serviço cadastrado.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecializedServicesUltraCompact;

