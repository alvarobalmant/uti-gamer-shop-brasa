
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuHeaderProps {
  onClose: () => void;
}

const MobileMenuHeader = ({ onClose }: MobileMenuHeaderProps) => {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
          alt="UTI DOS GAMES" 
          className="h-8 w-8"
        />
        <h2 className="font-bold text-lg text-gray-900">Menu</h2>
      </div>
      <Button 
        onClick={onClose} 
        variant="ghost" 
        size="icon"
        className="text-gray-500 hover:text-gray-700 rounded-full"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MobileMenuHeader;
