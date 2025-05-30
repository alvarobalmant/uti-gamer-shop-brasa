
import { Home, Crown, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '../categories';

interface MobileMenuNavigationProps {
  onNavigation: (path: string) => void;
}

const MobileMenuNavigation = ({ onNavigation }: MobileMenuNavigationProps) => {
  return (
    <div className="space-y-4">
      {/* Home button */}
      <Button
        onClick={() => onNavigation('/')}
        variant="ghost"
        className="w-full justify-start p-4 h-auto text-left"
      >
        <Home className="w-5 h-5 mr-3 text-gray-600" />
        <span className="font-medium text-gray-900">Início</span>
      </Button>

      {/* UTI PRO button - Yellow background like in image */}
      <Button
        onClick={() => onNavigation('/uti-pro')}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 rounded-lg font-medium justify-start"
      >
        <Crown className="w-5 h-5 mr-3" />
        UTI PRO
      </Button>

      {/* Categories section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2 py-2">
          <Grid className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Categorias</h3>
        </div>
        
        <div className="pl-7 space-y-1">
          {/* Início */}
          <Button
            onClick={() => onNavigation('/')}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2"
          >
            Início
          </Button>

          {/* Categories from the image */}
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onNavigation(category.path)}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2"
            >
              {category.name}
            </Button>
          ))}

          {/* UTI PRO at the bottom of categories */}
          <Button
            onClick={() => onNavigation('/uti-pro')}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2"
          >
            UTI PRO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuNavigation;
