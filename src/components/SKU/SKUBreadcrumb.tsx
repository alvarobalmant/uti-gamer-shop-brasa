import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { SKUNavigation, Platform } from '@/hooks/useProducts/types';
import { PLATFORM_CONFIG } from '@/hooks/useSKUs';
import { cn } from '@/lib/utils';

interface SKUBreadcrumbProps {
  skuNavigation: SKUNavigation;
  className?: string;
}

const SKUBreadcrumb: React.FC<SKUBreadcrumbProps> = ({
  skuNavigation,
  className
}) => {
  const { masterProduct, currentSKU } = skuNavigation;
  
  const getCurrentPlatformInfo = () => {
    if (currentSKU?.variant_attributes?.platform) {
      return PLATFORM_CONFIG[currentSKU.variant_attributes.platform as Platform];
    }
    return null;
  };

  const platformInfo = getCurrentPlatformInfo();

  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-gray-600", className)}>
      {/* Home */}
      <Link 
        to="/" 
        className="flex items-center hover:text-red-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      <ChevronRight className="w-4 h-4 text-gray-400" />

      {/* Categoria (se disponível) */}
      {masterProduct.category && (
        <>
          <Link 
            to={`/categoria/${masterProduct.category}`}
            className="hover:text-red-600 transition-colors"
          >
            {masterProduct.category}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </>
      )}

      {/* Produto Mestre */}
      <Link 
        to={`/produto/${masterProduct.id}`}
        className="hover:text-red-600 transition-colors font-medium"
      >
        {masterProduct.name}
      </Link>

      {/* SKU Atual (se for um SKU específico) */}
      {currentSKU && platformInfo && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium flex items-center gap-1">
            <span className="text-lg">{platformInfo.icon}</span>
            {platformInfo.name}
          </span>
        </>
      )}
    </nav>
  );
};

export default SKUBreadcrumb;

