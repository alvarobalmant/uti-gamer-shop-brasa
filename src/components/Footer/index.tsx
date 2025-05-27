
import React, { useState, useEffect } from 'react';
import FooterMain from './FooterMain';
import FloatingElements from './FloatingElements';
import NewsletterPopup from './NewsletterPopup';

const Footer = () => {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  useEffect(() => {
    // Show newsletter popup after 30 seconds or on scroll intent
    const timer = setTimeout(() => {
      setShowNewsletterPopup(true);
    }, 30000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowNewsletterPopup(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <FooterMain />
      <FloatingElements />
      <NewsletterPopup 
        isOpen={showNewsletterPopup} 
        onClose={() => setShowNewsletterPopup(false)} 
      />
    </>
  );
};

export default Footer;
