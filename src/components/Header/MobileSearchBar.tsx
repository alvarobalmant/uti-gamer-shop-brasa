
import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from '@/components/SearchSuggestions';

interface MobileSearchBarProps {
  className?: string;
}

const MobileSearchBar = ({ className }: MobileSearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      handleClose();
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/busca?q=${encodeURIComponent(suggestion)}`);
    handleClose();
  };

  if (!isExpanded) {
    return (
      <Button 
        onClick={handleExpand}
        variant="ghost" 
        size="sm"
        className={`p-2 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200 ${className}`}
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
            className="pl-10 pr-4 h-12 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        
        <Button 
          onClick={handleClose}
          variant="ghost" 
          size="sm"
          className="ml-3 text-gray-600 hover:text-uti-red"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Suggestions */}
      <div className="relative">
        <SearchSuggestions
          searchQuery={searchQuery}
          onSelectSuggestion={handleSuggestionSelect}
          onSearch={handleSearchSubmit}
          isVisible={showSuggestions}
        />
      </div>

      {/* Search Action */}
      {searchQuery.trim() && (
        <div className="p-4">
          <Button 
            onClick={handleSearchSubmit}
            className="w-full btn-primary"
          >
            Buscar "{searchQuery}"
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
