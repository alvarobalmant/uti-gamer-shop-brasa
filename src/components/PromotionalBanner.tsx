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
<<<<<<< HEAD
      {/* Desktop layout - Text on left, Image on right */}
      <div className="hidden md:flex flex-row items-center">
        {/* Text Content Area */}
        <div className={cn(
          "flex-grow flex flex-col justify-center",
          "p-8 lg:p-10" // Adjusted padding for desktop
        )}>
          <h2 className={cn(
            "text-3xl lg:text-4xl font-bold mb-3", // Desktop text size
            textColor
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-lg mb-6 opacity-90", // Desktop description
            textColor
          )}>
            {description}
          </p>
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start mt-auto">
            <Button 
              variant="outline" 
              size="default" // Desktop button size
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
=======
      {/* Use flex layout for better control on mobile */}
      <div className="flex flex-row items-center">
        {/* Image Area - Fixed width on mobile, full height */}
        <div className={cn(
          "w-1/3 md:w-2/5 flex-shrink-0", // Adjust width ratio for mobile/desktop
          "h-24 md:h-auto md:aspect-[4/3]" // Fixed height on mobile, aspect ratio on desktop
        )}>
>>>>>>> 3739176a6305ba173c1daaa03279b27359ccfd4d
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
<<<<<<< HEAD
      </div>
      
      {/* Mobile layout - Text only, aligned left, rectangular */}
      <div className="flex md:hidden flex-col">
        {/* Text Content Area - Takes full width */}
        <div className={cn(
          "flex flex-col justify-center items-start", // Align items to start (left)
          "p-4 py-3" // Reduced padding for mobile, making it more rectangular
=======

        {/* Text Content Area */}
        <div className={cn(
          "flex-grow flex flex-col justify-center",
          "p-3 sm:p-4 md:p-8 lg:p-10" // Adjusted padding
>>>>>>> 3739176a6305ba173c1daaa03279b27359ccfd4d
        )}>
          <h2 className={cn(
            "text-base md:text-3xl lg:text-4xl font-bold mb-1 md:mb-3", // Adjusted mobile text size
            textColor
          )}>
            {title}
          </h2>
<<<<<<< HEAD
          {/* Description is implicitly removed as it's not rendered here */}
          <a href={buttonLink} target="_blank" rel="noopener noreferrer" className="self-start mt-1">
            <Button 
              variant="outline" 
              size="xs" // Small button for mobile
=======
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
              size="xs" // Keep small size for mobile
>>>>>>> 3739176a6305ba173c1daaa03279b27359ccfd4d
              className={cn(
                "bg-transparent border-white/80 hover:bg-white/10 active:bg-white/20",
                "text-xs px-2 py-1", // Adjusted padding for smaller button
                textColor
              )}
            >
              {buttonText}
<<<<<<< HEAD
              <ArrowRight className="ml-1 h-3 w-3" />
=======
              <ArrowRight className="ml-1 h-3 w-3" /> {/* Adjusted icon size slightly */}
>>>>>>> 3739176a6305ba173c1daaa03279b27359ccfd4d
            </Button>
          </a>
        </div>
        {/* No image area for mobile, leaving space implicitly to the right */}
      </div>
    </div>
  );
};

export default PromotionalBanner;
