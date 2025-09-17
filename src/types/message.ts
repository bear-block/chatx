import type {
  BaseEntity,
  MessageType,
  MessageStatus,
  Timestamped,
  Identifiable,
} from './base';
import type { User } from './user';
import type { Reaction, Reply, Forward } from './interactions';
import type { MediaFile } from './media';

export interface Message extends BaseEntity, Timestamped, Identifiable {
  type: MessageType;
  text?: string;
  user: User;
  chatId: string;
  status: MessageStatus;
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: number;
  isDeleted?: boolean;
  deletedAt?: number;
  isPinned?: boolean;
  pinnedAt?: number;
  isForwarded?: boolean;
  forwardedFrom?: string;
  forwardedAt?: number;

  // Media content
  media?: MediaFile[];

  // Interactions
  reactions?: Reaction[];
  replies?: Reply[];
  forwards?: Forward[];

  // Reply context
  replyTo?: string;
  replyMessage?: Message;

  // System message data
  systemData?: SystemMessageData;

  // Custom data
  customData?: Record<string, any>;

  // Metadata
  metadata?: MessageMetadata;
}

export interface SystemMessageData {
  type:
    | 'user_joined'
    | 'user_left'
    | 'group_created'
    | 'group_updated'
    | 'message_deleted'
    | 'custom';
  data: Record<string, any>;
  actor?: User;
}

export interface MessageMetadata {
  clientId?: string;
  serverId?: string;
  version?: number;
  encryption?: {
    algorithm: string;
    keyId: string;
  };
  delivery?: {
    attempts: number;
    lastAttempt?: number;
    nextRetry?: number;
  };
}

export interface MessageDraft {
  id: string;
  chatId: string;
  text?: string;
  media?: MediaFile[];
  replyTo?: string;
  timestamp: number;
  isDraft: boolean;
}

export interface MessageSearchResult {
  message: Message;
  highlights: {
    field: string;
    text: string;
    start: number;
    end: number;
  }[];
  score: number;
}

export interface MessageThread {
  id: string;
  messageId: string;
  messages: Message[];
  participants: User[];
  createdAt: number;
  updatedAt: number;
}

export interface MessageReaction {
  messageId: string;
  userId: string;
  emoji: string;
  timestamp: number;
}

export interface MessageReadReceipt {
  messageId: string;
  userId: string;
  readAt: number;
}

export interface MessageDeliveryReceipt {
  messageId: string;
  userId: string;
  deliveredAt: number;
}

export interface TypingIndicator {
  userId: string;
  chatId: string;
  isTyping: boolean;
  timestamp: number;
}

export interface MessageListState {
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error?: string;
  lastMessageId?: string;
  unreadCount: number;
}

export interface MessageSendOptions {
  replyTo?: string;
  forwardFrom?: string;
  customData?: Record<string, any>;
  encryption?: boolean;
  priority?: 'low' | 'normal' | 'high';
  expiresAt?: number;
}
