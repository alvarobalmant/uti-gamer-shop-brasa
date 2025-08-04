import { ProcessingResult } from '../types';

export class DoubtfulProductHandler {
  
  handleDoubtfulProduct(product: any, identificationResult: any): ProcessingResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Analyze why the product is doubtful
    const analysis = this.analyzeDoubtfulReasons(product, identificationResult);
    
    // Generate detailed feedback
    const feedback = this.generateDetailedFeedback(product, analysis);
    
    // Determine if partial processing is possible
    const partialProcessing = this.attemptPartialProcessing(product, analysis);
    
    return {
      success: false,
      errors: [
        'Produto marcado como duvidoso - requer revisão manual',
        ...analysis.criticalIssues,
        ...feedback.errors
      ],
      warnings: [
        ...analysis.warnings,
        ...feedback.warnings,
        ...this.generateActionableRecommendations(analysis)
      ],
      processingType: 'doubtful',
      confidence: identificationResult.confidence.overall,
      product: partialProcessing.data || undefined
    };
  }
  
  private analyzeDoubtfulReasons(product: any, identificationResult: any): any {
    const analysis = {
      criticalIssues: [],
      warnings: [],
      dataGaps: [],
      inconsistencies: [],
      suggestions: []
    };
    
    // Analyze confidence factors
    const { factors } = identificationResult.confidence;
    
    if (factors.brandRecognition < 0.5) {
      analysis.criticalIssues.push('Marca não reconhecida ou desconhecida');
      analysis.suggestions.push('Verificar se a marca está correta e é oficial');
    }
    
    if (factors.dataCompleteness < 0.6) {
      analysis.criticalIssues.push('Dados incompletos ou insuficientes');
      analysis.dataGaps.push(...this.identifyDataGaps(product));
    }
    
    if (factors.consistencyCheck < 0.7) {
      analysis.warnings.push('Inconsistências detectadas nos dados');
      analysis.inconsistencies.push(...this.identifyInconsistencies(product));
    }
    
    if (factors.marketPresence < 0.4) {
      analysis.warnings.push('Produto não encontrado em bases de dados conhecidas');
      analysis.suggestions.push('Confirmar se o produto existe e está sendo comercializado');
    }
    
    return analysis;
  }
  
  private identifyDataGaps(product: any): string[] {
    const gaps: string[] = [];
    const requiredFields = ['name', 'price', 'description', 'brand', 'category'];
    const recommendedFields = ['image', 'specifications', 'stock'];
    
    requiredFields.forEach(field => {
      if (!product[field] || product[field].toString().trim().length === 0) {
        gaps.push(`Campo obrigatório ausente: ${field}`);
      }
    });
    
    recommendedFields.forEach(field => {
      if (!product[field]) {
        gaps.push(`Campo recomendado ausente: ${field}`);
      }
    });
    
    return gaps;
  }
  
  private identifyInconsistencies(product: any): string[] {
    const inconsistencies: string[] = [];
    
    // Price consistency
    if (product.price) {
      const price = Number(product.price);
      if (price <= 0) {
        inconsistencies.push('Preço inválido ou zero');
      }
      if (price > 50000) {
        inconsistencies.push('Preço extremamente alto - verificar se está correto');
      }
    }
    
    // Name/description consistency
    if (product.name && product.description) {
      const nameWords = product.name.toLowerCase().split(' ').filter(w => w.length > 3);
      const descriptionLower = product.description.toLowerCase();
      
      const commonWords = nameWords.filter(word => descriptionLower.includes(word));
      if (commonWords.length < 2) {
        inconsistencies.push('Nome e descrição parecem não estar relacionados');
      }
    }
    
    // Category/brand consistency
    if (product.category && product.brand) {
      const gamingBrands = ['sony', 'microsoft', 'nintendo', 'razer', 'logitech'];
      const gamingCategories = ['games', 'consoles', 'periféricos', 'acessórios'];
      
      const isGamingBrand = gamingBrands.some(brand => 
        product.brand.toLowerCase().includes(brand)
      );
      const isGamingCategory = gamingCategories.some(cat => 
        product.category.toLowerCase().includes(cat)
      );
      
      if (isGamingBrand && !isGamingCategory) {
        inconsistencies.push('Marca de gaming em categoria não relacionada');
      }
    }
    
    return inconsistencies;
  }
  
  private generateDetailedFeedback(product: any, analysis: any): any {
    const feedback = {
      errors: [],
      warnings: [],
      suggestions: []
    };
    
    // Critical issues become errors
    feedback.errors = [...analysis.criticalIssues];
    
    // Data gaps become actionable warnings
    if (analysis.dataGaps.length > 0) {
      feedback.warnings.push(`${analysis.dataGaps.length} campos importantes ausentes ou incompletos`);
      feedback.suggestions.push('Completar todos os campos obrigatórios antes de reprocessar');
    }
    
    // Inconsistencies become warnings with suggestions
    if (analysis.inconsistencies.length > 0) {
      feedback.warnings.push('Dados inconsistentes detectados');
      feedback.suggestions.push('Revisar e corrigir inconsistências nos dados');
    }
    
    return feedback;
  }
  
  private attemptPartialProcessing(product: any, analysis: any): { success: boolean; data?: any } {
    // If only minor issues, try to create a basic product structure
    if (analysis.criticalIssues.length === 0 && analysis.dataGaps.length < 3) {
      try {
        const partialProduct = {
          ...product,
          processingStatus: 'partial',
          requiresReview: true,
          reviewNotes: analysis.suggestions,
          confidence: 'low',
          
          // Add default values for missing fields
          badge_text: 'Requer Revisão',
          badge_color: '#f59e0b',
          badge_visible: true,
          
          // Mark for manual review
          needsManualReview: true,
          reviewFlags: analysis.warnings
        };
        
        return { success: true, data: partialProduct };
      } catch (error) {
        return { success: false };
      }
    }
    
    return { success: false };
  }
  
  private generateActionableRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    // Specific recommendations based on issues found
    if (analysis.dataGaps.some(gap => gap.includes('brand'))) {
      recommendations.push('AÇÃO: Verificar e informar a marca oficial do produto');
    }
    
    if (analysis.dataGaps.some(gap => gap.includes('category'))) {
      recommendations.push('AÇÃO: Definir categoria apropriada (Games, Consoles, Periféricos, etc.)');
    }
    
    if (analysis.dataGaps.some(gap => gap.includes('image'))) {
      recommendations.push('AÇÃO: Adicionar pelo menos uma imagem do produto');
    }
    
    if (analysis.inconsistencies.some(inc => inc.includes('preço'))) {
      recommendations.push('AÇÃO: Confirmar preço com fornecedor ou fonte oficial');
    }
    
    if (analysis.criticalIssues.some(issue => issue.includes('marca'))) {
      recommendations.push('AÇÃO: Pesquisar marca em bases oficiais ou verificar ortografia');
    }
    
    // General recommendations
    recommendations.push('SUGESTÃO: Comparar com produtos similares no catálogo');
    recommendations.push('SUGESTÃO: Confirmar informações com fornecedor antes de publicar');
    
    return recommendations;
  }
}

export const doubtfulProductHandler = new DoubtfulProductHandler();