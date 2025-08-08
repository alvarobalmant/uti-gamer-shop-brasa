import { useState, useEffect } from 'react';

interface AnalyticsConfig {
  showMockData: boolean;
  mockDataEnabled: boolean;
}

const ANALYTICS_CONFIG_KEY = 'analytics-config';

const defaultConfig: AnalyticsConfig = {
  showMockData: false,
  mockDataEnabled: false
};

export const useAnalyticsConfig = () => {
  const [config, setConfig] = useState<AnalyticsConfig>(defaultConfig);

  useEffect(() => {
    const savedConfig = localStorage.getItem(ANALYTICS_CONFIG_KEY);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Erro ao carregar configuração de analytics:', error);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<AnalyticsConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem(ANALYTICS_CONFIG_KEY, JSON.stringify(updatedConfig));
  };

  const toggleMockData = () => {
    updateConfig({ 
      showMockData: !config.showMockData,
      mockDataEnabled: !config.showMockData 
    });
  };

  return {
    config,
    updateConfig,
    toggleMockData,
    showMockData: config.showMockData,
    mockDataEnabled: config.mockDataEnabled
  };
};