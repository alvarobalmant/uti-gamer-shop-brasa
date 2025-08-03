import React from 'react';

interface StorePickupBadgeProps {
  className?: string;
}

const StorePickupBadge: React.FC<StorePickupBadgeProps> = ({ 
  className = "" 
}) => {
  return (
<<<<<<< HEAD
    <div className={`text-sm max-w-48 ${className}`}>
      <span className="font-semibold text-orange-500">🏪 RETIRADA NA LOJA</span>
=======
    <div className={`text-sm ${className}`}>
      <span className="font-semibold text-orange-500">RETIRADA NA LOJA</span>
>>>>>>> a14bf89bc02c21899828f715cf04e9ea7521825f
      <span className="text-gray-600 ml-1">de segunda à sábado</span>
    </div>
  );
};

export default StorePickupBadge;

