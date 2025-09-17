import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';

export type BubbleVariant =
  | 'default'
  | 'compact'
  | 'highlighted'
  | 'pinned'
  | 'system';

export interface BubbleDecorator {
  position: 'top' | 'bottom' | 'left' | 'right';
  component: React.ReactNode;
}

export interface MessageBubbleProps {
  isCurrentUser: boolean;
  variant?: BubbleVariant;
  showTail?: boolean;
  decorators?: BubbleDecorator[];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  isCurrentUser,
  variant = 'default',
  showTail = true,
  decorators = [],
  style,
  children,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
        };
      case 'highlighted':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      case 'pinned':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 18,
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.warning,
        };
      case 'system':
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: theme.colors.surfaceVariant,
        };
      default:
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 18,
        };
    }
  };

  const getTailStyles = () => {
    if (!showTail) return {};

    return isCurrentUser
      ? { borderBottomRightRadius: 4 }
      : { borderBottomLeftRadius: 4 };
  };

  const getBackgroundColor = () => {
    if (variant === 'system') {
      return theme.colors.surfaceVariant;
    }
    return isCurrentUser
      ? theme.colors.messageBubble.sent
      : theme.colors.messageBubble.received;
  };

  const renderDecorators = (position: BubbleDecorator['position']) => {
    return decorators
      .filter((decorator) => decorator.position === position)
      .map((decorator, index) => (
        <View key={index} style={styles.decorator}>
          {decorator.component}
        </View>
      ));
  };

  return (
    <View style={styles.container}>
      {/* Top decorators */}
      {renderDecorators('top')}

      {/* Left decorators */}
      <View style={styles.horizontalContainer}>
        {renderDecorators('left')}

        <View
          style={[
            styles.bubble,
            getVariantStyles(),
            getTailStyles(),
            {
              backgroundColor: getBackgroundColor(),
            },
            style,
          ]}
        >
          {children}
        </View>

        {/* Right decorators */}
        {renderDecorators('right')}
      </View>

      {/* Bottom decorators */}
      {renderDecorators('bottom')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '100%',
  },
  decorator: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
});
