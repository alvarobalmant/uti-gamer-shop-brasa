
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductPageHeaderProps {
  onBackClick: () => void;
}

const ProductPageHeader = ({ onBackClick }: ProductPageHeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center gap-3">
        <Button
          onClick={onBackClick}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
            alt="UTI DOS GAMES" 
            className="h-8 w-8"
          />
          <h1 className="text-lg font-bold text-gray-900">UTI DOS GAMES</h1>
        </div>
      </div>
    </header>
  );
};

export default ProductPageHeader;
