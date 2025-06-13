
import React from 'react';
import PlatformPage from '@/components/PlatformPage';

// Xbox4 page using the dynamic platform system
const XboxPage4: React.FC = () => {
  console.log('[Xbox4] Rendering XboxPage4 with dynamic platform system');
  return <PlatformPage slug="xbox4" />;
};

export default XboxPage4;
