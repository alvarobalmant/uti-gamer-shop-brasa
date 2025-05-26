
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, Category } from './categories';

const DesktopNavigation = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setHoveredCategory(null);
  };

  return (
    <div className="hidden lg:block border-t border-gray-200 bg-gray-50">
      <div className="container-professional">
        <nav className="flex items-center space-x-8 py-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => handleCategoryClick(category)}
                className="text-uti-dark hover:text-uti-red font-medium text-sm transition-colors duration-200 py-2"
              >
                {category.name}
              </button>
              
              {/* Mega Menu for subcategories */}
              {category.subcategories && hoveredCategory === category.id && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-professional border border-gray-200 py-4 z-50">
                  <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                    <h3 className="font-semibold text-uti-dark text-sm">{category.name}</h3>
                  </div>
                  {category.subcategories.map(sub => (
                    <button
                      key={sub.path}
                      onClick={() => navigate(sub.path)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-uti-red hover:bg-red-50 transition-colors duration-200"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DesktopNavigation;
