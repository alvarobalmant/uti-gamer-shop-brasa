import React from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface TopDealProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  dealLabel?: string;
  className?: string;
}

const TopDealProductCard = ({
  product,
  onAddToCart,
  dealLabel = "RIG DEAL",
  className,
}: TopDealProductCardProps) => {
  const navigate = useNavigate();
  
  // Determine label color based on label text
  const getLabelColor = (label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes("pre-owned") || labelLower.includes("bundle")) {
      return "bg-green-600";
    }
    if (labelLower.includes("employee") || labelLower.includes("favorite")) {
      return "bg-blue-600";
    }
    // Default color for RIG DEAL and others
    return "bg-red-600";
  };

  // Calculate pro price (5-10% discount)
  const calculateProPrice = (price: number) => {
    const discountPercent = price > 100 ? 0.05 : 0.1; // Higher discount for cheaper items
    const discountAmount = price * discountPercent;
    return (price - discountAmount).toFixed(2);
  };

  const handleProductClick = () => {
    navigate(`/produto/${product.id}`);
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Deal Label */}
      {dealLabel && (
        <div className={`absolute top-2 left-2 z-10 ${getLabelColor(dealLabel)}`}>
          <Badge variant="outline" className="text-white border-0 font-medium text-xs px-2 py-1">
            {dealLabel}
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div 
        className="aspect-square overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>
        
        {/* Regular Price */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold">
            R${product.price.toFixed(2)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              R${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Pro Price */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm font-medium text-purple-700">
            R${calculateProPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            for Pros
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full border-primary text-primary hover:bg-primary/10"
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default TopDealProductCard;
