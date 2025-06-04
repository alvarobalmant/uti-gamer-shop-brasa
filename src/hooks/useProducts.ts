import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  list_price?: number;
  pro_price?: number;
  pro_discount_percent?: number;
  new_price?: number;
  digital_price?: number;
  image: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category_id?: string;
  tags?: { id: string; name: string; }[];
}

// Dados mockados para uso offline/demonstrativo
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-product-1',
    name: 'PlayStation 5 Digital Edition',
    description: 'Console PlayStation 5 versão digital, sem leitor de disco, com controle DualSense.',
    price: 3999.90,
    list_price: 4499.90,
    pro_price: 3799.90,
    pro_discount_percent: 5,
    image: '/products/ps5-digital.webp',
    additional_images: ['/products/ps5-digital-2.webp', '/products/ps5-digital-3.webp'],
    stock: 15,
    category_id: 'consoles',
    tags: [
      { id: 'playstation', name: 'PlayStation' },
      { id: 'lancamento', name: 'Lançamento' },
      { id: 'console', name: 'Console' }
    ]
  },
  {
    id: 'mock-product-2',
    name: 'Xbox Series X',
    description: 'Console Xbox Series X com 1TB de armazenamento e controle sem fio.',
    price: 4299.90,
    list_price: 4799.90,
    pro_price: 4084.90,
    pro_discount_percent: 5,
    image: '/products/xbox-series-x.webp',
    additional_images: ['/products/xbox-series-x-2.webp', '/products/xbox-series-x-3.webp'],
    stock: 10,
    category_id: 'consoles',
    tags: [
      { id: 'xbox', name: 'Xbox' },
      { id: 'lancamento', name: 'Lançamento' },
      { id: 'console', name: 'Console' }
    ]
  },
  {
    id: 'mock-product-3',
    name: 'Nintendo Switch OLED',
    description: 'Console Nintendo Switch com tela OLED de 7 polegadas e 64GB de armazenamento.',
    price: 2499.90,
    list_price: 2799.90,
    pro_price: 2374.90,
    pro_discount_percent: 5,
    image: '/products/switch-oled.webp',
    additional_images: ['/products/switch-oled-2.webp', '/products/switch-oled-3.webp'],
    stock: 20,
    category_id: 'consoles',
    tags: [
      { id: 'nintendo', name: 'Nintendo' },
      { id: 'popular', name: 'Popular' },
      { id: 'console', name: 'Console' }
    ]
  },
  {
    id: 'mock-product-4',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'A sequência de Breath of the Wild leva você a uma jornada épica através de Hyrule e além.',
    price: 299.90,
    list_price: 349.90,
    pro_price: 284.90,
    pro_discount_percent: 5,
    image: '/products/zelda-totk.webp',
    additional_images: ['/products/zelda-totk-2.webp', '/products/zelda-totk-3.webp'],
    stock: 30,
    category_id: 'jogos',
    tags: [
      { id: 'nintendo', name: 'Nintendo' },
      { id: 'bestseller', name: 'Mais Vendido' },
      { id: 'jogo', name: 'Jogo' }
    ]
  },
  {
    id: 'mock-product-5',
    name: 'God of War Ragnarök',
    description: 'Kratos e Atreus devem viajar pelos Nove Reinos em busca de respostas enquanto as forças asgardianas se preparam para a guerra.',
    price: 249.90,
    list_price: 299.90,
    pro_price: 237.40,
    pro_discount_percent: 5,
    image: '/products/god-of-war.webp',
    additional_images: ['/products/god-of-war-2.webp', '/products/god-of-war-3.webp'],
    stock: 25,
    category_id: 'jogos',
    tags: [
      { id: 'playstation', name: 'PlayStation' },
      { id: 'bestseller', name: 'Mais Vendido' },
      { id: 'jogo', name: 'Jogo' }
    ]
  },
  {
    id: 'mock-product-6',
    name: 'Controle DualSense - Branco',
    description: 'Controle sem fio DualSense para PlayStation 5 com feedback háptico e gatilhos adaptáveis.',
    price: 449.90,
    list_price: 499.90,
    pro_price: 427.40,
    pro_discount_percent: 5,
    image: '/products/dualsense.webp',
    additional_images: ['/products/dualsense-2.webp', '/products/dualsense-3.webp'],
    stock: 40,
    category_id: 'acessorios',
    tags: [
      { id: 'playstation', name: 'PlayStation' },
      { id: 'acessorio', name: 'Acessório' },
      { id: 'controle', name: 'Controle' }
    ]
  },
  {
    id: 'mock-product-7',
    name: 'Headset Gamer HyperX Cloud Alpha',
    description: 'Headset gamer com som surround 7.1, drivers de 50mm e microfone destacável com cancelamento de ruído.',
    price: 599.90,
    list_price: 699.90,
    pro_price: 569.90,
    pro_discount_percent: 5,
    image: '/products/hyperx-cloud.webp',
    additional_images: ['/products/hyperx-cloud-2.webp', '/products/hyperx-cloud-3.webp'],
    stock: 35,
    category_id: 'acessorios',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'audio', name: 'Áudio' },
      { id: 'oferta', name: 'Oferta' }
    ]
  },
  {
    id: 'mock-product-8',
    name: 'Cadeira Gamer ThunderX3 TGC12',
    description: 'Cadeira gamer ergonômica com encosto reclinável, apoio de braço ajustável e almofadas para lombar e pescoço.',
    price: 1299.90,
    list_price: 1499.90,
    pro_price: 1234.90,
    pro_discount_percent: 5,
    image: '/products/cadeira-gamer.webp',
    additional_images: ['/products/cadeira-gamer-2.webp', '/products/cadeira-gamer-3.webp'],
    stock: 15,
    category_id: 'acessorios',
    tags: [
      { id: 'acessorio', name: 'Acessório' },
      { id: 'setup', name: 'Setup' },
      { id: 'oferta', name: 'Oferta' }
    ]
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Buscando produtos...');
      
      // Buscar todos os produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError);
        throw productsError;
      }

      // Se não houver produtos, usar dados mockados
      if (!productsData || productsData.length === 0) {
        console.log('Nenhum produto encontrado, usando dados mockados');
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
        return;
      }

      console.log('Produtos encontrados:', productsData?.length || 0);

      // Buscar as tags para cada produto usando a view otimizada
      const productsWithTags = await Promise.all(
        (productsData || []).map(async (product) => {
          console.log('Buscando tags para produto:', product.name);
          
          const { data: productTagsData, error: tagsError } = await supabase
            .from('view_product_with_tags')
            .select('tag_id, tag_name')
            .eq('product_id', product.id);

          if (tagsError) {
            console.error('Erro ao buscar tags do produto:', product.name, tagsError);
            return {
              ...product,
              tags: []
            };
          }

          const tags = productTagsData?.map(row => ({
            id: row.tag_id,
            name: row.tag_name
          })).filter(tag => tag.id && tag.name) || [];

          console.log(`Tags para ${product.name}:`, tags);

          return {
            ...product,
            tags
          };
        })
      );

      console.log('Produtos com tags carregados:', productsWithTags.length);
      setProducts(productsWithTags);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      
      // Em caso de erro, usar dados mockados
      console.log('Erro ao buscar produtos, usando dados mockados');
      setProducts(MOCK_PRODUCTS);
      
      toast({
        title: "Aviso",
        description: "Usando dados de demonstração devido a um problema de conexão.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'tags'> & { tagIds: string[] }) => {
    try {
      console.log('Adicionando produto:', productData);
      const { tagIds, ...product } = productData;
      
      const { data: productResult, error: productError } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (productError) {
        console.error('Erro ao inserir produto:', productError);
        throw productError;
      }

      console.log('Produto criado:', productResult.id);

      // Adicionar relacionamentos com tags
      if (tagIds && tagIds.length > 0) {
        console.log('Adicionando tags ao produto:', tagIds);
        const tagRelations = tagIds.map(tagId => ({
          product_id: productResult.id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(tagRelations);

        if (tagError) {
          console.error('Erro ao adicionar tags:', tagError);
          throw tagError;
        }
        console.log('Tags adicionadas com sucesso');
      }

      await fetchProducts(); // Recarregar para obter as tags
      toast({
        title: "Produto adicionado com sucesso!",
      });
      
      return productResult;
    } catch (error: any) {
      console.error('Erro completo ao adicionar produto:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
    try {
      console.log('Atualizando produto:', id, updates);
      const { tagIds, tags, ...productUpdates } = updates;

      const { data, error } = await supabase
        .from('products')
        .update(productUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      }

      console.log('Produto atualizado:', data.id);

      // Atualizar tags se fornecidas
      if (tagIds !== undefined) {
        console.log('Atualizando tags do produto:', tagIds);
        
        // Remover relacionamentos existentes
        const { error: deleteError } = await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', id);

        if (deleteError) {
          console.error('Erro ao remover tags antigas:', deleteError);
          throw deleteError;
        }

        // Adicionar novos relacionamentos
        if (tagIds.length > 0) {
          const tagRelations = tagIds.map(tagId => ({
            product_id: id,
            tag_id: tagId
          }));

          const { error: tagError } = await supabase
            .from('product_tags')
            .insert(tagRelations);

          if (tagError) {
            console.error('Erro ao inserir novas tags:', tagError);
            throw tagError;
          }
        }
        console.log('Tags atualizadas com sucesso');
      }

      await fetchProducts(); // Recarregar para obter as tags atualizadas
      toast({
        title: "Produto atualizado com sucesso!",
      });
      
      return data;
    } catch (error: any) {
      console.error('Erro completo ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      console.log('Deletando produto:', id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Produto removido com sucesso!",
      });
      console.log('Produto deletado com sucesso');
    } catch (error: any) {
      console.error('Erro completo ao deletar produto:', error);
      toast({
        title: "Erro ao remover produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
