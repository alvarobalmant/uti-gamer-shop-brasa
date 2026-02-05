// Stub: Specification fixer disabled - use ERP
export interface SpecificationFixResult {
  success: boolean;
  message: string;
  details: any;
}

export const runSpecificationFixer = async (): Promise<SpecificationFixResult> => {
  return {
    success: true,
    message: 'Fixer disabled - use ERP for specifications',
    details: {}
  };
};

export const runSpecificationFix = runSpecificationFixer;
export const runAdvancedSpecificationFix = runSpecificationFixer;

export const fixProductSpecifications = async (productId: string): Promise<SpecificationFixResult> => {
  return {
    success: true,
    message: 'Fixer disabled - use ERP for specifications',
    details: {}
  };
};