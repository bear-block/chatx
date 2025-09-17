import type {
  BaseEntity,
  Timestamped,
  Identifiable,
  MediaStatus,
  Size,
} from './base';

export interface MediaFile extends BaseEntity, Timestamped, Identifiable {
  type: 'image' | 'video' | 'audio' | 'file' | 'gif';
  url: string;
  thumbnailUrl?: string;
  filename: string;
  mimeType: string;
  size: number;
  duration?: number; // For video/audio
  dimensions?: Size; // For image/video/gif
  status: MediaStatus;
  progress?: number; // 0-100 for upload/download progress
  error?: string;
  metadata?: MediaMetadata;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  bitrate?: number;
  codec?: string;
  orientation?: number;
  exif?: Record<string, any>;
  compression?: {
    algorithm: string;
    quality: number;
  };
}

export interface ImageFile extends MediaFile {
  type: 'image';
  dimensions: Size;
  thumbnailUrl: string;
  filters?: ImageFilter[];
  annotations?: ImageAnnotation[];
}

export interface VideoFile extends MediaFile {
  type: 'video';
  dimensions: Size;
  duration: number;
  thumbnailUrl: string;
  thumbnailTimestamp?: number; // For video thumbnail
  hasAudio: boolean;
  quality?: VideoQuality;
}

export interface AudioFile extends MediaFile {
  type: 'audio';
  duration: number;
  waveform?: number[]; // For audio visualization
  hasVoice: boolean;
  transcription?: string;
}

export interface DocumentFile extends MediaFile {
  type: 'file';
  extension: string;
  isPreviewable: boolean;
  previewUrl?: string;
}

export interface ImageFilter {
  name: string;
  intensity: number;
  parameters?: Record<string, any>;
}

export interface ImageAnnotation {
  id: string;
  type: 'text' | 'drawing' | 'sticker' | 'emoji';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  data: any;
}

export interface VideoQuality {
  resolution: string;
  bitrate: number;
  fps: number;
}

export interface MediaUploadOptions {
  quality?: number;
  compression?: boolean;
  generateThumbnail?: boolean;
  watermark?: {
    text?: string;
    image?: string;
    position:
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'
      | 'center';
  };
  filters?: ImageFilter[];
}

export interface MediaDownloadOptions {
  quality?: 'low' | 'medium' | 'high' | 'original';
  format?: string;
  generateThumbnail?: boolean;
}

export interface MediaGalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  timestamp: number;
  messageId: string;
  chatId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface MediaViewerProps {
  media: MediaFile[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  onShare?: (media: MediaFile) => void;
  onDownload?: (media: MediaFile) => void;
  onDelete?: (media: MediaFile) => void;
}

export interface MediaPickerProps {
  onSelect: (media: MediaFile[]) => void;
  onClose: () => void;
  visible: boolean;
  maxSelection?: number;
  allowedTypes?: ('image' | 'video' | 'audio' | 'file')[];
  quality?: number;
}

export interface MediaPreviewProps {
  media: MediaFile;
  onRemove?: () => void;
  onEdit?: () => void;
  onRetry?: () => void;
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
}
