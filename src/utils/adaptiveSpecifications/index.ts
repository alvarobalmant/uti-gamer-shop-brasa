import { ProductType } from '../productIdentification/types';

interface AdaptiveSpecificationRule {
  id: string;
  name: string;
  pattern: RegExp | string;
  category: string;
  unit?: string;
  priority: number;
  applicableTypes: ProductType[];
}

interface SpecificationTransformer {
  transform(spec: any, context: any): any;
  validate(spec: any): boolean;
}

class AdaptiveSpecificationsEngine {
  private rules: AdaptiveSpecificationRule[] = [];
  private transformers: Map<string, SpecificationTransformer> = new Map();
  
  constructor() {
    this.initializeDefaultRules();
    this.initializeTransformers();
  }
  
  async processProduct(product: any): Promise<any> {
    const productType = this.inferProductType(product);
    
    // Extrair especificações adaptativas
    const extractedSpecs = await this.extractSpecifications(product, productType);
    
    // Transformar especificações baseado no tipo
    const transformedSpecs = await this.transformSpecifications(extractedSpecs, productType);
    
    // Enriquecer especificações técnicas
    const technicalSpecs = await this.enrichTechnicalSpecs(product, productType);
    
    // Categorizar produto
    const category = this.categorizeProduct(product, productType);
    
    return {
      specifications: transformedSpecs,
      technical_specs: technicalSpecs,
      category,
      metadata: {
        processedAt: new Date().toISOString(),
        version: '2.0',
        processing_type: productType,
        rules_applied: this.getAppliedRules(product, productType),
        confidence_score: this.calculateConfidenceScore(product, transformedSpecs)
      }
    };
  }
  
  private inferProductType(product: any): ProductType {
    const name = product.name?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || product.marca?.toLowerCase() || '';
    
    // Marcas conhecidas indicam produtos conhecidos
    const knownBrands = ['philips', 'ge', 'siemens', 'mindray', 'dixtal'];
    if (knownBrands.some(b => brand.includes(b) || name.includes(b))) {
      return 'known';
    }
    
    // Termos médicos indicam produtos UTI originais
    const medicalTerms = ['ventilador', 'monitor', 'bomba', 'desfibrilador'];
    if (medicalTerms.some(term => name.includes(term))) {
      return 'uti_original';
    }
    
    return 'doubtful';
  }
  
  private async extractSpecifications(product: any, type: ProductType): Promise<any[]> {
    const specifications: any[] = [];
    
    // Usar especificações existentes como base
    if (product.specifications && Array.isArray(product.specifications)) {
      specifications.push(...product.specifications);
    }
    
    // Extrair especificações de campos textuais
    const textFields = ['description', 'descricao', 'name', 'nome'];
    textFields.forEach(field => {
      if (product[field] && typeof product[field] === 'string') {
        const extracted = this.extractFromText(product[field], type);
        specifications.push(...extracted);
      }
    });
    
    // Aplicar regras específicas por tipo
    const typeSpecificSpecs = this.applyTypeSpecificRules(product, type);
    specifications.push(...typeSpecificSpecs);
    
    return this.deduplicateSpecifications(specifications);
  }
  
  private extractFromText(text: string, type: ProductType): any[] {
    const specs: any[] = [];
    
    // Padrões básicos para extração
    const patterns = [
      {
        regex: /(\d+(?:\.\d+)?)\s*(v|volt|volts|V)/gi,
        name: 'Tensão',
        category: 'Alimentação',
        unit: 'V'
      },
      {
        regex: /(\d+(?:\.\d+)?)\s*(w|watt|watts|W)/gi,
        name: 'Potência',
        category: 'Alimentação',
        unit: 'W'
      },
      {
        regex: /(\d+(?:\.\d+)?)\s*(kg|quilos|quilogramas)/gi,
        name: 'Peso',
        category: 'Físicas',
        unit: 'kg'
      },
      {
        regex: /(\d+(?:\.\d+)?)\s*(hz|hertz)/gi,
        name: 'Frequência',
        category: 'Técnicas',
        unit: 'Hz'
      }
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        specs.push({
          name: pattern.name,
          value: match[1],
          unit: pattern.unit,
          category: pattern.category,
          source: 'text_extraction',
          confidence: 0.7
        });
      }
    });
    
    return specs;
  }
  
  private applyTypeSpecificRules(product: any, type: ProductType): any[] {
    const specs: any[] = [];
    
    // Regras específicas para produtos UTI
    if (type === 'uti_original') {
      // Adicionar especificações padrão para equipamentos médicos
      if (product.name?.toLowerCase().includes('ventilador')) {
        specs.push(
          {
            name: 'Faixa de Volume Corrente',
            value: 'Variável',
            category: 'Parâmetros Ventilatórios',
            source: 'type_inference'
          },
          {
            name: 'Modos Ventilatórios',
            value: 'Volume/Pressão Controlada',
            category: 'Parâmetros Ventilatórios',
            source: 'type_inference'
          }
        );
      }
      
      if (product.name?.toLowerCase().includes('monitor')) {
        specs.push(
          {
            name: 'Parâmetros Monitorados',
            value: 'ECG, SpO2, NIBP, Temp',
            category: 'Monitorização',
            source: 'type_inference'
          }
        );
      }
    }
    
    return specs;
  }
  
  private async transformSpecifications(specs: any[], type: ProductType): Promise<any[]> {
    return specs.map(spec => {
      // Aplicar transformadores baseados no tipo
      const transformer = this.transformers.get(type);
      if (transformer && transformer.validate(spec)) {
        return transformer.transform(spec, { type });
      }
      
      // Transformações gerais
      return {
        ...spec,
        value: this.normalizeValue(spec.value),
        unit: this.standardizeUnit(spec.unit),
        category: spec.category || 'Geral'
      };
    });
  }
  
  private async enrichTechnicalSpecs(product: any, type: ProductType): Promise<any> {
    const baseSpecs = product.technical_specs || {};
    
    // Enriquecimento baseado no tipo
    const enrichment: any = {};
    
    if (type === 'uti_original') {
      enrichment.medical_certifications = [
        'ANVISA',
        'CE',
        'FDA (se aplicável)'
      ];
      
      enrichment.safety_standards = [
        'IEC 60601-1',
        'ABNT NBR IEC 60601-1'
      ];
      
      enrichment.maintenance_requirements = {
        preventive: 'Trimestral',
        calibration: 'Anual',
        specialized_service: true
      };
    }
    
    if (type === 'known') {
      enrichment.documentation_completeness = 'High';
      enrichment.spare_parts_availability = 'Good';
    }
    
    return {
      ...baseSpecs,
      ...enrichment,
      processing_metadata: {
        enriched_at: new Date().toISOString(),
        source_type: type
      }
    };
  }
  
  private categorizeProduct(product: any, type: ProductType): string {
    const name = product.name?.toLowerCase() || '';
    
    // Categorização específica para equipamentos médicos
    const medicalCategories: Record<string, string> = {
      'ventilador': 'Ventiladores Pulmonares',
      'monitor': 'Monitores Multiparâmetros',
      'bomba': 'Bombas de Infusão',
      'desfibrilador': 'Desfibriladores',
      'oximetro': 'Oxímetros',
      'eletrocardiografo': 'Eletrocardiógrafos',
      'incubadora': 'Incubadoras',
      'berco': 'Berços Aquecidos'
    };
    
    for (const [keyword, category] of Object.entries(medicalCategories)) {
      if (name.includes(keyword)) {
        return category;
      }
    }
    
    // Categoria baseada no tipo
    switch (type) {
      case 'known':
        return product.category || 'Equipamentos Conhecidos';
      case 'uti_original':
        return 'Equipamentos Médicos';
      case 'doubtful':
        return 'Não Classificado';
      default:
        return 'Geral';
    }
  }
  
  private deduplicateSpecifications(specs: any[]): any[] {
    const seen = new Set<string>();
    const deduplicated: any[] = [];
    
    specs.forEach(spec => {
      const key = `${spec.name}-${spec.category}-${spec.unit}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(spec);
      }
    });
    
    return deduplicated;
  }
  
  private normalizeValue(value: any): any {
    if (typeof value === 'string') {
      return value.trim().replace(/\s+/g, ' ');
    }
    return value;
  }
  
  private standardizeUnit(unit: string): string {
    if (!unit) return unit;
    
    const unitMap: Record<string, string> = {
      'v': 'V',
      'volt': 'V',
      'volts': 'V',
      'w': 'W',
      'watt': 'W',
      'watts': 'W',
      'kg': 'kg',
      'quilos': 'kg',
      'quilogramas': 'kg'
    };
    
    return unitMap[unit.toLowerCase()] || unit;
  }
  
  private initializeDefaultRules(): void {
    // Regras para identificação automática de especificações
    this.rules = [
      {
        id: 'voltage_detection',
        name: 'Detecção de Tensão',
        pattern: /(\d+(?:\.\d+)?)\s*(v|volt|volts)/gi,
        category: 'Alimentação',
        unit: 'V',
        priority: 1,
        applicableTypes: ['known', 'uti_original', 'doubtful']
      },
      {
        id: 'power_detection',
        name: 'Detecção de Potência',
        pattern: /(\d+(?:\.\d+)?)\s*(w|watt|watts)/gi,
        category: 'Alimentação',
        unit: 'W',
        priority: 1,
        applicableTypes: ['known', 'uti_original', 'doubtful']
      }
    ];
  }
  
  private initializeTransformers(): void {
    // Transformador para produtos conhecidos
    this.transformers.set('known', {
      transform: (spec: any, context: any) => ({
        ...spec,
        reliability: 'high',
        verified: true
      }),
      validate: (spec: any) => spec.name && spec.value
    });
    
    // Transformador para produtos UTI
    this.transformers.set('uti_original', {
      transform: (spec: any, context: any) => ({
        ...spec,
        medical_context: true,
        safety_critical: this.isSafetyCritical(spec.name)
      }),
      validate: (spec: any) => spec.name && spec.value
    });
  }
  
  private isSafetyCritical(specName: string): boolean {
    const criticalSpecs = ['tensão', 'potência', 'pressão', 'fluxo', 'temperatura'];
    return criticalSpecs.some(critical => 
      specName.toLowerCase().includes(critical)
    );
  }
  
  private getAppliedRules(product: any, type: ProductType): string[] {
    return this.rules
      .filter(rule => rule.applicableTypes.includes(type))
      .map(rule => rule.id);
  }
  
  private calculateConfidenceScore(product: any, specs: any[]): number {
    let score = 0.5; // Base score
    
    if (specs.length > 0) score += 0.2;
    if (specs.length > 5) score += 0.1;
    if (product.brand) score += 0.1;
    if (specs.some(s => s.category !== 'Geral')) score += 0.1;
    
    return Math.min(score, 1.0);
  }
}

export const adaptiveSpecificationsSystem = new AdaptiveSpecificationsEngine();