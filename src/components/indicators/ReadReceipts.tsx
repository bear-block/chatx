import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useChatThemeValue } from '../../theme/chatThemeProvider';

interface ReadReceiptProps {
  readBy: Array<{
    userId: string;
    userName: string;
    readAt: number;
    avatar?: string;
  }>;
  showAvatars?: boolean;
  maxAvatars?: number;
  style?: any;
}

export const ReadReceipts: React.FC<ReadReceiptProps> = ({
  readBy,
  showAvatars = true,
  maxAvatars = 3,
  style,
}) => {
  const theme = useChatThemeValue();

  if (!readBy || readBy.length === 0) return null;

  const formatReadTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getReadText = () => {
    if (readBy.length === 1) {
      return `Read by ${readBy[0].userName}`;
    } else if (readBy.length <= maxAvatars) {
      const names = readBy.map((user) => user.userName).join(', ');
      return `Read by ${names}`;
    } else {
      const visibleUsers = readBy.slice(0, maxAvatars);
      const names = visibleUsers.map((user) => user.userName).join(', ');
      const remaining = readBy.length - maxAvatars;
      return `Read by ${names} and ${remaining} others`;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showAvatars && (
        <View style={styles.avatarsContainer}>
          {readBy.slice(0, maxAvatars).map((user, index) => (
            <View
              key={user.userId}
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.surface,
                  borderWidth: 1,
                  marginLeft: index > 0 ? -8 : 0,
                  zIndex: maxAvatars - index,
                },
              ]}
            >
              {user.avatar ? (
                <Text style={styles.avatarText}>
                  {user.userName.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.avatarText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  {user.userName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          ))}
          {readBy.length > maxAvatars && (
            <View
              style={[
                styles.moreIndicator,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Text
                style={[
                  styles.moreText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                +{readBy.length - maxAvatars}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={[styles.readText, { color: theme.colors.text.secondary }]}>
          {getReadText()}
        </Text>
        <Text style={[styles.timeText, { color: theme.colors.text.disabled }]}>
          {formatReadTime(readBy[0].readAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  avatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 8,
    fontWeight: '600',
    color: 'white',
  },
  moreIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  moreText: {
    fontSize: 8,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
  },
  readText: {
    fontSize: 11,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10,
    marginTop: 1,
  },
});
