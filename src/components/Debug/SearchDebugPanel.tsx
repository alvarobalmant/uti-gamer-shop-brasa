import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Bug, Eye, EyeOff } from 'lucide-react';
import { Product } from '@/hooks/useProducts/types';

interface SearchDebugInfo {
  backendUsed: boolean;
  searchTerms: string[];
  responseTime: number;
  fallbackUsed: boolean;
}

interface ProductWithDebug extends Product {
  relevance_score?: number;
  matched_tags?: string[];
  debug_info?: {
    nameMatch: boolean;
    tagMatches: number;
    exactMatch: boolean;
    partialMatch: boolean;
    scoreBreakdown: {
      nameScore: number;
      tagScore: number;
      categoryBonus: number;
      exactBonus: number;
      totalScore: number;
    };
  };
}

interface SearchDebugPanelProps {
  products: ProductWithDebug[];
  debug: SearchDebugInfo;
  query: string;
  className?: string;
}

const SearchDebugPanel: React.FC<SearchDebugPanelProps> = ({ 
  products, 
  debug, 
  query,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const toggleVisibility = () => {
    console.log('[SearchDebugPanel] Toggling visibility:', !isVisible);
    console.log('[SearchDebugPanel] Products:', products);
    console.log('[SearchDebugPanel] Debug:', debug);
    setIsVisible(!isVisible);
  };

  const toggleProductDetails = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'bg-green-500';
    if (score >= 30) return 'bg-yellow-500';
    if (score >= 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 50) return 'default';
    if (score >= 30) return 'secondary';
    return 'outline';
  };

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={toggleVisibility}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          size="sm"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug ON
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto ${className}`}>
        <Card className="shadow-2xl border-purple-200">
          <CardHeader className="bg-purple-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Debug Search
              </CardTitle>
              <Button
                onClick={toggleVisibility}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-800"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Informações Gerais */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">Query Information</h4>
            <div className="text-xs space-y-1">
              <div><strong>Query:</strong> "{query}"</div>
              <div><strong>Termos:</strong> {debug.searchTerms.join(', ')}</div>
              <div><strong>Tempo:</strong> {debug.responseTime}ms</div>
              <div className="flex gap-2">
                <Badge variant={debug.backendUsed ? "default" : "secondary"}>
                  {debug.backendUsed ? '🚀 Backend' : '💻 Frontend'}
                </Badge>
                {debug.fallbackUsed && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Fallback
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Produtos com Scores */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">
              Produtos ({products.length})
            </h4>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product, index) => (
                <div key={product.id} className="border rounded-lg p-2 bg-white">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleProductDetails(product.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-mono text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-medium truncate">
                        {product.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {product.relevance_score !== undefined && (
                        <Badge 
                          variant={getScoreBadgeVariant(product.relevance_score)}
                          className="text-xs"
                        >
                          {product.relevance_score.toFixed(1)}
                        </Badge>
                      )}
                      {expandedProduct === product.id ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  <Collapsible open={expandedProduct === product.id}>
                    <CollapsibleContent className="mt-2 pt-2 border-t space-y-2">
                      {/* Score Breakdown */}
                      {product.debug_info?.scoreBreakdown && (
                        <div>
                          <div className="text-xs font-semibold text-gray-700 mb-1">Score Breakdown:</div>
                          <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                            <div>Nome: {product.debug_info.scoreBreakdown.nameScore || 0}</div>
                            <div>Tags: {product.debug_info.scoreBreakdown.tagScore || 0}</div>
                            <div>Categoria: {product.debug_info.scoreBreakdown.categoryScore || product.debug_info.scoreBreakdown.categoryBonus || 0}</div>
                            <div>Exato: {product.debug_info.scoreBreakdown.exactBonus || 0}</div>
                            <div className="font-semibold border-t pt-1">
                              Total: {product.debug_info.scoreBreakdown.totalScore || product.relevance_score || 0}</div>
                          </div>
                          
                          {/* Detalhes das Tags (Novo Sistema) */}
                          {product.debug_info.scoreBreakdown.tagDetails && product.debug_info.scoreBreakdown.tagDetails.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-semibold text-gray-700 mb-1">Detalhes das Tags:</div>
                              <div className="text-xs space-y-1">
                                {product.debug_info.scoreBreakdown.tagDetails.map((tagDetail: any, idx: number) => (
                                  <div key={idx} className="bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                                    <div className="font-medium text-blue-800">{tagDetail.name}</div>
                                    {tagDetail.compatibilityRatio !== undefined ? (
                                      // Novo sistema de tokens
                                      <div className="text-blue-700">
                                        <div>Compatibilidade: {(tagDetail.compatibilityRatio * 100).toFixed(1)}%</div>
                                        <div>Score base: {tagDetail.rawScore?.toFixed(1) || 0}</div>
                                        <div>Score final: {tagDetail.finalScore?.toFixed(1) || 0}</div>
                                        {tagDetail.matches && tagDetail.matches.length > 0 && (
                                          <div className="mt-1">
                                            <div className="font-medium">Matches:</div>
                                            {tagDetail.matches.map((match: any, matchIdx: number) => (
                                              <div key={matchIdx} className="ml-2 text-xs">
                                                "{match.queryToken}" → "{match.tagToken}" ({(match.similarity * 100).toFixed(0)}%)
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      // Sistema antigo
                                      <div className="text-blue-700">
                                        <div>Peso: {tagDetail.weight || 'N/A'}</div>
                                        <div>Contribuição: {tagDetail.contribution || 'N/A'} pontos</div>
                                        {tagDetail.description && (
                                          <div className="text-xs text-gray-600 mt-1">{tagDetail.description}</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Matched Tags */}
                      {product.matched_tags && product.matched_tags.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-700 mb-1">Tags Matched:</div>
                          <div className="flex flex-wrap gap-1">
                            {product.matched_tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Match Types */}
                      {product.debug_info && (
                        <div className="flex gap-1 flex-wrap">
                          {product.debug_info.exactMatch && (
                            <Badge variant="default" className="text-xs bg-green-600">Exato</Badge>
                          )}
                          {product.debug_info.partialMatch && (
                            <Badge variant="secondary" className="text-xs">Parcial</Badge>
                          )}
                          {product.debug_info.nameMatch && (
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Nome</Badge>
                          )}
                          {product.debug_info.tagMatches > 0 && (
                            <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">{product.debug_info.tagMatches} tags</Badge>
                          )}
                        </div>
                      )}

                      {/* Fallback quando não há dados de debug */}
                      {!product.debug_info && (!product.matched_tags || product.matched_tags.length === 0) && (
                        <div className="text-xs text-gray-500">Sem dados de debug para este item.</div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default SearchDebugPanel;