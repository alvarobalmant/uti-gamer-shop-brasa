import { ProcessingResult } from '../types';
import { adaptiveSpecificationsSystem } from '../../adaptiveSpecifications';

export class UTIProductProcessor {
  
  async processUTIProduct(product: any): Promise<ProcessingResult> {
    try {
      console.log(`Processando produto UTI original: ${product.name}`);
      
      // Aplicar especificações adaptativas para produtos UTI
      const adaptiveSpecs = await adaptiveSpecificationsSystem.processProduct(product);
      
      // Aplicar transformações específicas para produtos UTI
      const transformedProduct = await this.transformUTIProduct(product, adaptiveSpecs);
      
      return {
        success: true,
        product: transformedProduct,
        errors: [],
        warnings: this.validateUTIProduct(transformedProduct),
        processingType: 'uti_original',
        confidence: 0.85
      };
      
    } catch (error) {
      console.error('Erro no processamento de produto UTI:', error);
      
      return {
        success: false,
        errors: [`Erro no processamento UTI: ${error.message}`],
        warnings: [],
        processingType: 'uti_original',
        confidence: 0.0
      };
    }
  }
  
  private async transformUTIProduct(product: any, adaptiveSpecs: any): Promise<any> {
    const transformed = {
      ...product,
      specifications: adaptiveSpecs.specifications,
      technical_specs: adaptiveSpecs.technical_specs,
      category: this.categorizeUTIProduct(product),
      processing_metadata: {
        ...adaptiveSpecs.metadata,
        processing_type: 'uti_original',
        uti_transformations_applied: true
      }
    };
    
    // Aplicar transformações específicas do domínio UTI
    transformed.specifications = this.applyUTISpecificationTransforms(transformed.specifications);
    transformed.technical_specs = this.enhanceUTITechnicalSpecs(transformed.technical_specs);
    
    // Normalizar nomenclatura UTI
    transformed.name = this.normalizeUTIProductName(transformed.name);
    
    return transformed;
  }
  
  private categorizeUTIProduct(product: any): string {
    const name = product.name?.toLowerCase() || '';
    
    // Mapeamento específico para produtos UTI
    const utiCategories: Record<string, string> = {
      'ventilador': 'Ventiladores Pulmonares',
      'monitor': 'Monitores Multiparâmetros',
      'bomba': 'Bombas de Infusão',
      'desfibrilador': 'Desfibriladores',
      'oximetro': 'Oxímetros',
      'capnografo': 'Capnógrafos',
      'eletrocardiografo': 'Eletrocardiógrafos',
      'aspirador': 'Aspiradores',
      'incubadora': 'Incubadoras',
      'berco': 'Berços Aquecidos',
      'fototerapia': 'Equipamentos de Fototerapia'
    };
    
    for (const [keyword, category] of Object.entries(utiCategories)) {
      if (name.includes(keyword)) {
        return category;
      }
    }
    
    return 'Equipamentos Médicos';
  }
  
  private applyUTISpecificationTransforms(specs: any[]): any[] {
    if (!Array.isArray(specs)) return specs;
    
    return specs.map(spec => {
      const transformed = { ...spec };
      
      // Transformações específicas para especificações UTI
      if (spec.name?.toLowerCase().includes('fluxo')) {
        transformed.category = 'Parâmetros Ventilatórios';
        transformed.unit = this.standardizeFlowUnit(spec.unit);
      }
      
      if (spec.name?.toLowerCase().includes('pressão') || spec.name?.toLowerCase().includes('pressao')) {
        transformed.category = 'Parâmetros de Pressão';
        transformed.unit = this.standardizePressureUnit(spec.unit);
      }
      
      if (spec.name?.toLowerCase().includes('frequência') || spec.name?.toLowerCase().includes('frequencia')) {
        transformed.category = 'Parâmetros de Frequência';
        transformed.unit = this.standardizeFrequencyUnit(spec.unit);
      }
      
      return transformed;
    });
  }
  
  private enhanceUTITechnicalSpecs(techSpecs: any): any {
    const enhanced = { ...techSpecs };
    
    // Adicionar especificações técnicas padrão para equipamentos UTI
    if (!enhanced.safety_standards) {
      enhanced.safety_standards = [
        'IEC 60601-1',
        'ABNT NBR IEC 60601-1',
        'ANVISA'
      ];
    }
    
    if (!enhanced.classifications) {
      enhanced.classifications = {
        anvisa_class: 'II ou III',
        risk_level: 'Alto',
        maintenance_level: 'Especializado'
      };
    }
    
    return enhanced;
  }
  
  private normalizeUTIProductName(name: string): string {
    if (!name) return name;
    
    // Normalizar nomes comuns de equipamentos UTI
    const nameMap: Record<string, string> = {
      'vent pulmonar': 'Ventilador Pulmonar',
      'vent. pulmonar': 'Ventilador Pulmonar',
      'mon multiparametros': 'Monitor Multiparâmetros',
      'mon. multiparâmetros': 'Monitor Multiparâmetros',
      'bomba inf': 'Bomba de Infusão',
      'bomba infusao': 'Bomba de Infusão'
    };
    
    const lowerName = name.toLowerCase();
    for (const [pattern, replacement] of Object.entries(nameMap)) {
      if (lowerName.includes(pattern)) {
        return name.replace(new RegExp(pattern, 'gi'), replacement);
      }
    }
    
    return name;
  }
  
  private standardizeFlowUnit(unit: string): string {
    if (!unit) return 'L/min';
    
    const flowUnits: Record<string, string> = {
      'l/min': 'L/min',
      'lpm': 'L/min',
      'ml/min': 'mL/min',
      'ml/h': 'mL/h'
    };
    
    return flowUnits[unit.toLowerCase()] || unit;
  }
  
  private standardizePressureUnit(unit: string): string {
    if (!unit) return 'cmH2O';
    
    const pressureUnits: Record<string, string> = {
      'cmh2o': 'cmH2O',
      'mmhg': 'mmHg',
      'mbar': 'mbar',
      'psi': 'PSI'
    };
    
    return pressureUnits[unit.toLowerCase()] || unit;
  }
  
  private standardizeFrequencyUnit(unit: string): string {
    if (!unit) return 'Hz';
    
    const freqUnits: Record<string, string> = {
      'hz': 'Hz',
      'bpm': 'BPM',
      'rpm': 'RPM',
      '/min': '/min'
    };
    
    return freqUnits[unit.toLowerCase()] || unit;
  }
  
  private validateUTIProduct(product: any): string[] {
    const warnings: string[] = [];
    
    if (!product.technical_specs?.safety_standards) {
      warnings.push('Normas de segurança não especificadas');
    }
    
    if (!product.technical_specs?.classifications?.anvisa_class) {
      warnings.push('Classificação ANVISA não encontrada');
    }
    
    const vitalSpecs = ['tensão', 'potência', 'corrente'];
    const hasVitalSpecs = vitalSpecs.some(spec => 
      product.specifications?.some((s: any) => 
        s.name?.toLowerCase().includes(spec)
      )
    );
    
    if (!hasVitalSpecs) {
      warnings.push('Especificações elétricas essenciais podem estar faltando');
    }
    
    return warnings;
  }
}

export const utiProductProcessor = new UTIProductProcessor();