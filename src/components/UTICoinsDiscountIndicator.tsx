import React from 'react';
import { Coins, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UTICoinsDiscountIndicatorProps {
  discountPercentage: number;
  className?: string;
}

const UTICoinsDiscountIndicator: React.FC<UTICoinsDiscountIndicatorProps> = ({
  discountPercentage,
  className
}) => {
  if (discountPercentage <= 0) return null;

  // Definir estilo baseado na porcentagem
  const getDiscountStyle = (percentage: number) => {
    if (percentage === 100) {
      // Desconto completo - dourado especial
      return {
        containerClass: "bg-yellow-400 border border-yellow-500",
        iconClass: "text-yellow-900",
        textClass: "text-yellow-900 font-bold",
        icon: Star
      };
    } else if (percentage >= 50) {
      // Desconto alto - laranja
      return {
        containerClass: "bg-orange-200 border border-orange-300",
        iconClass: "text-orange-700",
        textClass: "text-orange-800 font-semibold",
        icon: Sparkles
      };
    } else if (percentage >= 25) {
      // Desconto médio - amarelo médio
      return {
        containerClass: "bg-yellow-100 border border-yellow-300",
        iconClass: "text-yellow-600",
        textClass: "text-yellow-700 font-semibold",
        icon: Coins
      };
    } else if (percentage >= 10) {
      // Desconto baixo médio - amarelo claro
      return {
        containerClass: "bg-yellow-50 border border-yellow-200",
        iconClass: "text-yellow-500",
        textClass: "text-yellow-600 font-medium",
        icon: Coins
      };
    } else {
      // Desconto muito baixo - estilo mais sutil (sem fundo nem borda)
      return {
        containerClass: "",
        iconClass: "text-yellow-500",
        textClass: "text-yellow-600 font-medium",
        icon: Coins
      };
    }
  };

  const style = getDiscountStyle(discountPercentage);
  const IconComponent = style.icon;

  return (
    <div className={cn(
      "rounded-md p-2 flex items-center justify-center gap-1 transition-all duration-200",
      style.containerClass,
      className
    )}>
      <IconComponent className={cn("w-3 h-3", style.iconClass)} />
      <span className={cn("text-xs", style.textClass)}>
        {discountPercentage}% OFF com UTI Coins
      </span>
    </div>
  );
};

export default UTICoinsDiscountIndicator;