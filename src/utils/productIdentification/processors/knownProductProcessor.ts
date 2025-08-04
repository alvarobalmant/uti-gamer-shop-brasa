import { ProcessingResult, KnownProductData } from '../types';
import { knownProductsDatabase } from '../knownProductsDatabase';
import { adaptiveSpecificationsSystem } from '../../adaptiveSpecifications';

export class KnownProductProcessor {
  private knownProducts: KnownProductData[] = knownProductsDatabase;
  
  async processKnownProduct(product: any): Promise<ProcessingResult> {
    try {
      const knownProduct = this.findMatchingKnownProduct(product);
      
      if (!knownProduct) {
        return {
          success: false,
          errors: ['Produto não encontrado na base de dados conhecidos'],
          warnings: [],
          processingType: 'known',
          confidence: 0.1
        };
      }
      
      // Merge user data with known product data
      const enhancedProduct = this.mergeWithKnownData(product, knownProduct);
      
      // Apply adaptive specifications
      const processedProduct = await this.applyAdaptiveSpecifications(enhancedProduct);
      
      // Validate and enrich
      const validatedProduct = this.validateAndEnrich(processedProduct, knownProduct);
      
      return {
        success: true,
        product: validatedProduct,
        errors: [],
        warnings: this.generateWarnings(product, knownProduct),
        processingType: 'known',
        confidence: 0.95
      };
      
    } catch (error) {
      return {
        success: false,
        errors: [`Erro no processamento: ${error.message}`],
        warnings: [],
        processingType: 'known',
        confidence: 0.0
      };
    }
  }
  
  private findMatchingKnownProduct(product: any): KnownProductData | null {
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    return this.knownProducts.find(known => {
      // Direct name match
      if (name.includes(known.name.toLowerCase())) {
        return true;
      }
      
      // Alias match
      return known.aliases.some(alias => 
        name.includes(alias.toLowerCase()) || alias.toLowerCase().includes(name)
      );
    }) || null;
  }
  
  private mergeWithKnownData(userProduct: any, knownProduct: KnownProductData): any {
    const merged = {
      ...userProduct,
      // Override with known data when user data is missing or incomplete
      name: userProduct.name || knownProduct.name,
      brand: userProduct.brand || knownProduct.brand,
      category: userProduct.category || knownProduct.category,
      
      // Add standard specifications
      standardSpecs: {
        ...knownProduct.standardSpecs,
        ...userProduct.standardSpecs
      },
      
      // Mark as known product
      isKnownProduct: true,
      knownProductId: knownProduct.id,
      dataSource: 'known_database'
    };
    
    return merged;
  }
  
  private async applyAdaptiveSpecifications(product: any): Promise<any> {
    try {
      const processedSpecs = await adaptiveSpecificationsSystem.processProduct(product);
      
      return {
        ...product,
        specifications: processedSpecs.specifications,
        technical_specs: processedSpecs.technical_specs,
        adaptiveCategory: processedSpecs.category,
        processingMetadata: {
          ...processedSpecs.metadata,
          processingType: 'known_product'
        }
      };
    } catch (error) {
      console.warn('Erro ao aplicar especificações adaptativas:', error);
      return product;
    }
  }
  
  private validateAndEnrich(product: any, knownProduct: KnownProductData): any {
    const enriched = { ...product };
    
    // Add missing SEO data
    if (!enriched.meta_title) {
      enriched.meta_title = `${knownProduct.name} - ${knownProduct.brand} | UTI Games`;
    }
    
    if (!enriched.meta_description) {
      enriched.meta_description = `${knownProduct.name} da ${knownProduct.brand}. Produto original com garantia. Compre na UTI Games com o melhor preço.`;
    }
    
    // Generate slug if missing
    if (!enriched.slug) {
      enriched.slug = this.generateSlug(knownProduct.name, knownProduct.brand);
    }
    
    // Add trust indicators for known products
    enriched.trust_indicators = {
      verified_product: true,
      official_brand: true,
      warranty_included: true,
      fast_shipping: true
    };
    
    // Add product highlights based on known data
    enriched.product_highlights = this.generateHighlights(knownProduct);
    
    // Set appropriate badge
    enriched.badge_text = 'Produto Oficial';
    enriched.badge_color = '#22c55e';
    enriched.badge_visible = true;
    
    return enriched;
  }
  
  private generateWarnings(userProduct: any, knownProduct: KnownProductData): string[] {
    const warnings: string[] = [];
    
    // Check for price discrepancies
    if (userProduct.price && this.isPriceUnusual(userProduct.price, knownProduct)) {
      warnings.push('Preço pode estar fora da faixa esperada para este produto');
    }
    
    // Check for missing important data
    if (!userProduct.image && !userProduct.images) {
      warnings.push('Produto conhecido sem imagem - considere adicionar imagens oficiais');
    }
    
    // Check for category mismatch
    if (userProduct.category && 
        userProduct.category.toLowerCase() !== knownProduct.category.toLowerCase()) {
      warnings.push(`Categoria divergente: usuário informou "${userProduct.category}", base de dados indica "${knownProduct.category}"`);
    }
    
    return warnings;
  }
  
  private isPriceUnusual(price: number, knownProduct: KnownProductData): boolean {
    // Basic price validation based on product category
    const categoryRanges = {
      'Consoles': { min: 1000, max: 5000 },
      'Games': { min: 50, max: 500 },
      'Periféricos': { min: 30, max: 1000 },
      'Colecionáveis': { min: 20, max: 300 },
      'Smartphones': { min: 500, max: 8000 }
    };
    
    const range = categoryRanges[knownProduct.category];
    if (range) {
      return price < range.min || price > range.max;
    }
    
    return false;
  }
  
  private generateSlug(name: string, brand: string): string {
    return `${name} ${brand}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  private generateHighlights(knownProduct: KnownProductData): string[] {
    const highlights: string[] = [];
    
    // Category-specific highlights
    switch (knownProduct.category) {
      case 'Consoles':
        highlights.push('Console de nova geração');
        highlights.push('Garantia oficial do fabricante');
        highlights.push('Suporte técnico especializado');
        break;
        
      case 'Games':
        highlights.push('Jogo original lacrado');
        highlights.push('Compatível com console');
        highlights.push('Entrega imediata');
        break;
        
      case 'Periféricos':
        highlights.push('Equipamento gamer profissional');
        highlights.push('Alta precisão e desempenho');
        highlights.push('Compatibilidade garantida');
        break;
        
      case 'Colecionáveis':
        highlights.push('Item de coleção autêntico');
        highlights.push('Embalagem original');
        highlights.push('Ideal para colecionadores');
        break;
    }
    
    return highlights;
  }
}

export const knownProductProcessor = new KnownProductProcessor();