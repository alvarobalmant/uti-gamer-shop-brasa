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
  icon?: string; // Emoji, Lucide icon name, ou URL
}

export interface SpecificationCategory {
  category: string;
  items: ProductSpecification[];
}

export const useProductSpecifications = (productId: string, viewType: 'mobile' | 'desktop' = 'desktop') => {
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [categorizedSpecs, setCategorizedSpecs] = useState<SpecificationCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      loadSpecifications();
    }
  }, [productId, viewType]);

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

      // Se não há especificações na tabela, tentar gerar a partir dos technical_specs
      if ((!data || data.length === 0) && viewType === 'desktop') {
        const generatedSpecs = await generateSpecsFromTechnicalSpecs(productId);
        if (generatedSpecs.length > 0) {
          const categories = groupSpecificationsByCategory(generatedSpecs);
          setSpecifications(generatedSpecs);
          setCategorizedSpecs(categories);
          setLoading(false);
          return;
        }
      }

      const filteredData = filterSpecificationsByViewType(data || [], viewType);
      setSpecifications(filteredData);
      
      // Categorizar especificações
      const categories = groupSpecificationsByCategory(filteredData);
      setCategorizedSpecs(categories);
    } catch (error) {
      console.error('Erro ao carregar especificações:', error);
      setSpecifications([]);
      setCategorizedSpecs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSpecificationsByViewType = (specs: ProductSpecification[], type: 'mobile' | 'desktop'): ProductSpecification[] => {
    if (type === 'mobile') {
      // Mobile: apenas especificações básicas (categoria "Informações Gerais")
      return specs.filter(spec => spec.category === 'Informações Gerais');
    } else {
      // Desktop: incluir categorias técnicas principais + categorias de override
      const desktopCategories = [
        '⚙️ Especificações Técnicas',
        '🚀 Performance', 
        '💾 Armazenamento',
        '🔌 Conectividade',
        // Categorias de override
        '📋 Informações Gerais',
        '🎮 Especificações de Jogo',
        '🎨 Detalhes do Colecionável'
      ];
      return specs.filter(spec => desktopCategories.includes(spec.category));
    }
  };

  const groupSpecificationsByCategory = (specs: ProductSpecification[]): SpecificationCategory[] => {
    const categoryMap = new Map<string, ProductSpecification[]>();
    
    specs.forEach((spec) => {
      if (!categoryMap.has(spec.category)) {
        categoryMap.set(spec.category, []);
      }
      categoryMap.get(spec.category)!.push(spec);
    });

    const result = Array.from(categoryMap.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.order_index - b.order_index)
    }));
    
    return result;
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

  // Função para gerar especificações a partir dos technical_specs do produto
  const generateSpecsFromTechnicalSpecs = async (productId: string): Promise<ProductSpecification[]> => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('technical_specs')
        .eq('id', productId)
        .single();

      if (error || !product?.technical_specs) return [];

      const technicalSpecs = product.technical_specs as Record<string, any>;
      const generatedSpecs: ProductSpecification[] = [];

      // Verificar se existe category_override
      const categoryOverride = technicalSpecs.category_override as string;
      const defaultCategory = getCategoryFromOverride(categoryOverride) || '⚙️ Especificações Técnicas';

      // Converter technical_specs em especificações
      Object.entries(technicalSpecs).forEach(([key, value], index) => {
        // Pular o campo category_override
        if (key === 'category_override') return;
        
        const label = formatLabel(key);
        const formattedValue = formatValue(value);
        
        generatedSpecs.push({
          id: `temp_${productId}_${key}`,
          product_id: productId,
          category: defaultCategory,
          label,
          value: formattedValue,
          highlight: false,
          order_index: index
        });
      });

      return generatedSpecs;
    } catch (error) {
      console.error('Erro ao gerar especificações dos technical_specs:', error);
      return [];
    }
  };

  // Mapear códigos de override para categorias
  const getCategoryFromOverride = (override: string): string | null => {
    const categoryMap: Record<string, string> = {
      'GENERAL': '📋 Informações Gerais',
      'TECH': '⚙️ Especificações Técnicas',
      'GAMING': '🎮 Especificações de Jogo',
      'COLLECTIBLE': '🎨 Detalhes do Colecionável'
    };
    
    return override ? categoryMap[override] : null;
  };

  // Formatar labels dos campos technical_specs
  const formatLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      'material': 'Material',
      'filling': 'Preenchimento',
      'height': 'Altura',
      'width': 'Largura',
      'weight': 'Peso',
      'care': 'Cuidados',
      'certification': 'Certificação',
      'age_group': 'Faixa Etária',
      'cpu': 'Processador',
      'gpu': 'Placa de Vídeo',
      'ram': 'Memória RAM',
      'storage': 'Armazenamento',
      'resolution': 'Resolução',
      'fps': 'Taxa de Quadros',
      'platform': 'Plataforma',
      'connectivity': 'Conectividade'
    };
    
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  };

  // Formatar valores
  const formatValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (Array.isArray(value)) return value.join(', ');
    return JSON.stringify(value);
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