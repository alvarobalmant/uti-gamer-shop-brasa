import {
  Shield,
  Users,
  Award,
  Star,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
  // Store differentiators data (moved from ServiceCards.tsx)
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
          titleClassName="text-white" // Adjusted for secondary background
          subtitleClassName="text-secondary-foreground/80" // Adjusted for secondary background
        />

        {/* Differentiators Grid - Improved for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 max-w-4xl mx-auto">
          {differentiators.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="text-center group bg-secondary/50 p-4 rounded-lg hover:bg-secondary-foreground/10 transition-colors duration-300">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {/* Ensure icon color contrasts with primary gradient */}
                    <IconComponent className="w-8 h-8 text-primary-foreground" /> 
                  </div>
                </div>
                {/* Improved text contrast and sizing */}
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-primary/80 transition-colors duration-300">
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
