import { ProcessingResult, ReportData } from '../types';
import * as XLSX from 'xlsx';

export class ReportGenerator {
  
  generateReports(results: ProcessingResult[]): {
    txtReport: string;
    excelData: any;
    summary: any;
  } {
    const reportData = this.organizeReportData(results);
    
    const txtReport = this.generateTXTReport(reportData);
    const excelData = this.generateExcelData(reportData);
    const summary = this.generateSummaryReport(reportData);
    
    return {
      txtReport,
      excelData,
      summary
    };
  }
  
  private organizeReportData(results: ProcessingResult[]): ReportData {
    const reportData: ReportData = {
      processed: {
        known: [],
        uti_original: []
      },
      failed: {
        doubtful: [],
        errors: []
      },
      summary: {
        total: results.length,
        successful: 0,
        failed: 0,
        byType: {
          known: 0,
          uti_original: 0,
          doubtful: 0
        }
      }
    };
    
    results.forEach((result, index) => {
      // Update counts
      reportData.summary.byType[result.processingType]++;
      
      if (result.success) {
        reportData.summary.successful++;
        
        // Add to processed
        if (result.processingType === 'known') {
          reportData.processed.known.push({
            ...result.product,
            processingIndex: index + 1,
            confidence: result.confidence
          });
        } else if (result.processingType === 'uti_original') {
          reportData.processed.uti_original.push({
            ...result.product,
            processingIndex: index + 1,
            confidence: result.confidence
          });
        }
      } else {
        reportData.summary.failed++;
        
        // Add to failed
        if (result.processingType === 'doubtful') {
          reportData.failed.doubtful.push({
            originalProduct: result.originalProduct || {},
            processingIndex: index + 1,
            errors: result.errors,
            warnings: result.warnings,
            confidence: result.confidence,
            recommendations: this.extractRecommendations(result.warnings)
          });
        } else {
          reportData.failed.errors.push({
            originalProduct: result.originalProduct || {},
            processingIndex: index + 1,
            errors: result.errors,
            warnings: result.warnings,
            confidence: result.confidence
          });
        }
      }
    });
    
    return reportData;
  }
  
  private generateTXTReport(data: ReportData): string {
    const lines: string[] = [];
    
    // Header
    lines.push('==========================================');
    lines.push('RELATÓRIO DE PRODUTOS FALHOS/DUVIDOSOS');
    lines.push('==========================================');
    lines.push('');
    lines.push(`Data de Processamento: ${new Date().toLocaleString('pt-BR')}`);
    lines.push(`Total de Produtos: ${data.summary.total}`);
    lines.push(`Produtos Processados: ${data.summary.successful}`);
    lines.push(`Produtos Falhos: ${data.summary.failed}`);
    lines.push('');
    
    // Summary by type
    lines.push('RESUMO POR TIPO:');
    lines.push('-'.repeat(40));
    lines.push(`• Produtos Conhecidos: ${data.summary.byType.known}`);
    lines.push(`• Produtos UTI Originais: ${data.summary.byType.uti_original}`);
    lines.push(`• Produtos Duvidosos: ${data.summary.byType.doubtful}`);
    lines.push('');
    
    // Doubtful products section
    if (data.failed.doubtful.length > 0) {
      lines.push('==========================================');
      lines.push('PRODUTOS DUVIDOSOS (REQUEREM REVISÃO)');
      lines.push('==========================================');
      lines.push('');
      
      data.failed.doubtful.forEach((item, index) => {
        lines.push(`PRODUTO ${item.processingIndex}: ${item.originalProduct.name || 'Nome não informado'}`);
        lines.push('-'.repeat(50));
        lines.push(`Marca: ${item.originalProduct.brand || 'Não informada'}`);
        lines.push(`Categoria: ${item.originalProduct.category || 'Não informada'}`);
        lines.push(`Preço: R$ ${item.originalProduct.price || 'Não informado'}`);
        lines.push(`Confiança: ${(item.confidence * 100).toFixed(1)}%`);
        lines.push('');
        
        if (item.errors.length > 0) {
          lines.push('PROBLEMAS IDENTIFICADOS:');
          item.errors.forEach(error => lines.push(`• ${error}`));
          lines.push('');
        }
        
        if (item.warnings.length > 0) {
          lines.push('AVISOS:');
          item.warnings.forEach(warning => lines.push(`• ${warning}`));
          lines.push('');
        }
        
        if (item.recommendations && item.recommendations.length > 0) {
          lines.push('AÇÕES RECOMENDADAS:');
          item.recommendations.forEach(rec => lines.push(`• ${rec}`));
          lines.push('');
        }
        
        lines.push('═'.repeat(50));
        lines.push('');
      });
    }
    
    // Error products section
    if (data.failed.errors.length > 0) {
      lines.push('==========================================');
      lines.push('PRODUTOS COM ERROS CRÍTICOS');
      lines.push('==========================================');
      lines.push('');
      
      data.failed.errors.forEach((item, index) => {
        lines.push(`PRODUTO ${item.processingIndex}: ${item.originalProduct.name || 'Nome não informado'}`);
        lines.push('-'.repeat(50));
        
        lines.push('ERROS:');
        item.errors.forEach(error => lines.push(`• ${error}`));
        lines.push('');
        
        if (item.warnings.length > 0) {
          lines.push('AVISOS ADICIONAIS:');
          item.warnings.forEach(warning => lines.push(`• ${warning}`));
          lines.push('');
        }
        
        lines.push('═'.repeat(50));
        lines.push('');
      });
    }
    
    // Footer with recommendations
    lines.push('==========================================');
    lines.push('PRÓXIMOS PASSOS');
    lines.push('==========================================');
    lines.push('');
    lines.push('1. Revisar produtos duvidosos listados acima');
    lines.push('2. Corrigir informações conforme recomendações');
    lines.push('3. Verificar dados com fornecedores quando necessário');
    lines.push('4. Reprocessar produtos após correções');
    lines.push('5. Verificar arquivo Excel para produtos processados com sucesso');
    lines.push('');
    lines.push('Para mais informações, consulte a documentação do sistema.');
    
    return lines.join('\n');
  }
  
  private generateExcelData(data: ReportData): any {
    const workbook = XLSX.utils.book_new();
    
    // Known products sheet
    if (data.processed.known.length > 0) {
      const knownData = data.processed.known.map(product => ({
        'Índice': product.processingIndex,
        'Nome': product.name || '',
        'Marca': product.brand || '',
        'Categoria': product.category || '',
        'Preço': product.price || '',
        'Descrição': product.description || '',
        'Estoque': product.stock || '',
        'SKU': product.sku_code || '',
        'Confiança': `${(product.confidence * 100).toFixed(1)}%`,
        'Tipo de Processamento': 'Produto Conhecido',
        'Badge': product.badge_text || '',
        'Ativo': product.is_active ? 'Sim' : 'Não',
        'Destaque': product.is_featured ? 'Sim' : 'Não'
      }));
      
      const knownSheet = XLSX.utils.json_to_sheet(knownData);
      XLSX.utils.book_append_sheet(workbook, knownSheet, 'Produtos Conhecidos');
    }
    
    // UTI products sheet
    if (data.processed.uti_original.length > 0) {
      const utiData = data.processed.uti_original.map(product => ({
        'Índice': product.processingIndex,
        'Nome': product.name || '',
        'Marca': product.brand || '',
        'Categoria': product.category || '',
        'Preço': product.price || '',
        'Descrição': product.description || '',
        'Estoque': product.stock || '',
        'SKU': product.sku_code || '',
        'Confiança': `${(product.confidence * 100).toFixed(1)}%`,
        'Tipo de Processamento': 'UTI Original',
        'Badge': product.badge_text || '',
        'Ativo': product.is_active ? 'Sim' : 'Não',
        'Exclusivo UTI': product.isUTIOriginal ? 'Sim' : 'Não'
      }));
      
      const utiSheet = XLSX.utils.json_to_sheet(utiData);
      XLSX.utils.book_append_sheet(workbook, utiSheet, 'Produtos UTI');
    }
    
    // Summary sheet
    const summaryData = [
      { 'Métrica': 'Total de Produtos', 'Valor': data.summary.total },
      { 'Métrica': 'Produtos Processados', 'Valor': data.summary.successful },
      { 'Métrica': 'Produtos Falhos', 'Valor': data.summary.failed },
      { 'Métrica': 'Taxa de Sucesso', 'Valor': `${((data.summary.successful / data.summary.total) * 100).toFixed(1)}%` },
      { 'Métrica': '', 'Valor': '' },
      { 'Métrica': 'Produtos Conhecidos', 'Valor': data.summary.byType.known },
      { 'Métrica': 'Produtos UTI', 'Valor': data.summary.byType.uti_original },
      { 'Métrica': 'Produtos Duvidosos', 'Valor': data.summary.byType.doubtful }
    ];
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
    
    return workbook;
  }
  
  private generateSummaryReport(data: ReportData): any {
    return {
      timestamp: new Date().toISOString(),
      total: data.summary.total,
      successful: data.summary.successful,
      failed: data.summary.failed,
      successRate: (data.summary.successful / data.summary.total) * 100,
      byType: data.summary.byType,
      hasDoubtfulProducts: data.failed.doubtful.length > 0,
      hasErrors: data.failed.errors.length > 0,
      recommendations: this.generateGlobalRecommendations(data)
    };
  }
  
  private extractRecommendations(warnings: string[]): string[] {
    return warnings.filter(warning => 
      warning.startsWith('AÇÃO:') || warning.startsWith('SUGESTÃO:')
    );
  }
  
  private generateGlobalRecommendations(data: ReportData): string[] {
    const recommendations: string[] = [];
    
    if (data.failed.doubtful.length > 0) {
      recommendations.push(`Revisar ${data.failed.doubtful.length} produtos duvidosos antes da publicação`);
    }
    
    if (data.failed.errors.length > 0) {
      recommendations.push(`Corrigir ${data.failed.errors.length} produtos com erros críticos`);
    }
    
    const successRate = (data.summary.successful / data.summary.total) * 100;
    if (successRate < 80) {
      recommendations.push('Taxa de sucesso baixa - verificar qualidade dos dados de entrada');
    }
    
    if (data.summary.byType.doubtful > data.summary.total * 0.3) {
      recommendations.push('Alto número de produtos duvidosos - considerar melhorar dados de entrada');
    }
    
    return recommendations;
  }
  
  downloadTXTReport(content: string, filename: string = 'produtos-falhos-report.txt'): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  downloadExcelReport(workbook: any, filename: string = 'produtos-processados.xlsx'): void {
    XLSX.writeFile(workbook, filename);
  }
}

export const reportGenerator = new ReportGenerator();