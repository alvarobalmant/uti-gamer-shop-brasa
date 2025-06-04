
import { useState, useEffect, useRef } from 'react';
import { useProducts, Product } from '@/hooks/useProducts';

interface UseProductModalProps {
  productId: string | null;
  isOpen: boolean;
  products: Product[];
  productsLoading: boolean;
}

export const useProductModal = ({ productId, isOpen, products, productsLoading }: UseProductModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  
  // Ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State for product options (similar to ProductPage)
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Enhanced function to scroll to top of modal content
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      // Force immediate scroll to top for better UX
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'auto' // Changed to auto for immediate effect
      });
    }
  };

  // Find related products based on tags
  const findRelatedProducts = (currentProduct: Product) => {
    if (products.length > 0) {
      const currentProductTags = currentProduct.tags?.map(t => t.id) || [];
      const related = products.filter(p => 
        p.id !== currentProduct.id && 
        p.tags?.some(tag => currentProductTags.includes(tag.id))
      ).slice(0, 6);
      
      if (related.length < 4) {
        const otherProducts = products.filter(p => 
          p.id !== currentProduct.id && 
          !related.some(r => r.id === p.id)
        );
        related.push(...otherProducts.slice(0, 4 - related.length));
      }

      setRelatedProducts(related);
    }
  };

  // Handle clicking on a related product
  const handleRelatedProductClick = (relatedProductId: string) => {
    if (relatedProductId !== productId) {
      setIsTransitioning(true);
      
      // Immediate scroll to top when starting transition
      scrollToTop();
      
      setTimeout(() => {
        const foundProduct = products.find(p => p.id === relatedProductId);
        if (foundProduct) {
          setProduct(foundProduct);
          findRelatedProducts(foundProduct);
          
          // Reset product options
          setSelectedCondition(foundProduct.tags?.some(t => t.name.toLowerCase() === 'novo') ? 'new' : 'pre-owned');
          setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : '');
          setSelectedColor(foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : '');
          setQuantity(1);
        }
        setIsTransitioning(false);
      }, 200); // Reduced transition time for better responsiveness
    }
  };

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToTop();
      }, 50);
    }
  }, [isOpen]);

  // Fetch product details when productId changes and modal is open
  useEffect(() => {
    if (isOpen && productId && products.length > 0) {
      console.log('Loading product with ID:', productId);
      setIsLoadingProduct(true);
      
      const foundProduct = products.find(p => p.id === productId);
      
      if (foundProduct) {
        setIsTransitioning(true);
        
        // Immediate scroll to top
        scrollToTop();
        
        // Short delay for transition effect when changing products
        setTimeout(() => {
          setProduct(foundProduct);
          
          // Reset and set default options
          setSelectedCondition(foundProduct.tags?.some(t => t.name.toLowerCase() === 'novo') ? 'new' : 'pre-owned');
          setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : '');
          setSelectedColor(foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : '');
          setQuantity(1);
          
          // Find related products
          findRelatedProducts(foundProduct);
          
          setIsTransitioning(false);
          setIsLoadingProduct(false);
          
          console.log('Product loaded successfully:', foundProduct.name);
        }, 200);
      } else {
        setTimeout(() => {
          setIsLoadingProduct(false);
          setProduct(null);
          setRelatedProducts([]);
          console.log('Product not found for ID:', productId);
        }, 200);
      }
    } else if (isOpen && productId && products.length === 0 && !productsLoading) {
      console.log('No products available but productId provided:', productId);
      setIsLoadingProduct(false);
      setProduct(null);
    } else if (isOpen && productId) {
      console.log('Waiting for products to load...');
      setIsLoadingProduct(true);
    } else if (!isOpen) {
      setIsLoadingProduct(false);
      setProduct(null);
      setRelatedProducts([]);
    }
  }, [isOpen, productId, products, productsLoading]);

  return {
    product,
    relatedProducts,
    isTransitioning,
    isLoadingProduct,
    scrollContainerRef,
    selectedCondition,
    selectedSize,
    selectedColor,
    quantity,
    setSelectedCondition,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    handleRelatedProductClick,
    scrollToTop
  };
};
