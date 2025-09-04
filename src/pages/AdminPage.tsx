import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Painel Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Painel administrativo em construção...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;