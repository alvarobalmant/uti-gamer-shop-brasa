export type ProductType = 'known' | 'uti_original' | 'doubtful';

export interface ConfidenceScore {
  overall: number;
  factors: {
    brandRecognition: number;
    dataCompleteness: number;
    consistencyCheck: number;
    marketPresence: number;
  };
}

export interface ProductIdentificationResult {
  type: ProductType;
  confidence: ConfidenceScore;
  reasoning: string[];
  flags: string[];
  recommendations?: string[];
}

export interface KnownProductData {
  id: string;
  name: string;
  brand: string;
  category: string;
  standardSpecs: Record<string, any>;
  aliases: string[];
  variants?: string[];
}

export interface ProcessingResult {
  success: boolean;
  product?: any;
  errors: string[];
  warnings: string[];
  processingType: ProductType;
  confidence: number;
  originalProduct?: any;
  originalIndex?: number;
}

export interface ReportData {
  processed: {
    known: any[];
    uti_original: any[];
  };
  failed: {
    doubtful: any[];
    errors: any[];
  };
  summary: {
    total: number;
    successful: number;
    failed: number;
    byType: Record<ProductType, number>;
  };
}