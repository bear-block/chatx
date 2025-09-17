import type { ChatTheme } from './types';

export const lightTheme: ChatTheme = {
  colors: {
    // Primary colors
    primary: '#007AFF',
    primaryContainer: '#E3F2FD',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#001F3F',

    // Secondary colors
    secondary: '#5856D6',
    secondaryContainer: '#E8E7FF',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1A1A3A',

    // Surface colors
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    surfaceContainer: '#F8F9FA',
    surfaceContainerHigh: '#FFFFFF',
    surfaceContainerHighest: '#FFFFFF',
    onSurface: '#000000',
    onSurfaceVariant: '#6C6C70',

    // Background colors
    background: '#FFFFFF',
    onBackground: '#000000',

    // Message bubble colors
    messageBubble: {
      sent: '#007AFF',
      received: '#F2F2F7',
      system: '#E5E5EA',
    },

    // Text colors
    text: {
      primary: '#000000',
      secondary: '#6C6C70',
      disabled: '#C7C7CC',
      inverse: '#FFFFFF',
    },

    // Status colors
    status: {
      online: '#34C759',
      offline: '#8E8E93',
      typing: '#FF9500',
      delivered: '#007AFF',
      read: '#34C759',
      error: '#FF3B30',
    },

    // Interactive colors
    interactive: {
      hover: 'rgba(0, 0, 0, 0.04)',
      pressed: 'rgba(0, 0, 0, 0.08)',
      focus: 'rgba(0, 122, 255, 0.1)',
      disabled: 'rgba(0, 0, 0, 0.12)',
    },

    // Border colors
    border: {
      light: '#E5E5EA',
      medium: '#C7C7CC',
      strong: '#8E8E93',
    },

    // Shadow colors
    shadow: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.15)',
      strong: 'rgba(0, 0, 0, 0.2)',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
    },
  },

  elevation: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },

  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  chat: {
    messageBubble: {
      maxWidth: 280,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
    },
    avatar: {
      size: {
        sm: 24,
        md: 32,
        lg: 40,
      },
      borderRadius: 16,
    },
    input: {
      height: 44,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    header: {
      height: 56,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  },
};

export const darkTheme: ChatTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // Primary colors
    primary: '#0A84FF',
    primaryContainer: '#1A1A3A',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#E3F2FD',

    // Secondary colors
    secondary: '#5E5CE6',
    secondaryContainer: '#2A2A4A',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#E8E7FF',

    // Surface colors
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    surfaceContainer: '#242426',
    surfaceContainerHigh: '#2C2C2E',
    surfaceContainerHighest: '#363638',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#8E8E93',

    // Background colors
    background: '#000000',
    onBackground: '#FFFFFF',

    // Message bubble colors
    messageBubble: {
      sent: '#0A84FF',
      received: '#2C2C2E',
      system: '#363638',
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
      disabled: '#48484A',
      inverse: '#000000',
    },

    // Status colors
    status: {
      online: '#30D158',
      offline: '#48484A',
      typing: '#FF9F0A',
      delivered: '#0A84FF',
      read: '#30D158',
      error: '#FF453A',
    },

    // Interactive colors
    interactive: {
      hover: 'rgba(255, 255, 255, 0.04)',
      pressed: 'rgba(255, 255, 255, 0.08)',
      focus: 'rgba(10, 132, 255, 0.1)',
      disabled: 'rgba(255, 255, 255, 0.12)',
    },

    // Border colors
    border: {
      light: '#2C2C2E',
      medium: '#48484A',
      strong: '#8E8E93',
    },

    // Shadow colors
    shadow: {
      light: 'rgba(0, 0, 0, 0.3)',
      medium: 'rgba(0, 0, 0, 0.4)',
      strong: 'rgba(0, 0, 0, 0.5)',
    },
  },
};
