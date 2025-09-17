import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import type { Message, User, Chat } from '../types';

// Chat state interface
export interface ChatState {
  // Current chat
  currentChat: Chat | null;

  // Messages
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;

  // Users
  currentUser: User | null;
  onlineUsers: Set<string>;
  typingUsers: Set<string>;

  // UI state
  isTyping: boolean;
  isConnected: boolean;
  isSearching: boolean;
  searchQuery: string;
  selectedMessages: Set<string>;

  // Message actions
  replyingTo: Message | null;
  forwardingMessages: Message[];
  editingMessage: Message | null;

  // Settings
  showTimestamps: boolean;
  showReadReceipts: boolean;
  showOnlineStatus: boolean;
  enableNotifications: boolean;
  enableSounds: boolean;
  enableVibrations: boolean;
}

// Chat actions
export type ChatAction =
  | { type: 'SET_CURRENT_CHAT'; payload: Chat | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_MORE'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_ONLINE_USERS'; payload: Set<string> }
  | { type: 'ADD_ONLINE_USER'; payload: string }
  | { type: 'REMOVE_ONLINE_USER'; payload: string }
  | { type: 'SET_TYPING_USERS'; payload: Set<string> }
  | { type: 'ADD_TYPING_USER'; payload: string }
  | { type: 'REMOVE_TYPING_USER'; payload: string }
  | { type: 'SET_IS_TYPING'; payload: boolean }
  | { type: 'SET_IS_CONNECTED'; payload: boolean }
  | { type: 'SET_IS_SEARCHING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SELECT_MESSAGE'; payload: string }
  | { type: 'DESELECT_MESSAGE'; payload: string }
  | { type: 'CLEAR_SELECTED_MESSAGES' }
  | { type: 'SET_REPLYING_TO'; payload: Message | null }
  | { type: 'SET_FORWARDING_MESSAGES'; payload: Message[] }
  | { type: 'SET_EDITING_MESSAGE'; payload: Message | null }
  | { type: 'SET_SHOW_TIMESTAMPS'; payload: boolean }
  | { type: 'SET_SHOW_READ_RECEIPTS'; payload: boolean }
  | { type: 'SET_SHOW_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_ENABLE_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_ENABLE_SOUNDS'; payload: boolean }
  | { type: 'SET_ENABLE_VIBRATIONS'; payload: boolean }
  | { type: 'RESET_CHAT' };

// Initial state
const initialState: ChatState = {
  currentChat: null,
  messages: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: false,
  error: null,
  currentUser: null,
  onlineUsers: new Set(),
  typingUsers: new Set(),
  isTyping: false,
  isConnected: false,
  isSearching: false,
  searchQuery: '',
  selectedMessages: new Set(),
  replyingTo: null,
  forwardingMessages: [],
  editingMessage: null,
  showTimestamps: true,
  showReadReceipts: true,
  showOnlineStatus: true,
  enableNotifications: true,
  enableSounds: true,
  enableVibrations: true,
};

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };

    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };

    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? action.payload : msg
        ),
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };

    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };

    case 'ADD_ONLINE_USER':
      return {
        ...state,
        onlineUsers: new Set([...state.onlineUsers, action.payload]),
      };

    case 'REMOVE_ONLINE_USER':
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.delete(action.payload);
      return { ...state, onlineUsers: newOnlineUsers };

    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload };

    case 'ADD_TYPING_USER':
      return {
        ...state,
        typingUsers: new Set([...state.typingUsers, action.payload]),
      };

    case 'REMOVE_TYPING_USER':
      const newTypingUsers = new Set(state.typingUsers);
      newTypingUsers.delete(action.payload);
      return { ...state, typingUsers: newTypingUsers };

    case 'SET_IS_TYPING':
      return { ...state, isTyping: action.payload };

    case 'SET_IS_CONNECTED':
      return { ...state, isConnected: action.payload };

    case 'SET_IS_SEARCHING':
      return { ...state, isSearching: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SELECT_MESSAGE':
      return {
        ...state,
        selectedMessages: new Set([...state.selectedMessages, action.payload]),
      };

    case 'DESELECT_MESSAGE':
      const newSelectedMessages = new Set(state.selectedMessages);
      newSelectedMessages.delete(action.payload);
      return { ...state, selectedMessages: newSelectedMessages };

    case 'CLEAR_SELECTED_MESSAGES':
      return { ...state, selectedMessages: new Set() };

    case 'SET_REPLYING_TO':
      return { ...state, replyingTo: action.payload };

    case 'SET_FORWARDING_MESSAGES':
      return { ...state, forwardingMessages: action.payload };

    case 'SET_EDITING_MESSAGE':
      return { ...state, editingMessage: action.payload };

    case 'SET_SHOW_TIMESTAMPS':
      return { ...state, showTimestamps: action.payload };

    case 'SET_SHOW_READ_RECEIPTS':
      return { ...state, showReadReceipts: action.payload };

    case 'SET_SHOW_ONLINE_STATUS':
      return { ...state, showOnlineStatus: action.payload };

    case 'SET_ENABLE_NOTIFICATIONS':
      return { ...state, enableNotifications: action.payload };

    case 'SET_ENABLE_SOUNDS':
      return { ...state, enableSounds: action.payload };

    case 'SET_ENABLE_VIBRATIONS':
      return { ...state, enableVibrations: action.payload };

    case 'RESET_CHAT':
      return initialState;

    default:
      return state;
  }
}

// Context
interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;

  // Message actions
  sendMessage: (text: string, options?: any) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;
  replyToMessage: (message: Message) => void;
  forwardMessage: (message: Message) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;

  // Chat actions
  loadMessages: (chatId: string) => void;
  loadMoreMessages: () => void;
  searchMessages: (query: string) => void;
  clearSearch: () => void;

  // User actions
  setTyping: (isTyping: boolean) => void;
  selectMessage: (messageId: string) => void;
  deselectMessage: (messageId: string) => void;
  clearSelection: () => void;

  // Settings actions
  toggleTimestamps: () => void;
  toggleReadReceipts: () => void;
  toggleOnlineStatus: () => void;
  toggleNotifications: () => void;
  toggleSounds: () => void;
  toggleVibrations: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

// Provider props
interface ChatProviderProps {
  children: ReactNode;
  initialUser?: User;
  initialChat?: Chat;
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
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialUser,
  initialChat,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onLoadMessages,
  onLoadMoreMessages,
  onSearchMessages,
  onAddReaction,
  onRemoveReaction,
  onTypingChange,
}) => {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    currentUser: initialUser || null,
    currentChat: initialChat || null,
  });

  // Message actions
  const sendMessage = useCallback(
    async (text: string, options?: any) => {
      if (!state.currentUser || !state.currentChat) return;

      const message: Message = {
        id: Date.now().toString(),
        text,
        user: state.currentUser,
        timestamp: Date.now(),
        type: 'text',
        chatId: state.currentChat.id,
        status: 'sending',
        isRead: false,
        ...options,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: message });

      try {
        await onSendMessage?.(text, options);
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: { ...message, status: 'sent' },
        });
      } catch (error) {
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: { ...message, status: 'failed' },
        });
      }
    },
    [state.currentUser, state.currentChat, onSendMessage]
  );

  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      try {
        await onEditMessage?.(messageId, newText);
        const updatedMessage = state.messages.find((m) => m.id === messageId);
        if (updatedMessage) {
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
              ...updatedMessage,
              text: newText,
              isEdited: true,
              editedAt: Date.now(),
            },
          });
        }
      } catch (error) {
        console.error('Failed to edit message:', error);
      }
    },
    [state.messages, onEditMessage]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        await onDeleteMessage?.(messageId);
        dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    },
    [onDeleteMessage]
  );

  const replyToMessage = useCallback((message: Message) => {
    dispatch({ type: 'SET_REPLYING_TO', payload: message });
  }, []);

  const forwardMessage = useCallback((message: Message) => {
    dispatch({ type: 'SET_FORWARDING_MESSAGES', payload: [message] });
  }, []);

  const addReaction = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        await onAddReaction?.(messageId, emoji);
        // Update message with new reaction
        const message = state.messages.find((m) => m.id === messageId);
        if (message) {
          const reactions = message.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            existingReaction.count += 1;
            existingReaction.users.push(state.currentUser?.id || '');
          } else {
            reactions.push({
              emoji,
              count: 1,
              users: [state.currentUser?.id || ''],
            });
          }
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: { ...message, reactions },
          });
        }
      } catch (error) {
        console.error('Failed to add reaction:', error);
      }
    },
    [state.messages, state.currentUser, onAddReaction]
  );

  const removeReaction = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        await onRemoveReaction?.(messageId, emoji);
        // Update message to remove reaction
        const message = state.messages.find((m) => m.id === messageId);
        if (message) {
          const reactions = message.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            existingReaction.count -= 1;
            existingReaction.users = existingReaction.users.filter(
              (id) => id !== state.currentUser?.id
            );
            if (existingReaction.count <= 0) {
              message.reactions = reactions.filter((r) => r.emoji !== emoji);
            }
          }
          dispatch({ type: 'UPDATE_MESSAGE', payload: message });
        }
      } catch (error) {
        console.error('Failed to remove reaction:', error);
      }
    },
    [state.messages, state.currentUser, onRemoveReaction]
  );

  // Chat actions
  const loadMessages = useCallback(
    async (chatId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const messages = (await onLoadMessages?.(chatId)) || [];
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [onLoadMessages]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!state.currentChat || state.isLoadingMore || !state.hasMore) return;

    dispatch({ type: 'SET_LOADING_MORE', payload: true });
    try {
      const lastMessage = state.messages[state.messages.length - 1];
      const moreMessages =
        (await onLoadMoreMessages?.(state.currentChat.id, lastMessage?.id)) ||
        [];
      dispatch({
        type: 'SET_MESSAGES',
        payload: [...state.messages, ...moreMessages],
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load more messages' });
    } finally {
      dispatch({ type: 'SET_LOADING_MORE', payload: false });
    }
  }, [
    state.currentChat,
    state.isLoadingMore,
    state.hasMore,
    state.messages,
    onLoadMoreMessages,
  ]);

  const searchMessages = useCallback(
    async (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      dispatch({ type: 'SET_IS_SEARCHING', payload: true });
      try {
        const results = (await onSearchMessages?.(query)) || [];
        dispatch({ type: 'SET_MESSAGES', payload: results });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to search messages' });
      } finally {
        dispatch({ type: 'SET_IS_SEARCHING', payload: false });
      }
    },
    [onSearchMessages]
  );

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_IS_SEARCHING', payload: false });
  }, []);

  // User actions
  const setTyping = useCallback(
    (isTyping: boolean) => {
      dispatch({ type: 'SET_IS_TYPING', payload: isTyping });
      onTypingChange?.(isTyping);
    },
    [onTypingChange]
  );

  const selectMessage = useCallback((messageId: string) => {
    dispatch({ type: 'SELECT_MESSAGE', payload: messageId });
  }, []);

  const deselectMessage = useCallback((messageId: string) => {
    dispatch({ type: 'DESELECT_MESSAGE', payload: messageId });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_MESSAGES' });
  }, []);

  // Settings actions
  const toggleTimestamps = useCallback(() => {
    dispatch({ type: 'SET_SHOW_TIMESTAMPS', payload: !state.showTimestamps });
  }, [state.showTimestamps]);

  const toggleReadReceipts = useCallback(() => {
    dispatch({
      type: 'SET_SHOW_READ_RECEIPTS',
      payload: !state.showReadReceipts,
    });
  }, [state.showReadReceipts]);

  const toggleOnlineStatus = useCallback(() => {
    dispatch({
      type: 'SET_SHOW_ONLINE_STATUS',
      payload: !state.showOnlineStatus,
    });
  }, [state.showOnlineStatus]);

  const toggleNotifications = useCallback(() => {
    dispatch({
      type: 'SET_ENABLE_NOTIFICATIONS',
      payload: !state.enableNotifications,
    });
  }, [state.enableNotifications]);

  const toggleSounds = useCallback(() => {
    dispatch({ type: 'SET_ENABLE_SOUNDS', payload: !state.enableSounds });
  }, [state.enableSounds]);

  const toggleVibrations = useCallback(() => {
    dispatch({
      type: 'SET_ENABLE_VIBRATIONS',
      payload: !state.enableVibrations,
    });
  }, [state.enableVibrations]);

  const contextValue: ChatContextValue = {
    state,
    dispatch,
    sendMessage,
    editMessage,
    deleteMessage,
    replyToMessage,
    forwardMessage,
    addReaction,
    removeReaction,
    loadMessages,
    loadMoreMessages,
    searchMessages,
    clearSearch,
    setTyping,
    selectMessage,
    deselectMessage,
    clearSelection,
    toggleTimestamps,
    toggleReadReceipts,
    toggleOnlineStatus,
    toggleNotifications,
    toggleSounds,
    toggleVibrations,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
