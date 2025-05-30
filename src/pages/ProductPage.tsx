
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductPageHeader from '@/components/ProductPage/ProductPageHeader';
import ProductImageGallery from '@/components/ProductPage/ProductImageGallery';
import ProductInfo from '@/components/ProductPage/ProductInfo';
import ProductPricing from '@/components/ProductPage/ProductPricing';
import ProductActions from '@/components/ProductPage/ProductActions';
import { useCart } from '@/contexts/CartContext';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart, isLoading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [products, id]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no produto: ${product.name}\nPreço: R$ ${product.price.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-uti-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Produto não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductPageHeader 
        onBackClick={() => navigate(-1)} 
        product={product}
        isLoading={loading}
      />
      
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductImageGallery product={product} />
          <div>
            <ProductInfo product={product} />
            <ProductPricing 
              product={product}
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-6">
        <ProductActions
          product={product}
          quantity={1}
          selectedCondition={selectedCondition}
          onAddToCart={handleAddToCart}
          onWhatsAppContact={handleWhatsAppContact}
          isLoading={loading || cartLoading}
        />
      </div>
    </div>
  );
};

export default ProductPage;
