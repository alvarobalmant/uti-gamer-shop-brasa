import React from 'react';

const Footer: React.FC = () => {
  // Placeholder implementation
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-8">
      <div className="container mx-auto px-4 text-center text-gray-500">
        [Placeholder: Rodapé do Site]
        <p>&copy; {new Date().getFullYear()} UTI dos Games. Todos os direitos reservados.</p>
        {/* Add actual footer content, links, etc. */}
      </div>
    </footer>
  );
};

export default Footer;

