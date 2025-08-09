import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useQuickLinks } from '@/hooks/useQuickLinks';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroQuickLinks = React.memo(() => {
  const navigate = useNavigate();
  const { quickLinks, loading, fetchQuickLinks } = useQuickLinks();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchQuickLinks();
  }, [fetchQuickLinks]);

  const handleQuickLinkClick = useCallback((path: string) => {
    if (path && path.trim() !== '' && path !== '#') {
      navigate(path);
    } else {
      console.warn('Invalid path provided for quick link:', path);
    }
  }, [navigate]);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/placeholder-icon.svg';
    event.currentTarget.onerror = null;
  }, []);

  // Memoizar skeleton loading
  const skeletonItems = useMemo(() => 
    [...Array(6)].map((_, i) => (
      <div key={`skeleton-${i}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border/60">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    )), 
    []
  );

  // Memoizar componente de link
  const QuickLinkButton = React.memo(({ link }: { link: any }) => (
    <button
      onClick={() => handleQuickLinkClick(link.path)}
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 rounded-full",
        "bg-white border border-border/60 shadow-sm",
        "hover:bg-gray-50 hover:border-primary/50 hover:shadow-md",
        "transition-all duration-200 ease-in-out",
        "group cursor-pointer"
      )}
    >
      <img
        src={link.icon_url}
        alt={link.label}
        className="w-5 h-5 object-contain transition-transform duration-200 group-hover:scale-110"
        loading="lazy"
        onError={handleImageError}
      />
      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-200">
        {link.label}
      </span>
    </button>
  ));

  return (
    <section className="py-6 md:py-8 bg-gray-50/50 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          {loading && skeletonItems}

          {!loading && quickLinks.length === 0 && (
            <p className="text-center text-muted-foreground py-4 w-full">
              Nenhum link rápido configurado.
            </p>
          )}

          {!loading && quickLinks.map((link) => (
            <QuickLinkButton key={link.id} link={link} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default HeroQuickLinks;

