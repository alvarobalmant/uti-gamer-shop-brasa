
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
    <div className="container-professional overflow-safe">
      <div className="flex items-center justify-between h-16 sm:h-20 w-full max-w-full">
        {/* Logo */}
        <div className="flex items-center cursor-pointer flex-shrink-0 min-w-0" onClick={() => navigate('/')}>
          <img 
            src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
            alt="UTI DOS GAMES" 
            className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mr-2 sm:mr-4 flex-shrink-0" 
          />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base lg:text-xl font-black text-uti-dark font-heading leading-tight truncate">
              UTI DOS GAMES
            </h1>
            <p className="text-[8px] sm:text-[10px] lg:text-xs text-uti-gray font-medium -mt-0.5 sm:-mt-1 truncate">
              A loja de games de Colatina
            </p>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:block flex-1 max-w-2xl mx-4">
          <DesktopSearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex-shrink-0">
          <HeaderActions
            onCartOpen={onCartOpen}
            onAuthOpen={onAuthOpen}
            onCategoriesToggle={onCategoriesToggle}
            onMobileMenuToggle={onMobileMenuToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
