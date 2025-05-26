
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
    <div className="container-professional">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
            alt="UTI DOS GAMES" 
            className="h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3" 
          />
          <div>
            <h1 className="text-sm sm:text-2xl font-black text-uti-dark font-heading leading-tight">
              UTI DOS GAMES
            </h1>
            <p className="text-xs text-uti-gray font-medium -mt-0.5 sm:-mt-1">
              A loja de games de Colatina
            </p>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <DesktopSearchBar />

        {/* Right Actions */}
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
