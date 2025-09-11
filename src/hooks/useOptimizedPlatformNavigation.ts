import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSKUNavigationStore } from '@/stores/skuNavigationStore';

export const useOptimizedPlatformNavigation = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    getSKUNavigation,
    setOptimisticUpdate,
    setCurrentProduct
  } = useSKUNavigationStore();

  const navigateToPlatform = useCallback(async (
    platform: string, 
    sku: any, 
    currentProductId?: string
  ) => {
    if (!sku || isTransitioning) return;

    const targetProductId = sku.id;
    
    // Skip if already on this product
    if (targetProductId === currentProductId) return;

    setIsTransitioning(true);
    
    try {
      console.log(`🚀 [useOptimizedPlatformNavigation] Navegando para ${targetProductId}`);
      
      // PRIORIDADE 1: Verificar estado global para navegação otimista
      const cachedSKUNavigation = getSKUNavigation(targetProductId);
      
      if (cachedSKUNavigation) {
        console.log(`⚡ [useOptimizedPlatformNavigation] SKU Navigation encontrado - navegação otimista`);
        
        // Enable optimistic update mode
        setOptimisticUpdate(true);
        
        // Navigate immediately
        navigate(`/produto/${targetProductId}`, { replace: false });
        setCurrentProduct(targetProductId);
        
        // Disable optimistic mode after a brief delay
        transitionTimeoutRef.current = setTimeout(() => {
          setOptimisticUpdate(false);
        }, 100);
      } else {
        console.log(`📡 [useOptimizedPlatformNavigation] Navegação padrão para ${targetProductId}`);
        
        // Standard navigation without optimistic update
        navigate(`/produto/${targetProductId}`, { replace: false });
        setCurrentProduct(targetProductId);
      }
    } catch (error) {
      console.error('❌ [useOptimizedPlatformNavigation] Erro na navegação:', error);
      
      // Fallback: navegação padrão
      navigate(`/produto/${targetProductId}`, { replace: false });
      setCurrentProduct(targetProductId);
    } finally {
      // Clear transition state after a brief delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [navigate, getSKUNavigation, setOptimisticUpdate, setCurrentProduct, isTransitioning]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    setIsTransitioning(false);
    setOptimisticUpdate(false);
  }, [setOptimisticUpdate]);

  return {
    navigateToPlatform,
    isTransitioning,
    cleanup
  };
};