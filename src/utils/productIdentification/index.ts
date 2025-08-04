// Main entry point for the expanded product identification system

export { ProductProcessor, productProcessor } from './productProcessor';
export { ProductIdentifier, productIdentifier } from './productIdentifier';
export { ReportGenerator, reportGenerator } from './reports/reportGenerator';

export type {
  ProductType,
  ConfidenceScore,
  ProductIdentificationResult,
  ProcessingResult,
  ReportData
} from './types';

// Convenience function for full processing workflow
export async function processProductsWithReports(products: any[]) {
  const { productProcessor } = await import('./productProcessor');
  const { reportGenerator } = await import('./reports/reportGenerator');
  
  // Process all products
  const batchResult = await productProcessor.processBatch(products);
  
  // Generate reports
  const reports = reportGenerator.generateReports(batchResult.results);
  
  return {
    processingResults: batchResult,
    reports,
    downloadTXTReport: (filename?: string) => 
      reportGenerator.downloadTXTReport(reports.txtReport, filename),
    downloadExcelReport: (filename?: string) => 
      reportGenerator.downloadExcelReport(reports.excelData, filename)
  };
}