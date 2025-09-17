import type {
  BaseEntity,
  Timestamped,
  Identifiable,
  ChatType,
  Permission,
} from './base';
import type { User } from './user';
import type { Message } from './message';

export interface Chat extends BaseEntity, Timestamped, Identifiable {
  type: ChatType;
  name?: string;
  description?: string;
  avatar?: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isBlocked: boolean;
  settings: ChatSettings;
  metadata: ChatMetadata;
}

export interface ChatParticipant extends BaseEntity, Timestamped, Identifiable {
  userId: string;
  chatId: string;
  role: 'admin' | 'moderator' | 'member' | 'owner';
  permissions: Permission[];
  joinedAt: number;
  leftAt?: number;
  isActive: boolean;
  user: User;
  customFields?: Record<string, any>;
}

export interface ChatSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    mentionsOnly: boolean;
  };
  privacy: {
    allowInvites: boolean;
    allowMemberAdd: boolean;
    allowMemberRemove: boolean;
    allowMessageEdit: boolean;
    allowMessageDelete: boolean;
    allowReactions: boolean;
    allowReplies: boolean;
    allowForwards: boolean;
  };
  appearance: {
    theme?: string;
    wallpaper?: string;
    fontSize?: 'small' | 'medium' | 'large';
  };
  moderation: {
    allowProfanity: boolean;
    allowSpam: boolean;
    autoDelete: boolean;
    autoDeleteAfter?: number; // days
  };
}

export interface ChatMetadata {
  createdBy: string;
  totalMessages: number;
  totalParticipants: number;
  lastActivity: number;
  tags: string[];
  customFields?: Record<string, any>;
}

export interface ChatListProps {
  chats: Chat[];
  currentUser: User;
  onChatSelect: (chat: Chat) => void;
  onChatLongPress?: (chat: Chat) => void;
  onChatCreate?: () => void;
  onChatSearch?: (query: string) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  emptyStateText?: string;
  errorStateText?: string;
  style?: any;
}

export interface ChatHeaderProps {
  chat: Chat;
  currentUser: User;
  onBack?: () => void;
  onInfo?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onSearch?: () => void;
  onMore?: () => void;
  style?: any;
}

export interface ChatInputProps {
  onSendMessage: (text: string, options?: any) => void;
  onSendMedia?: (media: any[]) => void;
  onSendLocation?: (location: any) => void;
  onSendContact?: (contact: any) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  replyTo?: Message;
  onReplyCancel?: () => void;
  style?: any;
}

export interface ChatMessageListProps {
  messages: Message[];
  currentUser: User;
  onMessagePress?: (message: Message) => void;
  onMessageLongPress?: (message: Message) => void;
  onMessageReaction?: (messageId: string, emoji: string) => void;
  onMessageReply?: (message: Message) => void;
  onMessageForward?: (message: Message) => void;
  onMessageEdit?: (message: Message) => void;
  onMessageDelete?: (message: Message) => void;
  onMessagePin?: (message: Message) => void;
  onMessageUnpin?: (message: Message) => void;
  onMessageStar?: (message: Message) => void;
  onMessageUnstar?: (message: Message) => void;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  hasMore?: boolean;
  style?: any;
}

export interface ChatInfoProps {
  chat: Chat;
  currentUser: User;
  onEdit?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  style?: any;
}

export interface ChatSearchProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  loading?: boolean;
  style?: any;
}

export interface ChatCreateProps {
  onCreate: (chat: Partial<Chat>) => void;
  onCancel?: () => void;
  visible: boolean;
  style?: any;
}

export interface ChatInviteProps {
  chat: Chat;
  onInvite: (users: User[]) => void;
  onCancel?: () => void;
  visible: boolean;
  style?: any;
}
