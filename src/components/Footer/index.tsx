
import React, { useState, useEffect } from 'react';
import FooterMain from './FooterMain';
import FloatingElements from './FloatingElements';
import NewsletterPopup from './NewsletterPopup';

const Footer = () => {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já viu o popup
    const hasSeenPopup = localStorage.getItem('utidosgames_newsletter_popup_seen');
    
    if (hasSeenPopup) {
      return; // Se já viu, não mostra novamente
    }

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

  const handleClosePopup = () => {
    setShowNewsletterPopup(false);
    // Marca que o usuário já viu o popup
    localStorage.setItem('utidosgames_newsletter_popup_seen', 'true');
  };

  return (
    <>
      <FooterMain />
      <FloatingElements />
      <NewsletterPopup 
        isOpen={showNewsletterPopup} 
        onClose={handleClosePopup} 
      />
    </>
  );
};

export default Footer;
