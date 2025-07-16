import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  quality = 75,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Começar a carregar 50px antes de entrar na viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Gerar URLs otimizadas
  const generateOptimizedSrc = useCallback((originalSrc: string, format?: string) => {
    // Se for uma URL do Supabase/Lovable, adicionar parâmetros de otimização
    if (originalSrc.includes('lovable-uploads') || originalSrc.includes('supabase')) {
      const url = new URL(originalSrc);
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      if (quality) url.searchParams.set('quality', quality.toString());
      if (format) url.searchParams.set('format', format);
      return url.toString();
    }
    return originalSrc;
  }, [width, height, quality]);

  // Gerar srcSet para diferentes formatos e tamanhos
  const generateSrcSet = useCallback(() => {
    if (!width) return undefined;

    const sizes = [width, width * 1.5, width * 2];
    return sizes
      .map(size => `${generateOptimizedSrc(src, 'webp')}?width=${size} ${size}w`)
      .join(', ');
  }, [src, width, generateOptimizedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Placeholder enquanto carrega
  const renderPlaceholder = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        />
      );
    }

    return (
      <div
        className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden="true"
      />
    );
  };

  // Fallback para erro
  const renderErrorFallback = () => (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <svg
          className="w-8 h-8 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs">Imagem não disponível</span>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!hasError && renderPlaceholder()}

      {/* Imagem principal */}
      {isInView && !hasError && (
        <picture>
          {/* WebP para navegadores compatíveis */}
          <source
            srcSet={generateOptimizedSrc(src, 'webp')}
            type="image/webp"
            sizes={sizes}
          />
          
          {/* AVIF para navegadores mais modernos */}
          <source
            srcSet={generateOptimizedSrc(src, 'avif')}
            type="image/avif"
            sizes={sizes}
          />
          
          {/* Fallback para formatos tradicionais */}
          <img
            ref={imgRef}
            src={generateOptimizedSrc(src)}
            srcSet={generateSrcSet()}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </picture>
      )}

      {/* Fallback para erro */}
      {hasError && renderErrorFallback()}
    </div>
  );
};

export default OptimizedImage;

