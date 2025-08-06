import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/hooks/useProducts/types';
import type { TemplateColumn } from './types';

// Função para buscar todos os produtos para backup
export const fetchAllProductsForBackup = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('view_product_with_tags')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Erro ao buscar produtos do banco de dados');
  }

  // Agrupar produtos por ID para evitar duplicatas devido às tags
  const productsMap = new Map<string, Product>();
  
  data?.forEach((row) => {
    const productId = row.product_id;
    if (!productId) return;

    if (productsMap.has(productId)) {
      const existingProduct = productsMap.get(productId)!;
      if (row.tag_id && row.tag_name) {
        if (!existingProduct.tags) existingProduct.tags = [];
        existingProduct.tags.push({
          id: row.tag_id,
          name: row.tag_name
        });
      }
    } else {
      const product: Product = {
        id: productId,
        name: row.product_name || '',
        description: row.product_description || '',
        price: Number(row.product_price) || 0,
        image: row.product_image || '',
        created_at: row.created_at || '',
        updated_at: row.updated_at || '',
        
        // Campos expandidos
        brand: row.brand,
        category: row.category,
        platform: row.platform,
        condition: row.condition,
        stock: row.product_stock,
        list_price: row.list_price ? Number(row.list_price) : undefined,
        pro_price: row.pro_price ? Number(row.pro_price) : undefined,
        pro_discount_percent: row.pro_discount_percent,
        new_price: row.new_price ? Number(row.new_price) : undefined,
        digital_price: row.digital_price ? Number(row.digital_price) : undefined,
        discount_price: row.discount_price ? Number(row.discount_price) : undefined,
        promotional_price: row.promotional_price ? Number(row.promotional_price) : undefined,
        discount_percentage: row.discount_percentage,
        pix_discount_percentage: row.pix_discount_percentage,
        uti_pro_price: row.uti_pro_price ? Number(row.uti_pro_price) : undefined,
        uti_pro_enabled: row.uti_pro_enabled,
        uti_pro_type: row.uti_pro_type as 'percentage' | 'fixed' | undefined,
        uti_pro_value: row.uti_pro_value ? Number(row.uti_pro_value) : undefined,
        uti_pro_custom_price: row.uti_pro_custom_price ? Number(row.uti_pro_custom_price) : undefined,
        installment_options: row.installment_options,
        badge_text: row.badge_text,
        badge_color: row.badge_color,
        badge_visible: row.badge_visible,
        is_featured: row.is_featured,
        is_active: row.is_active,
        rating_average: row.rating_average,
        rating_count: row.rating_count,
        slug: row.slug,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        
        // Sistema SKU
        parent_product_id: row.parent_product_id,
        is_master_product: row.is_master_product,
        product_type: row.product_type as 'simple' | 'master' | 'sku' | undefined,
        sku_code: row.sku_code,
        variant_attributes: typeof row.variant_attributes === 'object' ? row.variant_attributes : undefined,
        sort_order: row.sort_order,
        available_variants: typeof row.available_variants === 'object' ? row.available_variants : undefined,
        master_slug: row.master_slug,
        inherit_from_master: typeof row.inherit_from_master === 'object' && row.inherit_from_master !== null 
          ? row.inherit_from_master as { [key: string]: boolean } 
          : undefined,
        
        // Arrays
        additional_images: row.additional_images,
        colors: row.colors,
        sizes: row.sizes,
        
        // Especificações e conteúdo
        specifications: Array.isArray(row.specifications) 
          ? row.specifications as { label: string; value: string; }[] 
          : undefined,
        technical_specs: row.technical_specs,
        product_features: row.product_features,
        shipping_weight: row.shipping_weight,
        free_shipping: row.free_shipping,
        product_videos: row.product_videos,
        product_faqs: row.product_faqs,
        product_highlights: row.product_highlights,
        reviews_config: row.reviews_config,
        trust_indicators: row.trust_indicators,
        manual_related_products: row.manual_related_products,
        breadcrumb_config: row.breadcrumb_config,
        product_descriptions: row.product_descriptions,
        delivery_config: row.delivery_config,
        display_config: row.display_config,
        
        // Tags
        tags: row.tag_id && row.tag_name ? [{
          id: row.tag_id,
          name: row.tag_name
        }] : []
      };
      
      productsMap.set(productId, product);
    }
  });

  return Array.from(productsMap.values());
};

// Função para converter produtos em dados para planilha
export const convertProductsToExcelData = (products: Product[]) => {
  return products.map(product => ({
    // Identificação (obrigatório)
    sku_code: product.sku_code || '',
    
    // Campos básicos
    name: product.name || '',
    description: product.description || '',
    brand: product.brand || '',
    category: product.category || '',
    platform: product.platform || '',
    condition: product.condition || '',
    
    // Preços
    price: product.price || 0,
    list_price: product.list_price || '',
    pro_price: product.pro_price || '',
    pro_discount_percent: product.pro_discount_percent || '',
    new_price: product.new_price || '',
    digital_price: product.digital_price || '',
    discount_price: product.discount_price || '',
    promotional_price: product.promotional_price || '',
    discount_percentage: product.discount_percentage || '',
    pix_discount_percentage: product.pix_discount_percentage || '',
    
    // UTI Pro
    uti_pro_enabled: product.uti_pro_enabled ? 'TRUE' : 'FALSE',
    uti_pro_type: product.uti_pro_type || '',
    uti_pro_value: product.uti_pro_value || '',
    uti_pro_price: product.uti_pro_price || '',
    uti_pro_custom_price: product.uti_pro_custom_price || '',
    
    // Estoque e opções
    stock: product.stock || 0,
    installment_options: product.installment_options || '',
    
    // Imagens
    image: product.image || '',
    additional_images: Array.isArray(product.additional_images) 
      ? product.additional_images.join(';') 
      : product.additional_images || '',
    
    // Variações
    colors: Array.isArray(product.colors) 
      ? product.colors.join(';') 
      : product.colors || '',
    sizes: Array.isArray(product.sizes) 
      ? product.sizes.join(';') 
      : product.sizes || '',
    
    // Badge
    badge_text: product.badge_text || '',
    badge_color: product.badge_color || '',
    badge_visible: product.badge_visible ? 'TRUE' : 'FALSE',
    
    // Status
    is_active: product.is_active ? 'TRUE' : 'FALSE',
    is_featured: product.is_featured ? 'TRUE' : 'FALSE',
    
    // Sistema SKU
    is_master_product: product.is_master_product ? 'TRUE' : 'FALSE',
    parent_product_id: product.parent_product_id || '',
    product_type: product.product_type || 'simple',
    variant_attributes: typeof product.variant_attributes === 'object' 
      ? JSON.stringify(product.variant_attributes) 
      : product.variant_attributes || '',
    sort_order: product.sort_order || 0,
    available_variants: typeof product.available_variants === 'object' 
      ? JSON.stringify(product.available_variants) 
      : product.available_variants || '',
    master_slug: product.master_slug || '',
    inherit_from_master: typeof product.inherit_from_master === 'object' 
      ? JSON.stringify(product.inherit_from_master) 
      : product.inherit_from_master || '',
    
    // Especificações
    specifications: typeof product.specifications === 'object' 
      ? JSON.stringify(product.specifications) 
      : product.specifications || '',
    technical_specs: typeof product.technical_specs === 'object' 
      ? JSON.stringify(product.technical_specs) 
      : product.technical_specs || '',
    product_features: typeof product.product_features === 'object' 
      ? JSON.stringify(product.product_features) 
      : product.product_features || '',
    
    // Entrega
    shipping_weight: product.shipping_weight || '',
    free_shipping: product.free_shipping ? 'TRUE' : 'FALSE',
    delivery_config: typeof product.delivery_config === 'object' 
      ? JSON.stringify(product.delivery_config) 
      : product.delivery_config || '',
    
    // Conteúdo expandido
    product_videos: typeof product.product_videos === 'object' 
      ? JSON.stringify(product.product_videos) 
      : product.product_videos || '',
    product_descriptions: typeof product.product_descriptions === 'object' 
      ? JSON.stringify(product.product_descriptions) 
      : product.product_descriptions || '',
    product_highlights: typeof product.product_highlights === 'object' 
      ? JSON.stringify(product.product_highlights) 
      : product.product_highlights || '',
    reviews_config: typeof product.reviews_config === 'object' 
      ? JSON.stringify(product.reviews_config) 
      : product.reviews_config || '',
    trust_indicators: typeof product.trust_indicators === 'object' 
      ? JSON.stringify(product.trust_indicators) 
      : product.trust_indicators || '',
    manual_related_products: typeof product.manual_related_products === 'object' 
      ? JSON.stringify(product.manual_related_products) 
      : product.manual_related_products || '',
    breadcrumb_config: typeof product.breadcrumb_config === 'object' 
      ? JSON.stringify(product.breadcrumb_config) 
      : product.breadcrumb_config || '',
    display_config: typeof product.display_config === 'object' 
      ? JSON.stringify(product.display_config) 
      : product.display_config || '',
    
    // SEO
    slug: product.slug || '',
    meta_title: product.meta_title || '',
    meta_description: product.meta_description || '',
    
    // Tags
    tags: product.tags && product.tags.length > 0 
      ? product.tags.map(tag => tag.name).join(';') 
      : '',
    
    // Ratings
    rating_average: product.rating_average || '',
    rating_count: product.rating_count || '',
    
    // Metadados
    created_at: product.created_at || '',
    updated_at: product.updated_at || ''
  }));
};

// Função para gerar planilha de backup
export const generateBackupExcel = async (): Promise<void> => {
  const products = await fetchAllProductsForBackup();
  const excelData = convertProductsToExcelData(products);
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Configurar larguras das colunas
  const headers = Object.keys(excelData[0] || {});
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  
  XLSX.utils.book_append_sheet(wb, ws, 'Backup Produtos');
  
  // Gerar arquivo com timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = `backup-produtos-${timestamp}.xlsx`;
  
  XLSX.writeFile(wb, filename);
};

// Obter template de colunas para backup/edição
export const getBackupColumns = (): TemplateColumn[] => {
  return [
    { key: 'sku_code', label: 'Código SKU*', required: true, type: 'text', width: 15,
      instructions: 'Código único do produto. OBRIGATÓRIO e não deve ser alterado na edição.' },
    { key: 'name', label: 'Nome', type: 'text', width: 30 },
    { key: 'description', label: 'Descrição', type: 'text', width: 40 },
    { key: 'brand', label: 'Marca', type: 'text', width: 15 },
    { key: 'category', label: 'Categoria', type: 'text', width: 15 },
    { key: 'platform', label: 'Plataforma', type: 'text', width: 15 },
    { key: 'condition', label: 'Condição', type: 'text', width: 15 },
    { key: 'price', label: 'Preço', type: 'number', width: 12 },
    { key: 'list_price', label: 'Preço de Lista', type: 'number', width: 15 },
    { key: 'pro_price', label: 'Preço PRO', type: 'number', width: 12 },
    { key: 'stock', label: 'Estoque', type: 'number', width: 10 },
    { key: 'image', label: 'Imagem Principal', type: 'text', width: 50 },
    { key: 'additional_images', label: 'Imagens Adicionais', type: 'text', width: 50,
      instructions: 'URLs separadas por ponto e vírgula (;)' },
    { key: 'is_active', label: 'Ativo', type: 'boolean', width: 10,
      instructions: 'TRUE ou FALSE' },
    { key: 'is_featured', label: 'Destaque', type: 'boolean', width: 10,
      instructions: 'TRUE ou FALSE' },
    { key: 'badge_text', label: 'Texto Badge', type: 'text', width: 15 },
    { key: 'badge_color', label: 'Cor Badge', type: 'text', width: 12 },
    { key: 'meta_title', label: 'Meta Title', type: 'text', width: 30 },
    { key: 'meta_description', label: 'Meta Description', type: 'text', width: 40 },
    { key: 'tags', label: 'Tags', type: 'text', width: 30,
      instructions: 'Nomes das tags separados por ponto e vírgula (;)' }
  ];
};