import { categories, Category } from './categories';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileCategoriesMenuProps {
  showCategories: boolean;
  onCategoryClick: (category: Category) => void;
}

const MobileCategoriesMenu = ({ showCategories, onCategoryClick }: MobileCategoriesMenuProps) => {
  const isMobile = useIsMobile();
  
  if (!showCategories) return null;

  return (
    <div className="lg:hidden border-t border-gray-200 bg-gray-50">
      <div className="container-professional py-4">
        <div className="grid grid-cols-2 gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category)}
              className={cn(
                "text-left py-2 px-3 text-sm font-medium text-uti-dark rounded-md transition-all duration-200",
                // Aplicar efeitos de hover apenas em desktop
                !isMobile 
                  ? "hover:text-uti-red hover:bg-red-50" 
                  : "active:text-uti-red"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoriesMenu;
