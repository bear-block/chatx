import type { BaseEntity, Timestamped, Identifiable } from './base';
import type { User } from './user';

export interface TypingIndicator extends BaseEntity, Timestamped, Identifiable {
  userId: string;
  chatId: string;
  isTyping: boolean;
  user: User;
}

export interface OnlineStatus extends BaseEntity, Timestamped, Identifiable {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'invisible';
  lastSeen: number;
  user: User;
}

export interface ReadReceipt extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  userId: string;
  readAt: number;
  user: User;
}

export interface DeliveryReceipt extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  userId: string;
  deliveredAt: number;
  user: User;
}

export interface MessageStatus {
  messageId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: number;
  error?: string;
  retryCount?: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isReconnecting: boolean;
  lastConnected?: number;
  connectionType?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync?: number;
  pendingMessages: number;
  pendingMedia: number;
  errors: string[];
}

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'invisible' | 'typing';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: any;
}

export interface TypingIndicatorProps {
  users: User[];
  visible: boolean;
  style?: any;
}

export interface ReadReceiptProps {
  messageId: string;
  readBy: User[];
  deliveredTo: User[];
  totalRecipients: number;
  style?: any;
}

export interface ConnectionStatusProps {
  status: ConnectionStatus;
  onRetry?: () => void;
  style?: any;
}

export interface SyncStatusProps {
  status: SyncStatus;
  onRetry?: () => void;
  style?: any;
}
