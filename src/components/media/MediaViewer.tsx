import React, { useState, useCallback } from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useChatThemeValue } from '../../theme/chatThemeProvider';
import type { MediaFile } from '../../types';

interface MediaViewerProps {
  visible: boolean;
  media: MediaFile[];
  initialIndex?: number;
  onClose: () => void;
  onShare?: (media: MediaFile) => void;
  onDownload?: (media: MediaFile) => void;
  onDelete?: (media: MediaFile) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MediaViewer: React.FC<MediaViewerProps> = ({
  visible,
  media,
  initialIndex = 0,
  onClose,
  onShare,
  onDownload,
  onDelete,
}) => {
  const theme = useChatThemeValue();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [loading, setLoading] = useState(false);

  const currentMedia = media[currentIndex];

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, media.length]);

  const handleShare = useCallback(() => {
    if (currentMedia) {
      onShare?.(currentMedia);
    }
  }, [currentMedia, onShare]);

  const handleDownload = useCallback(() => {
    if (currentMedia) {
      onDownload?.(currentMedia);
    }
  }, [currentMedia, onDownload]);

  const handleDelete = useCallback(() => {
    if (currentMedia) {
      onDelete?.(currentMedia);
      if (currentIndex >= media.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  }, [currentMedia, onDelete, currentIndex, media.length]);

  const renderMedia = () => {
    if (!currentMedia) return null;

    switch (currentMedia.type) {
      case 'image':
        return (
          <Image
            source={{ uri: currentMedia.url }}
            style={[styles.media, { backgroundColor: theme.colors.surface }]}
            resizeMode="contain"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        );

      case 'video':
        return (
          <View
            style={[
              styles.media,
              styles.videoContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                styles.videoPlaceholder,
                { color: theme.colors.text.secondary },
              ]}
            >
              Video: {currentMedia.name}
            </Text>
            <Text
              style={[styles.videoInfo, { color: theme.colors.text.disabled }]}
            >
              Tap to play
            </Text>
          </View>
        );

      case 'audio':
        return (
          <View
            style={[
              styles.media,
              styles.audioContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.audioIcon, { color: theme.colors.primary }]}>
              🎵
            </Text>
            <Text
              style={[styles.audioName, { color: theme.colors.text.primary }]}
            >
              {currentMedia.name}
            </Text>
            <Text
              style={[styles.audioInfo, { color: theme.colors.text.secondary }]}
            >
              {currentMedia.size
                ? `${(currentMedia.size / 1024 / 1024).toFixed(1)} MB`
                : 'Audio file'}
            </Text>
          </View>
        );

      case 'file':
        return (
          <View
            style={[
              styles.media,
              styles.fileContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.fileIcon, { color: theme.colors.primary }]}>
              📄
            </Text>
            <Text
              style={[styles.fileName, { color: theme.colors.text.primary }]}
            >
              {currentMedia.name}
            </Text>
            <Text
              style={[styles.fileInfo, { color: theme.colors.text.secondary }]}
            >
              {currentMedia.size
                ? `${(currentMedia.size / 1024 / 1024).toFixed(1)} MB`
                : 'File'}
            </Text>
          </View>
        );

      default:
        return (
          <View
            style={[
              styles.media,
              styles.unknownContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                styles.unknownIcon,
                { color: theme.colors.text.secondary },
              ]}
            >
              ❓
            </Text>
            <Text
              style={[styles.unknownText, { color: theme.colors.text.primary }]}
            >
              Unsupported media type
            </Text>
          </View>
        );
    }
  };

  if (!visible || media.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]}>
        {/* Header */}
        <View
          style={[styles.header, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
        >
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.headerButtonText,
                { color: theme.colors.text.inverse },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.inverse }]}
          >
            {currentIndex + 1} of {media.length}
          </Text>

          <View style={styles.headerActions}>
            {onShare && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.headerButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  📤
                </Text>
              </TouchableOpacity>
            )}

            {onDownload && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDownload}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.headerButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  ⬇️
                </Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.headerButtonText,
                    { color: theme.colors.error },
                  ]}
                >
                  🗑️
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Media Content */}
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}

          {renderMedia()}
        </View>

        {/* Navigation */}
        {media.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.navButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  ‹
                </Text>
              </TouchableOpacity>
            )}

            {currentIndex < media.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.navButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  ›
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Thumbnail Strip */}
        {media.length > 1 && (
          <View
            style={[
              styles.thumbnailStrip,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContainer}
            >
              {media.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.thumbnail,
                    {
                      borderColor:
                        index === currentIndex
                          ? theme.colors.primary
                          : 'transparent',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setCurrentIndex(index)}
                  activeOpacity={0.7}
                >
                  {item.type === 'image' ? (
                    <Image
                      source={{ uri: item.url }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.thumbnailPlaceholder,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <Text
                        style={[
                          styles.thumbnailIcon,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        {item.type === 'video'
                          ? '🎥'
                          : item.type === 'audio'
                            ? '🎵'
                            : '📄'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44, // Account for status bar
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  videoInfo: {
    fontSize: 14,
  },
  audioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  audioName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  audioInfo: {
    fontSize: 14,
  },
  fileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  fileInfo: {
    fontSize: 14,
  },
  unknownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  unknownIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  unknownText: {
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  thumbnailStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailIcon: {
    fontSize: 20,
  },
});
