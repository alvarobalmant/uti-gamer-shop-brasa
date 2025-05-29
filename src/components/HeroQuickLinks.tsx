import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Gamepad2, 
  MonitorSpeaker, 
  Headphones, 
  Gift, 
  Puzzle, // Using Puzzle for Colecionáveis
  MousePointerSquare // Using MousePointerSquare for Acessórios
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components

// Define the structure for a quick link
interface QuickLinkItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  color: string; // Tailwind background color class
  hoverColor: string; // Tailwind hover background color class
  borderColor?: string; // Optional border color
}

const HeroQuickLinks = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Define the quick links data using the interface
  const quickLinks: QuickLinkItem[] = [
    {
      id: 'playstation',
      icon: Gamepad2,
      label: 'PlayStation',
      path: '/categoria/playstation',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      borderColor: 'border-blue-600'
    },
    {
      id: 'xbox',
      icon: Gamepad2,
      label: 'Xbox',
      path: '/categoria/xbox',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      borderColor: 'border-green-600'
    },
    {
      id: 'nintendo',
      icon: Gamepad2,
      label: 'Nintendo',
      path: '/categoria/nintendo',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      borderColor: 'border-red-600'
    },
    {
      id: 'pc',
      icon: MonitorSpeaker,
      label: 'PC Gaming',
      path: '/categoria/pc',
      color: 'bg-gray-700', // Changed color for PC
      hoverColor: 'hover:bg-gray-800',
      borderColor: 'border-gray-800'
    },
    {
      id: 'acessorios',
      icon: Headphones, // Kept Headphones, or use MousePointerSquare
      label: 'Acessórios',
      path: '/categoria/acessorios',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      borderColor: 'border-purple-600'
    },
    {
      id: 'ofertas',
      icon: Gift,
      label: 'Ofertas',
      path: '/categoria/ofertas',
      color: 'bg-uti-red', // Use brand red
      hoverColor: 'hover:bg-red-700',
      borderColor: 'border-red-700'
    }
    // Add 'Colecionáveis' if needed
    // {
    //   id: 'colecionaveis',
    //   icon: Puzzle,
    //   label: 'Colecionáveis',
    //   path: '/categoria/colecionaveis',
    //   color: 'bg-yellow-500',
    //   hoverColor: 'hover:bg-yellow-600',
    //   borderColor: 'border-yellow-600'
    // }
  ];

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    // Section styling: White background, subtle top border, padding
    <section className="py-6 md:py-10 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Use grid for layout, responsive columns */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              // Use Card component for structure and styling
              <Card 
                key={link.id}
                onClick={() => handleQuickLinkClick(link.path)}
                className={cn(
                  "overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out",
                  "hover:shadow-md hover:-translate-y-1 border-2 border-transparent",
                  `hover:border-opacity-50 ${link.borderColor}` // Use specific border color on hover
                )}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-5 aspect-square">
                  {/* Icon container with background color */}
                  <div className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-300",
                    link.color,
                    // link.hoverColor // Hover effect can be on the card itself
                  )}>
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  {/* Label styling */}
                  <span className="text-xs sm:text-sm font-medium text-gray-800 text-center leading-tight">
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

