import React from 'react';
import type { Message } from '../../types';
import { TextMessage } from './TextMessage';
import { ImageMessage } from './ImageMessage';
import { VideoMessage } from './VideoMessage';
import { AudioMessage } from './AudioMessage';
import { FileMessage } from './FileMessage';
import { GifMessage } from './GifMessage';
import { MessageBubble, BubbleVariant } from '../ui/MessageBubble';
import {
  ReactionsDecorator,
  ReplyPreviewDecorator,
  StatusDecorator,
  PinIndicatorDecorator,
} from './MessageDecorators';

export interface MessageFactoryConfig {
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showReactions?: boolean;
  enableReplies?: boolean;
  onPress?: (message: Message) => void;
  onLongPress?: (message: Message) => void;
  onReactionPress?: (messageId: string, emoji: string) => void;
  onReplyPress?: (messageId: string) => void;
  style?: any;
}

export interface MessageFactoryProps extends MessageFactoryConfig {
  message: Message;
  currentUserId: string;
}

/**
 * Message Factory - Creates message components with consistent decorators
 * This provides a clean API for creating messages with all common features
 */
export const MessageFactory: React.FC<MessageFactoryProps> = ({
  message,
  currentUserId,
  showAvatar = true,
  showTimestamp = true,
  showReactions = true,
  enableReplies = false,
  onPress,
  onLongPress,
  onReactionPress,
  onReplyPress,
  style,
}) => {
  const isCurrentUser = message.user.id === currentUserId;

  // Build decorators array
  const decorators = [
    // Reply preview at top
    ...(message.replyTo && enableReplies
      ? [
          {
            position: 'top' as const,
            component: (
              <ReplyPreviewDecorator
                replyTo={message.replyTo}
                replyMessage={message.replyMessage}
                onReplyPress={onReplyPress}
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

    // Status on right (only for current user)
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
    ...(showReactions && message.reactions && message.reactions.length > 0
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

  // Render based on message type
  switch (message.type) {
    case 'text':
      return (
        <TextMessage
          message={message}
          currentUserId={currentUserId}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          onPress={onPress}
          onLongPress={onLongPress}
          onReactionPress={onReactionPress}
          style={style}
        />
      );

    case 'image':
      return (
        <ImageMessage
          message={message}
          currentUserId={currentUserId}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          onPress={onPress}
          onLongPress={onLongPress}
          onReactionPress={onReactionPress}
          onImagePress={(media, index) =>
            console.log('Image pressed:', media.id, index)
          }
          style={style}
        />
      );

    case 'video':
      return (
        <VideoMessage
          message={message}
          currentUserId={currentUserId}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          onPress={onPress}
          onLongPress={onLongPress}
          onReactionPress={onReactionPress}
          onVideoPress={(media) => console.log('Video pressed:', media.id)}
          style={style}
        />
      );

    case 'audio':
      return (
        <AudioMessage
          message={message}
          currentUserId={currentUserId}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          onPress={onPress}
          onLongPress={onLongPress}
          onReactionPress={onReactionPress}
          onPlay={(media) => console.log('Audio play:', media.id)}
          onPause={(media) => console.log('Audio pause:', media.id)}
          style={style}
        />
      );

    case 'file':
      return (
        <FileMessage
          message={message}
          currentUserId={currentUserId}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          onPress={onPress}
          onLongPress={onLongPress}
          onReactionPress={onReactionPress}
          onFilePress={(media) => console.log('File pressed:', media.id)}
          onDownload={(media) => console.log('File download:', media.id)}
          style={style}
        />
      );

    case 'system':
      return (
        <MessageBubble
          isCurrentUser={false}
          variant="system"
          decorators={decorators}
          style={style}
        >
          <TextMessage
            message={message}
            currentUserId={currentUserId}
            showAvatar={false}
            showTimestamp={showTimestamp}
            onPress={onPress}
            onLongPress={onLongPress}
            onReactionPress={onReactionPress}
          />
        </MessageBubble>
      );

    default:
      // Check if it's a GIF message
      if (
        message.customData?.gif ||
        message.media?.some(
          (media) =>
            media.mimeType === 'image/gif' ||
            media.filename?.toLowerCase().endsWith('.gif')
        )
      ) {
        return (
          <GifMessage
            message={message}
            currentUserId={currentUserId}
            showAvatar={showAvatar}
            showTimestamp={showTimestamp}
            onPress={onPress}
            onLongPress={onLongPress}
            onReactionPress={onReactionPress}
            onGifPress={(media) => console.log('GIF pressed:', media.id)}
            style={style}
          />
        );
      }

      // Fallback to text message
      return (
        <TextMessage
          message={message}
          currentUserId={currentUserId}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          onPress={onPress}
          onLongPress={onLongPress}
          onReactionPress={onReactionPress}
          style={style}
        />
      );
  }
};

/**
 * HOC for creating custom message components with factory features
 */
export const withMessageFactory = <P extends object>(
  Component: React.ComponentType<P & MessageFactoryProps>
) => {
  return React.forwardRef<any, P & MessageFactoryProps>((props, ref) => {
    return <Component {...props} ref={ref} />;
  });
};

/**
 * Render prop pattern for custom message rendering
 */
export interface MessageRenderProps {
  message: Message;
  currentUserId: string;
  isCurrentUser: boolean;
  bubbleVariant: BubbleVariant;
  decorators: Array<{
    position: 'top' | 'bottom' | 'left' | 'right';
    component: React.ReactNode;
  }>;
  config: MessageFactoryConfig;
}

export interface MessageRenderPropsComponentProps {
  message: Message;
  currentUserId: string;
  config?: MessageFactoryConfig;
  children: (props: MessageRenderProps) => React.ReactNode;
}

export const MessageRenderProps: React.FC<MessageRenderPropsComponentProps> = ({
  message,
  currentUserId,
  config = {},
  children,
}) => {
  const isCurrentUser = message.user.id === currentUserId;

  const getBubbleVariant = (): BubbleVariant => {
    if (message.isPinned) return 'pinned';
    if (message.type === 'system') return 'system';
    if (message.customData?.highlighted) return 'highlighted';
    return 'default';
  };

  const decorators = [
    ...(message.replyTo && config.enableReplies
      ? [
          {
            position: 'top' as const,
            component: (
              <ReplyPreviewDecorator
                replyTo={message.replyTo}
                replyMessage={message.replyMessage}
                onReplyPress={config.onReplyPress}
              />
            ),
          },
        ]
      : []),
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
    ...(config.showReactions &&
    message.reactions &&
    message.reactions.length > 0
      ? [
          {
            position: 'bottom' as const,
            component: (
              <ReactionsDecorator
                reactions={message.reactions}
                messageId={message.id}
                onReactionPress={config.onReactionPress}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {children({
        message,
        currentUserId,
        isCurrentUser,
        bubbleVariant: getBubbleVariant(),
        decorators,
        config,
      })}
    </>
  );
};
