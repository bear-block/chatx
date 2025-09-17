import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useChatThemeValue } from '../../theme/chatThemeProvider';

interface TypingIndicatorProps {
  users: string[];
  isVisible: boolean;
  style?: any;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users,
  isVisible,
  style,
}) => {
  const theme = useChatThemeValue();
  const animationRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animationRef, {
            toValue: 1,
            duration: theme.animations.typingIndicator.duration,
            useNativeDriver: true,
          }),
          Animated.timing(animationRef, {
            toValue: 0,
            duration: theme.animations.typingIndicator.duration,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isVisible, animationRef, theme.animations.typingIndicator.duration]);

  if (!isVisible || users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing...`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing...`;
    } else {
      return `${users.length} people are typing...`;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: theme.appearance.typingIndicator.backgroundColor,
            borderRadius: theme.appearance.typingIndicator.borderRadius,
            paddingHorizontal:
              theme.appearance.typingIndicator.paddingHorizontal,
            paddingVertical: theme.appearance.typingIndicator.paddingVertical,
            height: theme.appearance.typingIndicator.height,
          },
        ]}
      >
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: theme.appearance.typingIndicator.dotColor,
                  width: theme.appearance.typingIndicator.dotSize,
                  height: theme.appearance.typingIndicator.dotSize,
                  borderRadius: theme.appearance.typingIndicator.dotSize / 2,
                  opacity: animationRef.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  }),
                  transform: [
                    {
                      translateY: animationRef.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -4, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
          {getTypingText()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  dot: {
    marginHorizontal: 2,
  },
  text: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
