
import React from 'react';
import { EmailTestPanel } from '@/components/admin/EmailTestPanel';

const EmailTest = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Teste de E-mails Customizados</h1>
        <EmailTestPanel />
      </div>
    </div>
  );
};

export default EmailTest;
