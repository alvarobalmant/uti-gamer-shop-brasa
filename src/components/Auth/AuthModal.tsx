import React from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode = 'login' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </h2>
        <p className="text-gray-600 mb-4">
          Modal de autenticação em construção
        </p>
        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export { AuthModal };
export default AuthModal;