
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, Category } from './categories';

const DesktopNavigation = () => {
  const navigate = useNavigate();
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setShowMobileCategories(false);
  };

  return (
    <>
      {/* Desktop Categories Navigation */}
      <nav className="hidden lg:block bg-white border-b border-gray-200">
        <div className="container-professional">
          <div className="flex items-center justify-center space-x-8 py-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => navigate(category.path)}
                className="text-sm font-medium text-uti-dark hover:text-uti-red transition-colors duration-200 py-2"
              >
                {category.name}
              </button>
            ))}
            
            {/* UTI PRO Link */}
            <button
              onClick={() => navigate('/uti-pro')}
              className="flex items-center gap-1 text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors duration-200 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 px-3 rounded-full border border-yellow-300"
            >
              <Crown className="w-4 h-4" />
              UTI PRO
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Categories Menu Icon - Floating */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <div className="relative">
          <Button
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="bg-uti-red hover:bg-red-700 text-white rounded-full w-12 h-12 shadow-lg"
          >
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showMobileCategories ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* Floating Categories Menu */}
          {showMobileCategories && (
            <>
              <div 
                className="fixed inset-0 bg-black/20 z-30" 
                onClick={() => setShowMobileCategories(false)}
              />
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-uti-dark hover:text-uti-red hover:bg-red-50 transition-all duration-200"
                  >
                    {category.name}
                  </button>
                ))}
                
                {/* UTI PRO Link Mobile */}
                <button
                  onClick={() => {
                    navigate('/uti-pro');
                    setShowMobileCategories(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 transition-all duration-200"
                >
                  <Crown className="w-4 h-4" />
                  UTI PRO
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DesktopNavigation;
