import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  ChatConfig,
  validateChatConfig,
  ChatConfigContextType,
} from './ChatConfig';

const ChatConfigContext = createContext<ChatConfigContextType | undefined>(
  undefined
);

interface ChatConfigProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<ChatConfig>;
  onConfigChange?: (config: ChatConfig) => void;
}

export const ChatConfigProvider: React.FC<ChatConfigProviderProps> = ({
  children,
  initialConfig,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<ChatConfig>(() =>
    validateChatConfig(initialConfig || {})
  );

  const updateConfig = useCallback(
    (updates: Partial<ChatConfig>) => {
      setConfig((prevConfig) => {
        const newConfig = validateChatConfig({ ...prevConfig, ...updates });
        onConfigChange?.(newConfig);
        return newConfig;
      });
    },
    [onConfigChange]
  );

  const resetConfig = useCallback(() => {
    const defaultConfig = validateChatConfig({});
    setConfig(defaultConfig);
    onConfigChange?.(defaultConfig);
  }, [onConfigChange]);

  const isFeatureEnabled = useCallback(
    (feature: keyof ChatConfig['features']) => {
      return config.features[feature];
    },
    [config.features]
  );

  const getBehaviorSetting = useCallback(
    <K extends keyof ChatConfig['behavior']>(key: K) => {
      return config.behavior[key];
    },
    [config.behavior]
  );

  const getUISetting = useCallback(
    <K extends keyof ChatConfig['ui']>(key: K) => {
      return config.ui[key];
    },
    [config.ui]
  );

  const getPerformanceSetting = useCallback(
    <K extends keyof ChatConfig['performance']>(key: K) => {
      return config.performance[key];
    },
    [config.performance]
  );

  const contextValue = useMemo<ChatConfigContextType>(
    () => ({
      config,
      updateConfig,
      resetConfig,
      isFeatureEnabled,
      getBehaviorSetting,
      getUISetting,
      getPerformanceSetting,
    }),
    [
      config,
      updateConfig,
      resetConfig,
      isFeatureEnabled,
      getBehaviorSetting,
      getUISetting,
      getPerformanceSetting,
    ]
  );

  return (
    <ChatConfigContext.Provider value={contextValue}>
      {children}
    </ChatConfigContext.Provider>
  );
};

export const useChatConfig = (): ChatConfigContextType => {
  const context = useContext(ChatConfigContext);
  if (context === undefined) {
    throw new Error('useChatConfig must be used within a ChatConfigProvider');
  }
  return context;
};

// Hook for specific feature checks
export const useFeatureFlag = (
  feature: keyof ChatConfig['features']
): boolean => {
  const { isFeatureEnabled } = useChatConfig();
  return isFeatureEnabled(feature);
};

// Hook for behavior settings
export const useBehaviorSetting = <K extends keyof ChatConfig['behavior']>(
  key: K
) => {
  const { getBehaviorSetting } = useChatConfig();
  return getBehaviorSetting(key);
};

// Hook for UI settings
export const useUISetting = <K extends keyof ChatConfig['ui']>(key: K) => {
  const { getUISetting } = useChatConfig();
  return getUISetting(key);
};

// Hook for performance settings
export const usePerformanceSetting = <
  K extends keyof ChatConfig['performance'],
>(
  key: K
) => {
  const { getPerformanceSetting } = useChatConfig();
  return getPerformanceSetting(key);
};
