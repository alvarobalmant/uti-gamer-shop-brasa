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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-center">
        {/* Text Content Area (Takes more space on mobile, less on desktop) */}
        <div className="md:col-span-3 p-6 md:p-8 lg:p-10 flex flex-col justify-center order-2 md:order-1">
          <h2 className={cn(
            "text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3",
            textColor
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-base md:text-lg mb-4 md:mb-6 opacity-90",
            textColor
          )}>
            {description}
          </p>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start">
            <Button 
              variant="outline" // Outline style often works well on dark backgrounds
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
                textColor // Inherit text color, adjust as needed
              )}
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Image Area (Takes less space on mobile, more on desktop) */}
        <div className="md:col-span-2 h-32 sm:h-36 md:h-full order-1 md:order-2"> {/* Reduced height for mobile to make it more rectangular */}
          <img 
            src={imageUrl || "/placeholder-banner.webp"} 
            alt={title} 
            className="w-full h-full object-cover"
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

