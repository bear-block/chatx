import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Image,
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
const MAX_VIDEO_WIDTH = screenWidth * 0.7;
const MAX_VIDEO_HEIGHT = 200;

interface VideoMessageProps {
  message: Message;
  currentUserId: string;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onPress?: (message: Message) => void;
  onLongPress?: (message: Message) => void;
  onReactionPress?: (messageId: string, emoji: string) => void;
  onVideoPress?: (media: MediaFile) => void;
  style?: any;
}

export const VideoMessage: React.FC<VideoMessageProps> = ({
  message,
  currentUserId,
  showAvatar = true,
  showTimestamp = true,
  onPress,
  onLongPress,
  onReactionPress,
  onVideoPress,
  style,
}) => {
  const theme = useChatThemeValue();
  const isCurrentUser = message.user.id === currentUserId;
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const videos = message.media?.filter(media) => media.type === 'video') || [];

  if (videos.length === 0) return null;

  const video = videos[0]; // For now, show first video

  const handleVideoPress = useCallback(() => {
    onVideoPress?.(video);
  }, [video, onVideoPress]);

  const getVideoDimensions = (_media: MediaFile) => {
    const { width = 0, height = 0 } = media.dimensions || {};

    if (width === 0 || height === 0) {
      return { width: MAX_VIDEO_WIDTH, height: MAX_VIDEO_HEIGHT };
    }

    const aspectRatio = width / height;
    let videoWidth = MAX_VIDEO_WIDTH;
    let videoHeight = videoWidth / aspectRatio;

    if (videoHeight > MAX_VIDEO_HEIGHT) {
      videoHeight = MAX_VIDEO_HEIGHT;
      videoWidth = videoHeight * aspectRatio;
    }

    return { width: videoWidth, height: videoHeight };
  };

  const formatDuration = (_seconds: number) => {
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

  const dimensions = getVideoDimensions(video);

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
          style={[styles.videoContainer, dimensions]}
          onPress={handleVideoPress}
          activeOpacity={0.9}
        >
          {/* Thumbnail */}
          <View style={[styles.thumbnailContainer, dimensions]}>
            {video.thumbnailUrl ? (
              <Image
                source={{ uri: video.thumbnailUrl }}
                style={[styles.thumbnail, dimensions]}
                resizeMode="cover"
                onLoad={() => setThumbnailLoaded(true)}
              />
            ) : (
              <View style={[styles.placeholder, dimensions]}>
                <Text
                  style={[
                    styles.placeholderIcon,
                    { color: theme.colors.text.disabled },
                  ]}
                >
                  🎥
                </Text>
              </View>
            )}

            {/* Play button overlay */}
            <View style={[styles.playButtonOverlay, dimensions]}>
              <View
                style={[
                  styles.playButton,
                  {
                    backgroundColor:
                      theme.appearance.mediaMessage.playButtonColor,
                  },
                ]}
              >
                <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
              </View>
            </View>

            {/* Duration */}
            {video.duration && (
              <View
                style={[
                  styles.durationBadge,
                  { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                ]}
              >
                <Text
                  style={[
                    styles.durationText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  {formatDuration(video.duration)}
                </Text>
              </View>
            )}

            {/* Upload progress */}
            {video.status === 'uploading' && (
              <View style={[styles.uploadOverlay, dimensions]}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${video.progress || 0}%`,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.progressText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  {video.progress || 0}%
                </Text>
              </View>
            )}

            {/* Error state */}
            {video.status === 'failed' && (
              <View style={[styles.errorOverlay, dimensions]}>
                <Text style={[styles.errorIcon, { color: theme.colors.error }]}>
                  ⚠️
                </Text>
                <Text
                  style={[
                    styles.errorText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  Failed to load
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Video info */}
        <View style={styles.videoInfo}>
          <Text
            style={[styles.videoTitle, { color: theme.colors.text.primary }]}
          >
            {video.filename}
          </Text>
          <Text
            style={[
              styles.videoDetails,
              { color: theme.colors.text.secondary },
            ]}
          >
            {formatFileSize(video.size)} •{' '}
            {video.duration ? formatDuration(video.duration) : 'Video'}
          </Text>
        </View>

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
    maxWidth: MAX_VIDEO_WIDTH,
  },
  videoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  playIcon: {
    fontSize: 24,
    color: 'white',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  progressBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    marginTop: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  videoDetails: {
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
