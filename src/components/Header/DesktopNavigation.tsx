
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
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
      {/* Desktop Categories Navigation - Premium Design */}
      <nav className="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
        <div className="container-premium">
          <div className="flex items-center justify-center space-x-xl py-sm">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => navigate(category.path)}
                className="text-sm font-medium text-neutral-dark hover:text-primary 
                           quick-transition py-sm px-md rounded-lg hover:bg-red-50
                           relative group"
              >
                {category.name}
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary 
                                group-hover:w-full group-hover:left-0 quick-transition"></div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Categories Menu Icon - Floating Premium */}
      <div className="lg:hidden fixed bottom-6 left-6 z-40">
        <div className="relative">
          <Button
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="bg-primary hover:bg-red-700 text-white rounded-full 
                       touch-friendly shadow-xl hover:shadow-2xl
                       quick-transition hover:scale-110 active:scale-95"
          >
            <ChevronDown className={`w-5 h-5 quick-transition ${showMobileCategories ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* Floating Categories Menu Premium */}
          {showMobileCategories && (
            <>
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" 
                onClick={() => setShowMobileCategories(false)}
              />
              <div className="absolute bottom-full left-0 mb-sm w-56 bg-white rounded-2xl 
                              shadow-2xl border border-gray-200 py-sm z-40
                              animate-[scaleIn_0.2s_ease-out]">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="block w-full text-left px-md py-sm text-sm font-medium 
                               text-neutral-dark hover:text-primary hover:bg-red-50 
                               quick-transition first:rounded-t-2xl last:rounded-b-2xl
                               touch-friendly"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DesktopNavigation;
