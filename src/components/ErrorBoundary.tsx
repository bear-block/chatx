import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useChatThemeValue } from '../theme/chatThemeProvider';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleRetry);
      }

      return (
        <DefaultErrorFallback
          error={this.state.error!}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  onRetry: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  onRetry,
}) => {
  const theme = useChatThemeValue();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={[styles.errorIcon, { color: theme.colors.error }]}>
          ⚠️
        </Text>
        <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>
          Something went wrong
        </Text>
        <Text
          style={[styles.errorMessage, { color: theme.colors.text.secondary }]}
        >
          {error.message || 'An unexpected error occurred'}
        </Text>

        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text
              style={[styles.debugTitle, { color: theme.colors.text.disabled }]}
            >
              Debug Info:
            </Text>
            <Text
              style={[styles.debugText, { color: theme.colors.text.disabled }]}
            >
              {error.stack}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.retryText, { color: theme.colors.text.inverse }]}
          >
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 300,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  debugContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    maxHeight: 200,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

// Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    if (__DEV__) {
      console.error(`Error in ${context || 'component'}:`, error);
    }

    // In production, you might want to send this to a crash reporting service
    // crashlytics().recordError(error);
  };

  return { handleError };
};
