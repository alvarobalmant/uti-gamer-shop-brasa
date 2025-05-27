
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { categories, Category } from './categories';

const PremiumNavigation = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    setHoveredCategory(null);
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'PlayStation': '🎮',
      'Xbox': '🎯',
      'Nintendo': '🌟',
      'PC Games': '💻',
      'Retro': '👾',
      'Acessórios': '🎧',
      'Promoções': '🔥',
      'Lançamentos': '✨'
    };
    return iconMap[categoryName] || '🎮';
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-1">
            {categories.map(category => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => navigate(category.path)}
                  className="flex items-center space-x-2 px-6 py-4 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800 rounded-lg group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {getCategoryIcon(category.name)}
                  </span>
                  <span className="font-medium">{category.name}</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Premium Dropdown */}
                {hoveredCategory === category.id && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 py-4 z-50 transform opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="px-4 py-2">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                        {category.name}
                      </h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 font-medium"
                        >
                          Ver todos os produtos
                        </button>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          Produtos em destaque
                        </button>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          Lançamentos
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Categories - Floating Premium Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button className="bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110">
          <span className="text-2xl">🎮</span>
        </button>
      </div>
    </>
  );
};

export default PremiumNavigation;
