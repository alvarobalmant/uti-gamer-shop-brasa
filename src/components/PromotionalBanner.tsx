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

// **New Component based on GameStop reference and user request**
const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  imageUrl,
  title,
  description,
  buttonText,
  buttonLink,
  backgroundColor = 'bg-gradient-to-r from-uti-dark to-uti-dark/90', // Default dark background
  textColor = 'text-white'
}) => {
  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-lg my-6 md:my-8", // Margin top/bottom
      backgroundColor
    )}>
    <div className={cn(
      "rounded-lg overflow-hidden shadow-lg my-6 md:my-8", // Margin top/bottom
      backgroundColor
    )}>
      {/* Adjusted grid for better mobile aspect ratio */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-0 items-stretch"> {/* Changed grid-cols-1 to grid-cols-3, items-center to items-stretch */}
        {/* Text Content Area */}
        <div className="col-span-2 sm:col-span-3 p-4 md:p-8 lg:p-10 flex flex-col justify-center order-2 sm:order-1"> {/* Adjusted col-span and order */}
          <h2 className={cn(
            "text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-3", // Adjusted mobile font size
            textColor
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-xs sm:text-sm md:text-lg mb-3 md:mb-6 opacity-90", // Adjusted mobile font size
            textColor
          )}>
            {description}
          </p>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start mt-auto"> {/* Added mt-auto to push button down */}
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20 text-xs md:text-sm", 
                textColor 
              )}
            >
              {buttonText}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        {/* Image Area */}
        <div className="col-span-1 sm:col-span-2 order-1 sm:order-2"> {/* Adjusted col-span and order */}
          <img 
            src={imageUrl || "/placeholder-banner.webp"} 
            alt={title} 
            className="w-full h-full object-cover min-h-[100px] sm:min-h-[120px]" /* Ensure image takes full height and has min-height */
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-banner-error.webp";
            }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;

