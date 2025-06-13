
import React from 'react';
import PlatformPage from '../PlatformPage';
import { CustomPlatformPageProps } from './CustomPlatformPageProps';

const CustomPlatformPage: React.FC<CustomPlatformPageProps> = ({ pageSlug }) => {
  // This component acts as a wrapper around PlatformPage
  // The pageSlug is used by the routing system to determine which page to load
  return <PlatformPage />;
};

export default CustomPlatformPage;
