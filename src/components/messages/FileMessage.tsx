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
const MAX_FILE_WIDTH = screenWidth * 0.7;

interface FileMessageProps {
  message: Message;
  currentUserId: string;
  showTimestamp?: boolean;
  onReactionPress?: (messageId: string, emoji: string) => void;
  onFilePress?: (media: MediaFile) => void;
  onDownload?: (media: MediaFile) => void;
  style?: any;
}

export const FileMessage: React.FC<FileMessageProps> = ({
  message,
  currentUserId,
  showTimestamp = true,
  onReactionPress,
  onFilePress,
  onDownload,
  style,
}) => {
  const theme = useChatThemeValue();
  const isCurrentUser = message.user.id === currentUserId;
  const [isDownloading, setIsDownloading] = useState(false);

  const file = message.media?.find((media) => media.type === 'file');
  if (!file) return null;

  const getFileIcon = (_mimeType: string) => {
    if (_mimeType.startsWith('image/')) return '🖼️';
    if (_mimeType.startsWith('video/')) return '🎥';
    if (_mimeType.startsWith('audio/')) return '🎵';
    if (_mimeType.includes('pdf')) return '📄';
    if (_mimeType.includes('word') || _mimeType.includes('document'))
      return '📝';
    if (_mimeType.includes('excel') || _mimeType.includes('spreadsheet'))
      return '📊';
    if (_mimeType.includes('powerpoint') || _mimeType.includes('presentation'))
      return '📽️';
    if (_mimeType.includes('zip') || _mimeType.includes('archive')) return '📦';
    if (_mimeType.includes('text/')) return '📄';
    return '📎';
  };

  const formatFileSize = (_bytes: number) => {
    if (_bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(_bytes) / Math.log(k));
    return parseFloat((_bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (_mimeType: string) => {
    const type = _mimeType.split('/')[0];
    switch (type) {
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'application':
        if (_mimeType.includes('pdf')) return 'PDF';
        if (_mimeType.includes('word')) return 'Word Document';
        if (_mimeType.includes('excel')) return 'Excel Spreadsheet';
        if (_mimeType.includes('powerpoint')) return 'PowerPoint';
        return 'Document';
      case 'text':
        return 'Text File';
      default:
        return 'File';
    }
  };

  const handleFilePress = useCallback(() => {
    onFilePress?.(file);
  }, [onFilePress, file]);

  const handleDownload = useCallback(async () => {
    if (isDownloading || !onDownload) return;

    try {
      setIsDownloading(true);
      await onDownload(file);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [file, onDownload, isDownloading]);

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
            styles.fileContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          onPress={handleFilePress}
          activeOpacity={0.7}
        >
          <View style={styles.fileIcon}>
            <Text style={styles.iconText}>
              {getFileIcon(file.mimeType || 'application/octet-stream')}
            </Text>
          </View>

          <View style={styles.fileInfo}>
            <Text
              style={[styles.fileName, { color: theme.colors.text.primary }]}
            >
              {file.filename || 'Unknown File'}
            </Text>
            <Text
              style={[styles.fileType, { color: theme.colors.text.secondary }]}
            >
              {getFileType(file.mimeType || 'application/octet-stream')}
            </Text>
            {file.fileSize && (
              <Text
                style={[styles.fileSize, { color: theme.colors.text.disabled }]}
              >
                {formatFileSize(file.fileSize)}
              </Text>
            )}
          </View>

          {onDownload && (
            <TouchableOpacity
              style={[
                styles.downloadButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleDownload}
              disabled={isDownloading}
            >
              <Text
                style={[
                  styles.downloadIcon,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {isDownloading ? '⏳' : '⬇️'}
              </Text>
            </TouchableOpacity>
          )}
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
    maxWidth: MAX_FILE_WIDTH,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileType: {
    fontSize: 14,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    fontSize: 14,
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
