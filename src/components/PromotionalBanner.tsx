
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PromotionalBannerProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
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
      "rounded-lg overflow-hidden shadow-lg my-4", // Reduced margin
      backgroundColor
    )}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-center min-h-[120px] md:min-h-[140px]"> {/* Much reduced height */}
        {/* Text Content Area */}
        <div className="md:col-span-3 p-4 md:p-6 flex flex-col justify-center order-2 md:order-1">
          <h2 className={cn(
            "text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2", // Reduced text sizes and margins
            textColor
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-sm md:text-base mb-3 md:mb-4 opacity-90", // Reduced text size and margin
            textColor
          )}>
            {description}
          </p>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start">
            <Button 
              variant="outline"
              size="sm" // Smaller button
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20 text-sm", // Smaller text
                textColor
              )}
            >
              {buttonText}
              <ArrowRight className="ml-2 h-3 w-3" /> {/* Smaller icon */}
            </Button>
          </a>
        </div>

        {/* Image Area - Much reduced height */}
        <div className="md:col-span-2 h-16 sm:h-20 md:h-[120px] lg:h-[140px] order-1 md:order-2"> {/* Drastically reduced heights */}
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
