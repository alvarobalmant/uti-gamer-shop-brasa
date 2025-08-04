import { ProductType, ProcessingResult } from './types';
import { productIdentifier } from './productIdentifier';
import { knownProductProcessor } from './processors/knownProductProcessor';
import { utiProductProcessor } from './processors/utiProductProcessor';
import { doubtfulProductHandler } from './processors/doubtfulProductHandler';

export class ProductProcessor {
  
  async processProduct(product: any): Promise<ProcessingResult> {
    try {
      // Step 1: Identify product type
      const identification = productIdentifier.identifyProductType(product);
      
      console.log(`Produto "${product.name}" identificado como: ${identification.type}`, {
        confidence: identification.confidence.overall,
        reasoning: identification.reasoning
      });
      
      // Step 2: Route to appropriate processor
      switch (identification.type) {
        case 'known':
          return await knownProductProcessor.processKnownProduct(product);
          
        case 'uti_original':
          return await utiProductProcessor.processUTIProduct(product);
          
        case 'doubtful':
          return doubtfulProductHandler.handleDoubtfulProduct(product, identification);
          
        default:
          return {
            success: false,
            errors: [`Tipo de produto não reconhecido: ${identification.type}`],
            warnings: [],
            processingType: identification.type,
            confidence: 0.0
          };
      }
      
    } catch (error) {
      console.error('Erro no processamento do produto:', error);
      
      return {
        success: false,
        errors: [`Erro crítico no processamento: ${error.message}`],
        warnings: [],
        processingType: 'doubtful',
        confidence: 0.0
      };
    }
  }
  
  async processBatch(products: any[]): Promise<{
    results: ProcessingResult[];
    summary: {
      total: number;
      successful: number;
      failed: number;
      byType: Record<ProductType, number>;
    };
  }> {
    const results: ProcessingResult[] = [];
    const summary = {
      total: products.length,
      successful: 0,
      failed: 0,
      byType: {
        known: 0,
        uti_original: 0,
        doubtful: 0
      } as Record<ProductType, number>
    };
    
    // Process products in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (product, index) => {
        try {
          const result = await this.processProduct(product);
          
          // Update summary
          if (result.success) {
            summary.successful++;
          } else {
            summary.failed++;
          }
          
          summary.byType[result.processingType]++;
          
          return {
            ...result,
            originalIndex: i + index,
            originalProduct: product
          };
          
        } catch (error) {
          summary.failed++;
          summary.byType.doubtful++;
          
          return {
            success: false,
            errors: [`Erro no processamento: ${error.message}`],
            warnings: [],
            processingType: 'doubtful' as ProductType,
            confidence: 0.0,
            originalIndex: i + index,
            originalProduct: product
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to prevent overload
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return { results, summary };
  }
  
  getProcessingStats(results: ProcessingResult[]): {
    total: number;
    byType: Record<ProductType, { count: number; successRate: number }>;
    averageConfidence: Record<ProductType, number>;
    commonIssues: { issue: string; count: number }[];
  } {
    const stats = {
      total: results.length,
      byType: {
        known: { count: 0, successRate: 0 },
        uti_original: { count: 0, successRate: 0 },
        doubtful: { count: 0, successRate: 0 }
      } as Record<ProductType, { count: number; successRate: number }>,
      averageConfidence: {
        known: 0,
        uti_original: 0,
        doubtful: 0
      } as Record<ProductType, number>,
      commonIssues: [] as { issue: string; count: number }[]
    };
    
    // Count by type and calculate success rates
    const typeGroups = {
      known: results.filter(r => r.processingType === 'known'),
      uti_original: results.filter(r => r.processingType === 'uti_original'),
      doubtful: results.filter(r => r.processingType === 'doubtful')
    };
    
    Object.entries(typeGroups).forEach(([type, typeResults]) => {
      const typedType = type as ProductType;
      stats.byType[typedType].count = typeResults.length;
      
      if (typeResults.length > 0) {
        const successful = typeResults.filter(r => r.success).length;
        stats.byType[typedType].successRate = successful / typeResults.length;
        
        const avgConfidence = typeResults.reduce((sum, r) => sum + r.confidence, 0) / typeResults.length;
        stats.averageConfidence[typedType] = avgConfidence;
      }
    });
    
    // Collect common issues
    const issueCount = new Map<string, number>();
    
    results.forEach(result => {
      result.errors.forEach(error => {
        issueCount.set(error, (issueCount.get(error) || 0) + 1);
      });
      
      result.warnings.forEach(warning => {
        issueCount.set(warning, (issueCount.get(warning) || 0) + 1);
      });
    });
    
    stats.commonIssues = Array.from(issueCount.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return stats;
  }
}

export const productProcessor = new ProductProcessor();