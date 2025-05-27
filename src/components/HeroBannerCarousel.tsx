
import DesktopHeroBanner from './HeroBanner/DesktopHeroBanner';
import MobileHeroBanner from './HeroBanner/MobileHeroBanner';

const HeroBannerCarousel = () => {
  return (
    <>
      {/* Desktop Banner - Fundo vermelho original */}
      <DesktopHeroBanner />
      {/* Mobile Banner - Design otimizado para mobile */}
      <MobileHeroBanner />
    </>
  );
};

export default HeroBannerCarousel;
