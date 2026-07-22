import { Product } from './types';

/**
 * Maps a row from the products table to the Product interface.
 * Kept for backward compatibility with legacy callers.
 */
export const mapIntegraRowToProduct = (row: any): Product => {
  const price = Number(row.price ?? row.preco_venda) || 0;
  const promo = row.promotional_price != null
    ? Number(row.promotional_price)
    : row.preco_promocao != null
    ? Number(row.preco_promocao)
    : 0;
  const hasPromotion = promo > 0 && promo < price;

  return {
    id: row.id,
    name: row.name || row.descricao || '',
    description: row.description || row.descricao || '',
    price: hasPromotion ? promo : price,
    list_price: price,
    promotional_price: promo || undefined,
    image: row.image || row.foto || '',
    additional_images: Array.isArray(row.additional_images) ? row.additional_images : [],
    stock: Number(row.stock ?? row.saldo_atual) || 0,
    category: row.category || row.grupo || '',
    platform: row.platform || '',
    is_active: row.is_active !== false,
    is_featured: row.is_featured || false,
    is_on_sale: hasPromotion,
    badge_text: row.badge_text || '',
    badge_color: row.badge_color || '#22c55e',
    badge_visible: row.badge_visible || false,
    uti_coins_cashback_percentage: row.uti_coins_cashback_percentage || 0,
    uti_coins_discount_percentage: row.uti_coins_discount_percentage || 0,
    uti_pro_price: row.uti_pro_price,
    slug: row.slug || row.id,
    sku: row.sku || row.referencia || row.codigo_barra || '',
    tags: [],
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
};
