
import React from 'react';
import { useQuickLinks } from '@/hooks/useQuickLinks';
import { cn } from '@/lib/utils';

const HeroQuickLinks = () => {
  const { quickLinks, loading, error } = useQuickLinks();

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error || quickLinks.length === 0) {
    // Fallback quick links
    const fallbackLinks = [
      { id: '1', label: 'PlayStation', icon_url: '/lovable-uploads/136bb734-dc02-4a5a-a4b8-300ce6d655b1.png', path: '/categoria/playstation' },
      { id: '2', label: 'Xbox', icon_url: '/lovable-uploads/8cf1f59f-91ee-4e94-b333-02445409df1a.png', path: '/categoria/xbox' },
      { id: '3', label: 'Nintendo', icon_url: '/lovable-uploads/103e7d18-a70a-497f-a476-e6c513079b69.png', path: '/categoria/nintendo' },
      { id: '4', label: 'PC Games', icon_url: '/lovable-uploads/1415b5a0-5865-4967-bb92-9f2c3915e2c0.png', path: '/categoria/pc' },
      { id: '5', label: 'Acessórios', icon_url: '/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png', path: '/categoria/acessorios' },
      { id: '6', label: 'Retro', icon_url: '/lovable-uploads/ab54f665-ca93-42fa-9bca-d93b35cc87f7.png', path: '/categoria/retro' },
    ];

    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {fallbackLinks.map((link) => (
            <a
              key={link.id}
              href={link.path}
              className={cn(
                "group flex flex-col items-center p-4 rounded-lg transition-all duration-300",
                "hover:shadow-md hover:scale-105 hover:bg-white/50",
                "bg-white/30 backdrop-blur-sm border border-white/20"
              )}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mb-2 rounded-full overflow-hidden bg-white shadow-sm">
                <img
                  src={link.icon_url}
                  alt={link.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm md:text-base font-medium text-gray-800 text-center group-hover:text-primary">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickLinks
          .sort((a, b) => a.position - b.position)
          .map((link) => (
            <a
              key={link.id}
              href={link.path}
              className={cn(
                "group flex flex-col items-center p-4 rounded-lg transition-all duration-300",
                "hover:shadow-md hover:scale-105 hover:bg-white/50",
                "bg-white/30 backdrop-blur-sm border border-white/20"
              )}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mb-2 rounded-full overflow-hidden bg-white shadow-sm">
                <img
                  src={link.icon_url || '/placeholder.svg'}
                  alt={link.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm md:text-base font-medium text-gray-800 text-center group-hover:text-primary">
                {link.label}
              </span>
            </a>
          ))}
      </div>
    </section>
  );
};

export default HeroQuickLinks;
