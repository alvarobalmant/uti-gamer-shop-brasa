
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full px-4">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Página de cadastro em desenvolvimento.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
