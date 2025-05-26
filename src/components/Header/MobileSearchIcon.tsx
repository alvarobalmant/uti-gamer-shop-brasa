
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileSearchBar from './MobileSearchBar';

const MobileSearchIcon = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  if (isSearchOpen) {
    return <MobileSearchBar onClose={handleSearchClose} />;
  }

  return (
    <Button 
      onClick={handleSearchOpen}
      variant="ghost" 
      size="sm"
      className="flex flex-col items-center p-2 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
    >
      <Search className="w-5 h-5" />
      <span className="text-xs font-medium mt-1">Buscar</span>
    </Button>
  );
};

export default MobileSearchIcon;
