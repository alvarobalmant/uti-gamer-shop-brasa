
import React from 'react';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Erro ao carregar produtos
        </h2>
        <p className="text-red-600 mb-4">
          Não foi possível carregar os produtos. Verifique sua conexão com a internet.
        </p>
        <button 
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
