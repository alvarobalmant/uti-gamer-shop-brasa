import { ProcessingResult, ProductIdentificationResult } from '../types';
import { adaptiveSpecificationsSystem } from '../../adaptiveSpecifications';

export class DoubtfulProductHandler {
  
  handleDoubtfulProduct(product: any, identification: ProductIdentificationResult): ProcessingResult {
    try {
      console.log(`Produto duvidoso detectado: ${product.name}`, {
        confidence: identification.confidence.overall,
        flags: identification.flags
      });
      
      // Aplicar processamento básico mesmo para produtos duvidosos
      return this.processWithCaution(product, identification);
      
    } catch (error) {
      console.error('Erro no processamento de produto duvidoso:', error);
      
      return {
        success: false,
        errors: [`Erro crítico no produto duvidoso: ${error.message}`],
        warnings: [],
        processingType: 'doubtful',
        confidence: 0.0
      };
    }
  }
  
  private processWithCaution(product: any, identification: ProductIdentificationResult): ProcessingResult {
    const warnings: string[] = [
      ...identification.flags,
      'Produto marcado como duvidoso - revisar manualmente'
    ];
    
    // Aplicar especificações básicas mesmo para produtos duvidosos
    const basicSpecs = this.extractBasicSpecifications(product);
    
    const processedProduct = {
      ...product,
      specifications: basicSpecs.specifications,
      technical_specs: basicSpecs.technical_specs,
      category: 'Não Classificado',
      processing_metadata: {
        processedAt: new Date().toISOString(),
        version: '1.0',
        processing_type: 'doubtful',
        confidence_factors: identification.confidence.factors,
        flags: identification.flags,
        requires_manual_review: true
      }
    };
    
    // Adicionar recomendações específicas
    if (identification.recommendations) {
      warnings.push(...identification.recommendations);
    }
    
    return {
      success: false, // Marcado como não bem-sucedido para revisão manual
      product: processedProduct,
      errors: this.generateDoubtfulErrors(identification),
      warnings,
      processingType: 'doubtful',
      confidence: identification.confidence.overall
    };
  }
  
  private extractBasicSpecifications(product: any): any {
    const specs: any[] = [];
    const techSpecs: any = {};
    
    // Tentar extrair informações básicas mesmo de produtos duvidosos
    const basicFields = ['name', 'brand', 'model', 'description'];
    
    basicFields.forEach(field => {
      if (product[field] && typeof product[field] === 'string') {
        specs.push({
          name: field.charAt(0).toUpperCase() + field.slice(1),
          value: product[field],
          category: 'Informações Básicas',
          confidence: 'low'
        });
      }
    });
    
    // Procurar por padrões numéricos que possam ser especificações
    if (product.description) {
      const numericPatterns = this.extractNumericPatterns(product.description);
      specs.push(...numericPatterns);
    }
    
    techSpecs.extraction_method = 'basic_pattern_matching';
    techSpecs.reliability = 'low';
    techSpecs.requires_verification = true;
    
    return {
      specifications: specs,
      technical_specs: techSpecs
    };
  }
  
  private extractNumericPatterns(text: string): any[] {
    const patterns: any[] = [];
    
    if (!text || typeof text !== 'string') return patterns;
    
    // Padrões comuns para especificações técnicas
    const specPatterns = [
      {
        regex: /(\d+(?:\.\d+)?)\s*(v|volt|volts)/gi,
        category: 'Alimentação',
        unit: 'V',
        name: 'Tensão'
      },
      {
        regex: /(\d+(?:\.\d+)?)\s*(w|watt|watts)/gi,
        category: 'Alimentação',
        unit: 'W',
        name: 'Potência'
      },
      {
        regex: /(\d+(?:\.\d+)?)\s*(kg|quilos|quilogramas)/gi,
        category: 'Físicas',
        unit: 'kg',
        name: 'Peso'
      },
      {
        regex: /(\d+(?:\.\d+)?)\s*(mm|cm|m|metros|milímetros|centímetros)/gi,
        category: 'Dimensões',
        unit: 'mm',
        name: 'Dimensão'
      }
    ];
    
    specPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        patterns.push({
          name: pattern.name,
          value: match[1],
          unit: pattern.unit,
          category: pattern.category,
          confidence: 'low',
          source: 'pattern_extraction'
        });
      }
    });
    
    return patterns;
  }
  
  private generateDoubtfulErrors(identification: ProductIdentificationResult): string[] {
    const errors: string[] = [];
    
    // Converter flags em erros mais específicos
    identification.flags.forEach(flag => {
      switch (flag.toLowerCase()) {
        case 'missing_brand':
          errors.push('Marca do produto não identificada ou ausente');
          break;
        case 'incomplete_data':
          errors.push('Dados do produto incompletos ou insuficientes');
          break;
        case 'inconsistent_specifications':
          errors.push('Especificações técnicas inconsistentes ou contraditórias');
          break;
        case 'unknown_category':
          errors.push('Categoria do produto não pode ser determinada');
          break;
        case 'low_confidence':
          errors.push('Baixa confiança na identificação do produto');
          break;
        default:
          errors.push(`Problema identificado: ${flag}`);
      }
    });
    
    if (errors.length === 0) {
      errors.push('Produto não atende aos critérios de qualidade mínimos');
    }
    
    return errors;
  }
}

export const doubtfulProductHandler = new DoubtfulProductHandler();