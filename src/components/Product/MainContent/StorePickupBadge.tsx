import React from 'react';

interface StorePickupBadgeProps {
  className?: string;
}

const StorePickupBadge: React.FC<StorePickupBadgeProps> = ({ 
  className = "" 
}) => {
  return (
    <div className={`text-sm ${className}`}>
      <span className="font-semibold text-orange-500">RETIRADA NA LOJA</span>
      <span className="text-gray-600 ml-1">de segunda à sábado</span>
    </div>
  );
};

export default StorePickupBadge;

