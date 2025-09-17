import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useChatThemeValue } from '../../theme/chatThemeProvider';
import type { Message, MediaFile } from '../../types';
import { MessageBubble } from '../ui/MessageBubble';
import {
  ReactionsDecorator,
  ReplyPreviewDecorator,
  StatusDecorator,
  PinIndicatorDecorator,
} from './MessageDecorators';

const { width: screenWidth } = Dimensions.get('window');
const MAX_AUDIO_WIDTH = screenWidth * 0.7;

interface AudioMessageProps {
  message: Message;
  currentUserId: string;
  showTimestamp?: boolean;
  onReactionPress?: (messageId: string, emoji: string) => void;
  onAudioPress?: (media: MediaFile) => void;
  onPlay?: (media: MediaFile) => void;
  onPause?: (media: MediaFile) => void;
  style?: any;
}

export const AudioMessage: React.FC<AudioMessageProps> = ({
  message,
  currentUserId,
  showTimestamp = true,
  onReactionPress,
  onAudioPress,
  style,
}) => {
  const theme = useChatThemeValue();
  const isCurrentUser = message.user.id === currentUserId;
  const [isPlaying, setIsPlaying] = useState(false);
  const [_currentTime, _setCurrentTime] = useState(0);
  const [duration, _setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const audio = message.media?.find((media) => media.type === 'audio');

  const handlePlayPause = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    setIsPlaying(!isPlaying);

    // Simulate audio loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isPlaying, isLoading]);

  const handleAudioPress = useCallback(() => {
    onAudioPress?.(audio);
  }, [onAudioPress, audio]);

  if (!audio) return null;

  const formatTime = (_seconds: number) => {
    const mins = Math.floor(_seconds / 60);
    const secs = Math.floor(_seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (_bytes: number) => {
    if (_bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(_bytes) / Math.log(k));
    return parseFloat((_bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const decorators = [
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
  ];

  return (
    <MessageBubble
      isCurrentUser={isCurrentUser}
      variant={message.isPinned ? 'pinned' : 'default'}
      decorators={decorators}
      style={style}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.audioContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          onPress={handleAudioPress}
          activeOpacity={0.7}
        >
          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            <Text
              style={[styles.playIcon, { color: theme.colors.text.inverse }]}
            >
              {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>

          <View style={styles.audioInfo}>
            <Text
              style={[styles.audioTitle, { color: theme.colors.text.primary }]}
            >
              {audio.filename || 'Audio Message'}
            </Text>
            <Text
              style={[
                styles.audioDuration,
                { color: theme.colors.text.secondary },
              ]}
            >
              {formatTime(duration)}
            </Text>
            {audio.fileSize && (
              <Text
                style={[
                  styles.audioSize,
                  { color: theme.colors.text.disabled },
                ]}
              >
                {formatFileSize(audio.fileSize)}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {message.text && (
          <Text style={[styles.caption, { color: theme.colors.text.primary }]}>
            {message.text}
          </Text>
        )}

        {showTimestamp && (
          <Text
            style={[styles.timestamp, { color: theme.colors.text.secondary }]}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </MessageBubble>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_AUDIO_WIDTH,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playIcon: {
    fontSize: 16,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 14,
    marginBottom: 2,
  },
  audioSize: {
    fontSize: 12,
  },
  caption: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
