import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runSpecificationDiagnostic, testSpecificationValidation, DiagnosticResult } from '@/utils/specificationDiagnostic';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const SpecificationDiagnosticPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [validationResults, setValidationResults] = useState<any[] | null>(null);

  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    setResult(null);
    
    try {
      console.log('[DIAGNOSTIC PANEL] Iniciando diagnóstico completo...');
      const diagnosticResult = await runSpecificationDiagnostic();
      setResult(diagnosticResult);
      
      // Também executar teste de validação
      const validation = testSpecificationValidation();
      setValidationResults(validation);
      
    } catch (error) {
      console.error('[DIAGNOSTIC PANEL] Erro:', error);
      setResult({
        success: false,
        message: 'Erro ao executar diagnóstico',
        details: error
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Diagnóstico de Especificações Customizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este diagnóstico criará um produto temporário com especificações customizadas para testar 
            se o sistema está processando e agrupando as categorias corretamente.
          </p>
          
          <Button 
            onClick={handleRunDiagnostic} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Executando Diagnóstico...' : 'Executar Diagnóstico'}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados do Teste de Validação */}
      {validationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Teste de Validação de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <code className="text-sm">{JSON.stringify(result.input)}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.output ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="secondary">{result.output}</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive">{result.reason}</Badge>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados do Diagnóstico */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado do Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium">{result.message}</p>
            </div>

            {result.details && (
              <div className="space-y-2">
                <h4 className="font-medium">Detalhes da Análise:</h4>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                </div>
              </div>
            )}

            {result.specificationsSaved && result.specificationsSaved.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Especificações Salvas no Banco:</h4>
                <div className="space-y-2">
                  {result.specificationsSaved.map((spec: any, index: number) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline">{spec.category}</Badge>
                          <span className="ml-2 font-medium">{spec.label}</span>
                        </div>
                        <div className="text-right">
                          <div>{spec.value}</div>
                          {spec.icon && <div className="text-sm">Ícone: {spec.icon}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.categoriesFound && (
              <div className="space-y-2">
                <h4 className="font-medium">Categorias Encontradas:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.categoriesFound.map((category: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpecificationDiagnosticPanel;