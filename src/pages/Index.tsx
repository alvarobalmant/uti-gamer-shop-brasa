import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Import your existing section components (adjust paths as needed)
import BannerCarousel from '@/components/Banners/BannerCarousel'; // Assuming component exists
import QuickLinks from '@/components/Sections/QuickLinks'; // Assuming component exists
import UtiProBanner from '@/components/Banners/UtiProBanner'; // Assuming component exists
import ServiceCards from '@/components/Sections/ServiceCards'; // Assuming component exists
import ProductSection from '@/components/Sections/ProductSection'; // Assuming component exists
import Footer from '@/components/Layout/Footer'; // Assuming component exists
import { Loader2, AlertCircle } from 'lucide-react';

// Types matching the database structure
type HomepageSectionConfig = {
  id: string;
  section_type: 'banner_carousel' | 'quick_links' | 'uti_pro_banner' | 'product_section' | 'service_cards';
  order: number;
  product_section_id?: string | null;
  is_visible: boolean;
};

type ProductSectionDetails = {
  id: string;
  title: string;
  selection_type: 'products' | 'tags';
  selected_product_ids: string[] | null;
  selected_tag_ids: string[] | null;
  max_products: number;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  promotional_price: number | null;
  image_url: string | null;
  stock: number;
  tags: { id: string; name: string }[] | null; // Assuming tags are fetched with products if needed by ProductSection
};

// Fetch the ordered and visible homepage structure
const fetchHomepageStructure = async (): Promise<HomepageSectionConfig[]> => {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage structure:', error);
    throw new Error('Não foi possível carregar a estrutura da página inicial.');
  }
  return data || [];
};

// Fetch details for a specific product section
const fetchProductSectionDetails = async (sectionId: string): Promise<ProductSectionDetails | null> => {
  if (!sectionId) return null;
  const { data, error } = await supabase
    .from('product_sections')
    .select('*')
    .eq('id', sectionId)
    .single(); // Expecting only one section

  if (error && error.code !== 'PGRST116') { // Ignore 'not found' error, return null
    console.error(`Error fetching product section details for ${sectionId}:`, error);
    // Don't throw here, maybe the section was deleted; let the component handle null
  }
  return data ? { ...data, selected_product_ids: data.selected_product_ids || [], selected_tag_ids: data.selected_tag_ids || [] } : null;
};

// Fetch products based on IDs or Tags
const fetchProductsForSection = async (details: ProductSectionDetails): Promise<Product[]> => {
  let query = supabase.from('products').select(`
    id, name, description, price, promotional_price, image_url, stock, 
    tags ( id, name ) 
  `); // Fetch tags if needed by ProductSection component

  if (details.selection_type === 'products' && details.selected_product_ids && details.selected_product_ids.length > 0) {
    query = query.in('id', details.selected_product_ids);
  } else if (details.selection_type === 'tags' && details.selected_tag_ids && details.selected_tag_ids.length > 0) {
    // Fetch products that have at least one of the selected tags
    // This requires a many-to-many relationship table (e.g., product_tags)
    // Assuming 'tags' column is a direct FK or similar structure for simplicity here.
    // A more robust approach might use an RPC function or adjust based on actual schema.
    // Placeholder: Adjust based on your actual product-tag relationship
    // This might fetch products and filter client-side or use Supabase functions/views
    console.warn('Fetching products by tags - requires specific schema implementation.');
    // Example using overlaps if tags were stored as array on product (not ideal)
    // query = query.overlaps('tag_ids', details.selected_tag_ids);
    // Example using join table (requires knowing the join table name)
    // query = query.rpc('get_products_by_tags', { tag_ids: details.selected_tag_ids });
    // For now, let's fetch all and filter (inefficient for large datasets!)
    const { data: allProducts, error: allError } = await query;
    if (allError) throw new Error('Erro ao buscar produtos por tags.');
    return (allProducts || []).filter(p => 
        p.tags?.some(pt => details.selected_tag_ids!.includes(pt.id))
    ).slice(0, details.max_products);

  } else {
    return []; // No valid selection criteria
  }

  query = query.limit(details.max_products);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products for section:', error);
    throw new Error('Erro ao buscar produtos para a seção.');
  }
  return data || [];
};

// Component to render a dynamic product section
const DynamicProductSection: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const { data: details, isLoading: isLoadingDetails, isError: isErrorDetails } = useQuery<ProductSectionDetails | null, Error>({
    queryKey: ['productSectionDetails', sectionId],
    queryFn: () => fetchProductSectionDetails(sectionId),
    enabled: !!sectionId, // Only run if sectionId is valid
  });

  const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery<Product[], Error>({
    queryKey: ['productsForSection', sectionId, details], // Include details in key
    queryFn: () => fetchProductsForSection(details!),
    enabled: !!details, // Only run if details are loaded
  });

  if (isLoadingDetails || (details && isLoadingProducts)) {
    return <div className="container mx-auto px-4 py-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  if (isErrorDetails || isErrorProducts || !details) {
    // Optionally log error or show a placeholder
    console.error(`Failed to load product section ${sectionId}`);
    return null; // Don't render the section if data is missing/error
  }

  // Render the actual ProductSection component with fetched title and products
  return <ProductSection title={details.title} products={products} />;
};

// Main Index Page Component
const Index = () => {
  const { data: structure, isLoading, isError, error } = useQuery<HomepageSectionConfig[], Error>({
    queryKey: ['homepageStructure'],
    queryFn: fetchHomepageStructure,
  });

  const renderSection = (section: HomepageSectionConfig) => {
    switch (section.section_type) {
      case 'banner_carousel':
        return <BannerCarousel key={section.id} />;
      case 'quick_links':
        return <QuickLinks key={section.id} />;
      case 'uti_pro_banner':
        return <UtiProBanner key={section.id} />;
      case 'service_cards':
        return <ServiceCards key={section.id} />;
      case 'product_section':
        // Render the dynamic component which handles its own data fetching
        return section.product_section_id ? <DynamicProductSection key={section.id} sectionId={section.product_section_id} /> : null;
      default:
        console.warn(`Unknown section type: ${section.section_type}`);
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header would typically be in a Layout component, but included here if needed */}
      {/* <Header /> */}

      <main className="flex-grow">
        {isLoading && (
          <div className="container mx-auto px-4 py-20 flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        )}
        {isError && (
          <div className="container mx-auto px-4 py-10">
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded relative flex items-center" role="alert">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">Erro ao carregar a página: {error?.message}</span>
            </div>
          </div>
        )}
        {!isLoading && !isError && structure && structure.map(renderSection)}
      </main>

      <Footer />
    </div>
  );
};

export default Index;

