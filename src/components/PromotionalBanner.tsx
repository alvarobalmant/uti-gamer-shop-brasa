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
      {/* Use flex layout for better control on mobile */}
      <div className="flex flex-row items-center">
        {/* Image Area - Fixed width on mobile, full height */}
        <div className={cn(
          "w-1/3 md:w-2/5 flex-shrink-0", // Adjust width ratio for mobile/desktop
          "h-24 md:h-auto md:aspect-[4/3]" // Fixed height on mobile, aspect ratio on desktop
        )}>
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

        {/* Text Content Area */}
        <div className={cn(
          "flex-grow flex flex-col justify-center",
          "p-3 sm:p-4 md:p-8 lg:p-10" // Adjusted padding
        )}>
          <h2 className={cn(
            "text-base md:text-3xl lg:text-4xl font-bold mb-1 md:mb-3", // Adjusted mobile text size
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
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start mt-auto">
            <Button 
              variant="outline" 
<<<<<<< HEAD
              size="xs" // Keep small size for mobile
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
                "text-xs px-2 py-1", // Adjusted padding for smaller button
=======
              size="xs"
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
>>>>>>> ab4a43026c025f1f4a4eb058d8b0604d2684adfe
                textColor
              )}
            >
              {buttonText}
<<<<<<< HEAD
              <ArrowRight className="ml-1 h-3 w-3" /> {/* Adjusted icon size slightly */}
=======
              <ArrowRight className="ml-1.5 h-3 w-3" />
>>>>>>> ab4a43026c025f1f4a4eb058d8b0604d2684adfe
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
