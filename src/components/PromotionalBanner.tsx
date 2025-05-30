import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// Interface for the banner data (props)
interface PromotionalBannerProps {
  imageUrl: string;
  title: string;
  description: string;
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-center">
        {/* Text Content Area */}
        <div className={cn(
          "md:col-span-3 flex flex-col justify-center order-2 md:order-1",
          "p-3 md:p-8 lg:p-10" // Reduced padding on mobile
        )}>
          <h2 className={cn(
            "text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-3",
            textColor
          )}>
            {title}
          </h2>
          {/* Description hidden on mobile */}
          <p className={cn(
            "text-sm md:text-lg mb-3 md:mb-6 opacity-90",
            "hidden md:block", // Hide on mobile, show on md and up
            textColor
          )}>
            {description}
          </p>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start">
            <Button 
              variant="outline" 
              size="xs" // Reduced button size on mobile
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
                "text-xs", // Reduced text size on mobile
                textColor
              )}
            >
              {buttonText}
              <ArrowRight className="ml-1.5 h-3 w-3" /> {/* Adjusted icon size slightly */}
            </Button>
          </a>
        </div>

        {/* Image Area */}
        <div className={cn(
          "md:col-span-2 order-1 md:order-2",
          "h-12 sm:h-16 md:h-full" // Reduced height for mobile/sm
        )}>
          <img 
            src={imageUrl || "/placeholder-banner.webp"} 
            alt={title} 
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-banner-error.webp";
            }} 
            loading="lazy" 
            className="w-full h-full object-cover" // Removed md:object-scale-down to ensure cover
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;

