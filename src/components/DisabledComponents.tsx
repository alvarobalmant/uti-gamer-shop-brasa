// Arquivo temporário para componentes desabilitados que estavam causando erros de build
import React from 'react';

// Placeholder para componentes que foram temporariamente desabilitados
export const DisabledComponent: React.FC<{ name: string; children?: React.ReactNode }> = ({ 
  name, 
  children 
}) => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="p-4 border border-dashed border-yellow-500 bg-yellow-50 rounded">
        <p className="text-yellow-700 text-sm">
          Componente "{name}" temporariamente desabilitado
        </p>
        {children}
      </div>
    );
  }
  
  return <div className="hidden">{children}</div>;
};

export default DisabledComponent;