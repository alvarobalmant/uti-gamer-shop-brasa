import { Product } from './types';
import { ProductLight } from './productApiOptimized';

// Adapter para converter ProductLight para Product mantendo compatibilidade
export const adaptProductLightToProduct = (productLight: ProductLight): Product => {
  return {
    ...productLight,
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
  };
};

// Adapter para converter array de ProductLight para Product
export const adaptProductLightArrayToProductArray = (productsLight: ProductLight[]): Product[] => {
  return productsLight.map(adaptProductLightToProduct);
};