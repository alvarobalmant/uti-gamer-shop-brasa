import React from 'react';
import { useParams } from 'react-router-dom';
import PlatformPage from '@/components/PlatformPage';

// Página específica para Xbox
const XboxPage: React.FC = () => {
  return <PlatformPage slug="xbox" />;
};

export default XboxPage;
