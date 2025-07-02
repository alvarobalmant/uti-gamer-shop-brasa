
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts/types';
import { fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        console.log('🔍 useProductDetail: INICIANDO BUSCA DO PRODUTO:', productId);
        console.log('🔍 useProductDetail: Usando fetchSingleProductFromDatabase');

        const productData = await fetchSingleProductFromDatabase(productId);

        console.log('🔍 useProductDetail: Resultado da consulta:', productData);

        if (!productData) {
          console.warn('⚠️ useProductDetail: Nenhum produto encontrado para ID:', productId);
          setProduct(null);
          return;
        }

        console.log('✅ useProductDetail: Produto carregado:', productData);
        console.log('🔍 useProductDetail: product_faqs final:', productData.product_faqs);
        console.log('🔍 useProductDetail: product_faqs length:', productData.product_faqs?.length);
        console.log('🔍 useProductDetail: product_faqs conteúdo:', JSON.stringify(productData.product_faqs, null, 2));
        
        // Log específico para debug do FAQ
        if (productData.product_faqs && productData.product_faqs.length > 0) {
          console.log('🎉 useProductDetail: FAQs ENCONTRADOS! Total:', productData.product_faqs.length);
          productData.product_faqs.forEach((faq: any, index: number) => {
            console.log(`🔍 FAQ ${index + 1}:`, {
              id: faq.id,
              question: faq.question,
              answer: faq.answer?.substring(0, 50) + '...',
              is_visible: faq.is_visible,
              order: faq.order
            });
          });
        } else {
          console.log('❌ useProductDetail: NENHUM FAQ ENCONTRADO!');
        }

        setProduct(productData);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Erro ao carregar produto');
        toast({
          title: "Erro ao carregar produto",
          description: err.message || 'Tente novamente em alguns instantes',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  return { product, loading, error };
};
