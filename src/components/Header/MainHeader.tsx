
import { useNavigate } from 'react-router-dom';
import DesktopSearchBar from './DesktopSearchBar';
import HeaderActions from './HeaderActions';

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onCategoriesToggle: () => void;
  onMobileMenuToggle: () => void;
}

const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onCategoriesToggle, 
  onMobileMenuToggle 
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="container-premium">
      <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
        {/* Logo - Responsivo com Micro-interações */}
        <div 
          className="flex items-center cursor-pointer group quick-transition hover:scale-105" 
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES" 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 
                         quick-transition group-hover:rotate-3" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent 
                            opacity-0 group-hover:opacity-100 quick-transition rounded-lg"></div>
          </div>
          
          <div className="ml-3 md:ml-4">
            <h1 className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl 
                           font-black text-neutral-dark font-heading leading-tight
                           group-hover:text-primary quick-transition">
              UTI DOS GAMES
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base 
                          text-neutral-gray font-medium -mt-0.5 sm:-mt-1
                          group-hover:text-secondary quick-transition hidden sm:block">
              A loja de games de Colatina
            </p>
          </div>
        </div>

        {/* Desktop Search Bar - Melhor responsividade */}
        <div className="hidden lg:block flex-1 max-w-2xl mx-8">
          <DesktopSearchBar />
        </div>

        {/* Right Actions - Otimizado para touch */}
        <HeaderActions
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onCategoriesToggle={onCategoriesToggle}
          onMobileMenuToggle={onMobileMenuToggle}
        />
      </div>
    </div>
  );
};

export default MainHeader;
