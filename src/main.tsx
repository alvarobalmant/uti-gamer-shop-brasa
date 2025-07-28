import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializePerformanceOptimizations } from './utils/performanceUtils'

// Performance optimizations
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Create root with optimizations
const root = createRoot(rootElement);

// Initialize performance optimizations
initializePerformanceOptimizations();

// Preload critical modules
const preloadModules = () => {
  // Preload critical lazy components
  import('./pages/SearchResultsFinal');
  import('./pages/ProductPageSKU');
  import('./pages/CategoryPage');
};

// Start preloading after initial render
setTimeout(preloadModules, 100);

root.render(<App />);


