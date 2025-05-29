import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { categories, Category } from './categories';
import { cn } from '@/lib/utils'; // Assuming utils path

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation = ({ className }: DesktopNavigationProps) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
  };

  return (
    // Removed background and border, simplified structure
    // Added container for consistent padding, hidden below lg breakpoint
    <nav className={cn("hidden lg:block bg-white border-t border-gray-100", className)}> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-6 xl:space-x-8 py-2.5">
          {/* Adjusted spacing and padding */}
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="text-sm font-medium text-gray-700 hover:text-uti-red transition-colors duration-150 py-1"
              // Simplified text color and hover effect
            >
              {category.name}
            </button>
          ))}
          
          {/* UTI PRO Link - Refined styling slightly */}
          <button
            onClick={() => navigate('/uti-pro')}
            className="flex items-center gap-1.5 text-sm font-semibold text-yellow-700 hover:text-yellow-800 transition-colors duration-150 py-1 px-3 rounded-md bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 shadow-sm"
            // Adjusted font weight, colors, padding, added shadow
          >
            <Crown className="w-4 h-4 text-yellow-600" />
            UTI PRO
          </button>
        </div>
      </div>
    </nav>
    // Removed the mobile floating button logic, will be handled in MobileMenu
  );
};

export default DesktopNavigation;

