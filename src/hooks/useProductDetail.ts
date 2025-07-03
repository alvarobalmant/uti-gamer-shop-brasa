
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts/types';
import { fetchSingleProductFromDatabase } from '@/hooks/useProducts/productApi';

export const useProductDetail = (productId: string | undefined) => {
  // DIAGNÓSTICO: Log inicial do hook
  console.log('🔍 useProductDetail: HOOK INICIALIZADO');
  console.log('🔍 useProductDetail: productId recebido:', productId);
  console.log('🔍 useProductDetail: tipo do productId:', typeof productId);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // DIAGNÓSTICO: Log de estado inicial
  console.log('🔍 useProductDetail: Estados iniciais:', {
    product,
    loading,
    error
  });

  useEffect(() => {
    console.log('🔍 useProductDetail: useEffect EXECUTANDO');
    console.log('🔍 useProductDetail: productId no useEffect:', productId);
    console.log('🔍 useProductDetail: productId é válido?', !!productId);
    
    const fetchProduct = async () => {
      console.log('🔍 useProductDetail: fetchProduct função iniciada');
      
      if (!productId) {
        console.log('🔍 useProductDetail: productId é falsy, saindo da função');
        console.log('🔍 useProductDetail: valor do productId:', productId);
        return;
      }

      console.log('🔍 useProductDetail: Prosseguindo com busca do produto');
      
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

    console.log('🔍 useProductDetail: Chamando fetchProduct...');
    fetchProduct();
  }, [productId, toast]);

  // DIAGNÓSTICO: Log final antes do return
  console.log('🔍 useProductDetail: RETORNANDO valores:', {
    product: product?.name || 'null',
    loading,
    error
  });

  return { product, loading, error };
};
