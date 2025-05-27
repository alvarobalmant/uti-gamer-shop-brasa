
import { useNavigate } from 'react-router-dom';
import PremiumSearchBar from './PremiumSearchBar';
import HeaderActions from './HeaderActions';

interface MainHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuToggle: () => void;
}

const MainHeader = ({ 
  onCartOpen, 
  onAuthOpen, 
  onMobileMenuToggle 
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between h-20 lg:h-24">
        {/* Logo - Premium sizing */}
        <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <img 
            src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
            alt="UTI DOS GAMES" 
            className="h-12 w-12 lg:h-16 lg:w-16 mr-3 lg:mr-4" 
          />
          <div className="hidden sm:block">
            <h1 className="text-lg lg:text-2xl font-black text-gray-900 font-heading leading-tight">
              UTI DOS GAMES
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 font-medium -mt-1">
              A loja de games de Colatina
            </p>
          </div>
        </div>

        {/* Desktop Search Bar - Premium design */}
        <PremiumSearchBar />

        {/* Right Actions - Enhanced */}
        <HeaderActions
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onMobileMenuToggle={onMobileMenuToggle}
        />
      </div>
    </div>
  );
};

export default MainHeader;
