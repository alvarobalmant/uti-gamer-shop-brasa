// Placeholder hook for useProductPrefetch
export const useProductPrefetch = () => {
  return {
    prefetchProduct: (id: string) => {},
    getProductHoverProps: (productId?: string) => ({
      onMouseEnter: () => {},
      onMouseLeave: () => {},
    }),
    handleMouseEnter: (productId: string) => {},
    handleMouseLeave: () => {},
  };
};

export const useProductHover = () => {
  const { handleMouseEnter, handleMouseLeave, getProductHoverProps } = useProductPrefetch();
  return { 
    handleMouseEnter, 
    handleMouseLeave, 
    getProductHoverProps: () => getProductHoverProps()
  };
};