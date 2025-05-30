import { useServiceCards } from "@/hooks/useServiceCards";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const SpecializedServices = () => {
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

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nossos Serviços Especializados"
          subtitle="Mais de 10 anos oferecendo os melhores serviços em games para Colatina e região"
          className="text-center mb-8 md:mb-12"
        />

        {loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-60 w-full" />)}
           </div>
        )}

        {!loading && serviceCards.length > 0 && (
          <div className="relative">
            <div
              className={cn(
                "grid grid-cols-1 gap-6",
                "md:grid-cols-2 lg:grid-cols-4",
                "md:overflow-visible md:pb-0",
                "overflow-x-auto pb-4 flex md:grid space-x-4 md:space-x-0",
                "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:mx-0 md:px-0"
              )}
              style={{ scrollbarWidth: "none" }}
            >
              {serviceCards.map((card) => (
                <div
                  key={card.id}
                  className="w-72 md:w-auto flex-shrink-0 md:flex-shrink"
                >
                  <Card
                    onClick={() => handleCardClick(card.link_url)}
                    className="group h-full cursor-pointer transition-all duration-300 ease-in-out border border-border/80 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 bg-card"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="mb-4 flex-shrink-0">
                        <div className="relative w-14 h-14 mx-auto">
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {!imageErrors[card.id] && card.image_url ? (
                              <img
                                src={card.image_url}
                                alt={card.title}
                                className="w-7 h-7 object-contain filter brightness-0 invert"
                                loading="lazy"
                                onError={() => handleImageError(card.id)}
                              />
                            ) : (
                              // Fallback icon when image fails to load or is missing
                              <div className="w-7 h-7 flex items-center justify-center text-primary-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                                  <line x1="12" y1="22" x2="12" y2="12"></line>
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                        {card.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-center text-primary group-hover:text-primary/80 transition-colors duration-300 font-medium text-xs mt-auto">
                        <span>Saiba mais</span>
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
         {!loading && serviceCards.length === 0 && (
             <p className="text-center text-muted-foreground">Nenhum serviço cadastrado.</p>
         )}
      </div>
    </section>
  );
};

export default SpecializedServices;
