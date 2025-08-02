
import React, { useState, useEffect } from 'react';

interface AppWithPreloaderProps {
  children: React.ReactNode;
}

export const AppWithPreloader: React.FC<AppWithPreloaderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple preloader - just show for a brief moment
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando UTI dos Games...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
