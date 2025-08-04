import { ProcessingResult } from '../types';
import { adaptiveSpecificationsSystem } from '../../adaptiveSpecifications';

export class KnownProductProcessor {
  
  async processKnownProduct(product: any): Promise<ProcessingResult> {
    try {
      console.log(`Processando produto conhecido: ${product.name}`);
      
      // Aplicar especificações adaptativas para produtos conhecidos
      const adaptiveSpecs = await adaptiveSpecificationsSystem.processProduct(product);
      
      // Enriquecer dados baseado no conhecimento existente
      const enrichedProduct = await this.enrichKnownProduct(product, adaptiveSpecs);
      
      return {
        success: true,
        product: enrichedProduct,
        errors: [],
        warnings: this.validateKnownProduct(enrichedProduct),
        processingType: 'known',
        confidence: 0.95
      };
      
    } catch (error) {
      console.error('Erro no processamento de produto conhecido:', error);
      
      return {
        success: false,
        errors: [`Erro no processamento: ${error.message}`],
        warnings: [],
        processingType: 'known',
        confidence: 0.0
      };
    }
  }
  
  private async enrichKnownProduct(product: any, adaptiveSpecs: any): Promise<any> {
    const enriched = {
      ...product,
      specifications: adaptiveSpecs.specifications,
      technical_specs: adaptiveSpecs.technical_specs,
      category: adaptiveSpecs.category,
      processing_metadata: {
        ...adaptiveSpecs.metadata,
        processing_type: 'known',
        enrichment_applied: true
      }
    };
    
    // Normalizar campos essenciais
    if (!enriched.brand && enriched.marca) {
      enriched.brand = enriched.marca;
    }
    
    if (!enriched.model && enriched.modelo) {
      enriched.model = enriched.modelo;
    }
    
    // Padronizar unidades de medida
    enriched.specifications = this.standardizeUnits(enriched.specifications);
    
    return enriched;
  }
  
  private standardizeUnits(specs: any[]): any[] {
    if (!Array.isArray(specs)) return specs;
    
    return specs.map(spec => ({
      ...spec,
      value: this.normalizeValue(spec.value, spec.unit),
      unit: this.standardizeUnit(spec.unit)
    }));
  }
  
  private normalizeValue(value: any, unit: string): any {
    if (typeof value !== 'string') return value;
    
    // Remover espaços e caracteres especiais desnecessários
    return value.trim().replace(/\s+/g, ' ');
  }
  
  private standardizeUnit(unit: string): string {
    if (!unit || typeof unit !== 'string') return unit;
    
    const unitMap: Record<string, string> = {
      'mm': 'mm',
      'milímetros': 'mm',
      'milimetros': 'mm',
      'cm': 'cm',
      'centímetros': 'cm',
      'centimetros': 'cm',
      'm': 'm',
      'metros': 'm',
      'kg': 'kg',
      'quilogramas': 'kg',
      'quilos': 'kg',
      'g': 'g',
      'gramas': 'g',
      'v': 'V',
      'volts': 'V',
      'volt': 'V',
      'w': 'W',
      'watts': 'W',
      'watt': 'W'
    };
    
    return unitMap[unit.toLowerCase()] || unit;
  }
  
  private validateKnownProduct(product: any): string[] {
    const warnings: string[] = [];
    
    if (!product.brand) {
      warnings.push('Marca não identificada');
    }
    
    if (!product.model) {
      warnings.push('Modelo não especificado');
    }
    
    if (!product.specifications || product.specifications.length === 0) {
      warnings.push('Especificações técnicas não encontradas');
    }
    
    if (!product.category || product.category === 'Geral') {
      warnings.push('Categoria genérica - pode precisar de classificação mais específica');
    }
    
    return warnings;
  }
}

export const knownProductProcessor = new KnownProductProcessor();