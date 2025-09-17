import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { ChatListProps, Message } from '../types';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import EmptyState from './EmptyState';
// import ErrorState from './ErrorState';
import { useMessageRegistry } from './messages/registry';

const ChatList: React.FC<ChatListProps> = ({
  messages,
  currentUser,
  onSendMessage,
  onMessagePress,
  onMessageLongPress,
  onReactionPress,
  renderMessage,
  renderInput,
  showAvatar = true,
  showTimestamp = true,
  showReactions = true,
  enableReplies = false,
  placeholder = 'Type a message...',
  maxInputLength = 1000,
  loading = false,
  emptyStateText = 'No messages yet',
  // errorStateText = 'Something went wrong',
  onRefresh,
  onLoadMore,
  hasMore = false,
  style,
  messageStyle,
  inputStyle,
  avatarStyle,
  timestampStyle,
}) => {
  const { get: getRenderer } =
    useMessageRegistry?.() || ({ get: undefined } as any);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      // 1) Registry renderer by type
      const registryRenderer = getRenderer?.(item.type);
      if (registryRenderer) {
        return registryRenderer(item);
      }

      // 2) renderMessage prop fallback
      if (renderMessage) {
        return renderMessage(item);
      }

      // 3) default renderer
      return (
        <MessageItem
          message={item}
          currentUser={currentUser}
          showAvatar={showAvatar}
          showTimestamp={showTimestamp}
          showReactions={showReactions}
          enableReplies={enableReplies}
          onPress={onMessagePress}
          onLongPress={onMessageLongPress}
          onReactionPress={onReactionPress}
          style={messageStyle}
          avatarStyle={avatarStyle}
          timestampStyle={timestampStyle}
        />
      );
    },
    [
      getRenderer,
      renderMessage,
      currentUser,
      showAvatar,
      showTimestamp,
      showReactions,
      enableReplies,
      onMessagePress,
      onMessageLongPress,
      onReactionPress,
      messageStyle,
      avatarStyle,
      timestampStyle,
    ]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const getItemType = useCallback((item: Message) => {
    return item.type || 'text';
  }, []);

  const renderEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    return <EmptyState text={emptyStateText} />;
  }, [loading, emptyStateText]);

  const renderFooter = useCallback(() => {
    if (loading && messages.length > 0) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    return null;
  }, [loading, messages.length]);

  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl
          refreshing={loading && messages.length === 0}
          onRefresh={onRefresh}
          tintColor="#007AFF"
        />
      ) : undefined,
    [onRefresh, loading, messages.length]
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && onLoadMore && !loading) {
      onLoadMore();
    }
  }, [hasMore, onLoadMore, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <View style={[styles.container, style]}>
        {renderEmptyComponent()}
        {renderInput ? (
          renderInput()
        ) : (
          <ChatInput
            onSendMessage={onSendMessage}
            placeholder={placeholder}
            maxLength={maxInputLength}
            style={inputStyle}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlashList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        refreshControl={refreshControl}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        maintainVisibleContentPosition={{
          autoscrollToBottomThreshold: 0.2,
          startRenderingFromBottom: true,
        }}
      />

      {renderInput ? (
        renderInput()
      ) : (
        <ChatInput
          onSendMessage={onSendMessage}
          placeholder={placeholder}
          maxLength={maxInputLength}
          style={inputStyle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default ChatList;
