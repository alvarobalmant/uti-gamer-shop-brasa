
import GlobalCartContainer from './GlobalCartContainer';
import GlobalCartContent from './GlobalCartContent';
import { useGlobalCartLogic } from './useGlobalCartLogic';

interface GlobalCartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalCartDropdown = ({ isOpen, onClose }: GlobalCartDropdownProps) => {
  const {
    items,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    getCartTotal,
    sendToWhatsApp,
  } = useGlobalCartLogic();

  return (
    <GlobalCartContainer isOpen={isOpen} onClose={onClose}>
      <GlobalCartContent
        items={items}
        onClose={onClose}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        getCartTotal={getCartTotal}
        sendToWhatsApp={sendToWhatsApp}
      />
    </GlobalCartContainer>
  );
};

export default GlobalCartDropdown;
