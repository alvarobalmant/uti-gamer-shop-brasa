import React from "react";

// Ultra minimal test app to verify React works
const AppMinimal = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#333' }}>
        ✅ React is Working!
      </h1>
    </div>
  );
};

export default AppMinimal;
