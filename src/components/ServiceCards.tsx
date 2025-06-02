import { useServiceCards } from "@/hooks/useServiceCards";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowRight,
  Shield,
  Users,
  Award,
  Clock,
  Star,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle"; // Use the new SectionTitle component
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card"; // Use shadcn Card

// **Redesign - Applying responsive layouts and horizontal scroll**

const ServiceCards = () => {
  const { serviceCards, loading } = useServiceCards();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCardClick = (linkUrl: string) => {
    if (linkUrl.startsWith("http")) {
      window.open(linkUrl, "_blank");
    } else {
      navigate(linkUrl);
    }
  };

  // Store differentiators data
  const differentiators = [
    {
      icon: Award,
      title: "10+ Anos de Tradição",
      description: "Referência em games na região",
    },
    {
      icon: Users,
      title: "Especialistas em Games",
      description: "Equipe especializada e apaixonada",
    },
    {
      icon: Shield,
      title: "Garantia e Confiança",
      description: "Produtos e serviços com garantia",
    },
    {
      icon: Star,
      title: "Atendimento Personalizado",
      description: "Suporte dedicado a cada cliente",
    },
  ];

  if (loading) {
    // Simple loading state for all sections combined
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Main Services Section */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Nossos Serviços Especializados"
            subtitle="Mais de 10 anos oferecendo os melhores serviços em games para Colatina e região"
            className="text-center mb-8 md:mb-12"
          />

          {/* Service Cards - Horizontal Scroll on Mobile */}
          {serviceCards.length > 0 && (
            <div className="relative">
              <div
                className={cn(
                  "grid grid-cols-1 gap-6", // Base grid for structure
                  "md:grid-cols-2 lg:grid-cols-4", // Desktop grid
                  "md:overflow-visible md:pb-0", // No scroll needed on desktop
                  "overflow-x-auto pb-4 flex md:grid space-x-4 md:space-x-0", // Horizontal scroll on mobile
                  "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:mx-0 md:px-0" // Edge-to-edge padding on mobile
                )}
                style={{ scrollbarWidth: "none" }} // Hide scrollbar
              >
                {serviceCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="w-72 md:w-auto flex-shrink-0 md:flex-shrink" // Fixed width for mobile scroll
                  >
                    <Card
                      onClick={() => handleCardClick(card.link_url)}
                      className={cn(
                        "group h-full cursor-pointer transition-all duration-300 ease-in-out border border-border/80 rounded-xl overflow-hidden bg-card",
                        // Aplicar efeitos de hover apenas em desktop
                        !isMobile && "hover:shadow-lg hover:border-primary/40 hover:-translate-y-1"
                      )}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex-shrink-0">
                          <div className="relative w-14 h-14 mx-auto">
                            <div className={cn(
                              "w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center transition-transform duration-300",
                              // Aplicar efeito de escala apenas em desktop
                              !isMobile && "group-hover:scale-110"
                            )}>
                              <img
                                src={card.image_url}
                                alt=""
                                className="w-7 h-7 object-contain filter brightness-0 invert"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            {/* Optional: Green dot indicator */}
                            {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div> */}
                          </div>
                        </div>
                        <h3 className={cn(
                          "text-base font-semibold text-foreground mb-1 transition-colors duration-200",
                          // Aplicar mudança de cor apenas em desktop
                          !isMobile && "group-hover:text-primary"
                        )}>
                          {card.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {card.description}
                        </p>
                        <div className={cn(
                          "flex items-center justify-center text-primary transition-colors duration-300 font-medium text-xs mt-auto",
                          // Aplicar mudança de cor apenas em desktop
                          !isMobile && "group-hover:text-primary/80"
                        )}>
                          <span>Saiba mais</span>
                          <ArrowRight className={cn(
                            "w-3 h-3 ml-1 transition-transform duration-300",
                            // Aplicar efeito de movimento apenas em desktop
                            !isMobile && "group-hover:translate-x-0.5"
                          )} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Store Differentiators Section - Adjusted Mobile Layout */}
      <section className="py-12 md:py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Por que escolher a UTI DOS GAMES?"
            subtitle="Nossos diferenciais que fazem a diferença na sua experiência"
            className="text-center mb-8 md:mb-12"
            titleClassName="text-white"
            subtitleClassName="text-secondary-foreground/80"
          />

          {/* Differentiators Grid - Adjusted for Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {differentiators.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="mb-4">
                    <div className={cn(
                      "w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center transition-transform duration-300 shadow-lg",
                      // Aplicar efeito de escala apenas em desktop
                      !isMobile && "group-hover:scale-110"
                    )}>
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className={cn(
                    "text-sm font-semibold text-gray-800 mb-1 transition-colors duration-300",
                    // Aplicar mudança de cor apenas em desktop
                    !isMobile && "group-hover:text-primary/80"
                  )}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact/Help Section - Adjusted Mobile Layout */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg border border-border/60 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: CTA */}
              <div className="p-6 md:p-8 text-center md:text-left">
                <SectionTitle
                  title="Precisa de ajuda especializada?"
                  subtitle="Nossa equipe está pronta para atender você com a melhor experiência em games."
                  className="mb-6"
                />
                <a
                  href="https://wa.me/5527996882090" // Direct link
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 text-sm group",
                    // Aplicar efeitos de hover apenas em desktop
                    !isMobile && "hover:bg-green-700 hover:scale-105"
                  )}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Falar no WhatsApp</span>
                </a>
              </div>

              {/* Right: Contact Info */}
              <div className="bg-muted/50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-border/60">
                <h4 className="text-base font-semibold text-foreground mb-4">
                  Outras formas de contato
                </h4>
                <div className="space-y-3">
                  {[{
                      icon: Phone,
                      label: "(27) 99688-2090",
                      sublabel: "WhatsApp e Ligações",
                      color: "blue",
                    },
                    {
                      icon: Clock,
                      label: "Seg à Sex: 9h às 18h",
                      sublabel: "Horário de atendimento",
                      color: "orange",
                    },
                    {
                      icon: MapPin,
                      label: "Colatina - ES",
                      sublabel: "Venha nos visitar",
                      color: "red",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
                            `bg-${item.color}-100`
                          )}
                        >
                          <Icon className={cn("w-4 h-4", `text-${item.color}-600`)} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceCards;
