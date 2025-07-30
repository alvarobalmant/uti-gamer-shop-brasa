
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts/types';
import { 
  fetchProductsFromDatabaseCached, 
  fetchProductsByCriteriaOptimized,
  fetchProductDetails 
} from './useProducts/productApiOptimized';
import { 
  addProductToDatabase, 
  updateProductInDatabase, 
  deleteProductFromDatabase,
  fetchSingleProductFromDatabase
} from './useProducts/productApi';
import { handleProductError } from './useProducts/productErrorHandler';
import { CarouselConfig } from '@/types/specialSections';

export type { Product } from './useProducts/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsData = await fetchProductsFromDatabaseCached();
      setProducts(productsData);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos');
      
      toast({
        title: "Erro ao carregar produtos",
        description: errorMessage,
        variant: "destructive",
      });
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // New function to fetch products based on carousel config
  const fetchProductsByConfig = useCallback(async (config: CarouselConfig) => {
    if (!config) return;
    setLoading(true);
    try {
      // Converter CarouselConfig para ProductCriteriaConfig
      const criteriaConfig = {
        product_ids: config.product_ids,
        filter_featured: false,
        sort_by: 'created_at' as const,
        sort_order: 'desc' as const
      };
      const productsData = await fetchProductsByCriteriaOptimized(criteriaConfig);
      // Converter ProductLight para Product (temporário)
      const fullProducts = productsData.map(light => ({
        ...light,
        description: '',
        brand: '',
        category: '',
        additional_images: [],
        sizes: [],
        colors: [],
        stock: 0,
        specifications: [],
        technical_specs: {},
        product_features: {},
        shipping_weight: undefined,
        free_shipping: false,
        meta_title: '',
        meta_description: '',
        parent_product_id: undefined,
        is_master_product: false,
        product_type: 'simple' as const,
        sku_code: undefined,
        variant_attributes: {},
        sort_order: 0,
        available_variants: {},
        master_slug: undefined,
        inherit_from_master: {},
        product_videos: [],
        product_faqs: [],
        product_highlights: [],
        reviews_config: {
          enabled: true,
          show_rating: true,
          show_count: true,
          allow_reviews: true,
          custom_rating: { value: 0, count: 0, use_custom: false }
        },
        trust_indicators: [],
        manual_related_products: [],
        breadcrumb_config: {
          custom_path: [],
          use_custom: false,
          show_breadcrumb: true
        },
        product_descriptions: {
          short: '',
          detailed: '',
          technical: '',
          marketing: ''
        },
        delivery_config: {
          custom_shipping_time: '',
          shipping_regions: [],
          express_available: false,
          pickup_locations: [],
          shipping_notes: ''
        },
        display_config: {
          show_stock_counter: true,
          show_view_counter: false,
          custom_view_count: 0,
          show_urgency_banner: false,
          urgency_text: '',
          show_social_proof: false,
          social_proof_text: ''
        },
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as Product[];
      setProducts(fullProducts);
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao carregar produtos do carrossel');
      toast({
        title: "Erro ao carregar produtos do carrossel",
        description: errorMessage,
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addProduct = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
    try {
      const result = await addProductToDatabase(productData);
      await fetchProducts(); // Recarregar para obter as tags
      toast({
        title: "Produto adicionado com sucesso!",
      });
      return result;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao adicionar produto');
      toast({
        title: "Erro ao adicionar produto",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
    try {
      const result = await updateProductInDatabase(id, updates);
      await fetchProducts(); // Recarregar para obter as tags atualizadas
      toast({
        title: "Produto atualizado com sucesso!",
      });
      return result;
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao atualizar produto');
      toast({
        title: "Erro ao atualizar produto",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFromDatabase(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido com sucesso!",
      });
    } catch (error: any) {
      const errorMessage = handleProductError(error, 'ao remover produto');
      toast({
        title: "Erro ao remover produto",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchSingleProduct = async (id: string): Promise<Product | null> => {
    try {
      console.log('useProducts: fetchSingleProduct called with ID:', id);
      const product = await fetchProductDetails(id);
      console.log('useProducts: fetchSingleProduct result:', product);
      return product;
    } catch (error: any) {
      console.error('useProducts: Error fetching single product:', error);
      const errorMessage = handleProductError(error, 'ao carregar produto');
      toast({
        title: "Erro ao carregar produto",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    // Initial fetch is needed for general product sections on the homepage
    fetchProducts(); 
  }, [fetchProducts]); // Corrected dependency array

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts, // Keep refetch for general product list if needed elsewhere
    fetchProductsByConfig, // Expose the new function
    fetchSingleProduct, // Expose the new single product function
  };
};

