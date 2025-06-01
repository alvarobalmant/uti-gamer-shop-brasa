import React from "react";
import { useNavigate } from "react-router-dom";
import { HomepageLayoutItem } from "@/hooks/useHomepageLayout";
import { TopDealSection } from "@/hooks/useTopDeals";
import { Product } from "@/hooks/useProducts";
import TopDealsSection from "@/components/TopDeals/TopDealsSection";

interface TopDealsSectionRendererProps {
  layoutItem: HomepageLayoutItem;
  section: TopDealSection;
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

const TopDealsSectionRenderer: React.FC<TopDealsSectionRendererProps> = ({
  section,
  products,
  loading,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  
  // Filter products to only include those in the section
  const sectionProducts = section.items
    ? products.filter(product => 
        section.items?.some(item => item.product_id === product.id)
      )
    : [];
  
  // Sort products according to the order in section.items
  const sortedProducts = [...sectionProducts].sort((a, b) => {
    const aIndex = section.items?.findIndex(item => item.product_id === a.id) ?? 0;
    const bIndex = section.items?.findIndex(item => item.product_id === b.id) ?? 0;
    return aIndex - bIndex;
  });
  
  // Prepare banner props if banner data exists
  const banner = section.banner_title 
    ? {
        title: section.banner_title,
        subtitle: section.banner_subtitle || "",
        imageUrl: section.banner_image_url || "/placeholder-banner.jpg",
        buttonText: section.banner_button_text || "Shop Now",
        buttonLink: section.banner_button_link || "/categoria/ofertas",
        isProExclusive: section.is_pro_exclusive || false
      }
    : undefined;
  
  return (
    <TopDealsSection
      products={sortedProducts}
      loading={loading}
      onAddToCart={onAddToCart}
      title={section.title}
      subtitle={section.subtitle || undefined}
      viewAllLink={section.view_all_link || "/categoria/ofertas"}
      banner={banner}
    />
  );
};

export default TopDealsSectionRenderer;
