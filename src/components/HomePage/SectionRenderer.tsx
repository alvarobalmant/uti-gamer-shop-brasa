import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, Product } from '@/hooks/useProducts';
import { useTags, Tag } from '@/hooks/useTags';
import { cn } from "@/lib/utils";
import ProductCard from '@/components/ProductCard';
import { SectionRendererProps } from './SectionRendererProps';
import BicolorSectionTitle from './BicolorSectionTitle';

<<<<<<< HEAD
interface SectionRendererProps {
  sectionKey: string;
  bannerData: {
    imageUrl: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    targetBlank: boolean;
  };
  products: Product[];
  sections: ProductSection[];
  productsLoading: boolean;
  sectionsLoading: boolean;
  onAddToCart: (product: any, size?: string, color?: string) => void;
  reduceTopSpacing?: boolean;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  sectionKey,
  bannerData,
  products,
  sections,
  productsLoading,
  sectionsLoading,
  onAddToCart,
  reduceTopSpacing = false
}) => {
  const renderSection = () => {
    switch (sectionKey) {
      case 'hero_banner':
        return <HeroBannerCarousel key="hero_banner" />;
      
      case 'hero_quick_links':
        return <HeroQuickLinks key="hero_quick_links" />;

      case 'promo_banner':
        return (
          <div key="promo_banner" className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
            <PromotionalBanner {...bannerData} />
          </div>
        );
      
      case 'specialized_services':
        return <SpecializedServices key="specialized_services" />;
      case 'why_choose_us':
        return <WhyChooseUs key="why_choose_us" />;
      case 'contact_help':
        return <ContactHelp key="contact_help" />;
      
      default:
        // Handle product sections
        if (sectionKey.startsWith('product_section_')) {
          const sectionId = sectionKey.replace('product_section_', '');
          const section = sections.find(s => s.id === sectionId);
          
          if (!section) return null;
          
          // --- BUG FIX: Deduplicate products --- 
          const productMap = new Map<string, Product>(); // Use a Map to store unique products by ID
          
          if (section.items) {
            for (const item of section.items) {
              if (item.item_type === 'product') {
                // Find specific product by ID
                const product = products.find(p => p.id === item.item_id);
                if (product && !productMap.has(product.id)) { // Check if not already added
                  productMap.set(product.id, product);
                }
              } else if (item.item_type === 'tag') {
                // Find products with this tag
                const tagProducts = products.filter(p => 
                  p.tags?.some(tag => tag.name.toLowerCase() === item.item_id.toLowerCase() || tag.id === item.item_id)
                );
                // Add tag products to the map, overwriting duplicates (which is fine)
                tagProducts.forEach(product => {
                  if (!productMap.has(product.id)) { // Check if not already added
                     productMap.set(product.id, product);
                  }
                });
              }
            }
          }
          
          const uniqueSectionProducts = Array.from(productMap.values()); // Get unique products from the map
          // --- END BUG FIX ---
          
          return (
            <FeaturedProductsSection
              key={sectionKey}
              products={uniqueSectionProducts} // Pass unique products
              loading={productsLoading || sectionsLoading}
              onAddToCart={onAddToCart}
              title={section.title}
              viewAllLink={section.view_all_link || undefined}
              reduceTopSpacing={reduceTopSpacing}
            />
          );
=======
const SectionRenderer: React.FC<SectionRendererProps> = ({ section, onProductCardClick }) => {
  const { products, loading: productsLoading } = useProducts();
  const { tags, loading: tagsLoading } = useTags();

  const getProductsBySection = (): Product[] => {
    if (productsLoading || !products || !Array.isArray(products)) return [];
    if (!section.items || section.items.length === 0) return [];

    const sectionProducts: Product[] = [];
    
    section.items.forEach(item => {
      if (item.item_type === 'product') {
        const product = products.find(p => p.id === item.item_id);
        if (product) {
          sectionProducts.push(product);
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
        }
      } else if (item.item_type === 'tag') {
        // For tags, find all products that have this tag
        if (!tagsLoading && tags) {
          const taggedProducts = products.filter(product => 
            product.tags?.some(productTag => productTag.id === item.item_id)
          );
          sectionProducts.push(...taggedProducts);
        }
      }
    });

    return sectionProducts;
  };

  const sectionProducts = getProductsBySection();
  const isLoading = productsLoading || tagsLoading;

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <BicolorSectionTitle
          title={section.title}
          titlePart1={section.title_part1}
          titlePart2={section.title_part2}
          titleColor1={section.title_color1}
          titleColor2={section.title_color2}
          className="text-white"
        />
        {section.view_all_link && (
          <Link to={section.view_all_link}>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-900">
              Ver todos
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={`${section.id}-skel-${index}`} className="bg-white rounded-md overflow-hidden border border-gray-200">
              <Skeleton className="w-full aspect-square bg-gray-300" />
              <div className="p-2 sm:p-3">
                <Skeleton className="h-3 w-3/4 mb-1 bg-gray-300" />
                <Skeleton className="h-5 w-1/2 bg-gray-300" />
              </div>
            </div>
          ))
        ) : sectionProducts.length > 0 ? (
          sectionProducts.map(product => (
            <ProductCard 
              key={`${section.id}-${product.id}`} 
              product={product} 
              onCardClick={onProductCardClick}
            />
          ))
        ) : (
          <p className="text-gray-200 col-span-full text-center py-5">
            Nenhum produto encontrado para esta seção.
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionRenderer;
