export const IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
] as const;

export const VIDEO_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/webm',
  'video/mkv',
  'video/3gp',
] as const;

export const AUDIO_TYPES = [
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/flac',
  'audio/m4a',
  'audio/wma',
  'audio/opus',
] as const;

export const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
] as const;

export const SUPPORTED_TYPES = [
  ...IMAGE_TYPES,
  ...VIDEO_TYPES,
  ...AUDIO_TYPES,
  ...DOCUMENT_TYPES,
] as const;

export const FILE_EXTENSIONS = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'],
  VIDEO: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.3gp'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a', '.wma', '.opus'],
  DOCUMENT: [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.csv',
    '.zip',
    '.rar',
    '.7z',
  ],
} as const;

export const MIME_TYPE_ICONS = {
  // Images
  'image/jpeg': '🖼️',
  'image/jpg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🖼️',
  'image/webp': '🖼️',
  'image/svg+xml': '🖼️',
  'image/bmp': '🖼️',
  'image/tiff': '🖼️',

  // Videos
  'video/mp4': '🎥',
  'video/avi': '🎥',
  'video/mov': '🎥',
  'video/wmv': '🎥',
  'video/flv': '🎥',
  'video/webm': '🎥',
  'video/mkv': '🎥',
  'video/3gp': '🎥',

  // Audio
  'audio/mp3': '🎵',
  'audio/wav': '🎵',
  'audio/ogg': '🎵',
  'audio/aac': '🎵',
  'audio/flac': '🎵',
  'audio/m4a': '🎵',
  'audio/wma': '🎵',
  'audio/opus': '🎵',

  // Documents
  'application/pdf': '📄',
  'application/msword': '📄',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '📄',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'application/vnd.ms-powerpoint': '📊',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    '📊',
  'text/plain': '📄',
  'text/csv': '📊',
  'application/zip': '📦',
  'application/x-rar-compressed': '📦',
  'application/x-7z-compressed': '📦',
} as const;

export type ImageType = (typeof IMAGE_TYPES)[number];
export type VideoType = (typeof VIDEO_TYPES)[number];
export type AudioType = (typeof AUDIO_TYPES)[number];
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type SupportedType = (typeof SUPPORTED_TYPES)[number];
