export const useProductPrefetch = () => {
  return {
    prefetchProduct: (...args: any[]) => {},
    handleProductHover: (...args: any[]) => () => {}
  };
};

export const useProductHover = () => {
  return {
    handleMouseEnter: (...args: any[]) => {},
    handleMouseLeave: (...args: any[]) => {}
  };
};