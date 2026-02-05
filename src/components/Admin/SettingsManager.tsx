 import React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Alert, AlertDescription } from '@/components/ui/alert';
 import { Settings } from 'lucide-react';
 
 // Stub: Settings Manager - migração para integra_products
 export const SettingsManager: React.FC = () => {
   return (
     <Card>
       <CardHeader>
         <CardTitle className="flex items-center gap-2">
           <Settings className="w-5 h-5" />
           Configurações
         </CardTitle>
       </CardHeader>
       <CardContent>
         <Alert>
           <AlertDescription>
             As configurações de produtos foram migradas para o sistema IntegraAPI.
             Use o painel do ERP para gerenciar produtos.
           </AlertDescription>
         </Alert>
       </CardContent>
     </Card>
   );
 };
 
 export default SettingsManager;