import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import type { MessageItemProps } from '../types';
import { MessageBubble } from './ui/MessageBubble';

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  showAvatar = true,
  showTimestamp = true,
  showReactions = true,
  enableReplies = false,
  onPress,
  onLongPress,
  onReactionPress,
  style,
  avatarStyle,
  timestampStyle,
}) => {
  const isCurrentUser = message.user.id === currentUser.id;
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
        style,
      ]}
      onPress={() => onPress?.(message)}
      onLongPress={() => onLongPress?.(message)}
      activeOpacity={0.7}
    >
      <View style={styles.messageContent}>
        {showAvatar && !isCurrentUser && (
          <View style={[styles.avatarContainer, avatarStyle]}>
            {message.user.avatar ? (
              <Image
                source={{ uri: message.user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>
                  {message.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.messageBubble}>
          <MessageBubble isCurrentUser={isCurrentUser}>
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.otherUserText,
              ]}
            >
              {message.text}
            </Text>

            {showTimestamp && (
              <Text
                style={[
                  styles.timestamp,
                  isCurrentUser
                    ? styles.currentUserTimestamp
                    : styles.otherUserTimestamp,
                  timestampStyle,
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            )}
          </MessageBubble>

          {showReactions &&
            message.reactions &&
            message.reactions.length > 0 && (
              <View style={styles.reactionsContainer}>
                {message.reactions.map((reaction, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.reaction}
                    onPress={() =>
                      onReactionPress?.(message.id, reaction.emoji)
                    }
                  >
                    <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                    <Text style={styles.reactionCount}>{reaction.count}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          {enableReplies && message.replyTo && (
            <View style={styles.replyContainer}>
              <Text style={styles.replyText}>Replying to message</Text>
            </View>
          )}
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
  avatarContainer: {
    marginRight: 8,
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageBubble: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  currentUserTimestamp: {
    color: 'white',
    textAlign: 'right',
  },
  otherUserTimestamp: {
    color: '#8E8E93',
    textAlign: 'left',
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 10,
    marginLeft: 2,
    color: '#666',
  },
  replyContainer: {
    marginTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
  },
  replyText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default MessageItem;
