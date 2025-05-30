
import MobileMenuHeader from './MobileMenu/MobileMenuHeader';
import MobileMenuAuth from './MobileMenu/MobileMenuAuth';
import MobileMenuNavigation from './MobileMenu/MobileMenuNavigation';
import { useMobileMenuLogic } from './MobileMenu/useMobileMenuLogic';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileMenu = ({ isOpen, onClose, onAuthOpen }: MobileMenuProps) => {
  const { handleAuthClick, handleNavigation } = useMobileMenuLogic({
    isOpen,
    onClose,
    onAuthOpen,
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Full screen backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={onClose} />
      
      {/* Menu modal - positioned like in the image */}
      <div className="fixed top-0 left-4 right-4 bottom-20 bg-white z-[9999] rounded-b-2xl shadow-2xl flex flex-col overflow-hidden">
        <MobileMenuHeader onClose={onClose} />

        {/* Menu content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <MobileMenuAuth onAuthClick={handleAuthClick} />
          <MobileMenuNavigation onNavigation={handleNavigation} />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
