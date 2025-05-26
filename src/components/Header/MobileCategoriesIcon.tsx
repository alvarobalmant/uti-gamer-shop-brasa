
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileCategoriesIconProps {
  onClick: () => void;
}

const MobileCategoriesIcon = ({ onClick }: MobileCategoriesIconProps) => {
  return (
    <Button 
      onClick={onClick}
      variant="ghost" 
      size="sm"
      className="flex items-center p-2 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
    >
      <ChevronDown className="w-4 h-4" />
    </Button>
  );
};

export default MobileCategoriesIcon;
