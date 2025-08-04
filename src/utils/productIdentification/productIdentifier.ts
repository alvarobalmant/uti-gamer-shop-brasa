import { ProductType, ConfidenceScore, ProductIdentificationResult, KnownProductData } from './types';
import { knownProductsDatabase } from './knownProductsDatabase';

export class ProductIdentifier {
  private knownProducts: KnownProductData[] = knownProductsDatabase;
  private utiProductKeywords = ['uti games', 'uti', 'camiseta uti', 'produto uti'];
  
  identifyProductType(product: any): ProductIdentificationResult {
    const brandRecognition = this.analyzeBrandRecognition(product);
    const dataCompleteness = this.analyzeDataCompleteness(product);
    const consistencyCheck = this.analyzeConsistency(product);
    const marketPresence = this.analyzeMarketPresence(product);
    
    const confidence: ConfidenceScore = {
      overall: (brandRecognition + dataCompleteness + consistencyCheck + marketPresence) / 4,
      factors: {
        brandRecognition,
        dataCompleteness,
        consistencyCheck,
        marketPresence
      }
    };
    
    const { type, reasoning, flags, recommendations } = this.determineProductType(product, confidence);
    
    return {
      type,
      confidence,
      reasoning,
      flags,
      recommendations
    };
  }
  
  private analyzeBrandRecognition(product: any): number {
    const brand = product.brand?.toLowerCase() || '';
    const name = product.name?.toLowerCase() || '';
    
    // Check if it's a UTI Games product
    if (this.utiProductKeywords.some(keyword => 
      brand.includes(keyword) || name.includes(keyword)
    )) {
      return 0.95; // High confidence for UTI products
    }
    
    // Check against known products database
    const knownProduct = this.findKnownProduct(product);
    if (knownProduct) {
      return 0.9; // High confidence for known products
    }
    
    // Check for well-known brands
    const majorBrands = [
      'sony', 'microsoft', 'nintendo', 'playstation', 'xbox',
      'logitech', 'razer', 'corsair', 'steelseries', 'hyperx',
      'samsung', 'lg', 'apple', 'google', 'amazon',
      'funko', 'bandai', 'hasbro', 'mattel'
    ];
    
    if (majorBrands.some(majorBrand => brand.includes(majorBrand))) {
      return 0.8;
    }
    
    return 0.3; // Low confidence for unknown brands
  }
  
  private analyzeDataCompleteness(product: any): number {
    const requiredFields = ['name', 'price', 'description'];
    const optionalFields = ['brand', 'category', 'image', 'specifications'];
    
    const hasRequired = requiredFields.every(field => 
      product[field] && product[field].toString().trim().length > 0
    );
    
    if (!hasRequired) {
      return 0.2; // Very low confidence for incomplete data
    }
    
    const optionalScore = optionalFields.reduce((score, field) => {
      return score + (product[field] ? 0.25 : 0);
    }, 0);
    
    return Math.min(0.6 + optionalScore, 1.0);
  }
  
  private analyzeConsistency(product: any): number {
    const inconsistencies = [];
    
    // Check price consistency
    if (product.price && (product.price < 0 || product.price > 50000)) {
      inconsistencies.push('price_range');
    }
    
    // Check name/description consistency
    if (product.name && product.description) {
      const nameWords = product.name.toLowerCase().split(' ');
      const descWords = product.description.toLowerCase().split(' ');
      const commonWords = nameWords.filter(word => descWords.includes(word));
      
      if (commonWords.length < 2) {
        inconsistencies.push('name_description_mismatch');
      }
    }
    
    // Check category/brand consistency
    if (product.category && product.brand) {
      const gamingBrands = ['sony', 'microsoft', 'nintendo', 'razer', 'logitech'];
      const gamingCategories = ['games', 'consoles', 'acessórios', 'periféricos'];
      
      const isGamingBrand = gamingBrands.some(brand => 
        product.brand.toLowerCase().includes(brand)
      );
      const isGamingCategory = gamingCategories.some(cat => 
        product.category.toLowerCase().includes(cat)
      );
      
      if (isGamingBrand !== isGamingCategory) {
        inconsistencies.push('category_brand_mismatch');
      }
    }
    
    return Math.max(0.1, 1.0 - (inconsistencies.length * 0.3));
  }
  
  private analyzeMarketPresence(product: any): number {
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    // Check for popular gaming products
    const popularProducts = [
      'playstation 5', 'ps5', 'xbox series', 'nintendo switch',
      'fifa', 'call of duty', 'grand theft auto', 'minecraft',
      'funko pop', 'pokemon', 'mario', 'zelda'
    ];
    
    const hasPopularKeywords = popularProducts.some(keyword => 
      name.includes(keyword) || brand.includes(keyword)
    );
    
    if (hasPopularKeywords) {
      return 0.9;
    }
    
    // Check for gaming-related keywords
    const gamingKeywords = ['gamer', 'gaming', 'console', 'jogo', 'game'];
    const hasGamingKeywords = gamingKeywords.some(keyword => 
      name.includes(keyword)
    );
    
    if (hasGamingKeywords) {
      return 0.7;
    }
    
    return 0.4; // Neutral for unknown products
  }
  
  private determineProductType(product: any, confidence: ConfidenceScore) {
    const reasoning: string[] = [];
    const flags: string[] = [];
    const recommendations: string[] = [];
    
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    // Check for UTI Original Products
    if (this.utiProductKeywords.some(keyword => 
      brand.includes(keyword) || name.includes(keyword)
    )) {
      reasoning.push('Produto identificado como UTI Games original');
      return {
        type: 'uti_original' as ProductType,
        reasoning,
        flags,
        recommendations: ['Processar apenas com dados fornecidos pelo usuário']
      };
    }
    
    // Check for Known Products
    const knownProduct = this.findKnownProduct(product);
    if (knownProduct && confidence.overall >= 0.7) {
      reasoning.push(`Produto reconhecido: ${knownProduct.name}`);
      reasoning.push('Alta confiança baseada em dados conhecidos');
      return {
        type: 'known' as ProductType,
        reasoning,
        flags,
        recommendations: ['Processar automaticamente com dados conhecidos']
      };
    }
    
    // Determine if product is doubtful
    if (confidence.overall < 0.6) {
      reasoning.push('Baixa confiança na identificação do produto');
      flags.push('low_confidence');
    }
    
    if (confidence.factors.dataCompleteness < 0.5) {
      reasoning.push('Dados incompletos ou inconsistentes');
      flags.push('incomplete_data');
    }
    
    if (confidence.factors.brandRecognition < 0.4) {
      reasoning.push('Marca desconhecida ou não reconhecida');
      flags.push('unknown_brand');
    }
    
    if (flags.length > 0 || confidence.overall < 0.6) {
      recommendations.push('Revisar manualmente antes do processamento');
      recommendations.push('Verificar informações com fornecedor');
      
      return {
        type: 'doubtful' as ProductType,
        reasoning,
        flags,
        recommendations
      };
    }
    
    // Default to known if no major issues found
    return {
      type: 'known' as ProductType,
      reasoning: ['Produto aprovado para processamento automático'],
      flags,
      recommendations: ['Processar com dados disponíveis']
    };
  }
  
  private findKnownProduct(product: any): KnownProductData | null {
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    return this.knownProducts.find(known => {
      const knownName = known.name.toLowerCase();
      const knownBrand = known.brand.toLowerCase();
      
      // Exact match
      if (name === knownName && brand === knownBrand) {
        return true;
      }
      
      // Check aliases
      if (known.aliases.some(alias => 
        name.includes(alias.toLowerCase()) || alias.toLowerCase().includes(name)
      )) {
        return true;
      }
      
      // Partial match with high similarity
      const nameMatch = this.calculateSimilarity(name, knownName);
      const brandMatch = brand && knownBrand ? this.calculateSimilarity(brand, knownBrand) : 0;
      
      return nameMatch > 0.8 && brandMatch > 0.7;
    }) || null;
  }
  
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

export const productIdentifier = new ProductIdentifier();