import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
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
const MAX_GIF_WIDTH = screenWidth * 0.7;
const MAX_GIF_HEIGHT = 300;

interface GifMessageProps {
  message: Message;
  currentUserId: string;
  showTimestamp?: boolean;
  onReactionPress?: (messageId: string, emoji: string) => void;
  onGifPress?: (media: MediaFile) => void;
  style?: any;
}

export const GifMessage: React.FC<GifMessageProps> = ({
  message,
  currentUserId,
  showTimestamp = true,
  onReactionPress,
  onGifPress,
  style,
}) => {
  const theme = useChatThemeValue();
  const isCurrentUser = message.user.id === currentUserId;
  const [isPlaying, setIsPlaying] = useState(true);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);

  // Check if message has GIF in customData or media
  const gifData = message.customData?.gif;
  const gifMedia = message.media?.find(
    (media) =>
      media.mimeType === 'image/gif' ||
      media.filename?.toLowerCase().endsWith('.gif')
  );

  const gifUrl = gifData?.url || gifMedia?.url;
  const gifTitle = gifData?.title || gifMedia?.filename || 'GIF';

  const handleGifPress = useCallback(() => {
    onGifPress?.(
      gifMedia || {
        id: message.id,
        type: 'image',
        url: gifUrl!,
        filename: gifTitle,
        mimeType: 'image/gif',
        size: 0,
        status: 'uploaded',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        timestamp: Date.now(),
      }
    );
  }, [gifUrl, gifTitle, gifMedia, message.id, onGifPress]);

  const handleGifLoad = useCallback(() => {
    setGifLoaded(true);
    setGifError(false);
  }, []);

  const handleGifError = useCallback(() => {
    setGifLoaded(false);
    setGifError(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const getGifDimensions = () => {
    const { width = 0, height = 0 } =
      gifData?.dimensions || gifMedia?.dimensions || {};

    if (width === 0 || height === 0) {
      return { width: MAX_GIF_WIDTH, height: 200 };
    }

    const aspectRatio = width / height;
    let gifWidth = MAX_GIF_WIDTH;
    let gifHeight = gifWidth / aspectRatio;

    if (gifHeight > MAX_GIF_HEIGHT) {
      gifHeight = MAX_GIF_HEIGHT;
      gifWidth = gifHeight * aspectRatio;
    }

    return { width: gifWidth, height: gifHeight };
  };

  const dimensions = getGifDimensions();

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
          style={[styles.gifContainer, dimensions]}
          onPress={handleGifPress}
          activeOpacity={0.9}
        >
          {/* GIF Image */}
          <View style={[styles.gifWrapper, dimensions]}>
            {!gifLoaded && !gifError && (
              <View style={[styles.loadingContainer, dimensions]}>
                <Text
                  style={[
                    styles.loadingText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Loading GIF...
                </Text>
              </View>
            )}

            {gifError ? (
              <View style={[styles.errorContainer, dimensions]}>
                <Text
                  style={[
                    styles.errorIcon,
                    { color: theme.colors.text.disabled },
                  ]}
                >
                  🎬
                </Text>
                <Text
                  style={[
                    styles.errorText,
                    { color: theme.colors.text.disabled },
                  ]}
                >
                  Failed to load GIF
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: gifUrl }}
                style={[styles.gifImage, dimensions]}
                resizeMode="cover"
                onLoad={handleGifLoad}
                onError={handleGifError}
              />
            )}

            {/* Play/Pause Overlay */}
            {gifLoaded && !gifError && (
              <TouchableOpacity
                style={[styles.playPauseOverlay, dimensions]}
                onPress={togglePlayPause}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.playPauseButton,
                    {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  ]}
                >
                  <Text style={styles.playPauseIcon}>
                    {isPlaying ? '⏸️' : '▶️'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* GIF Badge */}
            <View
              style={[
                styles.gifBadge,
                { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
              ]}
            >
              <Text
                style={[
                  styles.gifBadgeText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                GIF
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* GIF Title */}
        {gifTitle && gifTitle !== 'GIF' && (
          <Text
            style={[styles.gifTitle, { color: theme.colors.text.primary }]}
            numberOfLines={2}
          >
            {gifTitle}
          </Text>
        )}

        {/* Caption */}
        {message.text && (
          <Text style={[styles.caption, { color: theme.colors.text.primary }]}>
            {message.text}
          </Text>
        )}

        {/* Timestamp */}
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
    maxWidth: MAX_GIF_WIDTH,
  },
  gifContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  gifWrapper: {
    position: 'relative',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  playPauseIcon: {
    fontSize: 20,
    color: 'white',
  },
  gifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gifBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  gifTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
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
