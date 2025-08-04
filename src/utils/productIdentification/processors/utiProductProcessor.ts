import { ProcessingResult } from '../types';
import { adaptiveSpecificationsSystem } from '../../adaptiveSpecifications';

export class UTIProductProcessor {
  
  async processUTIProduct(product: any): Promise<ProcessingResult> {
    try {
      // Validate required UTI product data
      const validation = this.validateUTIProduct(product);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings,
          processingType: 'uti_original',
          confidence: 0.3
        };
      }
      
      // Process with user-provided data only
      const processedProduct = await this.processWithUserData(product);
      
      // Apply UTI-specific enhancements
      const enhancedProduct = this.applyUTIEnhancements(processedProduct);
      
      return {
        success: true,
        product: enhancedProduct,
        errors: [],
        warnings: validation.warnings,
        processingType: 'uti_original',
        confidence: 0.9
      };
      
    } catch (error) {
      return {
        success: false,
        errors: [`Erro no processamento UTI: ${error.message}`],
        warnings: [],
        processingType: 'uti_original',
        confidence: 0.0
      };
    }
  }
  
  private validateUTIProduct(product: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required fields for UTI products
    const requiredFields = ['name', 'price', 'description'];
    
    for (const field of requiredFields) {
      if (!product[field] || product[field].toString().trim().length === 0) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    }
    
    // Validate price
    if (product.price) {
      const price = Number(product.price);
      if (isNaN(price) || price <= 0) {
        errors.push('Preço deve ser um número válido maior que zero');
      }
      if (price > 10000) {
        warnings.push('Preço alto para produto UTI - verificar se está correto');
      }
    }
    
    // Validate stock
    if (product.stock !== undefined) {
      const stock = Number(product.stock);
      if (isNaN(stock) || stock < 0) {
        errors.push('Estoque deve ser um número válido maior ou igual a zero');
      }
    }
    
    // Check for UTI branding consistency
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    const utiKeywords = ['uti', 'uti games'];
    
    const hasUTIBranding = utiKeywords.some(keyword => 
      name.includes(keyword) || brand.includes(keyword)
    );
    
    if (!hasUTIBranding) {
      warnings.push('Produto não contém branding UTI explícito');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private async processWithUserData(product: any): Promise<any> {
    try {
      // Apply adaptive specifications with user data only
      const processedSpecs = await adaptiveSpecificationsSystem.processProduct(product);
      
      return {
        ...product,
        specifications: processedSpecs.specifications,
        technical_specs: processedSpecs.technical_specs,
        adaptiveCategory: processedSpecs.category,
        processingMetadata: {
          ...processedSpecs.metadata,
          processingType: 'uti_original',
          dataSource: 'user_provided_only'
        }
      };
    } catch (error) {
      console.warn('Erro ao aplicar especificações adaptativas para produto UTI:', error);
      return product;
    }
  }
  
  private applyUTIEnhancements(product: any): any {
    const enhanced = { ...product };
    
    // Ensure UTI branding
    if (!enhanced.brand || !enhanced.brand.toLowerCase().includes('uti')) {
      enhanced.brand = enhanced.brand ? `UTI Games - ${enhanced.brand}` : 'UTI Games';
    }
    
    // Generate UTI-specific SEO
    if (!enhanced.meta_title) {
      enhanced.meta_title = `${enhanced.name} - UTI Games Original | Loja Oficial`;
    }
    
    if (!enhanced.meta_description) {
      enhanced.meta_description = `${enhanced.name} - Produto exclusivo UTI Games. Qualidade garantida, entrega rápida. Compre direto da loja oficial.`;
    }
    
    // Generate slug with UTI prefix
    if (!enhanced.slug) {
      enhanced.slug = this.generateUTISlug(enhanced.name);
    }
    
    // Add UTI-specific trust indicators
    enhanced.trust_indicators = {
      uti_original: true,
      exclusive_product: true,
      quality_guaranteed: true,
      fast_shipping: true,
      official_store: true
    };
    
    // Set UTI product highlights
    enhanced.product_highlights = [
      'Produto exclusivo UTI Games',
      'Qualidade premium garantida',
      'Entrega rápida e segura',
      'Suporte especializado',
      'Satisfação garantida'
    ];
    
    // Add UTI-specific badge
    enhanced.badge_text = 'UTI Original';
    enhanced.badge_color = '#3b82f6'; // UTI blue
    enhanced.badge_visible = true;
    
    // Mark as UTI original
    enhanced.isUTIOriginal = true;
    enhanced.dataSource = 'uti_internal';
    
    // Add delivery configuration for UTI products
    enhanced.delivery_config = {
      free_shipping: true,
      fast_delivery: true,
      same_day_available: true,
      delivery_time: '24-48 horas'
    };
    
    // Set appropriate category if not provided
    if (!enhanced.category) {
      enhanced.category = this.determineUTICategory(enhanced);
    }
    
    // Add UTI-specific tags
    const utiTags = ['uti games', 'produto exclusivo', 'original'];
    enhanced.tags = enhanced.tags ? 
      [...new Set([...enhanced.tags.split(','), ...utiTags])].join(',') :
      utiTags.join(',');
    
    return enhanced;
  }
  
  private generateUTISlug(name: string): string {
    return `uti-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  private determineUTICategory(product: any): string {
    const name = product.name?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    
    // Category mapping based on keywords
    const categoryMap = {
      'Vestuário': ['camiseta', 'camisa', 't-shirt', 'blusa', 'moletom', 'vestuário'],
      'Acessórios': ['chaveiro', 'adesivo', 'caneca', 'copo', 'squeeze'],
      'Eletrônicos': ['headset', 'mouse', 'teclado', 'cabo', 'carregador'],
      'Colecionáveis': ['action figure', 'boneco', 'miniatura', 'poster', 'quadro'],
      'Livros': ['livro', 'revista', 'manual', 'guia'],
      'Jogos': ['jogo', 'game', 'card game', 'tabuleiro']
    };
    
    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => name.includes(keyword) || description.includes(keyword))) {
        return category;
      }
    }
    
    return 'Produtos UTI'; // Default category
  }
}

export const utiProductProcessor = new UTIProductProcessor();