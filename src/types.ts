// Re-export from detailed types for backward compatibility
export type { User, Message, Reaction } from './types/user';
export type { Message as DetailedMessage } from './types/message';
export type { Reaction as DetailedReaction } from './types/interactions';

export interface ChatListProps {
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  onMessagePress?: (message: Message) => void;
  onMessageLongPress?: (message: Message) => void;
  onReactionPress?: (messageId: string, emoji: string) => void;
  renderMessage?: (message: Message) => React.ReactElement;
  renderInput?: () => React.ReactElement;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showReactions?: boolean;
  enableReplies?: boolean;
  placeholder?: string;
  maxInputLength?: number;
  loading?: boolean;
  emptyStateText?: string;
  errorStateText?: string;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  style?: any;
  messageStyle?: any;
  inputStyle?: any;
  avatarStyle?: any;
  timestampStyle?: any;
}

export interface MessageItemProps {
  message: Message;
  currentUser: User;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showReactions?: boolean;
  enableReplies?: boolean;
  onPress?: (message: Message) => void;
  onLongPress?: (message: Message) => void;
  onReactionPress?: (messageId: string, emoji: string) => void;
  style?: any;
  avatarStyle?: any;
  timestampStyle?: any;
}

export interface ChatInputProps {
  onSendMessage: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  style?: any;
  inputStyle?: any;
  buttonStyle?: any;
  multiline?: boolean;
  autoFocus?: boolean;
}

export interface EmptyStateProps {
  text?: string;
  style?: any;
}

export interface ErrorStateProps {
  text?: string;
  onRetry?: () => void;
  style?: any;
}
