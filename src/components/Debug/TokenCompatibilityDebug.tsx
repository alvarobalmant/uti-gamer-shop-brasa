import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateTokenCompatibility } from '@/utils/tokenCompatibilitySearch';

interface DebugResult {
  tagName: string;
  tagWeight: number;
  compatibility: any;
}

export const TokenCompatibilityDebug: React.FC = () => {
  const [query, setQuery] = useState('fifa 25');
  const [results, setResults] = useState<DebugResult[]>([]);

  // Tags de exemplo para teste
  const testTags = [
    { name: 'fifa 25', weight: 40 },
    { name: 'fifa 24', weight: 40 },
    { name: 'fifa 23', weight: 40 },
    { name: 'fifa', weight: 30 },
    { name: 'esportes', weight: 20 },
    { name: 'far cry 6', weight: 35 },
    { name: 'far cry 5', weight: 35 },
    { name: 'far cry', weight: 25 },
    { name: 'call of duty modern warfare 3', weight: 45 },
    { name: 'call of duty', weight: 30 },
    { name: 'cod mw3', weight: 45 },
    { name: 'gta v', weight: 40 },
    { name: 'grand theft auto 5', weight: 40 },
    { name: 'playstation 5', weight: 35 },
    { name: 'ps5', weight: 35 },
    { name: 'xbox series x', weight: 35 }
  ];

  const runTest = () => {
    const testResults: DebugResult[] = [];

    testTags.forEach(tag => {
      const compatibility = calculateTokenCompatibility(query, tag.name, tag.weight);
      testResults.push({
        tagName: tag.name,
        tagWeight: tag.weight,
        compatibility
      });
    });

    // Ordenar por score final
    testResults.sort((a, b) => b.compatibility.finalScore - a.compatibility.finalScore);
    setResults(testResults);
  };

  useEffect(() => {
    if (query.trim()) {
      runTest();
    }
  }, [query]);

  const getScoreColor = (score: number) => {
    if (score >= 40) return 'bg-green-500';
    if (score >= 20) return 'bg-yellow-500';
    if (score >= 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-green-100 text-green-800';
      case 'numeric': return 'bg-blue-100 text-blue-800';
      case 'roman_numeral': return 'bg-purple-100 text-purple-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🧪 Debug: Sistema de Compatibilidade de Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite sua busca..."
              className="flex-1"
            />
            <Button onClick={runTest}>Testar</Button>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <strong>Query tokens:</strong> {query.split(' ').filter(t => t.trim()).map(t => `"${t}"`).join(', ')}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: result.compatibility.finalScore > 0 ? '#10b981' : '#ef4444' }}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {result.tagName}
                    <Badge className="ml-2" variant="outline">
                      Peso: {result.tagWeight}
                    </Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-600 mt-1">
                    Tokens: {result.compatibility.tagTokens.map((t: string) => `"${t}"`).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded text-white font-bold ${getScoreColor(result.compatibility.finalScore)}`}>
                    {result.compatibility.finalScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(result.compatibility.compatibilityRatio * 100).toFixed(1)}% compatível
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Matches */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Matches encontrados:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.compatibility.matches.map((match: any, i: number) => (
                    <Badge key={i} className={getMatchTypeColor(match.matchType)}>
                      "{match.queryToken}" → "{match.tagToken}" 
                      ({(match.similarity * 100).toFixed(0)}%)
                    </Badge>
                  ))}
                  {result.compatibility.matches.length === 0 && (
                    <span className="text-gray-500 italic">Nenhum match encontrado</span>
                  )}
                </div>
              </div>

              {/* Debug info */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Tokens encontrados:</span>
                  <div>{result.compatibility.debug.foundTokens}</div>
                </div>
                <div>
                  <span className="font-semibold">Query tokens:</span>
                  <div>{result.compatibility.debug.totalQueryTokens}</div>
                </div>
                <div>
                  <span className="font-semibold">Tag tokens:</span>
                  <div>{result.compatibility.debug.totalTagTokens}</div>
                </div>
                <div>
                  <span className="font-semibold">Score base:</span>
                  <div>{result.compatibility.rawScore.toFixed(1)}</div>
                </div>
                <div>
                  <span className="font-semibold">Score final:</span>
                  <div className="font-bold">{result.compatibility.finalScore.toFixed(1)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <span className="font-semibold">Compatibilidade:</span>
                  <div>{(result.compatibility.compatibilityRatio * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="font-semibold">Bônus especiais:</span>
                  <div className={result.compatibility.debug.specialBonuses >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {result.compatibility.debug.specialBonuses > 0 ? '+' : ''}{result.compatibility.debug.specialBonuses}
                  </div>
                </div>
              </div>

              {/* Explicação do cálculo */}
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                <strong>Cálculo:</strong> ({result.compatibility.debug.foundTokens}/max({result.compatibility.debug.totalQueryTokens},{result.compatibility.debug.totalTagTokens})) × {result.tagWeight} + {result.compatibility.debug.specialBonuses} = {result.compatibility.finalScore.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && query.trim() && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            Nenhum resultado encontrado. Digite uma busca para testar.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
