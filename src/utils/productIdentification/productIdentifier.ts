import { ProductType, ProductIdentificationResult, ConfidenceScore } from './types';

export class ProductIdentifier {
  
  identifyProductType(product: any): ProductIdentificationResult {
    const confidence = this.calculateConfidence(product);
    const flags = this.identifyFlags(product);
    const reasoning = this.generateReasoning(product, confidence, flags);
    
    const type = this.determineProductType(confidence, flags);
    
    return {
      type,
      confidence,
      reasoning,
      flags,
      recommendations: this.generateRecommendations(type, flags)
    };
  }
  
  private calculateConfidence(product: any): ConfidenceScore {
    const factors = {
      brandRecognition: this.calculateBrandRecognition(product),
      dataCompleteness: this.calculateDataCompleteness(product),
      consistencyCheck: this.calculateConsistencyCheck(product),
      marketPresence: this.calculateMarketPresence(product)
    };
    
    // Calcular confiança geral (média ponderada)
    const weights = {
      brandRecognition: 0.3,
      dataCompleteness: 0.35,
      consistencyCheck: 0.25,
      marketPresence: 0.1
    };
    
    const overall = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);
    
    return {
      overall: Math.round(overall * 100) / 100,
      factors
    };
  }
  
  private calculateBrandRecognition(product: any): number {
    // Lista de marcas conhecidas no setor médico/UTI
    const knownBrands = [
      'philips', 'ge', 'siemens', 'mindray', 'dixtal', 'drager', 'maquet',
      'hamilton', 'servo', 'newport', 'bird', 'bennett', 'puritan',
      'oxylog', 'evita', 'galileo', 'fabius', 'primus', 'zeus',
      'carescape', 'intellivue', 'mp', 'mx', 'avalon', 'cardiotocografo'
    ];
    
    const brand = product.brand?.toLowerCase() || product.marca?.toLowerCase() || '';
    const name = product.name?.toLowerCase() || product.nome?.toLowerCase() || '';
    
    // Verificar marca exata
    if (knownBrands.includes(brand)) {
      return 1.0;
    }
    
    // Verificar marca no nome do produto
    const brandInName = knownBrands.some(knownBrand => 
      name.includes(knownBrand)
    );
    
    if (brandInName) {
      return 0.8;
    }
    
    // Verificar se tem alguma marca (mesmo que não conhecida)
    if (brand && brand.length > 0) {
      return 0.4;
    }
    
    return 0.0;
  }
  
  private calculateDataCompleteness(product: any): number {
    const essentialFields = ['name', 'nome'];
    const importantFields = ['brand', 'marca', 'model', 'modelo', 'description', 'descricao'];
    const technicalFields = ['specifications', 'especificacoes', 'technical_specs'];
    
    let score = 0;
    let maxScore = 0;
    
    // Campos essenciais (peso 50%)
    maxScore += 0.5;
    const hasEssential = essentialFields.some(field => 
      product[field] && typeof product[field] === 'string' && product[field].trim().length > 0
    );
    if (hasEssential) score += 0.5;
    
    // Campos importantes (peso 30%)
    maxScore += 0.3;
    const importantFieldsPresent = importantFields.filter(field => 
      product[field] && typeof product[field] === 'string' && product[field].trim().length > 0
    ).length;
    score += (importantFieldsPresent / importantFields.length) * 0.3;
    
    // Campos técnicos (peso 20%)
    maxScore += 0.2;
    const hasTechnical = technicalFields.some(field => 
      product[field] && (Array.isArray(product[field]) || typeof product[field] === 'object')
    );
    if (hasTechnical) score += 0.2;
    
    return Math.min(score / maxScore, 1.0);
  }
  
  private calculateConsistencyCheck(product: any): number {
    let consistencyScore = 1.0;
    
    // Verificar consistência de dados
    
    // 1. Nome vs Marca
    const name = product.name?.toLowerCase() || product.nome?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || product.marca?.toLowerCase() || '';
    
    if (brand && name && !name.includes(brand) && brand.length > 2) {
      // Verificar se a marca deveria estar no nome
      const commonBrands = ['philips', 'ge', 'siemens', 'mindray'];
      if (commonBrands.includes(brand)) {
        consistencyScore -= 0.2;
      }
    }
    
    // 2. Verificar campos duplicados ou conflitantes
    const duplicatedFields = [
      ['name', 'nome'],
      ['brand', 'marca'],
      ['model', 'modelo'],
      ['description', 'descricao']
    ];
    
    duplicatedFields.forEach(([field1, field2]) => {
      if (product[field1] && product[field2] && product[field1] !== product[field2]) {
        consistencyScore -= 0.1;
      }
    });
    
    // 3. Verificar formato de especificações
    if (product.specifications) {
      if (!Array.isArray(product.specifications)) {
        consistencyScore -= 0.2;
      }
    }
    
    return Math.max(consistencyScore, 0.0);
  }
  
  private calculateMarketPresence(product: any): number {
    // Simulação de verificação de presença no mercado
    // Em uma implementação real, isso poderia consultar APIs externas
    
    const name = product.name?.toLowerCase() || product.nome?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || product.marca?.toLowerCase() || '';
    
    // Palavras-chave que indicam produtos médicos conhecidos
    const medicalKeywords = [
      'ventilador', 'monitor', 'bomba', 'desfibrilador', 'oximetro',
      'eletrocardiografo', 'aspirador', 'incubadora', 'berco'
    ];
    
    const hasmedicalKeywords = medicalKeywords.some(keyword => 
      name.includes(keyword)
    );
    
    if (hasmedicalKeywords) {
      return 0.7; // Produto médico reconhecível
    }
    
    if (brand) {
      return 0.5; // Tem marca, pode ter presença no mercado
    }
    
    return 0.3; // Presença no mercado incerta
  }
  
  private identifyFlags(product: any): string[] {
    const flags: string[] = [];
    
    // Verificar marca ausente
    const brand = product.brand || product.marca;
    if (!brand || (typeof brand === 'string' && brand.trim().length === 0)) {
      flags.push('missing_brand');
    }
    
    // Verificar dados incompletos
    const essentialFields = ['name', 'nome'];
    const hasEssentialData = essentialFields.some(field => 
      product[field] && typeof product[field] === 'string' && product[field].trim().length > 0
    );
    
    if (!hasEssentialData) {
      flags.push('incomplete_data');
    }
    
    // Verificar especificações técnicas
    if (!product.specifications && !product.especificacoes && !product.technical_specs) {
      flags.push('missing_specifications');
    }
    
    // Verificar inconsistências
    const name = product.name?.toLowerCase() || product.nome?.toLowerCase() || '';
    if (name.includes('undefined') || name.includes('null') || name.includes('n/a')) {
      flags.push('data_quality_issues');
    }
    
    // Verificar se parece ser produto médico
    const medicalTerms = ['ventilador', 'monitor', 'bomba', 'uti', 'hospital'];
    const seemsMedical = medicalTerms.some(term => name.includes(term));
    
    if (!seemsMedical && !brand) {
      flags.push('unknown_category');
    }
    
    return flags;
  }
  
  private generateReasoning(product: any, confidence: ConfidenceScore, flags: string[]): string[] {
    const reasoning: string[] = [];
    
    // Reasoning baseado na confiança
    if (confidence.overall >= 0.8) {
      reasoning.push('Alto nível de confiança baseado em dados completos e consistentes');
    } else if (confidence.overall >= 0.6) {
      reasoning.push('Confiança moderada - alguns dados podem estar incompletos');
    } else {
      reasoning.push('Baixa confiança - dados insuficientes ou inconsistentes');
    }
    
    // Reasoning baseado em fatores específicos
    if (confidence.factors.brandRecognition >= 0.8) {
      reasoning.push('Marca reconhecida no setor médico');
    } else if (confidence.factors.brandRecognition < 0.3) {
      reasoning.push('Marca não identificada ou desconhecida');
    }
    
    if (confidence.factors.dataCompleteness >= 0.8) {
      reasoning.push('Dados do produto completos e bem estruturados');
    } else if (confidence.factors.dataCompleteness < 0.5) {
      reasoning.push('Dados do produto incompletos ou mal estruturados');
    }
    
    // Reasoning baseado em flags
    if (flags.includes('missing_brand')) {
      reasoning.push('Marca do produto não foi especificada');
    }
    
    if (flags.includes('missing_specifications')) {
      reasoning.push('Especificações técnicas não foram fornecidas');
    }
    
    return reasoning;
  }
  
  private determineProductType(confidence: ConfidenceScore, flags: string[]): ProductType {
    // Produto conhecido: alta confiança e poucos problemas
    if (confidence.overall >= 0.75 && flags.length <= 1) {
      return 'known';
    }
    
    // Produto UTI original: confiança moderada/alta e características de produto médico
    if (confidence.overall >= 0.6 && confidence.factors.brandRecognition >= 0.4) {
      return 'uti_original';
    }
    
    // Caso contrário, produto duvidoso
    return 'doubtful';
  }
  
  private generateRecommendations(type: ProductType, flags: string[]): string[] {
    const recommendations: string[] = [];
    
    if (type === 'doubtful') {
      recommendations.push('Produto requer revisão manual antes do processamento');
      
      if (flags.includes('missing_brand')) {
        recommendations.push('Adicionar informações da marca do produto');
      }
      
      if (flags.includes('missing_specifications')) {
        recommendations.push('Incluir especificações técnicas detalhadas');
      }
      
      if (flags.includes('incomplete_data')) {
        recommendations.push('Completar dados básicos do produto');
      }
      
      if (flags.includes('data_quality_issues')) {
        recommendations.push('Verificar e corrigir problemas na qualidade dos dados');
      }
    }
    
    if (type === 'uti_original') {
      recommendations.push('Aplicar transformações específicas para produtos UTI');
      recommendations.push('Validar especificações contra padrões médicos');
    }
    
    if (type === 'known') {
      recommendations.push('Aplicar enriquecimento de dados baseado em conhecimento existente');
    }
    
    return recommendations;
  }
}

export const productIdentifier = new ProductIdentifier();