import type { ChatTheme } from '../theme/chatTheme';

export interface ChatConfig {
  // Feature flags
  features: {
    enableReactions: boolean;
    enableReplies: boolean;
    enableForwards: boolean;
    enablePinning: boolean;
    enableStarring: boolean;
    enableTypingIndicator: boolean;
    enableReadReceipts: boolean;
    enableMessageSearch: boolean;
    enableMediaViewer: boolean;
    enableMessageActions: boolean;
    enableNotifications: boolean;
    enableVoiceMessages: boolean;
    enableFileSharing: boolean;
    enableLocationSharing: boolean;
    enableContactSharing: boolean;
    enablePolls: boolean;
    enableStickers: boolean;
    enableGifs: boolean;
  };

  // Behavior settings
  behavior: {
    maxMessageLength: number;
    maxFileSize: number; // in bytes
    maxImageSize: number; // in bytes
    maxVideoSize: number; // in bytes
    maxAudioSize: number; // in bytes
    maxParticipants: number;
    messageRetentionDays: number;
    typingIndicatorDelay: number; // in ms
    readReceiptTimeout: number; // in ms
    autoScrollToBottom: boolean;
    enableMessageCaching: boolean;
    enableOfflineMode: boolean;
    enableMessageEncryption: boolean;
  };

  // UI settings
  ui: {
    showAvatars: boolean;
    showTimestamps: boolean;
    showMessageStatus: boolean;
    showOnlineStatus: boolean;
    showTypingIndicator: boolean;
    showReadReceipts: boolean;
    enableSwipeToReply: boolean;
    enableLongPressActions: boolean;
    enablePullToRefresh: boolean;
    enableInfiniteScroll: boolean;
    messageBubbleStyle: 'rounded' | 'square' | 'custom';
    avatarStyle: 'circle' | 'square' | 'custom';
    inputStyle: 'bubble' | 'line' | 'custom';
  };

  // Performance settings
  performance: {
    enableVirtualization: boolean;
    enableImageLazyLoading: boolean;
    enableMessageMemoization: boolean;
    enableThemeMemoization: boolean;
    maxCachedMessages: number;
    maxCachedImages: number;
    enableMessageCompression: boolean;
    enableImageCompression: boolean;
  };

  // Development settings
  development: {
    enableDebugMode: boolean;
    enablePerformanceMonitoring: boolean;
    enableErrorReporting: boolean;
    enableLogging: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };

  // Theme override
  theme?: Partial<ChatTheme>;
}

export const defaultChatConfig: ChatConfig = {
  features: {
    enableReactions: true,
    enableReplies: true,
    enableForwards: true,
    enablePinning: true,
    enableStarring: true,
    enableTypingIndicator: true,
    enableReadReceipts: true,
    enableMessageSearch: true,
    enableMediaViewer: true,
    enableMessageActions: true,
    enableNotifications: true,
    enableVoiceMessages: true,
    enableFileSharing: true,
    enableLocationSharing: true,
    enableContactSharing: true,
    enablePolls: true,
    enableStickers: true,
    enableGifs: true,
  },

  behavior: {
    maxMessageLength: 2000,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxVideoSize: 100 * 1024 * 1024, // 100MB
    maxAudioSize: 25 * 1024 * 1024, // 25MB
    maxParticipants: 1000,
    messageRetentionDays: 365,
    typingIndicatorDelay: 1000,
    readReceiptTimeout: 5000,
    autoScrollToBottom: true,
    enableMessageCaching: true,
    enableOfflineMode: false,
    enableMessageEncryption: false,
  },

  ui: {
    showAvatars: true,
    showTimestamps: true,
    showMessageStatus: true,
    showOnlineStatus: true,
    showTypingIndicator: true,
    showReadReceipts: true,
    enableSwipeToReply: true,
    enableLongPressActions: true,
    enablePullToRefresh: true,
    enableInfiniteScroll: true,
    messageBubbleStyle: 'rounded',
    avatarStyle: 'circle',
    inputStyle: 'bubble',
  },

  performance: {
    enableVirtualization: true,
    enableImageLazyLoading: true,
    enableMessageMemoization: true,
    enableThemeMemoization: true,
    maxCachedMessages: 1000,
    maxCachedImages: 100,
    enableMessageCompression: true,
    enableImageCompression: true,
  },

  development: {
    enableDebugMode: __DEV__,
    enablePerformanceMonitoring: __DEV__,
    enableErrorReporting: true,
    enableLogging: __DEV__,
    logLevel: __DEV__ ? 'debug' : 'error',
  },
};

// Configuration context
export interface ChatConfigContextType {
  config: ChatConfig;
  updateConfig: (updates: Partial<ChatConfig>) => void;
  resetConfig: () => void;
  isFeatureEnabled: (feature: keyof ChatConfig['features']) => boolean;
  getBehaviorSetting: <K extends keyof ChatConfig['behavior']>(
    key: K
  ) => ChatConfig['behavior'][K];
  getUISetting: <K extends keyof ChatConfig['ui']>(
    key: K
  ) => ChatConfig['ui'][K];
  getPerformanceSetting: <K extends keyof ChatConfig['performance']>(
    key: K
  ) => ChatConfig['performance'][K];
}

// Configuration validation
export const validateChatConfig = (config: Partial<ChatConfig>): ChatConfig => {
  const validatedConfig = { ...defaultChatConfig, ...config };

  // Validate numeric values
  if (validatedConfig.behavior.maxMessageLength < 1) {
    validatedConfig.behavior.maxMessageLength = 1;
  }

  if (validatedConfig.behavior.maxFileSize < 1024) {
    validatedConfig.behavior.maxFileSize = 1024;
  }

  if (validatedConfig.behavior.maxParticipants < 1) {
    validatedConfig.behavior.maxParticipants = 1;
  }

  if (validatedConfig.performance.maxCachedMessages < 10) {
    validatedConfig.performance.maxCachedMessages = 10;
  }

  if (validatedConfig.performance.maxCachedImages < 5) {
    validatedConfig.performance.maxCachedImages = 5;
  }

  return validatedConfig;
};

// Configuration presets
export const chatConfigPresets = {
  minimal: {
    features: {
      enableReactions: false,
      enableReplies: false,
      enableForwards: false,
      enablePinning: false,
      enableStarring: false,
      enableTypingIndicator: false,
      enableReadReceipts: false,
      enableMessageSearch: false,
      enableMediaViewer: false,
      enableMessageActions: false,
      enableNotifications: false,
      enableVoiceMessages: false,
      enableFileSharing: false,
      enableLocationSharing: false,
      enableContactSharing: false,
      enablePolls: false,
      enableStickers: false,
      enableGifs: false,
    },
    ui: {
      showAvatars: false,
      showTimestamps: false,
      showMessageStatus: false,
      showOnlineStatus: false,
      showTypingIndicator: false,
      showReadReceipts: false,
      enableSwipeToReply: false,
      enableLongPressActions: false,
      enablePullToRefresh: false,
      enableInfiniteScroll: false,
    },
  },

  full: defaultChatConfig,

  performance: {
    ...defaultChatConfig,
    performance: {
      ...defaultChatConfig.performance,
      enableVirtualization: true,
      enableImageLazyLoading: true,
      enableMessageMemoization: true,
      enableThemeMemoization: true,
      maxCachedMessages: 500,
      maxCachedImages: 50,
      enableMessageCompression: true,
      enableImageCompression: true,
    },
  },

  development: {
    ...defaultChatConfig,
    development: {
      enableDebugMode: true,
      enablePerformanceMonitoring: true,
      enableErrorReporting: true,
      enableLogging: true,
      logLevel: 'debug' as const,
    },
  },
} as const;
