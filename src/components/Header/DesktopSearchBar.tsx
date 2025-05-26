
import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from '@/components/SearchSuggestions';

const DesktopSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
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
    navigate(`/busca?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="hidden lg:block flex-1 max-w-2xl mx-8 relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
          onFocus={() => setShowSuggestions(searchQuery.length > 1)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="input-professional pl-12 pr-12 h-12 text-base bg-gray-50 border-gray-200 focus:bg-white"
        />
        <Button
          onClick={handleSearchSubmit}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-uti-red hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Buscar
        </Button>
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

export default DesktopSearchBar;
