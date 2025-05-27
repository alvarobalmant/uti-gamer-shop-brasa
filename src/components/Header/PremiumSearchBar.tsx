
import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from '@/components/SearchSuggestions';

const PremiumSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);
    navigate(`/busca?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="hidden lg:block flex-1 max-w-2xl mx-8 xl:mx-12 relative">
      <div className="relative group">
        <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-105' : ''}`}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar jogos, consoles, acessórios..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 1);
            }}
            onKeyPress={handleSearchKeyPress}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(searchQuery.length > 1);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false);
                setIsFocused(false);
              }, 200);
            }}
            className={`w-full pl-12 pr-16 h-12 xl:h-14 text-base bg-gray-50 border-2 rounded-xl transition-all duration-300 font-medium
              ${isFocused 
                ? 'border-red-500 bg-white shadow-lg shadow-red-500/20' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-white'
              }`}
          />
          <Button
            onClick={handleSearchSubmit}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <SearchSuggestions
        searchQuery={searchQuery}
        onSelectSuggestion={handleSuggestionSelect}
        onSearch={handleSearchSubmit}
        isVisible={showSuggestions}
      />
    </div>
  );
};

export default PremiumSearchBar;
