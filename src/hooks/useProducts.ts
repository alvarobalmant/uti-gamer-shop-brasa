import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Tag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
<<<<<<< HEAD
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  category: string;
  platform?: string;
  condition?: 'new' | 'used' | 'refurbished';
  stock: number;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  rating?: number;
  pro_discount?: number;
}

// Mock data for offline mode
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'PlayStation 5 Digital Edition',
    description: 'Console PlayStation 5 Digital Edition. Inclui controle DualSense branco, cabo HDMI 2.1, cabo de alimentação e jogos pré-instalados como Astro\'s Playroom. Experimente o poder do SSD ultrarrápido e dos gráficos em 4K.',
    price: 3999.99,
    discount_price: 3799.99,
    images: ['/lovable-uploads/ps5-digital.png', '/lovable-uploads/ps5-digital-2.png', '/lovable-uploads/ps5-digital-3.png'],
    category: 'consoles',
    platform: 'playstation',
    condition: 'new',
    stock: 15,
    is_featured: true,
    is_active: true,
    tags: ['playstation', 'console', 'ps5', 'digital', 'nova geração'],
    rating: 4.9,
    pro_discount: 5
  },
  {
    id: '2',
    title: 'Xbox Series X',
    description: 'Console Xbox Series X. O console mais poderoso da Microsoft com suporte a 4K e 120fps. Inclui controle sem fio, cabo HDMI de alta velocidade e acesso ao Xbox Game Pass (assinatura vendida separadamente).',
    price: 4299.99,
    discount_price: 4099.99,
    images: ['/lovable-uploads/xbox-series-x.png', '/lovable-uploads/xbox-series-x-2.png', '/lovable-uploads/xbox-series-x-3.png'],
    category: 'consoles',
    platform: 'xbox',
    condition: 'new',
    stock: 10,
    is_featured: true,
    is_active: true,
    tags: ['xbox', 'console', 'series x', 'microsoft', 'nova geração'],
    rating: 4.8,
    pro_discount: 5
  },
  {
    id: '3',
    title: 'Nintendo Switch OLED',
    description: 'Console Nintendo Switch modelo OLED com tela de 7 polegadas e armazenamento de 64GB. Inclui dock com porta LAN, suporte ajustável mais largo e áudio aprimorado. Jogue em casa na TV ou em qualquer lugar no modo portátil.',
    price: 2499.99,
    discount_price: 2399.99,
    images: ['/lovable-uploads/switch-oled.png', '/lovable-uploads/switch-oled-2.png', '/lovable-uploads/switch-oled-3.png'],
    category: 'consoles',
    platform: 'nintendo',
    condition: 'new',
    stock: 20,
    is_featured: true,
    is_active: true,
    tags: ['nintendo', 'console', 'switch', 'oled', 'portátil'],
    rating: 4.7,
    pro_discount: 5
  },
  {
    id: '4',
    title: 'God of War Ragnarök',
    description: 'Embarque em uma jornada épica com Kratos e Atreus nos nove reinos nórdicos. Enfrente deuses e monstros em uma batalha pelo destino de Midgard enquanto o Ragnarök se aproxima. Gráficos impressionantes e combate visceral em uma das maiores aventuras para PlayStation.',
    price: 299.99,
    discount_price: 249.99,
    images: ['/lovable-uploads/god-of-war.png', '/lovable-uploads/god-of-war-2.png', '/lovable-uploads/god-of-war-3.png'],
    category: 'jogos',
    platform: 'playstation',
    condition: 'new',
    stock: 30,
    is_featured: true,
    is_active: true,
    tags: ['playstation', 'jogo', 'ação', 'aventura', 'exclusivo', 'kratos'],
    rating: 4.9,
    pro_discount: 10
  },
  {
    id: '5',
    title: 'Halo Infinite',
    description: 'Master Chief retorna em sua aventura mais épica para salvar a humanidade. Explore o vasto mundo aberto de Zeta Halo, enfrente os Banished e descubra segredos que podem mudar o destino da galáxia. Multiplayer gratuito incluído com modos competitivos e cooperativos.',
    price: 249.99,
    discount_price: 199.99,
    images: ['/lovable-uploads/halo-infinite.png', '/lovable-uploads/halo-infinite-2.png', '/lovable-uploads/halo-infinite-3.png'],
    category: 'jogos',
    platform: 'xbox',
    condition: 'new',
    stock: 25,
    is_featured: true,
    is_active: true,
    tags: ['xbox', 'jogo', 'fps', 'ação', 'exclusivo', 'master chief'],
    rating: 4.7,
    pro_discount: 10
  },
  {
    id: '6',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    description: 'Nova aventura de Link no reino de Hyrule com novos poderes e desafios. Explore ilhas flutuantes nos céus, descubra novas habilidades como Ultrahand e Fuse, e enfrente ameaças antigas e novas. A sequência do aclamado Breath of the Wild expande ainda mais o vasto mundo aberto.',
    price: 349.99,
    discount_price: 329.99,
    images: ['/lovable-uploads/zelda-totk.png', '/lovable-uploads/zelda-totk-2.png', '/lovable-uploads/zelda-totk-3.png'],
    category: 'jogos',
    platform: 'nintendo',
    condition: 'new',
    stock: 20,
    is_featured: true,
    is_active: true,
    tags: ['nintendo', 'jogo', 'aventura', 'zelda', 'exclusivo', 'link', 'mundo aberto'],
    rating: 4.9,
    pro_discount: 10
  },
  {
    id: '7',
    title: 'Controle DualSense - Branco',
    description: 'Controle oficial para PlayStation 5 com feedback háptico e gatilhos adaptáveis. Sinta cada impacto nos jogos, desde o recuo de armas até a tensão ao puxar a corda de um arco. Inclui microfone embutido, alto-falante e bateria recarregável via USB-C.',
    price: 449.99,
    discount_price: 399.99,
    images: ['/lovable-uploads/dualsense.png', '/lovable-uploads/dualsense-2.png', '/lovable-uploads/dualsense-3.png'],
    category: 'acessorios',
    platform: 'playstation',
    condition: 'new',
    stock: 40,
    is_featured: false,
    is_active: true,
    tags: ['playstation', 'acessório', 'controle', 'dualsense', 'ps5'],
    rating: 4.8,
    pro_discount: 15
  },
  {
    id: '8',
    title: 'Headset Xbox Wireless',
    description: 'Headset sem fio oficial para Xbox Series X|S com áudio espacial. Experimente som surround imersivo, microfone com isolamento de ruído e controles de volume integrados. Compatível com Xbox Series X|S, Xbox One e Windows 10/11 via Bluetooth.',
    price: 599.99,
    discount_price: 549.99,
    images: ['/lovable-uploads/xbox-headset.png', '/lovable-uploads/xbox-headset-2.png', '/lovable-uploads/xbox-headset-3.png'],
    category: 'acessorios',
    platform: 'xbox',
    condition: 'new',
    stock: 35,
    is_featured: false,
    is_active: true,
    tags: ['xbox', 'acessório', 'headset', 'áudio', 'sem fio'],
    rating: 4.6,
    pro_discount: 15
  },
  {
    id: '9',
    title: 'Nintendo Switch Pro Controller',
    description: 'Controle profissional para Nintendo Switch com bateria de longa duração. Oferece controles precisos, feedback HD Rumble, NFC para amiibo e giroscópio para controle de movimento. Design ergonômico para sessões de jogo prolongadas.',
    price: 399.99,
    discount_price: 369.99,
    images: ['/lovable-uploads/switch-pro-controller.png', '/lovable-uploads/switch-pro-controller-2.png', '/lovable-uploads/switch-pro-controller-3.png'],
    category: 'acessorios',
    platform: 'nintendo',
    condition: 'new',
    stock: 30,
    is_featured: false,
    is_active: true,
    tags: ['nintendo', 'acessório', 'controle', 'pro controller', 'switch'],
    rating: 4.7,
    pro_discount: 15
  },
  {
    id: '10',
    title: 'PlayStation 4 Pro - Usado',
    description: 'Console PlayStation 4 Pro usado em excelente estado. Inclui controle DualShock 4, cabos HDMI e de alimentação. Capacidade de 1TB, suporte a 4K e HDR. Testado e verificado pela equipe UTI DOS GAMES com garantia de 3 meses.',
    price: 1999.99,
    discount_price: 1799.99,
    images: ['/lovable-uploads/ps4-pro.png', '/lovable-uploads/ps4-pro-2.png', '/lovable-uploads/ps4-pro-3.png'],
    category: 'consoles',
    platform: 'playstation',
    condition: 'used',
    stock: 5,
    is_featured: false,
    is_active: true,
    tags: ['playstation', 'console', 'ps4', 'usado', 'pro', '4k'],
    rating: 4.5,
    pro_discount: 5
  },
  {
    id: '11',
    title: 'Xbox One X - Recondicionado',
    description: 'Console Xbox One X recondicionado pela UTI DOS GAMES. Garantia de 6 meses. Inclui controle sem fio, cabos e fonte de alimentação originais. Capacidade de 1TB, suporte a 4K nativo e HDR. Todas as peças foram testadas e substituídas quando necessário.',
    price: 1899.99,
    discount_price: 1699.99,
    images: ['/lovable-uploads/xbox-one-x.png', '/lovable-uploads/xbox-one-x-2.png', '/lovable-uploads/xbox-one-x-3.png'],
    category: 'consoles',
    platform: 'xbox',
    condition: 'refurbished',
    stock: 3,
    is_featured: false,
    is_active: true,
    tags: ['xbox', 'console', 'one x', 'recondicionado', '4k'],
    rating: 4.4,
    pro_discount: 5
  },
  {
    id: '12',
    title: 'Figura Colecionável Kratos',
    description: 'Figura colecionável premium de Kratos de God of War. Altura: 30cm. Esculpida com detalhes impressionantes, pintada à mão e feita de material de alta qualidade. Inclui base personalizada e acessórios como o Machado Leviatã. Edição limitada com certificado de autenticidade.',
    price: 899.99,
    discount_price: 849.99,
    images: ['/lovable-uploads/kratos-figure.png', '/lovable-uploads/kratos-figure-2.png', '/lovable-uploads/kratos-figure-3.png'],
    category: 'colecionaveis',
    condition: 'new',
    stock: 10,
    is_featured: true,
    is_active: true,
    tags: ['colecionável', 'figura', 'god of war', 'kratos', 'premium', 'edição limitada'],
    rating: 4.9,
    pro_discount: 10
  },
  {
    id: '13',
    title: 'PlayStation 5 Standard Edition',
    description: 'Console PlayStation 5 Standard Edition com leitor de disco. Inclui controle DualSense branco, cabo HDMI 2.1, cabo de alimentação e jogo Astro\'s Playroom pré-instalado. Experimente jogos em 4K a até 120fps com tempos de carregamento quase instantâneos.',
    price: 4499.99,
    discount_price: 4299.99,
    images: ['/lovable-uploads/ps5-standard.png', '/lovable-uploads/ps5-standard-2.png', '/lovable-uploads/ps5-standard-3.png'],
    category: 'consoles',
    platform: 'playstation',
    condition: 'new',
    stock: 8,
    is_featured: true,
    is_active: true,
    tags: ['playstation', 'console', 'ps5', 'standard', 'nova geração', 'disco'],
    rating: 4.9,
    pro_discount: 5
  },
  {
    id: '14',
    title: 'Xbox Series S',
    description: 'Console Xbox Series S totalmente digital. Compacto mas poderoso, oferece jogos em 1440p a até 120fps. Inclui controle sem fio, cabo HDMI e acesso ao Xbox Game Pass (assinatura vendida separadamente). SSD de 512GB para carregamentos ultrarrápidos.',
    price: 2799.99,
    discount_price: 2599.99,
    images: ['/lovable-uploads/xbox-series-s.png', '/lovable-uploads/xbox-series-s-2.png', '/lovable-uploads/xbox-series-s-3.png'],
    category: 'consoles',
    platform: 'xbox',
    condition: 'new',
    stock: 12,
    is_featured: true,
    is_active: true,
    tags: ['xbox', 'console', 'series s', 'microsoft', 'nova geração', 'digital'],
    rating: 4.7,
    pro_discount: 5
  },
  {
    id: '15',
    title: 'Nintendo Switch Lite - Turquesa',
    description: 'Console Nintendo Switch Lite na cor turquesa. Versão compacta e leve dedicada ao jogo portátil. Controles integrados e tela de 5,5 polegadas. Compatível com todos os jogos Nintendo Switch que suportam o modo portátil.',
    price: 1799.99,
    discount_price: 1699.99,
    images: ['/lovable-uploads/switch-lite-turquoise.png', '/lovable-uploads/switch-lite-turquoise-2.png', '/lovable-uploads/switch-lite-turquoise-3.png'],
    category: 'consoles',
    platform: 'nintendo',
    condition: 'new',
    stock: 15,
    is_featured: false,
    is_active: true,
    tags: ['nintendo', 'console', 'switch', 'lite', 'portátil', 'turquesa'],
    rating: 4.6,
    pro_discount: 5
  },
  {
    id: '16',
    title: 'Horizon Forbidden West',
    description: 'Junte-se a Aloy em sua jornada pelo Oeste Proibido, uma fronteira perigosa que esconde novas ameaças misteriosas. Explore terras distantes, enfrente máquinas maiores e mais imponentes, e encontre tribos impressionantes enquanto retorna a um futuro distante em um mundo pós-apocalíptico.',
    price: 299.99,
    discount_price: 269.99,
    images: ['/lovable-uploads/horizon-forbidden-west.png', '/lovable-uploads/horizon-forbidden-west-2.png', '/lovable-uploads/horizon-forbidden-west-3.png'],
    category: 'jogos',
    platform: 'playstation',
    condition: 'new',
    stock: 22,
    is_featured: true,
    is_active: true,
    tags: ['playstation', 'jogo', 'ação', 'aventura', 'exclusivo', 'aloy', 'mundo aberto'],
    rating: 4.8,
    pro_discount: 10
  },
  {
    id: '17',
    title: 'Forza Horizon 5',
    description: 'Explore um mundo aberto vibrante e em constante evolução nas paisagens do México, com uma ação de direção ilimitada em centenas dos melhores carros do mundo. Corra através de paisagens desérticas, florestas tropicais densas, cidades históricas, ruínas ocultas, praias pristinas, canyons profundos e um vulcão imponente.',
    price: 249.99,
    discount_price: 229.99,
    images: ['/lovable-uploads/forza-horizon-5.png', '/lovable-uploads/forza-horizon-5-2.png', '/lovable-uploads/forza-horizon-5-3.png'],
    category: 'jogos',
    platform: 'xbox',
    condition: 'new',
    stock: 18,
    is_featured: true,
    is_active: true,
    tags: ['xbox', 'jogo', 'corrida', 'mundo aberto', 'exclusivo', 'forza'],
    rating: 4.9,
    pro_discount: 10
  },
  {
    id: '18',
    title: 'Animal Crossing: New Horizons',
    description: 'Escape para uma ilha deserta e crie seu paraíso como quiser em Animal Crossing: New Horizons! Colete recursos para criar tudo, desde ferramentas até itens de conforto. Interaja com personagens carismáticos, personalize sua casa e a ilha inteira, e desfrute do passar das estações em tempo real.',
    price: 299.99,
    discount_price: 279.99,
    images: ['/lovable-uploads/animal-crossing.png', '/lovable-uploads/animal-crossing-2.png', '/lovable-uploads/animal-crossing-3.png'],
    category: 'jogos',
    platform: 'nintendo',
    condition: 'new',
    stock: 25,
    is_featured: true,
    is_active: true,
    tags: ['nintendo', 'jogo', 'simulação', 'exclusivo', 'animal crossing', 'relaxante'],
    rating: 4.8,
    pro_discount: 10
  },
  {
    id: '19',
    title: 'Controle DualSense Edge',
    description: 'Controle premium para PlayStation 5 com personalização avançada. Inclui gatilhos ajustáveis, botões traseiros mapeáveis, capas de analógicos intercambiáveis e perfis de controle salvos. O controle profissional definitivo para jogadores competitivos.',
    price: 899.99,
    discount_price: 849.99,
    images: ['/lovable-uploads/dualsense-edge.png', '/lovable-uploads/dualsense-edge-2.png', '/lovable-uploads/dualsense-edge-3.png'],
    category: 'acessorios',
    platform: 'playstation',
    condition: 'new',
    stock: 15,
    is_featured: true,
    is_active: true,
    tags: ['playstation', 'acessório', 'controle', 'dualsense', 'ps5', 'premium', 'profissional'],
    rating: 4.9,
    pro_discount: 15
  },
  {
    id: '20',
    title: 'Figura Colecionável Link',
    description: 'Figura colecionável premium de Link de The Legend of Zelda: Tears of the Kingdom. Altura: 25cm. Detalhes impressionantes, pintada à mão e base personalizada. Inclui acessórios como a Master Sword e o escudo Hylian. Edição limitada com certificado de autenticidade.',
    price: 799.99,
    discount_price: 749.99,
    images: ['/lovable-uploads/link-figure.png', '/lovable-uploads/link-figure-2.png', '/lovable-uploads/link-figure-3.png'],
    category: 'colecionaveis',
    condition: 'new',
    stock: 8,
    is_featured: true,
    is_active: true,
    tags: ['colecionável', 'figura', 'zelda', 'link', 'premium', 'edição limitada'],
    rating: 4.9,
    pro_discount: 10
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS); // Initialize with MOCK_PRODUCTS
  const [loading, setLoading] = useState<boolean>(true);
=======
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  additional_images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  // Optional pricing fields that some components expect
  pro_discount_percent?: number;
  pro_price?: number;
  list_price?: number;
  new_price?: number;
  digital_price?: number;
}

// Type for creating new products - ensures required fields are present
export interface CreateProductData {
  name: string;
  price: number;
  description?: string;
  image?: string;
  additional_images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
>>>>>>> 2dcbe294a87f3437db0345f7b62065cbff1c0403
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = useCallback(async (options?: {
    category?: string;
    platform?: string;
    condition?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      let query = supabase.from('products').select('*');
=======
      setLoading(true);
      setError(null);
      
      console.log('Buscando produtos...');
      
      // Fetch products with their tags
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_tags!inner(
            tag_id,
            tags!inner(
              id,
              name
            )
          )
        `);
>>>>>>> 2dcbe294a87f3437db0345f7b62065cbff1c0403

      // Apply filters
      if (options?.category) {
        query = query.eq('category', options.category);
      }
      if (options?.platform) {
        query = query.eq('platform', options.platform);
      }
      if (options?.condition) {
        query = query.eq('condition', options.condition);
      }
      if (options?.featured !== undefined) {
        query = query.eq('is_featured', options.featured);
      }
      if (options?.search) {
        query = query.ilike('title', `%${options.search}%`);
      }

<<<<<<< HEAD
      // Apply sorting
      if (options?.sortBy) {
        const order = options.sortOrder || 'asc';
        query = query.order(options.sortBy, { ascending: order === 'asc' });
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false });
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      // Only active products
      query = query.eq('is_active', true);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Falha ao carregar produtos.');
      
      // Filter mock products based on options
      let filteredProducts = [...MOCK_PRODUCTS];
      
      if (options?.category) {
        filteredProducts = filteredProducts.filter(p => p.category === options.category);
      }
      if (options?.platform) {
        filteredProducts = filteredProducts.filter(p => p.platform === options.platform);
      }
      if (options?.condition) {
        filteredProducts = filteredProducts.filter(p => p.condition === options.condition);
      }
      if (options?.featured !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.is_featured === options.featured);
      }
      if (options?.search) {
        const searchLower = options.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      // Apply sorting
      if (options?.sortBy) {
        const sortBy = options.sortBy as keyof Product;
        const order = options.sortOrder || 'asc';
        filteredProducts.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
          if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      // Apply limit
      if (options?.limit) {
        filteredProducts = filteredProducts.slice(0, options.limit);
      }
      
      setProducts(filteredProducts);
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando dados locais devido a um problema de conexão.', 
        variant: 'default' 
      });
=======
      // Transform the data to include tags properly
      const transformedProducts: Product[] = [];
      const productMap = new Map<string, Product>();

      productsData?.forEach((product: any) => {
        if (!productMap.has(product.id)) {
          productMap.set(product.id, {
            ...product,
            tags: []
          });
        }

        const existingProduct = productMap.get(product.id)!;
        
        if (product.product_tags && product.product_tags.tags) {
          const tag = {
            id: product.product_tags.tags.id,
            name: product.product_tags.tags.name
          };
          
          // Check if tag already exists to avoid duplicates
          if (!existingProduct.tags!.some(t => t.id === tag.id)) {
            existingProduct.tags!.push(tag);
          }
        }
      });

      const finalProducts = Array.from(productMap.values());
      
      console.log(`${finalProducts.length} produtos carregados`);
      setProducts(finalProducts);
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error);
      setError(error.message || 'Erro ao carregar produtos');
      setProducts([]);
>>>>>>> 2dcbe294a87f3437db0345f7b62065cbff1c0403
    } finally {
      setLoading(false);
    }
  }, [toast]);

<<<<<<< HEAD
  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err: any) {
      console.error(`Error fetching product with ID ${id}:`, err);
      setError(`Falha ao carregar produto com ID ${id}.`);
      
      // Return mock product with matching ID
      const mockProduct = MOCK_PRODUCTS.find(p => p.id === id);
      
      if (!mockProduct) {
        toast({ 
          title: 'Erro', 
          description: 'Produto não encontrado.', 
          variant: 'destructive' 
        });
        return null;
      }
      
      toast({ 
        title: 'Aviso', 
        description: 'Usando dados locais devido a um problema de conexão.', 
        variant: 'default' 
      });
      
      return mockProduct;
    } finally {
      setLoading(false);
=======
  const addProduct = async (productData: CreateProductData): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto criado com sucesso!",
      });

      await fetchProducts(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso!",
      });

      await fetchProducts(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto removido com sucesso!",
      });

      await fetchProducts(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto.",
        variant: "destructive",
      });
      return false;
>>>>>>> 2dcbe294a87f3437db0345f7b62065cbff1c0403
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

<<<<<<< HEAD
  return { products, loading, error, fetchProducts, fetchProductById };
=======
  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refetch,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
>>>>>>> 2dcbe294a87f3437db0345f7b62065cbff1c0403
};
