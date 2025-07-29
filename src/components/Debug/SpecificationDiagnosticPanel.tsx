import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runSpecificationDiagnostic, testSpecificationValidation, DiagnosticResult } from '@/utils/specificationDiagnostic';
import { runSpecificationFix, SpecificationFixResult } from '@/utils/specificationFixer';
import { testCategoryValidation, simulateSpecificationProcessing, CategoryTestResult } from '@/utils/categoryValidationTest';
import { AlertCircle, CheckCircle, XCircle, Wrench } from 'lucide-react';

const SpecificationDiagnosticPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [fixResult, setFixResult] = useState<SpecificationFixResult | null>(null);
  const [validationResults, setValidationResults] = useState<any[] | null>(null);
  const [categoryTestResult, setCategoryTestResult] = useState<CategoryTestResult | null>(null);
  const [simulationResult, setSimulationResult] = useState<CategoryTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

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

  const handleFixSpecifications = async () => {
    setIsFixing(true);
    setFixResult(null);
    
    try {
      const fixResultData = await runSpecificationFix();
      setFixResult(fixResultData);
    } catch (error) {
      console.error('Erro ao corrigir especificações:', error);
    } finally {
      setIsFixing(false);
    }
  };

  const handleTestCategoryValidation = async () => {
    setIsTesting(true);
    setCategoryTestResult(null);
    
    try {
      const testResult = await testCategoryValidation();
      setCategoryTestResult(testResult);
    } catch (error) {
      console.error('Erro ao testar validação de categoria:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSimulateProcessing = async () => {
    setIsTesting(true);
    setSimulationResult(null);
    
    try {
      const simResult = await simulateSpecificationProcessing();
      setSimulationResult(simResult);
    } catch (error) {
      console.error('Erro ao simular processamento:', error);
    } finally {
      setIsTesting(false);
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
          
          <div className="space-y-2">
            <Button 
              onClick={handleRunDiagnostic} 
              disabled={isRunning || isFixing}
              className="w-full"
            >
              {isRunning ? 'Executando Diagnóstico...' : 'Executar Diagnóstico'}
            </Button>
            
            <Button 
              onClick={handleFixSpecifications} 
              disabled={isRunning || isFixing || isTesting}
              variant="outline"
              className="w-full"
            >
              <Wrench className="w-4 h-4 mr-2" />
              {isFixing ? 'Corrigindo...' : 'Corrigir Especificações Existentes'}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleTestCategoryValidation} 
                disabled={isRunning || isFixing || isTesting}
                variant="secondary"
                size="sm"
              >
                {isTesting ? 'Testando...' : 'Testar Regex Categorias'}
              </Button>
              
              <Button 
                onClick={handleSimulateProcessing} 
                disabled={isRunning || isFixing || isTesting}
                variant="secondary"
                size="sm"
              >
                {isTesting ? 'Simulando...' : 'Simular Processamento'}
              </Button>
            </div>
          </div>
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

      {/* Resultado da Correção */}
      {fixResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {fixResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado da Correção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded ${fixResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium">{fixResult.message}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total de especificações:</span>
                <div>{fixResult.details.totalSpecs}</div>
              </div>
              <div>
                <span className="font-medium">Especificações corrigidas:</span>
                <div>{fixResult.details.fixedSpecs}</div>
              </div>
            </div>
            
            {fixResult.details.categoriesUpdated.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Categorias atualizadas:</h4>
                <div className="space-y-1">
                  {fixResult.details.categoriesUpdated.map((update, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {update}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {fixResult.details.errors && fixResult.details.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Erros:</h4>
                <div className="space-y-1">
                  {fixResult.details.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">{error}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resultado do Teste de Categoria */}
      {categoryTestResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {categoryTestResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Teste de Validação de Regex
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded ${categoryTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium">{categoryTestResult.message}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Categorias Testadas:</h4>
              <div className="space-y-2">
                {categoryTestResult.details.originalCategories.map((original, index) => {
                  const validated = categoryTestResult.details.validatedCategories[index];
                  const isMatch = original === validated;
                  return (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <code className="text-sm">{original}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        {isMatch ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge variant="secondary">✅ Mantida</Badge>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <Badge variant="destructive">❌ → {validated}</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {categoryTestResult.details.errors && categoryTestResult.details.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Erros:</h4>
                <div className="space-y-1">
                  {categoryTestResult.details.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">{error}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resultado da Simulação */}
      {simulationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {simulationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Simulação de Processamento Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded ${simulationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium">{simulationResult.message}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Categorias Esperadas:</span>
                <div>{simulationResult.details.originalCategories.length}</div>
              </div>
              <div>
                <span className="font-medium">Categorias Processadas:</span>
                <div>{simulationResult.details.validatedCategories.length}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Categorias Finais:</h4>
              <div className="flex flex-wrap gap-2">
                {simulationResult.details.validatedCategories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            {simulationResult.details.errors && simulationResult.details.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Erros:</h4>
                <div className="space-y-1">
                  {simulationResult.details.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">{error}</div>
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