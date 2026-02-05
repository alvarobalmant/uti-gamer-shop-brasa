// Stub: FAQs management disabled - use ERP
import React from 'react';

interface FAQTabProps {
  productId?: string;
}

const FAQTab: React.FC<FAQTabProps> = () => {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Gerenciamento de FAQs desativado.</p>
      <p className="text-sm">Use o ERP para gerenciar FAQs dos produtos.</p>
    </div>
  );
};

export default FAQTab;