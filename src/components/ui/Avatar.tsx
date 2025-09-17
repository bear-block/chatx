import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import type { User } from '../../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  size = 'md',
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  const sizeValue = theme.chat.avatar.size[size];
  const borderRadius = theme.chat.avatar.borderRadius;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = () => (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: borderRadius,
          backgroundColor: theme.colors.primary,
        },
        style,
      ]}
    >
      {user.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          style={[
            styles.image,
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius: borderRadius,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize: sizeValue * 0.4,
              color: theme.colors.text.inverse,
            },
          ]}
        >
          {getInitials(user.name)}
        </Text>
      )}

      {user.isOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: theme.colors.status.online,
              borderColor: theme.colors.surface,
              width: sizeValue * 0.25,
              height: sizeValue * 0.25,
              borderRadius: (sizeValue * 0.25) / 2,
              borderWidth: 2,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderAvatar()}
      </TouchableOpacity>
    );
  }

  return renderAvatar();
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
