export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface Timestamped {
  timestamp: number;
}

export interface Identifiable {
  id: string;
}

export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'gif'
  | 'location'
  | 'contact'
  | 'system'
  | 'reply'
  | 'forward';

export type ReactionType =
  | 'like'
  | 'love'
  | 'laugh'
  | 'wow'
  | 'sad'
  | 'angry'
  | 'custom';

export type ChatType = 'direct' | 'group' | 'channel' | 'broadcast';

export type UserStatus = 'online' | 'offline' | 'away' | 'busy' | 'invisible';

export type MediaStatus =
  | 'uploading'
  | 'uploaded'
  | 'downloading'
  | 'downloaded'
  | 'failed';

export type Permission = 'read' | 'write' | 'admin' | 'owner';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Duration {
  start: number;
  end: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Filter {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: any;
}

export interface SearchQuery {
  query: string;
  fields: string[];
  filters?: Filter[];
  sort?: Sort[];
  pagination?: Pagination;
}
