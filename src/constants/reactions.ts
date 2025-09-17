export const DEFAULT_REACTIONS = [
  { emoji: '👍', name: 'like' },
  { emoji: '❤️', name: 'love' },
  { emoji: '😂', name: 'laugh' },
  { emoji: '😮', name: 'wow' },
  { emoji: '😢', name: 'sad' },
  { emoji: '😡', name: 'angry' },
] as const;

export const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'] as const;

export const REACTION_LIMITS = {
  MAX_REACTIONS_PER_MESSAGE: 10,
  MAX_REACTIONS_PER_USER: 1,
  MAX_CUSTOM_REACTIONS: 5,
} as const;

export type DefaultReaction = (typeof DEFAULT_REACTIONS)[number];
export type QuickReaction = (typeof QUICK_REACTIONS)[number];
