export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return 'now';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d`;
  }

  // More than 7 days - show date
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // This week
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (date > weekAgo) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }

  // This year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  }

  // Other year
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${formatFullTime(timestamp)}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatFullTime(timestamp)}`;
  }

  // This week
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (date > weekAgo) {
    return `${formatDate(timestamp)} at ${formatFullTime(timestamp)}`;
  }

  // This year
  if (date.getFullYear() === now.getFullYear()) {
    return `${formatDate(timestamp)} at ${formatFullTime(timestamp)}`;
  }

  // Other year
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isToday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const now = new Date();
  return date.toDateString() === now.toDateString();
};

export const isYesterday = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const getRelativeTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return 'just now';
  }

  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (diff < 2592000000) {
    const weeks = Math.floor(diff / 604800000);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  if (diff < 31536000000) {
    const months = Math.floor(diff / 2592000000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(diff / 31536000000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};
