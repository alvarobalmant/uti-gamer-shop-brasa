import {
  Shield,
  Users,
  Award,
  Star,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
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

  return (
    <section className="py-12 md:py-16 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Por que escolher a UTI DOS GAMES?"
          subtitle="Nossos diferenciais que fazem a diferença na sua experiência"
          className="text-center mb-8 md:mb-12"
          titleClassName="text-white" // Title of the section itself
          subtitleClassName="text-secondary-foreground/80"
        />

        {/* Differentiators - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div
          className={cn(
            "md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:max-w-4xl md:mx-auto", // Grid layout for medium screens and up
            "flex overflow-x-auto space-x-6 pb-4 md:space-x-0 md:pb-0 md:overflow-visible", // Flex layout with horizontal scroll for mobile
            "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 md:mx-auto md:px-0" // Adjust padding for scroll overflow
          )}
          style={{ scrollbarWidth: "none" }} // Hide scrollbar
        >
          {differentiators.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                // Set width for mobile flex items, allow grid to control width on larger screens
                className="text-center group bg-secondary/50 p-4 rounded-lg hover:bg-secondary-foreground/10 transition-colors duration-300 w-64 sm:w-72 flex-shrink-0 md:w-auto md:flex-shrink"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                {/* Corrected title color for better contrast */}
                <h3 className="text-base font-semibold text-secondary-foreground mb-2 group-hover:text-primary/80 transition-colors duration-300">
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

