import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { useWeightedSearch } from '@/hooks/useWeightedSearch';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBarEnhanced({ 
  onSearch, 
  placeholder = "Buscar produtos...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { search: weightedSearch, loading: searchLoading } = useWeightedSearch();
  
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions based on debounced query
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery && debouncedQuery.length >= 2) {
        setIsLoading(true);
        try {
          // Usar busca com pesos para sugestões
          const results = await weightedSearch(debouncedQuery, 5);
          const formattedSuggestions = results.map(result => ({
            id: result.product_id,
            name: result.product_name,
            type: 'product',
            score: result.relevance_score,
            matchedTags: result.matched_tags
          }));
          
          setSuggestions(formattedSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, weightedSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      navigate(`/busca-avancada?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.name);
    setIsOpen(false);
    navigate(`/produto/${suggestion.id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(query.length > 0)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Buscando...</p>
              </div>
            ) : (
              <div className="py-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Score: {suggestion.score?.toFixed(1)}
                      </p>
                    </div>
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}