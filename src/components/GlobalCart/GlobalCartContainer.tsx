
import { useIsMobile } from '@/hooks/use-mobile';

interface GlobalCartContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const GlobalCartContainer = ({ isOpen, onClose, children }: GlobalCartContainerProps) => {
  const isMobile = useIsMobile();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]" 
        onClick={handleBackdropClick}
      />
      
      {/* Dropdown - Mobile gets almost full screen treatment */}
      <div className={`
        fixed z-[9999] bg-white shadow-2xl border border-gray-200 flex flex-col rounded-2xl
        ${isMobile 
          ? 'inset-x-4 inset-y-8 max-h-[calc(100vh-4rem)]' 
          : 'absolute right-0 top-full mt-2 w-96 max-h-96 rounded-lg'
        }
      `}>
        {children}
      </div>
    </>
  );
};

export default GlobalCartContainer;
