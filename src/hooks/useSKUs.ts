import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Tipos básicos para SKUs
export interface ProductSKU {
  id: string;
  name: string;
  price: number;
  parent_product_id?: string;
  product_type: 'sku';
  sku_code?: string;
  variant_attributes?: {
    platform?: string;
    [key: string]: any;
  };
  stock_quantity?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MasterProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category_id?: string;
  product_type: 'master';
  is_master_product: boolean;
  available_variants?: {
    platforms?: string[];
    [key: string]: any;
  };
  price: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Configuração das plataformas suportadas
export const PLATFORM_CONFIG = {
  xbox: {
    id: 'xbox',
    name: 'Xbox',
    icon: '🎮',
    color: '#107C10'
  },
  playstation: {
    id: 'playstation',
    name: 'PlayStation',
    icon: '🎮',
    color: '#003791'
  },
  pc: {
    id: 'pc',
    name: 'PC',
    icon: '💻',
    color: '#FF6B00'
  },
  nintendo: {
    id: 'nintendo',
    name: 'Nintendo',
    icon: '🎮',
    color: '#E60012'
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile',
    icon: '📱',
    color: '#34C759'
  }
};

const useSKUs = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Buscar SKUs de um produto mestre
  const fetchSKUsForMaster = useCallback(async (masterProductId: string): Promise<ProductSKU[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', masterProductId)
        .eq('product_type', 'sku')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Erro ao buscar SKUs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar SKUs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar produto mestre
  const createMasterProduct = useCallback(async (productData: Partial<MasterProduct>): Promise<string | null> => {
    try {
      setLoading(true);
      
      const masterData = {
        ...productData,
        product_type: 'master',
        is_master_product: true,
        slug: `${productData.name?.toLowerCase().replace(/\s+/g, '-')}-master-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .insert([masterData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar produto mestre:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Erro ao criar produto mestre:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar SKU
  const createSKU = useCallback(async (skuData: Partial<ProductSKU>): Promise<string | null> => {
    try {
      setLoading(true);
      
      const sku = {
        ...skuData,
        product_type: 'sku',
        is_master_product: false,
        slug: `${skuData.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .insert([sku])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar SKU:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Erro ao criar SKU:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchSKUsForMaster,
    createMasterProduct,
    createSKU,
    PLATFORM_CONFIG
  };
};

export default useSKUs;

