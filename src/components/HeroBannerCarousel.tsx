
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBanners } from '@/hooks/useBanners';
import Autoplay from 'embla-carousel-autoplay';

const HeroBannerCarousel = () => {
  const { banners, loading, error } = useBanners();
  
  // Filter for active banners only
  const activeBanners = banners.filter(banner => banner.is_active);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
      </section>
    );
  }

  if (error || activeBanners.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">UTI DOS GAMES</h2>
              <p className="text-lg md:text-xl">Sua loja de games favorita</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {activeBanners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className={cn(
                "aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden relative",
                banner.background_type === 'gradient' 
                  ? `bg-gradient-to-r ${banner.gradient || 'from-blue-600 via-purple-600 to-red-600'}`
                  : 'bg-gray-900'
              )}>
                {banner.image_url && (
                  <img
                    src={banner.image_url}
                    alt={banner.title || 'Banner'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
                  <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-2xl text-white">
                      {banner.title && (
                        <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                          {banner.title}
                        </h1>
                      )}
                      {banner.subtitle && (
                        <p className="text-base md:text-xl mb-4 md:mb-6 opacity-90">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.button_text && banner.button_link && (
                        <Button 
                          asChild
                          size="lg"
                          className="bg-white text-black hover:bg-gray-100 font-semibold px-6 md:px-8"
                        >
                          <a href={banner.button_link}>
                            {banner.button_text}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {activeBanners.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default HeroBannerCarousel;
