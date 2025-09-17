import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import type { ChatThemeConfig } from './chatTheme';
import { lightTheme, darkTheme } from './defaultTheme';

interface ChatThemeProviderProps {
  theme?: Partial<ChatThemeConfig>;
  mode?: 'light' | 'dark' | 'auto';
  children: ReactNode;
}

interface ChatThemeContextValue {
  theme: ChatThemeConfig;
  mode: 'light' | 'dark' | 'auto';
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
  updateTheme: (updates: Partial<ChatThemeConfig>) => void;
  resetTheme: () => void;
}

const ChatThemeContext = createContext<ChatThemeContextValue | null>(null);

// Default comprehensive theme configuration
const defaultChatTheme: ChatThemeConfig = {
  ...lightTheme,
  appearance: {
    messageBubble: {
      borderRadius: 18,
      maxWidth: 280,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginVertical: 2,
      marginHorizontal: 16,
      tailSize: 8,
      tailOffset: 4,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    avatar: {
      size: {
        xs: 20,
        sm: 24,
        md: 32,
        lg: 40,
        xl: 48,
      },
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    input: {
      height: 44,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      lineHeight: 20,
      backgroundColor: '#F2F2F7',
      borderColor: '#E5E5EA',
      borderWidth: 1,
      placeholderColor: '#8E8E93',
      sendButtonSize: 32,
      sendButtonColor: '#007AFF',
      sendButtonDisabledColor: '#C7C7CC',
    },
    header: {
      height: 56,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#FFFFFF',
      borderBottomColor: '#E5E5EA',
      borderBottomWidth: 1,
      titleFontSize: 17,
      titleFontWeight: '600',
      titleColor: '#000000',
      subtitleFontSize: 13,
      subtitleColor: '#8E8E93',
      actionButtonSize: 24,
      actionButtonColor: '#007AFF',
    },
    list: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 8,
      paddingHorizontal: 0,
      separatorColor: '#E5E5EA',
      separatorHeight: 1,
      loadingColor: '#007AFF',
      loadingSize: 20,
    },
    typingIndicator: {
      height: 32,
      backgroundColor: '#F2F2F7',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      dotSize: 6,
      dotColor: '#8E8E93',
      animationDuration: 1000,
    },
    reactions: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginTop: 4,
      fontSize: 12,
      pickerBackgroundColor: '#FFFFFF',
      pickerBorderRadius: 16,
      pickerPadding: 8,
      pickerItemSize: 40,
    },
    replyPreview: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#007AFF',
      fontSize: 14,
      maxHeight: 60,
    },
    systemMessage: {
      backgroundColor: '#E5E5EA',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginVertical: 4,
      fontSize: 13,
      textAlign: 'center',
      color: '#8E8E93',
    },
    mediaMessage: {
      borderRadius: 12,
      maxWidth: 200,
      maxHeight: 200,
      backgroundColor: '#F2F2F7',
      imageBorderRadius: 12,
      videoBorderRadius: 12,
      playButtonSize: 40,
      playButtonColor: 'rgba(0, 0, 0, 0.6)',
      fileIconSize: 24,
      fileNameFontSize: 14,
      fileSizeFontSize: 12,
    },
    pollMessage: {
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      questionFontSize: 16,
      questionFontWeight: '600',
      questionColor: '#000000',
      optionPadding: 12,
      optionBorderRadius: 8,
      optionBorderColor: '#E5E5EA',
      optionBorderWidth: 1,
      progressBarHeight: 4,
      progressBarColor: '#007AFF',
      progressBarBackgroundColor: '#E5E5EA',
      voteCountFontSize: 12,
      voteCountColor: '#8E8E93',
    },
    stickerMessage: {
      maxSize: 120,
      borderRadius: 8,
    },
    locationMessage: {
      width: 200,
      height: 120,
      borderRadius: 12,
      backgroundColor: '#F2F2F7',
      mapBorderRadius: 12,
      addressFontSize: 14,
      addressColor: '#000000',
      addressPadding: 8,
    },
    contactMessage: {
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      contactAvatarSize: 32,
      contactAvatarBorderRadius: 16,
      contactNameFontSize: 16,
      contactNameFontWeight: '600',
      contactNameColor: '#000000',
      contactPhoneFontSize: 14,
      contactPhoneColor: '#8E8E93',
    },
  },
  animations: {
    messageSlideIn: {
      duration: 300,
      easing: 'ease-out',
    },
    messageFadeIn: {
      duration: 200,
      easing: 'ease-in',
    },
    typingIndicator: {
      duration: 1000,
      easing: 'ease-in-out',
    },
    reactionBounce: {
      duration: 200,
      easing: 'ease-out',
    },
    bubbleScale: {
      duration: 150,
      easing: 'ease-out',
    },
  },
  features: {
    enableReactions: true,
    enableReplies: true,
    enableForwards: true,
    enablePolls: true,
    enableStickers: true,
    enableLocation: true,
    enableContacts: true,
    enableVoiceMessages: true,
    enableVideoMessages: true,
    enableFileSharing: true,
    enableTypingIndicator: true,
    enableReadReceipts: true,
    enableMessageSearch: true,
    enableMessageThreading: true,
    enableMessagePinning: true,
    enableMessageEditing: true,
    enableMessageDeletion: true,
    enableMessageTranslation: true,
    enableMessageEncryption: false,
  },
  behavior: {
    autoScrollToBottom: true,
    showTypingIndicator: true,
    showReadReceipts: true,
    showOnlineStatus: true,
    showMessageTimestamps: true,
    showMessageStatus: true,
    enableMessageGrouping: true,
    enableMessageBatching: true,
    maxMessageLength: 2000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxAudioSize: 10 * 1024 * 1024, // 10MB
    typingIndicatorDelay: 1000,
    messageRetryAttempts: 3,
    messageRetryDelay: 1000,
  },
};

export const ChatThemeProvider: React.FC<ChatThemeProviderProps> = ({
  theme: customTheme,
  mode = 'auto',
  children,
}) => {
  const [currentMode, setCurrentMode] = React.useState<
    'light' | 'dark' | 'auto'
  >(mode);
  const [theme, setTheme] = React.useState<ChatThemeConfig>(() => {
    const baseTheme = currentMode === 'dark' ? darkTheme : lightTheme;
    return {
      ...defaultChatTheme,
      ...baseTheme,
      ...customTheme,
    };
  });

  const toggleMode = React.useCallback(() => {
    setCurrentMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      updateThemeForMode(newMode);
      return newMode;
    });
  }, []);

  const setMode = React.useCallback((newMode: 'light' | 'dark' | 'auto') => {
    setCurrentMode(newMode);
    if (newMode !== 'auto') {
      updateThemeForMode(newMode);
    }
  }, []);

  const updateThemeForMode = React.useCallback((newMode: 'light' | 'dark') => {
    const baseTheme = newMode === 'dark' ? darkTheme : lightTheme;
    setTheme((prev) => ({
      ...prev,
      ...baseTheme,
    }));
  }, []);

  const updateTheme = React.useCallback((updates: Partial<ChatThemeConfig>) => {
    setTheme((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetTheme = React.useCallback(() => {
    const baseTheme = currentMode === 'dark' ? darkTheme : lightTheme;
    setTheme({
      ...defaultChatTheme,
      ...baseTheme,
      ...customTheme,
    });
  }, [currentMode, customTheme]);

  const contextValue = useMemo<ChatThemeContextValue>(
    () => ({
      theme,
      mode: currentMode,
      toggleMode,
      setMode,
      updateTheme,
      resetTheme,
    }),
    [theme, currentMode, toggleMode, setMode, updateTheme, resetTheme]
  );

  return (
    <ChatThemeContext.Provider value={contextValue}>
      {children}
    </ChatThemeContext.Provider>
  );
};

export const useChatTheme = () => {
  const context = useContext(ChatThemeContext);
  if (!context) {
    throw new Error('useChatTheme must be used within ChatThemeProvider');
  }
  return context;
};

// Hook for accessing theme values with type safety
export const useChatThemeValue = () => {
  const { theme } = useChatTheme();
  return theme;
};

// Hook for theme customization
export const useChatThemeCustomization = () => {
  const { updateTheme, resetTheme } = useChatTheme();
  return { updateTheme, resetTheme };
};
