import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import type { Message, Reaction } from '../../types';

export interface ReactionsDecoratorProps {
  reactions: Reaction[];
  onReactionPress?: (messageId: string, emoji: string) => void;
  messageId: string;
  style?: any;
}

export const ReactionsDecorator: React.FC<ReactionsDecoratorProps> = ({
  reactions,
  onReactionPress,
  messageId,
  style,
}) => {
  const { theme } = useTheme();

  if (!reactions || reactions.length === 0) return null;

  return (
    <View style={[styles.reactionsContainer, style]}>
      {reactions.map((reaction, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.reaction,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          onPress={() => onReactionPress?.(messageId, reaction.emoji)}
        >
          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
          <Text style={styles.reactionCount}>{reaction.count}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export interface ReplyPreviewDecoratorProps {
  replyTo?: string;
  replyMessage?: Message;
  onReplyPress?: (messageId: string) => void;
  style?: any;
}

export const ReplyPreviewDecorator: React.FC<ReplyPreviewDecoratorProps> = ({
  replyTo,
  replyMessage,
  onReplyPress,
  style,
}) => {
  const { theme } = useTheme();

  if (!replyTo) return null;

  return (
    <TouchableOpacity
      style={[styles.replyContainer, style]}
      onPress={() => onReplyPress?.(replyTo)}
    >
      <View
        style={[
          styles.replyIndicator,
          { borderLeftColor: theme.colors.primary },
        ]}
      />
      <View style={styles.replyContent}>
        <Text
          style={[styles.replyLabel, { color: theme.colors.text.secondary }]}
        >
          Replying to
        </Text>
        <Text
          style={[styles.replyText, { color: theme.colors.text.primary }]}
          numberOfLines={2}
        >
          {replyMessage?.text || 'Message not found'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export interface StatusDecoratorProps {
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: number;
  isCurrentUser: boolean;
  style?: any;
}

export const StatusDecorator: React.FC<StatusDecoratorProps> = ({
  status,
  isCurrentUser,
  style,
}) => {
  const { theme } = useTheme();

  if (!isCurrentUser) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      case 'failed':
        return '❌';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sending':
        return theme.colors.text.secondary;
      case 'sent':
        return theme.colors.text.secondary;
      case 'delivered':
        return theme.colors.text.secondary;
      case 'read':
        return theme.colors.primary;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <View style={[styles.statusContainer, style]}>
      <Text style={[styles.statusIcon, { color: getStatusColor() }]}>
        {getStatusIcon()}
      </Text>
    </View>
  );
};

export interface PinIndicatorDecoratorProps {
  isPinned: boolean;
  style?: any;
}

export const PinIndicatorDecorator: React.FC<PinIndicatorDecoratorProps> = ({
  isPinned,
  style,
}) => {
  const { theme } = useTheme();

  if (!isPinned) return null;

  return (
    <View style={[styles.pinContainer, style]}>
      <Text style={[styles.pinIcon, { color: theme.colors.warning }]}>📌</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'flex-start',
  },
  replyIndicator: {
    width: 2,
    marginRight: 8,
    minHeight: 20,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  statusContainer: {
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 12,
  },
  pinContainer: {
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    fontSize: 12,
  },
});
