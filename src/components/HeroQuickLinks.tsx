import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed useLocation
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useQuickLinks } from '@/hooks/useQuickLinks'; // Import the hook
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { useIsMobile } from '@/hooks/use-mobile';
// Removed import for saveScrollPosition as it's no longer called explicitly here
// import { saveScrollPosition } from '@/lib/scrollRestorationManager';

const HeroQuickLinks = () => {
  const navigate = useNavigate();
  // const location = useLocation(); // Removed useLocation
  const { quickLinks, loading, fetchQuickLinks } = useQuickLinks(); // Use the hook
  const isMobile = useIsMobile();

  // Fetch links when the component mounts
  useEffect(() => {
    fetchQuickLinks();
  }, [fetchQuickLinks]);

  const handleQuickLinkClick = (path: string) => {
    // Basic validation to prevent navigating to empty or invalid paths
    if (path && path.trim() !== '' && path !== '#') {
      // REMOVED the explicit call to saveScrollPosition
      // saveScrollPosition(location.pathname, 'HeroQuickLink click');
      navigate(path);
    } else {
      console.warn('Invalid path provided for quick link:', path);
    }
  };

  // Function to handle image loading errors
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Replace with a placeholder or hide the image
    event.currentTarget.src = '/placeholder-icon.svg'; // Ensure you have a placeholder icon at this path
    event.currentTarget.onerror = null; // Prevent infinite loop if placeholder also fails
  };

  return (
    <section className="py-8 md:py-12 bg-secondary border-t border-border/60">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {loading && (
            // Show skeletons while loading
            [...Array(6)].map((_, i) => (
              <Card key={`skeleton-${i}`} className="overflow-hidden bg-card border border-border/80 rounded-xl">
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 aspect-[4/3] sm:aspect-square">
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 mb-3 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          )}

          {!loading && quickLinks.length === 0 && (
            <p className="col-span-3 md:col-span-6 text-center text-muted-foreground py-8">
              Nenhum link rápido configurado.
            </p>
          )}

          {!loading && quickLinks.map((link) => (
            <Card
              key={link.id}
              onClick={() => handleQuickLinkClick(link.path)}
              className={cn(
                "overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out",
                "bg-card border border-border/80 rounded-xl",
                // Aplicar efeitos de hover apenas em desktop
                !isMobile && "hover:shadow-md hover:border-primary/40 hover:-translate-y-1"
              )}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 aspect-[4/3] sm:aspect-square">
                {/* Use img tag for the icon_url */}
                <img
                  src={link.icon_url}
                  alt={link.label} // Use label as alt text
                  className={cn(
                    "w-7 h-7 md:w-8 md:h-8 mb-3 object-contain transition-transform duration-300",
                    // Aplicar efeito de escala apenas em desktop
                    !isMobile && "group-hover:scale-110"
                  )}
                  loading="lazy"
                  onError={handleImageError} // Add error handler
                />
                {/* Adjusted font weight and color */}
                <span className={cn(
                  "text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight transition-colors duration-200",
                  // Aplicar mudança de cor apenas em desktop
                  !isMobile && "group-hover:text-primary"
                )}>
                  {link.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroQuickLinks;

