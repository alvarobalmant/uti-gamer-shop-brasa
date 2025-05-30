
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { AuthModal } from '@/components/Auth/AuthModal';
import Cart from '@/components/Cart';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import HeroQuickLinks from '@/components/HeroQuickLinks';
import PromotionalBanner from '@/components/PromotionalBanner';
import ServiceCards from '@/components/ServiceCards';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useCart } from '@/contexts/CartContext';
import FeaturedProductsSection from '@/components/FeaturedProducts/FeaturedProductsSection';
import Footer from '@/components/Footer';

const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, getCartTotal, getCartItemsCount, sendToWhatsApp } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setupScrollRestoration } = useScrollPosition();

  // Placeholder for fetching banner data (replace with actual logic)
  const [bannerData, setBannerData] = useState({
    imageUrl: '/banners/uti-pro-banner.webp',
    title: 'Desbloqueie Vantagens com UTI PRO!',
    description: 'Tenha acesso a descontos exclusivos, frete grátis e muito mais. Torne-se membro hoje mesmo!',
    buttonText: 'Saiba Mais sobre UTI PRO',
    buttonLink: '/uti-pro',
    targetBlank: false,
  });

  // Placeholder for fetching featured sections data
  const [featuredSections, setFeaturedSections] = useState([
    { id: 'destaques', title: 'Destaques da Semana', tag: 'featured', viewAllLink: '/categoria/destaques' },
    { id: 'novidades', title: 'Novidades', tag: 'new', viewAllLink: '/categoria/novidades' },
    { id: 'mais_vendidos', title: 'Mais Vendidos', tag: 'bestseller', viewAllLink: '/categoria/mais-vendidos' },
  ]);

  useEffect(() => {
    const cleanup = setupScrollRestoration();
    return cleanup;
  }, [setupScrollRestoration]);

  const handleAddToCart = (product: any, size?: string, color?: string) => {
    addToCart(product, size, color);
  };

  // Create a wrapper function to match Cart component's expected signature
  const handleUpdateQuantity = (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    // Find the cart item that matches these parameters
    const item = items.find(item => 
      item.product.id === productId && 
      item.size === size && 
      item.color === color
    );
    
    if (item) {
      updateQuantity(item.id, quantity);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col">
      <ProfessionalHeader
        onCartOpen={() => setShowCart(true)}
        onAuthOpen={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        <HeroBannerCarousel />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
          <PromotionalBanner {...bannerData} />
        </div>

        {featuredSections.map((section) => (
          <FeaturedProductsSection
            key={section.id}
            products={products.filter(p => p.tags?.some(t => t.name.toLowerCase() === section.tag) || section.tag === 'featured')} 
            loading={loading}
            onAddToCart={handleAddToCart}
            title={section.title}
            viewAllLink={section.viewAllLink}
          />
        ))}

        <ServiceCards />
      </main>

      <Footer />

      <Cart
        cart={items}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={handleUpdateQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
