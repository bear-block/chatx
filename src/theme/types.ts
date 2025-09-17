export interface ChatTheme {
  colors: {
    // Primary colors
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;

    // Secondary colors
    secondary: string;
    secondaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;

    // Surface colors
    surface: string;
    surfaceVariant: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    onSurface: string;
    onSurfaceVariant: string;

    // Background colors
    background: string;
    onBackground: string;

    // Message bubble colors
    messageBubble: {
      sent: string;
      received: string;
      system: string;
    };

    // Text colors
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };

    // Status colors
    status: {
      online: string;
      offline: string;
      typing: string;
      delivered: string;
      read: string;
      error: string;
    };

    // Interactive colors
    interactive: {
      hover: string;
      pressed: string;
      focus: string;
      disabled: string;
    };

    // Border colors
    border: {
      light: string;
      medium: string;
      strong: string;
    };

    // Shadow colors
    shadow: {
      light: string;
      medium: string;
      strong: string;
    };
  };

  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };

  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    lineHeight: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };

  elevation: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };

  // Chat specific styles
  chat: {
    messageBubble: {
      maxWidth: number;
      paddingHorizontal: number;
      paddingVertical: number;
      borderRadius: number;
    };
    avatar: {
      size: {
        sm: number;
        md: number;
        lg: number;
      };
      borderRadius: number;
    };
    input: {
      height: number;
      borderRadius: number;
      paddingHorizontal: number;
      paddingVertical: number;
    };
    header: {
      height: number;
      paddingHorizontal: number;
      paddingVertical: number;
    };
  };
}

export interface ThemeContextType {
  theme: ChatTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ChatTheme) => void;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeProviderProps {
  theme?: ChatTheme;
  mode?: ThemeMode;
  children: React.ReactNode;
}
