
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPageHeaderProps {
  onBackClick: () => void;
}

const ProductPageHeader = ({ onBackClick }: ProductPageHeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 w-full max-w-full">
      <div className="px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 w-full max-w-full overflow-x-hidden">
        <Button
          onClick={onBackClick}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-[44px] min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img 
            src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
            alt="UTI DOS GAMES" 
            className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
          />
          <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">UTI DOS GAMES</h1>
        </div>
      </div>
    </header>
  );
};

export default ProductPageHeader;
