import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// Interface for the banner data (props)
interface PromotionalBannerProps {
  imageUrl: string;
  title: string;
  description: string; // Keep description for desktop
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string; // Optional background color override
  textColor?: string; // Optional text color override
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  imageUrl,
  title,
  description,
  buttonText,
  buttonLink,
  backgroundColor = 'bg-gradient-to-r from-uti-dark to-uti-dark/90',
  textColor = 'text-white'
}) => {
  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-lg my-6 md:my-8", // Margin top/bottom
      backgroundColor
    )}>
      {/* Desktop layout - Image on right */}
      <div className="hidden md:flex flex-row items-center">
        {/* Text Content Area */}
        <div className={cn(
          "flex-grow flex flex-col justify-center",
          "p-8 lg:p-10" // Adjusted padding
        )}>
          <h2 className={cn(
            "text-3xl lg:text-4xl font-bold mb-3", // Adjusted text size
            textColor
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-lg mb-6 opacity-90",
            textColor
          )}>
            {description}
          </p>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start mt-auto">
            <Button 
              variant="outline" 
              size="default"
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
                textColor
              )}
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
        
        {/* Image Area - Fixed width on desktop */}
        <div className="w-2/5 flex-shrink-0 h-auto aspect-[4/3]">
          <img 
            src={imageUrl || "/placeholder-banner.webp"} 
            alt={title} 
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-banner-error.webp";
            }} 
            loading="lazy" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      
      {/* Mobile layout - Text only, aligned left */}
      <div className="flex md:hidden flex-col">
        <div className={cn(
          "flex flex-col justify-center",
          "p-4 py-3" // Reduced padding for mobile
        )}>
          <h2 className={cn(
            "text-base font-bold mb-1", // Smaller text for mobile
            textColor
          )}>
            {title}
          </h2>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start mt-1">
            <Button 
              variant="outline" 
              size="xs"
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
                "text-xs px-2 py-1", // Adjusted padding for smaller button
                textColor
              )}
            >
              {buttonText}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
