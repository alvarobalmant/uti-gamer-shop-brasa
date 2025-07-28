
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import scrollManager from '@/lib/scrollRestorationManager';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActionsEnhanced from './HeaderActionsEnhanced';
import MobileSearchBar from './MobileSearchBar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useGlobalNavigationLinks } from '@/hooks/useGlobalNavigationLinks';
import { CSSLogo } from '@/components/ui/CSSLogo';

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuToggle: () => void;
  className?: string;
}

const MainHeader = ({
  onCartOpen,
  onAuthOpen,
  onMobileMenuToggle,
  className
}: MainHeaderProps) => {
  const location = useLocation();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { siteInfo, loading } = useSiteSettings();
  const { navigateToHome } = useGlobalNavigationLinks();

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleLogoClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Se já estamos na homepage, tentar restaurar posição salva
    if (location.pathname === '/') {
      const restored = await scrollManager.restorePosition('/', 'logo click', true);
      if (!restored) {
        // Se não há posição salva ou falhou, scroll suave para o topo
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
    } else {
      // Se estamos em outra página, usar navegação global
      await navigateToHome();
    }
  };

  return (
    <>
      <div className={cn(
        "w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/80 shadow-sm",
        "fixed top-0 left-0 right-0 z-50", // Mudança aqui: fixed ao invés de sticky
        className
      )}>
        <div className="container flex h-[72px] items-center justify-between px-4 gap-2">
          {/* Left side: Mobile Menu Toggle + Header Content */}
          <div className="flex items-center flex-shrink min-w-0"> 
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "mr-2 lg:hidden p-2 h-10 w-10 flex-shrink-0",
                // 🎯 TABLET: Botão de menu visível em tablets também
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={onMobileMenuToggle}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {!loading && (
              <div 
                onClick={handleLogoClick}
                className="flex items-center min-w-0 cursor-pointer" 
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLogoClick(e as any);
                  }
                }}
                aria-label={`Página Inicial ${siteInfo.siteName}`}
              >
                {siteInfo.headerLayoutType === 'single_image' && siteInfo.headerImageUrl ? (
                  /* Modo Imagem Única */
                  <img
                    src={siteInfo.headerImageUrl}
                    alt={`${siteInfo.siteName} - ${siteInfo.siteSubtitle}`}
                    className="h-12 w-auto flex-shrink-0 max-w-64"
                  />
                ) : siteInfo.headerLayoutType === 'css_logo' ? (
                  /* Modo Logo CSS */
                  <CSSLogo 
                    size="sm" 
                    className="flex-shrink-0"
                  />
                ) : (
                  /* Modo Logo + Título tradicional */
                  <>
                    <img
                      src={siteInfo.logoUrl}
                      alt={`${siteInfo.siteName} Logo`}
                      className="h-10 w-auto flex-shrink-0"
                    />
                    <div className="ml-2 sm:ml-3 overflow-hidden">
                      <h1 className={cn(
                        "font-bold leading-tight text-uti-red",
                        // 🎯 TABLET: Tamanho de fonte otimizado para tablets
                        "text-sm md:text-base lg:text-lg"
                      )}>{siteInfo.siteName}</h1>
                      <p className={cn(
                        "text-gray-600 leading-tight whitespace-normal",
                        // 🎯 TABLET: Texto otimizado para tablets
                        "text-[10px] md:text-xs lg:text-sm"
                      )}>
                        {siteInfo.siteSubtitle}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Center: Desktop Search Bar - Só aparece em desktop */}
          <div className="flex-1 justify-center px-4 hidden lg:flex">
             <DesktopSearchBar />
          </div>

          {/* Right side: Header Actions + Mobile/Tablet Search Toggle */}
          <div className="flex items-center justify-end flex-shrink-0 gap-1"> 
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden p-2 h-10 w-10",
                // 🎯 TABLET: Botão de busca visível em tablets também
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={toggleMobileSearch}
              aria-label="Abrir busca"
            >
              <Search className="h-6 w-6" />
            </Button>

            <HeaderActionsEnhanced
              onCartOpen={onCartOpen}
              onAuthOpen={onAuthOpen}
            />
          </div>
        </div>
      </div>

      <MobileSearchBar isOpen={isMobileSearchOpen} onClose={toggleMobileSearch} />
    </>
  );
};

export default MainHeader;
