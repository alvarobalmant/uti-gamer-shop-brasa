
import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from '@/components/SearchSuggestions';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

const DesktopSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      if (searchInputRef.current) {
        searchInputRef.current.blur(); // Optionally blur input after search
      }
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
    // Changed lg:block to md:flex as per MainHeader.tsx
    // Removed max-w-2xl and mx-8 to allow full flex expansion
    <div className="hidden md:flex flex-1 relative">
      <div className="relative w-full"> {/* Ensure relative positioning spans full width */}
        {/* Make the Search icon clickable */}
        <Search
          className={cn(
            "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
            "cursor-pointer hover:text-gray-600 transition-colors" // Add cursor and hover effect
          )}
          onClick={handleSearchSubmit} // Trigger search on icon click
        />
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
          // Delay blur slightly to allow suggestion click
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} 
          // Adjusted padding: pl-12 for icon, pr-4 since button is removed
          className="input-professional pl-12 pr-4 h-12 text-base bg-gray-50 border-gray-200 focus:bg-white w-full" 
        />
        {/* Removed the Buscar Button */}
      </div>
      
      {/* Suggestions remain the same */}
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

