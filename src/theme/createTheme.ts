import type { ChatTheme } from './types';
import { lightTheme } from './defaultTheme';

export const createTheme = (overrides: Partial<ChatTheme>): ChatTheme => {
  return {
    ...lightTheme,
    ...overrides,
    colors: {
      ...lightTheme.colors,
      ...overrides.colors,
      messageBubble: {
        ...lightTheme.colors.messageBubble,
        ...overrides.colors?.messageBubble,
      },
      text: {
        ...lightTheme.colors.text,
        ...overrides.colors?.text,
      },
      status: {
        ...lightTheme.colors.status,
        ...overrides.colors?.status,
      },
      interactive: {
        ...lightTheme.colors.interactive,
        ...overrides.colors?.interactive,
      },
      border: {
        ...lightTheme.colors.border,
        ...overrides.colors?.border,
      },
      shadow: {
        ...lightTheme.colors.shadow,
        ...overrides.colors?.shadow,
      },
    },
    spacing: {
      ...lightTheme.spacing,
      ...overrides.spacing,
    },
    borderRadius: {
      ...lightTheme.borderRadius,
      ...overrides.borderRadius,
    },
    typography: {
      ...lightTheme.typography,
      ...overrides.typography,
      fontFamily: {
        ...lightTheme.typography.fontFamily,
        ...overrides.typography?.fontFamily,
      },
      fontSize: {
        ...lightTheme.typography.fontSize,
        ...overrides.typography?.fontSize,
      },
      lineHeight: {
        ...lightTheme.typography.lineHeight,
        ...overrides.typography?.lineHeight,
      },
    },
    elevation: {
      ...lightTheme.elevation,
      ...overrides.elevation,
    },
    animation: {
      ...lightTheme.animation,
      ...overrides.animation,
      duration: {
        ...lightTheme.animation.duration,
        ...overrides.animation?.duration,
      },
      easing: {
        ...lightTheme.animation.easing,
        ...overrides.animation?.easing,
      },
    },
    chat: {
      ...lightTheme.chat,
      ...overrides.chat,
      messageBubble: {
        ...lightTheme.chat.messageBubble,
        ...overrides.chat?.messageBubble,
      },
      avatar: {
        ...lightTheme.chat.avatar,
        ...overrides.chat?.avatar,
        size: {
          ...lightTheme.chat.avatar.size,
          ...overrides.chat?.avatar?.size,
        },
      },
      input: {
        ...lightTheme.chat.input,
        ...overrides.chat?.input,
      },
      header: {
        ...lightTheme.chat.header,
        ...overrides.chat?.header,
      },
    },
  };
};
