import { Product } from './types';

export const mapIntegraRowToProduct = (row: any): Product => {
  return {
    id: row.id,
    name: row.descricao || '',
    description: row.descricao || '',
    price: Number(row.preco_venda) || 0,
    original_price: Number(row.preco_venda) || 0,
    promotional_price: row.preco_promocao ? Number(row.preco_promocao) : undefined,
    image: row.foto || '',
    additional_images: [],
    stock: Number(row.saldo_atual) || 0,
    category: row.category || row.grupo || '',
    platform: row.platform || '',
    is_active: row.is_active !== false,
    is_featured: row.is_featured || false,
    isOnSale: row.preco_promocao && row.preco_promocao < row.preco_venda,
    badge_text: row.badge_text || '',
    badge_color: row.badge_color || '#22c55e',
    badge_visible: row.badge_visible || false,
    uti_coins_cashback_percentage: row.uti_coins_cashback_percentage || 0,
    uti_coins_discount_percentage: row.uti_coins_discount_percentage || 0,
    uti_pro_price: row.uti_pro_price,
    slug: row.slug || row.id,
    tags: [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};