
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  MonitorSpeaker, 
  Headphones, 
  Gift, 
  Puzzle, 
  MousePointer,
  Flame, // Icon for Ofertas
  Package // Icon for Colecionáveis
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card'; // Use shadcn Card

// Define the structure for a quick link
interface QuickLinkItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
}

const HeroQuickLinks = () => {
  const navigate = useNavigate();

  // Define the quick links data - simplified, colors removed
  const quickLinks: QuickLinkItem[] = [
    {
      id: 'playstation',
      icon: Gamepad2,
      label: 'PlayStation',
      path: '/categoria/playstation',
    },
    {
      id: 'xbox',
      icon: Gamepad2,
      label: 'Xbox',
      path: '/categoria/xbox',
    },
    {
      id: 'nintendo',
      icon: Gamepad2,
      label: 'Nintendo',
      path: '/categoria/nintendo',
    },
    {
      id: 'pc',
      icon: MonitorSpeaker,
      label: 'PC Gamer',
      path: '/categoria/pc',
    },
    {
      id: 'acessorios',
      icon: Headphones, // Or MousePointerSquare
      label: 'Acessórios',
      path: '/categoria/acessorios',
    },
    {
      id: 'ofertas',
      icon: Flame, // Using Flame for Ofertas
      label: 'Ofertas',
      path: '/categoria/ofertas',
    },
    // Add Colecionáveis if it exists as a category
    // {
    //   id: 'colecionaveis',
    //   icon: Package, // Using Package for Colecionáveis
    //   label: 'Colecionáveis',
    //   path: '/categoria/colecionaveis',
    // },
  ];

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    // Section styling: Light gray background, padding, subtle border top
    <section className="py-8 md:py-12 bg-secondary border-t border-border/60">
      <div className="container mx-auto">
        {/* Use grid for layout, responsive columns */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              // Use Card component for structure and styling
              <Card 
                key={link.id}
                onClick={() => handleQuickLinkClick(link.path)}
                className={cn(
                  "overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out",
                  "bg-card border border-border/80 rounded-xl", // Use card background, subtle border, defined radius
                  "hover:shadow-md hover:border-primary/40 hover:-translate-y-1" // Hover effects: shadow, primary border, lift
                )}
              >
                {/* Flex container for icon and text */}
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 aspect-[4/3] sm:aspect-square">
                  {/* Icon styling: Use primary color */}
                  <IconComponent className="w-7 h-7 md:w-8 md:h-8 mb-3 text-primary transition-transform duration-300 group-hover:scale-110" />
                  
                  {/* Label styling: Clear typography */}
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight group-hover:text-primary transition-colors duration-200">
                    {link.label}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroQuickLinks;

