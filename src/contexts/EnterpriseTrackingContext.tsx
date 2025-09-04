import React, { createContext, useContext } from 'react';

const EnterpriseTrackingContext = createContext({});

export const EnterpriseTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <EnterpriseTrackingContext.Provider value={{}}>
      {children}
    </EnterpriseTrackingContext.Provider>
  );
};

export const useEnterpriseTracking = () => useContext(EnterpriseTrackingContext);