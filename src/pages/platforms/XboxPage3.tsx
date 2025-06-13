import React, { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { customPlatformPages } from '@/data/customPlatformPages';
import CustomPlatformPage from '@/components/Platform/CustomPlatformPage';
import { useNavigate } from 'react-router-dom';

const XboxPage3 = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Encontrar a configuração da página Xbox
  const xboxPageData = customPlatformPages.find(page => page.slug === 'xbox');

  // Função para lidar com cliques em produtos
  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  // Aplicar tema Xbox ao carregar a página
  useEffect(() => {
    document.title = xboxPageData?.metaTitle || 'Xbox | UTI dos Games';
    
    // Log para depuração
    console.log('Produtos carregados:', products.length);
    
    // Verificar produtos com tag Xbox
    if (products.length > 0) {
      const xboxTagId = '28047409-2ad5-4cea-bde3-803d42e49fc6'; // UUID da tag Xbox
      const accessoryTagId = '43f59a81-8dd1-460b-be1e-a0187e743075'; // UUID da tag Acessórios
      
      // Verificar produtos com tag Xbox
      const xboxProducts = products.filter(product => 
        product.tags?.some(tag => tag.id === xboxTagId)
      );
      console.log('Produtos Xbox encontrados:', xboxProducts.length);
      
      // Verificar produtos com tag Acessórios
      const accessoryProducts = products.filter(product => 
        product.tags?.some(tag => tag.id === accessoryTagId)
      );
      console.log('Produtos Acessórios encontrados:', accessoryProducts.length);
      
      // Verificar produtos que são tanto Xbox quanto Acessórios
      const xboxAccessories = products.filter(product => 
        product.tags?.some(tag => tag.id === xboxTagId) && 
        product.tags?.some(tag => tag.id === accessoryTagId)
      );
      console.log('Acessórios Xbox encontrados:', xboxAccessories.length);
    }
  }, [products, xboxPageData]);

  if (!xboxPageData) {
    return <div>Configuração da página Xbox não encontrada</div>;
  }

  return (
    <CustomPlatformPage
      pageData={xboxPageData}
      products={products}
      onAddToCart={addToCart}
      onProductClick={handleProductClick}
    />
  );
};

export default XboxPage3;
