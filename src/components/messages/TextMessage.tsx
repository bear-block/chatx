import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { Message } from '../../types';
import { Avatar } from '../ui/Avatar';
import { formatTime } from '../../utils/date';
import { MessageBubble } from '../ui/MessageBubble';
import {
  ReactionsDecorator,
  ReplyPreviewDecorator,
  StatusDecorator,
  PinIndicatorDecorator,
} from './MessageDecorators';

interface TextMessageProps {
  message: Message;
  currentUserId: string;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onPress?: (message: Message) => void;
  onLongPress?: (message: Message) => void;
  onReactionPress?: (messageId: string, emoji: string) => void;
  style?: any;
}

export const TextMessage: React.FC<TextMessageProps> = ({
  message,
  currentUserId,
  showAvatar = true,
  showTimestamp = true,
  onPress,
  onLongPress,
  onReactionPress,
  style,
}) => {
  const { theme } = useTheme();
  const isCurrentUser = message.user.id === currentUserId;

  const handlePress = () => onPress?.(message);
  const handleLongPress = () => onLongPress?.(message);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
        style,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.messageContent}>
        {showAvatar && !isCurrentUser && (
          <Avatar user={message.user} size="sm" style={styles.avatar} />
        )}

        <View style={styles.messageBubble}>
          <MessageBubble
            isCurrentUser={isCurrentUser}
            variant={message.isPinned ? 'pinned' : 'default'}
            decorators={[
              // Reply preview at top
              ...(message.replyTo
                ? [
                    {
                      position: 'top' as const,
                      component: (
                        <ReplyPreviewDecorator
                          replyTo={message.replyTo}
                          replyMessage={message.replyMessage}
                          onReplyPress={(messageId) =>
                            console.log('Reply pressed:', messageId)
                          }
                        />
                      ),
                    },
                  ]
                : []),
              // Pin indicator on left
              ...(message.isPinned
                ? [
                    {
                      position: 'left' as const,
                      component: (
                        <PinIndicatorDecorator
                          isPinned={message.isPinned}
                          pinnedAt={message.pinnedAt}
                        />
                      ),
                    },
                  ]
                : []),
              // Status on right
              ...(isCurrentUser
                ? [
                    {
                      position: 'right' as const,
                      component: (
                        <StatusDecorator
                          status={message.status || 'sent'}
                          timestamp={message.timestamp}
                          isCurrentUser={isCurrentUser}
                        />
                      ),
                    },
                  ]
                : []),
              // Reactions at bottom
              ...(message.reactions && message.reactions.length > 0
                ? [
                    {
                      position: 'bottom' as const,
                      component: (
                        <ReactionsDecorator
                          reactions={message.reactions}
                          messageId={message.id}
                          onReactionPress={onReactionPress}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color: isCurrentUser
                    ? theme.colors.text.inverse
                    : theme.colors.text.primary,
                },
              ]}
            >
              {message.text}
            </Text>

            {showTimestamp && (
              <Text
                style={[
                  styles.timestamp,
                  {
                    color: isCurrentUser
                      ? theme.colors.text.inverse
                      : theme.colors.text.secondary,
                  },
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            )}
          </MessageBubble>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  avatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
