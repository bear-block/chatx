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
const MAX_IMAGE_WIDTH = screenWidth * 0.7;
const MAX_IMAGE_HEIGHT = 300;

interface ImageMessageProps {
  message: Message;
  currentUserId: string;
  showTimestamp?: boolean;
  onReactionPress?: (messageId: string, emoji: string) => void;
  onImagePress?: (media: MediaFile, index: number) => void;
  style?: any;
}

export const ImageMessage: React.FC<ImageMessageProps> = ({
  message,
  currentUserId,
  showTimestamp = true,
  onReactionPress,
  onImagePress,
  style,
}) => {
  const theme = useChatThemeValue();
  const isCurrentUser = message.user.id === currentUserId;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const images = message.media?.filter((media) => media.type === 'image') || [];

  const handleImagePress = useCallback(
    (media: MediaFile, index: number) => {
      onImagePress?.(media, index);
    },
    [onImagePress]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const getImageDimensions = (media: MediaFile) => {
    const { width = 0, height = 0 } = media.dimensions || {};

    if (width === 0 || height === 0) {
      return { width: MAX_IMAGE_WIDTH, height: 200 };
    }

    const aspectRatio = width / height;
    let imageWidth = MAX_IMAGE_WIDTH;
    let imageHeight = imageWidth / aspectRatio;

    if (imageHeight > MAX_IMAGE_HEIGHT) {
      imageHeight = MAX_IMAGE_HEIGHT;
      imageWidth = imageHeight * aspectRatio;
    }

    return { width: imageWidth, height: imageHeight };
  };

  const renderSingleImage = (media: MediaFile) => {
    const dimensions = getImageDimensions(media);

    return (
      <TouchableOpacity
        style={[styles.imageContainer, dimensions]}
        onPress={() => handleImagePress(media, 0)}
        activeOpacity={0.9}
      >
        {imageLoading && (
          <View style={[styles.loadingContainer, dimensions]}>
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Loading...
            </Text>
          </View>
        )}

        {imageError ? (
          <View style={[styles.errorContainer, dimensions]}>
            <Text
              style={[styles.errorIcon, { color: theme.colors.text.disabled }]}
            >
              🖼️
            </Text>
            <Text
              style={[styles.errorText, { color: theme.colors.text.disabled }]}
            >
              Failed to load image
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: media.url }}
            style={[styles.image, dimensions]}
            resizeMode="cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {media.status === 'uploading' && (
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
                    width: `${media.progress || 0}%`,
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
              {media.progress || 0}%
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderMultipleImages = () => {
    const displayImages = images.slice(0, 4);
    const remainingCount = images.length - 4;

    return (
      <View style={styles.multipleImagesContainer}>
        <View style={styles.imageGrid}>
          {displayImages.map((media, index) => {
            const isLast = index === displayImages.length - 1;
            const showOverlay = isLast && remainingCount > 0;

            return (
              <TouchableOpacity
                key={media.id}
                style={[
                  styles.gridImageContainer,
                  {
                    width: images.length === 2 ? '48%' : '32%',
                    height: images.length === 2 ? 120 : 80,
                  },
                ]}
                onPress={() => handleImagePress(media, index)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: media.thumbnailUrl || media.url }}
                  style={[
                    styles.gridImage,
                    {
                      borderRadius:
                        theme.appearance.mediaMessage.imageBorderRadius,
                    },
                  ]}
                  resizeMode="cover"
                />

                {showOverlay && (
                  <View
                    style={[
                      styles.overlay,
                      { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.overlayText,
                        { color: theme.colors.text.inverse },
                      ]}
                    >
                      +{remainingCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {images.length > 1 && (
          <Text
            style={[styles.imageCount, { color: theme.colors.text.secondary }]}
          >
            {images.length} photos
          </Text>
        )}
      </View>
    );
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
        {images.length === 1
          ? renderSingleImage(images[0])
          : renderMultipleImages()}

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
    maxWidth: MAX_IMAGE_WIDTH,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
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
  multipleImagesContainer: {
    maxWidth: MAX_IMAGE_WIDTH,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImageContainer: {
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageCount: {
    fontSize: 12,
    marginTop: 4,
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
