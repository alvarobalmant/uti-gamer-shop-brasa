import React, { useCallback, useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import { analyzeTag, getTypeIcon, getTokenColor } from '@/utils/tokenClassification';

import SearchResultProductCardImage from './ProductCard/SearchResultProductCardImage';
import SearchResultProductCardInfo from './ProductCard/SearchResultProductCardInfo';
import ProductCardPrice from './ProductCard/ProductCardPrice';
import ProductCardBadge from './ProductCard/ProductCardBadge';

export type { Product } from '@/hooks/useProducts';

interface SearchResultProductCardProps {
  product: Product;
  onCardClick: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  showDebug?: boolean;
}

const SearchResultProductCard = React.memo(({ product, onCardClick, onAddToCart, showDebug = false }: SearchResultProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { trackProductView } = useAnalytics();

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-action="true"]')) {
      return;
    }
    
    // Track product view
    trackProductView(product.id, { name: product.name, price: product.price });
    
    onCardClick(product.id);
  }, [onCardClick, product.id, trackProductView, product.name, product.price]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <>
      <Card
        className={cn(
          "relative flex flex-col bg-white overflow-hidden",
          "border border-gray-200",
          "rounded-lg",
          "shadow-none",
          "transition-all duration-200 ease-in-out",
          "cursor-pointer",
          "w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[380px]",
          "p-0",
          "product-card",
          isHovered && "md:shadow-md md:-translate-y-1"
        )}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="search-result-product-card"
      >
        <ProductCardBadge 
          text={product.badge_text || ''} 
          color={product.badge_color || '#22c55e'} 
          isVisible={product.badge_visible || false} 
        />
        
        <SearchResultProductCardImage product={product} isHovered={isHovered} />

        <div className="flex flex-1 flex-col justify-between p-1 sm:p-2 md:p-2.5 lg:p-3 min-h-0">
          <div className="space-y-2">
            <SearchResultProductCardInfo product={product} />
            <ProductCardPrice product={product} />
          </div>
          
          {/* UTI Coins Discount Indicator */}
          {(product.uti_coins_discount_percentage || 0) > 0 && (
            <div className="mt-1 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-md p-1 sm:p-2 flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700">
                {product.uti_coins_discount_percentage}% OFF
              </span>
            </div>
          )}
        </div>
      </Card>

      {showDebug && (
        <div className="mt-1 border border-purple-200 rounded-md p-2 bg-purple-50/40 text-[11px] leading-relaxed">
          {(() => {
            const p: any = product;
            const score = p.relevance_score ?? null;
            const tags: string[] = p.matched_tags || [];
            const breakdown = p.debug_info?.scoreBreakdown;
            return (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Score:</span>
                  <span className="font-mono px-1.5 py-0.5 rounded bg-white border">
                    {score !== null ? Number(score).toFixed(1) : '–'}
                  </span>
                  {p.debug_info?.exactMatch && (
                    <Badge variant="default" className="h-5 py-0">Exato</Badge>
                  )}
                  {p.debug_info?.partialMatch && (
                    <Badge variant="secondary" className="h-5 py-0">Parcial</Badge>
                  )}
                  {product.category && (
                    <Badge variant="outline" className="h-5 py-0 text-blue-700 border-blue-300">
                      {product.category}
                    </Badge>
                  )}
                </div>
                {breakdown && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>Nome: <span className="font-mono">{breakdown.nameScore || 0}</span></div>
                      <div>Tags: <span className="font-mono">{breakdown.tagScore || 0}</span></div>
                      <div>Categoria: <span className="font-mono">{breakdown.categoryScore || breakdown.categoryBonus || 0}</span></div>
                      <div>Exato: <span className="font-mono">{breakdown.exactBonus || 0}</span></div>
                      <div className="col-span-2 font-semibold">Total: <span className="font-mono">{breakdown.totalScore || score || 0}</span></div>
                    </div>
                    {breakdown.tagDetails && breakdown.tagDetails.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-600">Detalhes das Tags:</div>
                        {breakdown.tagDetails.map((detail: any, i: number) => {
                          // Analisar a tag para obter classificação
                          const tagAnalysis = analyzeTag(detail.name || '');
                          
                          return (
                            <div key={i} className="text-xs text-gray-600 bg-gray-50 p-1.5 rounded border-l-2 border-blue-300">
                              {detail.compatibilityRatio !== undefined ? (
                                // Novo sistema de tokens
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-800">{detail.name}</div>
                                  
                                  {/* Indicadores visuais da classificação */}
                                  <div className="space-y-0.5">
                                    {tagAnalysis.indicators.map((indicator, idx) => (
                                      <div key={idx} className="text-[10px] text-gray-600">{indicator}</div>
                                    ))}
                                  </div>
                                  
                                  {/* Tokens da tag */}
                                  <div className="space-y-1">
                                    <div className="text-[10px] font-medium text-gray-700">🏷️ Tokens da Tag:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {tagAnalysis.tokens.map((token, idx) => (
                                        <span
                                          key={idx}
                                          className={`px-1 py-0.5 rounded text-[9px] border ${getTokenColor(token.type)}`}
                                          title={`${token.type} - Importância: ${token.importance}`}
                                        >
                                          {getTypeIcon(token.type)} {token.token}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Tokens com compatibilidade */}
                                  {detail.matches && detail.matches.length > 0 && (
                                    <div className="space-y-1">
                                      <div className="text-[10px] font-medium text-green-700">✅ Tokens com Compatibilidade:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {detail.matches.map((match: any, idx: number) => {
                                          // Analisar o token da tag para obter sua classificação correta
                                          const tagTokenAnalysis = analyzeTag(match.tagToken);
                                          const tagTokenType = tagTokenAnalysis.tokens[0]?.type || 'MAIN';
                                          const queryTokenAnalysis = analyzeTag(match.queryToken);
                                          const queryTokenType = queryTokenAnalysis.tokens[0]?.type || 'MAIN';
                                          
                                          return (
                                            <span
                                              key={idx}
                                              className="px-1 py-0.5 rounded text-[9px] border bg-green-50 text-green-800 border-green-300"
                                              title={`Match: "${match.queryToken}" (${queryTokenType}) → "${match.tagToken}" (${tagTokenType})`}
                                            >
                                              {getTypeIcon(queryTokenType)} "{match.queryToken}" → {getTypeIcon(tagTokenType)} "{match.tagToken}"
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Informações de score */}
                                  <div className="mt-1 pt-1 border-t border-gray-200">
                                    <div>Compatibilidade: {(detail.compatibilityRatio * 100).toFixed(1)}%</div>
                                    
                                    {/* DEBUG: Verificar se a regra especial deveria ser aplicada */}
                                    {(() => {
                                      const tagOnlyHasDescriptive = tagAnalysis.tokens.length > 0 && 
                                        tagAnalysis.tokens.every(t => t.type === 'DESCRIPTIVE');
                                      const hasMatches = detail.matches && detail.matches.length > 0;
                                      
                                      if (tagOnlyHasDescriptive) {
                                        return (
                                          <div className="text-[10px] bg-yellow-50 text-yellow-800 px-1 py-0.5 rounded mt-1">
                                            🔍 REGRA ESPECIAL: Tag só tem DESCRIPTIVE {hasMatches ? '✅ COM matches' : '❌ SEM matches'}
                                            {hasMatches && detail.compatibilityRatio < 1.0 && (
                                              <span className="text-red-600 font-bold"> - DEVERIA SER 100%!</span>
                                            )}
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                    
                                    <div className="text-[10px] text-gray-600">
                                      10 × {detail.weight || 'peso'} × {detail.debug?.foundTokens || 0}/{detail.debug?.maxTokens || 1} = {detail.rawScore?.toFixed(1) || 0}
                                    </div>
                                    <div>Score final: {detail.finalScore?.toFixed(1) || 0}</div>
                                    {detail.rejectedByNumericOnlyRule && (
                                      <div className="text-[10px] text-red-600 font-medium mt-1 bg-red-50 px-1 py-0.5 rounded">
                                        ❌ REJEITADO: Compatibilidade apenas numérica
                                      </div>
                                    )}
                                    {detail.matches && detail.matches.length > 0 && (
                                      <div className="text-[10px] text-gray-500 mt-1">
                                        Matches: {detail.matches.map((m: any) => `"${m.queryToken}"→"${m.tagToken}"`).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                // Sistema antigo (fallback) - também com classificação
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-800">{detail.name}</div>
                                  
                                  {/* Indicadores visuais da classificação */}
                                  <div className="space-y-0.5">
                                    {tagAnalysis.indicators.map((indicator, idx) => (
                                      <div key={idx} className="text-[10px] text-gray-600">{indicator}</div>
                                    ))}
                                  </div>
                                  
                                  {/* Tokens da tag */}
                                  <div className="space-y-1">
                                    <div className="text-[10px] font-medium text-gray-700">🏷️ Tokens da Tag:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {tagAnalysis.tokens.map((token, idx) => (
                                        <span
                                          key={idx}
                                          className={`px-1 py-0.5 rounded text-[9px] border ${getTokenColor(token.type)}`}
                                          title={`${token.type} - Importância: ${token.importance}`}
                                        >
                                          {getTypeIcon(token.type)} {token.token}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Tokens com compatibilidade */}
                                  {detail.matches && detail.matches.length > 0 && (
                                    <div className="space-y-1">
                                      <div className="text-[10px] font-medium text-green-700">✅ Tokens com Compatibilidade:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {detail.matches.map((match: any, idx: number) => {
                                          // Analisar o token da tag para obter sua classificação correta
                                          const tagTokenAnalysis = analyzeTag(match.tagToken);
                                          const tagTokenType = tagTokenAnalysis.tokens[0]?.type || 'MAIN';
                                          const queryTokenAnalysis = analyzeTag(match.queryToken);
                                          const queryTokenType = queryTokenAnalysis.tokens[0]?.type || 'MAIN';
                                          
                                          return (
                                            <span
                                              key={idx}
                                              className="px-1 py-0.5 rounded text-[9px] border bg-green-50 text-green-800 border-green-300"
                                              title={`Match: "${match.queryToken}" (${queryTokenType}) → "${match.tagToken}" (${tagTokenType})`}
                                            >
                                              {getTypeIcon(queryTokenType)} "{match.queryToken}" → {getTypeIcon(tagTokenType)} "{match.tagToken}"
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Score do sistema antigo */}
                                  <div className="mt-1 pt-1 border-t border-gray-200 text-[10px]">
                                    {detail.description || `${detail.name}: ${detail.weight || 'N/A'} × 10 = ${detail.contribution || 'N/A'} pontos`}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
});

export default SearchResultProductCard;

