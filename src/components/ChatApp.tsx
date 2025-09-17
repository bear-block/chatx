import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
  ChatThemeProvider,
  useChatThemeValue,
} from '../theme/chatThemeProvider';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import { TypeSafeMessageRegistryProvider } from './messages/TypeSafeRegistry';
import { NotificationManager } from './notifications/NotificationManager';
import { ChatList } from './ChatList';
import { MessageSearch } from './search/MessageSearch';
import { TypingIndicator } from './indicators/TypingIndicator';
import { MessageActions } from './actions/MessageActions';
import { MediaViewer } from './media/MediaViewer';
import type { Message, User, Chat } from '../types';

interface ChatAppProps {
  currentUser: User;
  currentChat: Chat;
  messages: Message[];
  onSendMessage?: (text: string, options?: any) => Promise<void>;
  onEditMessage?: (messageId: string, newText: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onLoadMessages?: (chatId: string) => Promise<Message[]>;
  onLoadMoreMessages?: (
    chatId: string,
    lastMessageId?: string
  ) => Promise<Message[]>;
  onSearchMessages?: (query: string) => Promise<Message[]>;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction?: (messageId: string, emoji: string) => Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
  theme?: any;
  style?: any;
}

const ChatAppContent: React.FC<Omit<ChatAppProps, 'theme'>> = ({
  currentUser,
  currentChat,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onLoadMessages,
  onLoadMoreMessages,
  onSearchMessages,
  onAddReaction,
  onRemoveReaction,
  onTypingChange,
  style,
}) => {
  const theme = useChatThemeValue();
  const { state } = useChat();

  // UI State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  // Message handlers
  const handleSendMessage = useCallback(
    async (text: string, options?: any) => {
      try {
        await onSendMessage?.(text, options);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [onSendMessage]
  );

  const handleMessagePress = useCallback((_message: Message) => {
    // Handle media messages
    if (message.media && message.media.length > 0) {
      setSelectedMedia(message.media);
      setMediaIndex(0);
      setShowMediaViewer(true);
    }
  }, []);

  const handleMessageLongPress = useCallback((_message: Message) => {
    setSelectedMessage(message);
    setShowMessageActions(true);
  }, []);

  const handleReactionPress = useCallback(
    async (messageId: string, (_emoji: string) => {
      try {
        await onAddReaction?.(messageId, emoji);
      } catch (error) {
        console.error('Failed to add reaction:', error);
      }
    },
    [onAddReaction]
  );

  const handleSearch = useCallback(
    (_query: string) => {
      setSearchQuery(query);
      onSearchMessages?.(query);
    },
    [onSearchMessages]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const handleReply = useCallback((_message: Message) => {
    // Implement reply functionality
    console.log('Reply to message:', message.id);
  }, []);

  const handleForward = useCallback((_message: Message) => {
    // Implement forward functionality
    console.log('Forward message:', message.id);
  }, []);

  const handleEdit = useCallback(
    async (_message: Message) => {
      try {
        const newText = 'Edited message'; // In real app, show edit modal
        await onEditMessage?.(message.id, newText);
      } catch (error) {
        console.error('Failed to edit message:', error);
      }
    },
    [onEditMessage]
  );

  const handleDelete = useCallback(
    async (_message: Message) => {
      try {
        await onDeleteMessage?.(message.id);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    },
    [onDeleteMessage]
  );

  const handleCopy = useCallback((_message: Message) => {
    // Implement copy functionality
    console.log('Copy message:', message.text);
  }, []);

  const handlePin = useCallback((_message: Message) => {
    // Implement pin functionality
    console.log('Pin message:', message.id);
  }, []);

  const handleUnpin = useCallback((_message: Message) => {
    // Implement unpin functionality
    console.log('Unpin message:', message.id);
  }, []);

  const handleStar = useCallback((_message: Message) => {
    // Implement star functionality
    console.log('Star message:', message.id);
  }, []);

  const handleUnstar = useCallback((_message: Message) => {
    // Implement unstar functionality
    console.log('Unstar message:', message.id);
  }, []);

  const handleReport = useCallback((_message: Message) => {
    // Implement report functionality
    console.log('Report message:', message.id);
  }, []);

  const handleBlock = useCallback((_message: Message) => {
    // Implement block functionality
    console.log('Block user:', message.user.id);
  }, []);

  const handleMediaShare = useCallback(media: any) => {
    // Implement media share functionality
    console.log('Share media:', media.id);
  }, []);

  const handleMediaDownload = useCallback(media: any) => {
    // Implement media download functionality
    console.log('Download media:', media.id);
  }, []);

  const handleMediaDelete = useCallback(media: any) => {
    // Implement media delete functionality
    console.log('Delete media:', media.id);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      <StatusBar
        barStyle={
          theme.colors.background === '#000000'
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={theme.colors.background}
      />

      {/* Search Bar */}
      {isSearching && (
        <MessageSearch
          messages={messages}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          onMessagePress={handleMessagePress}
        />
      )}

      {/* Chat List */}
      <ChatList
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onMessagePress={handleMessagePress}
        onMessageLongPress={handleMessageLongPress}
        onReactionPress={handleReactionPress}
        onRefresh={() => onLoadMessages?.(currentChat.id)}
        onLoadMore={() => onLoadMoreMessages?.(currentChat.id)}
        hasMore={state.hasMore}
        loading={state.isLoading}
        showAvatar={theme.features.enableReactions}
        showTimestamp={theme.behavior.showMessageTimestamps}
        showReactions={theme.features.enableReactions}
        enableReplies={theme.features.enableReplies}
        placeholder="Type a message..."
        maxInputLength={theme.behavior.maxMessageLength}
        emptyStateText="No messages yet. Start a conversation!"
        errorStateText="Failed to load messages"
      />

      {/* Typing Indicator */}
      {theme.features.enableTypingIndicator && state.typingUsers.size > 0 && (
        <TypingIndicator
          users={Array.from(state.typingUsers)}
          isVisible={state.typingUsers.size > 0}
        />
      )}

      {/* Message Actions Modal */}
      <MessageActions
        visible={showMessageActions}
        message={selectedMessage}
        currentUserId={currentUser.id}
        onClose={() => setShowMessageActions(false)}
        onReply={handleReply}
        onForward={handleForward}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onPin={handlePin}
        onUnpin={handleUnpin}
        onStar={handleStar}
        onUnstar={handleUnstar}
        onReport={handleReport}
        onBlock={handleBlock}
      />

      {/* Media Viewer Modal */}
      <MediaViewer
        visible={showMediaViewer}
        media={selectedMedia}
        initialIndex={mediaIndex}
        onClose={() => setShowMediaViewer(false)}
        onShare={handleMediaShare}
        onDownload={handleMediaDownload}
        onDelete={handleMediaDelete}
      />
    </View>
  );
};

export const ChatApp: React.FC<ChatAppProps> = ({ theme, ...props }) => {
  return (
    <ChatThemeProvider theme={theme}>
      <ChatProvider
        initialUser={props.currentUser}
        initialChat={props.currentChat}
        onSendMessage={props.onSendMessage}
        onEditMessage={props.onEditMessage}
        onDeleteMessage={props.onDeleteMessage}
        onLoadMessages={props.onLoadMessages}
        onLoadMoreMessages={props.onLoadMoreMessages}
        onSearchMessages={props.onSearchMessages}
        onAddReaction={props.onAddReaction}
        onRemoveReaction={props.onRemoveReaction}
        onTypingChange={props.onTypingChange}
      >
        <TypeSafeMessageRegistryProvider>
          <NotificationManager>
            <ChatAppContent {...props} />
          </NotificationManager>
        </TypeSafeMessageRegistryProvider>
      </ChatProvider>
    </ChatThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
