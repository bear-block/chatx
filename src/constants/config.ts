export const DEFAULT_CONFIG = {
  THEME: {
    MODE: 'auto' as const,
    PRIMARY_COLOR: '#007AFF',
    SECONDARY_COLOR: '#5856D6',
  },
  CHAT: {
    MESSAGES_PER_PAGE: 50,
    AUTO_SCROLL_THRESHOLD: 0.2,
    TYPING_INDICATOR_TIMEOUT: 3000,
    MESSAGE_RETRY_ATTEMPTS: 3,
    MESSAGE_RETRY_DELAY: 1000,
  },
  MEDIA: {
    QUALITY: 0.8,
    COMPRESSION: true,
    GENERATE_THUMBNAILS: true,
    CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  },
  NOTIFICATIONS: {
    ENABLED: true,
    SOUND: true,
    VIBRATION: true,
    BADGE: true,
  },
  PRIVACY: {
    READ_RECEIPTS: true,
    ONLINE_STATUS: true,
    LAST_SEEN: 'everyone' as const,
  },
  PERFORMANCE: {
    LAZY_LOADING: true,
    VIRTUALIZATION: true,
    MEMORY_OPTIMIZATION: true,
    ANIMATION_REDUCTION: false,
  },
} as const;

export const API_ENDPOINTS = {
  MESSAGES: '/api/messages',
  CHATS: '/api/chats',
  USERS: '/api/users',
  MEDIA: '/api/media',
  AUTH: '/api/auth',
  NOTIFICATIONS: '/api/notifications',
} as const;

export const STORAGE_KEYS = {
  THEME: 'chatx_theme',
  USER: 'chatx_user',
  SETTINGS: 'chatx_settings',
  CACHE: 'chatx_cache',
  DRAFTS: 'chatx_drafts',
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  TYPING: 500,
  SCROLL: 100,
  RESIZE: 250,
} as const;
