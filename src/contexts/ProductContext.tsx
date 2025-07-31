import React, { createContext, useContext, ReactNode } from 'react';

interface ProductContextType {
  refreshProducts?: () => void;
}

const ProductContext = createContext<ProductContextType>({ refreshProducts: () => {} });

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const refreshProducts = () => {
    // Stub implementation
  };
  
  return (
    <ProductContext.Provider value={{ refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};