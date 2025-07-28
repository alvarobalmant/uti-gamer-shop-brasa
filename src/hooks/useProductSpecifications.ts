import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductSpecification {
  id: string;
  product_id: string;
  category: string;
  label: string;
  value: string;
  highlight: boolean;
  order_index: number;
}

export interface SpecificationCategory {
  category: string;
  items: ProductSpecification[];
}

export const useProductSpecifications = (productId: string) => {
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [categorizedSpecs, setCategorizedSpecs] = useState<SpecificationCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      loadSpecifications();
    }
  }, [productId]);

  const loadSpecifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productId)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      setSpecifications(data || []);
      
      // Categorizar especificações
      const categories = groupSpecificationsByCategory(data || []);
      setCategorizedSpecs(categories);
    } catch (error) {
      console.error('Erro ao carregar especificações:', error);
      setSpecifications([]);
      setCategorizedSpecs([]);
    } finally {
      setLoading(false);
    }
  };

  const groupSpecificationsByCategory = (specs: ProductSpecification[]): SpecificationCategory[] => {
    const categoryMap = new Map<string, ProductSpecification[]>();
    
    specs.forEach(spec => {
      if (!categoryMap.has(spec.category)) {
        categoryMap.set(spec.category, []);
      }
      categoryMap.get(spec.category)!.push(spec);
    });

    return Array.from(categoryMap.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.order_index - b.order_index)
    }));
  };

  const addSpecification = async (spec: Omit<ProductSpecification, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('product_specifications')
        .insert([spec])
        .select()
        .single();

      if (error) throw error;

      await loadSpecifications();
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao adicionar especificação:', error);
      return { success: false, error };
    }
  };

  const updateSpecification = async (id: string, updates: Partial<ProductSpecification>) => {
    try {
      const { error } = await supabase
        .from('product_specifications')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await loadSpecifications();
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar especificação:', error);
      return { success: false, error };
    }
  };

  const deleteSpecification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_specifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadSpecifications();
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar especificação:', error);
      return { success: false, error };
    }
  };

  return {
    specifications,
    categorizedSpecs,
    loading,
    addSpecification,
    updateSpecification,
    deleteSpecification,
    refreshSpecifications: loadSpecifications
  };
};