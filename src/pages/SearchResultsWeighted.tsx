import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWeightedSearch, WeightedSearchResult } from '@/hooks/useWeightedSearch';

export default function SearchResultsWeighted() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<WeightedSearchResult[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  
  const { search, loading, error } = useWeightedSearch();

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const searchResults = await search(searchTerm, 50);
    setResults(searchResults);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      platform: 'bg-blue-100 text-blue-800',
      product_type: 'bg-green-100 text-green-800',
      game_title: 'bg-purple-100 text-purple-800',
      brand: 'bg-orange-100 text-orange-800',
      genre: 'bg-pink-100 text-pink-800',
      physical_attribute: 'bg-gray-100 text-gray-800',
      condition: 'bg-yellow-100 text-yellow-800',
      generic: 'bg-gray-100 text-gray-600'
    };
    return colors[category] || colors.generic;
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header de busca */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
          
          {query && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Resultados para: <span className="font-semibold">"{query}"</span>
                {results.length > 0 && ` (${results.length} produtos encontrados)`}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? 'Ocultar Debug' : 'Mostrar Debug'}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">Erro na busca: {error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Buscando produtos...</p>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente buscar com outras palavras-chave ou verifique a ortografia.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.div
                key={result.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6 bg-card"
              >
                <div className="flex gap-6">
                  {/* Imagem do produto */}
                  <div className="flex-shrink-0">
                    <img
                      src={result.product_image || '/placeholder.svg'}
                      alt={result.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Informações do produto */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {result.product_name}
                        </h3>
                        <p className="text-2xl font-bold text-primary mb-3">
                          R$ {result.product_price.toFixed(2)}
                        </p>
                      </div>
                      
                      {showDebug && (
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            Score: {result.relevance_score.toFixed(1)}
                          </Badge>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Base: {result.debug_info.base_score}</div>
                            <div>Peso: {result.debug_info.weighted_score}</div>
                            <div>Boost: {result.debug_info.type_boost}x</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags que fizeram match */}
                    {result.matched_tags.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Tags encontradas:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.matched_tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className={`text-xs ${getCategoryColor(tag.category)}`}
                            >
                              {tag.name} 
                              {showDebug && ` (${tag.weight})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button asChild>
                      <a href={`/produto/${result.product_slug}`}>
                        Ver Produto
                      </a>
                    </Button>
                  </div>
                </div>
                
                {showDebug && (
                  <div className="mt-4 pt-4 border-t bg-muted/30 rounded p-3">
                    <h4 className="text-sm font-semibold mb-2">Debug Info:</h4>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.debug_info, null, 2)}
                    </pre>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}