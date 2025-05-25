
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/components/ProductCard';

interface SearchSuggestionsProps {
  searchQuery: string;
  onSelectSuggestion: (suggestion: string) => void;
  onSearch: () => void;
  isVisible: boolean;
}

const SearchSuggestions = ({ searchQuery, onSelectSuggestion, onSearch, isVisible }: SearchSuggestionsProps) => {
  const { products } = useProducts();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // Gerar sugestões baseadas nos produtos
    const uniqueSuggestions = new Set<string>();
    
    products.forEach((product: Product) => {
      // Adicionar nome do produto se contém a busca
      if (product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        uniqueSuggestions.add(product.name);
      }
      
      // Adicionar plataforma se contém a busca
      if (product.platform?.toLowerCase().includes(searchQuery.toLowerCase())) {
        uniqueSuggestions.add(product.platform);
      }
      
      // Adicionar categoria se contém a busca
      if (product.category?.toLowerCase().includes(searchQuery.toLowerCase())) {
        uniqueSuggestions.add(product.category);
      }
    });

    // Limitar a 5 sugestões
    setSuggestions(Array.from(uniqueSuggestions).slice(0, 5));
  }, [searchQuery, products]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion)}
          className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{suggestion}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
