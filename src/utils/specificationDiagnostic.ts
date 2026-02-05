// Stub: Specification diagnostic disabled - use ERP
export interface DiagnosticResult {
  success: boolean;
  message: string;
  details: any;
  categoriesFound?: string[];
  specificationsSaved?: any[];
}

export const runSpecificationDiagnostic = async (): Promise<DiagnosticResult> => {
  return {
    success: true,
    message: 'Diagnostic disabled - use ERP for specifications',
    details: {},
    categoriesFound: [],
    specificationsSaved: []
  };
};

export const testSpecificationValidation = async (): Promise<DiagnosticResult> => {
  return runSpecificationDiagnostic();
};