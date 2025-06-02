
import {
  Shield,
  Users,
  Award,
  Star,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
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

  return (
    <section className="py-12 md:py-16 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Por que escolher a UTI DOS GAMES?"
          subtitle="Nossos diferenciais que fazem a diferença na sua experiência"
          className="text-center mb-8 md:mb-12"
          titleClassName="text-white"
          subtitleClassName="text-secondary-foreground/80"
        />

        <div
          className={cn(
            "md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:max-w-4xl md:mx-auto",
            "flex overflow-x-auto space-x-6 pb-4 md:space-x-0 md:pb-0 md:overflow-visible",
            "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:mx-auto md:px-0"
          )}
          style={{ scrollbarWidth: "none" }}
        >
          {differentiators.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={cn(
                  "text-center group bg-secondary/50 p-4 rounded-lg transition-colors duration-300",
                  "w-64 sm:w-72 flex-shrink-0 md:w-auto md:flex-shrink",
                  // Apply hover background only on desktop
                  "md:hover:bg-secondary-foreground/10"
                )}
              >
                <div className="mb-4">
                  <div className={cn(
                    "w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg",
                    "transition-transform duration-300",
                    // Apply hover scale only on desktop
                    "md:group-hover:scale-110"
                  )}>
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <h3 className={cn(
                  "text-base font-semibold text-secondary-foreground mb-2",
                  "transition-colors duration-300",
                  // Apply hover color only on desktop
                  "md:group-hover:text-primary/80"
                )}>
                  {item.title}
                </h3>
                <p className="text-sm text-secondary-foreground/90 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
