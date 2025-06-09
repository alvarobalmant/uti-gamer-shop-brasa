
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useQuickLinks } from '@/hooks/useQuickLinks';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroQuickLinks = () => {
  const navigate = useNavigate();
  const { quickLinks, loading, fetchQuickLinks } = useQuickLinks();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchQuickLinks();
  }, [fetchQuickLinks]);

  const handleQuickLinkClick = (path: string) => {
    if (path && path.trim() !== '' && path !== '#') {
      navigate(path);
    } else {
      console.warn('Invalid path provided for quick link:', path);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/placeholder-icon.svg';
    event.currentTarget.onerror = null;
  };

  return (
    <section className="py-8 md:py-12 bg-secondary border-t border-border/60">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {loading && (
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
                // Remover hover effects no mobile
                "md:hover:shadow-md md:hover:border-primary/40 md:hover:-translate-y-1"
              )}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 aspect-[4/3] sm:aspect-square">
                <img
                  src={link.icon_url}
                  alt={link.label}
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 mb-3 object-contain transition-transform duration-300",
                    // Remover hover scale no mobile
                    "md:group-hover:scale-110"
                  )}
                  loading="lazy"
                  onError={handleImageError}
                />
                <span className={cn(
                  "text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center leading-tight transition-colors duration-200",
                  // Remover hover color no mobile
                  "md:group-hover:text-primary"
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
