import type { BaseEntity, UserStatus, Identifiable } from './base';

export interface User extends BaseEntity, Identifiable {
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: number;
  isOnline: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  bio?: string;
  customFields?: Record<string, any>;
}

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastSeen: number;
  isOnline: boolean;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isFollower?: boolean;
  mutualFriends?: User[];
}

export interface Contact extends BaseEntity {
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  isRegistered: boolean;
  userId?: string;
  customFields?: Record<string, any>;
}

export interface UserSettings {
  notifications: {
    messages: boolean;
    mentions: boolean;
    calls: boolean;
    groups: boolean;
  };
  privacy: {
    lastSeen: 'everyone' | 'contacts' | 'nobody';
    readReceipts: boolean;
    onlineStatus: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    language: string;
  };
  chat: {
    enterToSend: boolean;
    showEmoji: boolean;
    showPreview: boolean;
  };
}
