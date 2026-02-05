import { Product } from './types';

/**
 * Maps a row from integra_products table to the Product interface
 */
export const mapIntegraRowToProduct = (row: any): Product => {
  const hasPromotion = row.preco_promocao && Number(row.preco_promocao) < Number(row.preco_venda);
  
  return {
    id: row.id,
    name: row.descricao || '',
    description: row.descricao || '',
    price: hasPromotion ? Number(row.preco_promocao) : Number(row.preco_venda) || 0,
    list_price: Number(row.preco_venda) || 0,
    promotional_price: row.preco_promocao ? Number(row.preco_promocao) : undefined,
    image: row.foto || '',
    additional_images: [],
    stock: Number(row.saldo_atual) || 0,
    category: row.category || row.grupo || '',
    platform: row.platform || '',
    is_active: row.is_active !== false && row.suspensa !== 'S',
    is_featured: row.is_featured || false,
    is_on_sale: hasPromotion,
    badge_text: row.badge_text || '',
    badge_color: row.badge_color || '#22c55e',
    badge_visible: row.badge_visible || false,
    uti_coins_cashback_percentage: row.uti_coins_cashback_percentage || 0,
    uti_coins_discount_percentage: row.uti_coins_discount_percentage || 0,
    uti_pro_price: row.uti_pro_price,
    slug: row.slug || row.id,
    sku: row.referencia || row.codigo_barra || '',
    tags: [],
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
};