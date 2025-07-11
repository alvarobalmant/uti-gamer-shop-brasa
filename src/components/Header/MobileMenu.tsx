import { useEffect } from 'react';
import { X, User, Crown, Home, Grid, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Category, categories } from './categories'; // Add categories import
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
  categories: Category[];
  onCategoryClick: (category: Category) => void;
}

const MobileMenu = ({ isOpen, onClose, onAuthOpen }: MobileMenuProps) => {
  const { user, isAdmin } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAuthClick = () => {
    if (user) {
      navigate(isAdmin ? '/admin' : '/account'); 
      onClose();
    } else {
      onAuthOpen();
      onClose(); 
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const navLinks = [
    { id: 'inicio', name: 'Início', path: '/', icon: Home },
    { id: 'uti-pro', name: 'UTI PRO', path: '/uti-pro', icon: Crown },
  ];

  const utiProLink = navLinks.find(link => link.id === 'uti-pro');
  const mainLinks = navLinks.filter(link => link.id !== 'uti-pro');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* Ensure no default close button is rendered by SheetContent if possible, 
         or remove any other <X> or <SheetClose> outside the header */}
      <SheetContent
        side="left"
        className={cn(
          "w-4/5 max-w-xs h-screen flex flex-col p-0 z-[100] lg:hidden",
          // 🎯 TABLET: Agora funciona em tablets também (removido md:hidden)
          "bg-white"
        )}
        aria-describedby="mobile-menu-title"
        // Add showCloseButton={false} or similar prop if available in Shadcn Sheet to prevent default button
        // For now, assume the explicit <SheetClose> in the header is the only one needed.
      >
        {/* Header - Contains the ONLY intended close button */}
        <SheetHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <SheetTitle id="mobile-menu-title" className="font-semibold text-lg text-gray-800">Menu</SheetTitle>
          </div>
          {/* This is the close button to keep - REMOVED hover effects for mobile */}
          <SheetClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "text-gray-500 rounded-full w-8 h-8",
                "md:hover:text-red-600 md:hover:bg-red-50"
              )}
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            {/* User Section */}
            <div className="border-b pb-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-gray-600" />
                    <div className='flex-1 min-w-0'>
                      <p className="font-medium text-gray-800 truncate text-sm">{user.email}</p>
                    </div>
                  </div>
                  {utiProLink && hasActiveSubscription() && (
                    <Button
                      onClick={() => handleNavigation(utiProLink.path)}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-11 text-base px-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md",
                        "md:hover:bg-yellow-200 md:hover:text-yellow-900"
                      )}
                    >
                      <utiProLink.icon className="w-5 h-5 mr-3" />
                      {utiProLink.name} (Ativo)
                    </Button>
                  )}
                  <Button
                    onClick={handleAuthClick}
                    variant="outline"
                    className={cn(
                      "w-full h-11 text-base border-gray-300",
                      "md:hover:bg-accent md:hover:text-accent-foreground"
                    )}
                  >
                    {isAdmin ? 'Painel Admin' : 'Minha Conta'}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className={cn(
                    "w-full bg-red-600 h-12 text-base flex items-center justify-center gap-2 text-white rounded-md font-semibold",
                    "md:hover:bg-red-700"
                  )}
                >
                  <LogIn className="w-5 h-5" />
                  Entrar / Cadastrar
                </Button>
              )}
            </div>

            {/* Main Navigation Links - REMOVED hover effects for mobile */}
            <div className="space-y-1 border-b pb-4">
              {mainLinks.map((link) => (
                 <Button
                    key={link.id}
                    onClick={() => handleNavigation(link.path)}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 text-base px-3 text-gray-700 rounded-md font-medium",
                      // Only apply hover effects on desktop (md and above) - REMOVED hover effects for mobile
                      "md:hover:text-red-600 md:hover:bg-red-50"
                    )}
                  >
                    {link.icon && <link.icon className="w-5 h-5 mr-3" />}
                    {link.name}
                  </Button>
              ))}
              {utiProLink && (
                <Button
                  onClick={() => handleNavigation(utiProLink.path)}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 text-base px-3 rounded-md font-medium",
                    hasActiveSubscription() 
                      ? "bg-yellow-50 text-yellow-800 md:hover:bg-yellow-100" 
                      : "bg-gray-100 text-gray-800 md:hover:bg-gray-200"
                  )}
                >
                  <utiProLink.icon className="w-5 h-5 mr-3" />
                  {utiProLink.name}
                </Button>
              )}
            </div>

            {/* Categories Section - REMOVED hover effects for mobile */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-500 mb-2 flex items-center gap-2 text-sm px-3 uppercase tracking-wider">
                Categorias
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleNavigation(category.path)}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 text-base px-3 text-gray-700 rounded-md font-medium",
                      // Only apply hover effects on desktop (md and above) - REMOVED hover effects for mobile
                      "md:hover:text-red-600 md:hover:bg-red-50"
                    )}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add padding at the bottom for scroll space */}
            <div className="h-16"></div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
