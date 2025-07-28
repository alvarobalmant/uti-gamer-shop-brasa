import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedLazyImage = memo<OptimizedLazyImageProps>(({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Generate optimized image URLs
  const getOptimizedSrc = (originalSrc: string, width?: number, height?: number) => {
    // If it's a Supabase image, add optimization parameters
    if (originalSrc.includes('supabase') || originalSrc.includes('lovable-uploads')) {
      const url = new URL(originalSrc);
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      url.searchParams.set('quality', '85');
      url.searchParams.set('format', 'webp');
      return url.toString();
    }
    return originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    const sizes = [200, 400, 600, 800, 1200];
    return sizes
      .map(size => `${getOptimizedSrc(originalSrc, size)} ${size}w`)
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder component
  const Placeholder = () => (
    <div 
      className={cn(
        "bg-muted animate-pulse",
        className
      )}
      style={{ width, height }}
    >
      {placeholder && (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          {placeholder}
        </div>
      )}
    </div>
  );

  // Error fallback component
  const ErrorFallback = () => (
    <div 
      className={cn(
        "bg-muted border border-border flex items-center justify-center",
        className
      )}
      style={{ width, height }}
    >
      <span className="text-muted-foreground text-sm">Failed to load image</span>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div ref={containerRef} className="relative">
      {!isLoaded && <Placeholder />}
      
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          <source
            srcSet={generateSrcSet(src).replace(/\.(jpg|jpeg|png)/g, '.webp')}
            type="image/webp"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* AVIF source for even better compression */}
          <source
            srcSet={generateSrcSet(src).replace(/\.(jpg|jpeg|png)/g, '.avif')}
            type="image/avif"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={getOptimizedSrc(src, width, height)}
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            style={{
              display: isLoaded ? 'block' : 'none'
            }}
          />
        </picture>
      )}
    </div>
  );
});

OptimizedLazyImage.displayName = 'OptimizedLazyImage';

export default OptimizedLazyImage;