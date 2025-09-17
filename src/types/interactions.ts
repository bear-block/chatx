import type { BaseEntity, Timestamped, Identifiable } from './base';
import type { User } from './user';

export interface Reaction extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  userId: string;
  emoji: string;
  user: User;
}

export interface Reply extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  replyToMessageId: string;
  userId: string;
  text: string;
  user: User;
  replyMessage?: {
    id: string;
    text: string;
    user: User;
    type: string;
  };
}

export interface Forward extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  forwardedMessageId: string;
  userId: string;
  user: User;
  forwardedMessage?: {
    id: string;
    text: string;
    user: User;
    type: string;
    timestamp: number;
  };
}

export interface Pin extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  userId: string;
  user: User;
  reason?: string;
}

export interface Star extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  userId: string;
  user: User;
}

export interface Mention extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  mentionedUserId: string;
  mentionedUser: User;
  position: {
    start: number;
    end: number;
  };
}

export interface Hashtag extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  text: string;
  position: {
    start: number;
    end: number;
  };
}

export interface LinkPreview extends BaseEntity, Timestamped, Identifiable {
  messageId: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  position: {
    start: number;
    end: number;
  };
}

export interface MessageAction {
  id: string;
  type:
    | 'reply'
    | 'forward'
    | 'copy'
    | 'delete'
    | 'edit'
    | 'pin'
    | 'unpin'
    | 'star'
    | 'unstar'
    | 'react';
  messageId: string;
  userId: string;
  data?: Record<string, any>;
  timestamp: number;
}

export interface InteractionSummary {
  messageId: string;
  reactions: {
    emoji: string;
    count: number;
    users: User[];
  }[];
  repliesCount: number;
  forwardsCount: number;
  isPinned: boolean;
  isStarred: boolean;
  mentions: User[];
  hashtags: string[];
  linkPreviews: LinkPreview[];
}

export interface ReactionPickerProps {
  onReactionSelect: (emoji: string) => void;
  onClose: () => void;
  visible: boolean;
  messageId: string;
}

export interface ReplyInputProps {
  onReply: (text: string) => void;
  onCancel: () => void;
  replyTo: {
    messageId: string;
    text: string;
    user: User;
  };
  visible: boolean;
}

export interface ForwardModalProps {
  onForward: (chatIds: string[]) => void;
  onCancel: () => void;
  message: any;
  visible: boolean;
  availableChats: any[];
}
