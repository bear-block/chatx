import type { ChatTheme } from './types';

export interface ChatAppearance {
  // Message bubble styles
  messageBubble: {
    borderRadius: number;
    maxWidth: number;
    paddingHorizontal: number;
    paddingVertical: number;
    marginVertical: number;
    marginHorizontal: number;
    // Tail styles
    tailSize: number;
    tailOffset: number;
    // Shadow
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };

  // Avatar styles
  avatar: {
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
  };

  // Input styles
  input: {
    height: number;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    fontSize: number;
    lineHeight: number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    placeholderColor: string;
    // Send button
    sendButtonSize: number;
    sendButtonColor: string;
    sendButtonDisabledColor: string;
  };

  // Header styles
  header: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    backgroundColor: string;
    borderBottomColor: string;
    borderBottomWidth: number;
    // Title
    titleFontSize: number;
    titleFontWeight: string;
    titleColor: string;
    // Subtitle
    subtitleFontSize: number;
    subtitleColor: string;
    // Action buttons
    actionButtonSize: number;
    actionButtonColor: string;
  };

  // List styles
  list: {
    backgroundColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
    // Separator
    separatorColor: string;
    separatorHeight: number;
    // Loading
    loadingColor: string;
    loadingSize: number;
  };

  // Typing indicator
  typingIndicator: {
    height: number;
    backgroundColor: string;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    dotSize: number;
    dotColor: string;
    animationDuration: number;
  };

  // Reactions
  reactions: {
    backgroundColor: string;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    marginTop: number;
    fontSize: number;
    // Reaction picker
    pickerBackgroundColor: string;
    pickerBorderRadius: number;
    pickerPadding: number;
    pickerItemSize: number;
  };

  // Reply preview
  replyPreview: {
    backgroundColor: string;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    marginBottom: number;
    borderLeftWidth: number;
    borderLeftColor: string;
    fontSize: number;
    maxHeight: number;
  };

  // System messages
  systemMessage: {
    backgroundColor: string;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    marginVertical: number;
    fontSize: number;
    textAlign: 'center' | 'left' | 'right';
    color: string;
  };

  // Media messages
  mediaMessage: {
    borderRadius: number;
    maxWidth: number;
    maxHeight: number;
    backgroundColor: string;
    // Image
    imageBorderRadius: number;
    // Video
    videoBorderRadius: number;
    playButtonSize: number;
    playButtonColor: string;
    // File
    fileIconSize: number;
    fileNameFontSize: number;
    fileSizeFontSize: number;
  };

  // Poll messages
  pollMessage: {
    backgroundColor: string;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    // Question
    questionFontSize: number;
    questionFontWeight: string;
    questionColor: string;
    // Options
    optionPadding: number;
    optionBorderRadius: number;
    optionBorderColor: string;
    optionBorderWidth: number;
    // Progress bar
    progressBarHeight: number;
    progressBarColor: string;
    progressBarBackgroundColor: string;
    // Vote count
    voteCountFontSize: number;
    voteCountColor: string;
  };

  // Sticker messages
  stickerMessage: {
    maxSize: number;
    borderRadius: number;
  };

  // Location messages
  locationMessage: {
    width: number;
    height: number;
    borderRadius: number;
    backgroundColor: string;
    // Map
    mapBorderRadius: number;
    // Address
    addressFontSize: number;
    addressColor: string;
    addressPadding: number;
  };

  // Contact messages
  contactMessage: {
    backgroundColor: string;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    // Avatar
    contactAvatarSize: number;
    contactAvatarBorderRadius: number;
    // Name
    contactNameFontSize: number;
    contactNameFontWeight: string;
    contactNameColor: string;
    // Phone
    contactPhoneFontSize: number;
    contactPhoneColor: string;
  };
}

export interface ChatThemeConfig extends ChatTheme {
  appearance: ChatAppearance;
  // Animation settings
  animations: {
    messageSlideIn: {
      duration: number;
      easing: string;
    };
    messageFadeIn: {
      duration: number;
      easing: string;
    };
    typingIndicator: {
      duration: number;
      easing: string;
    };
    reactionBounce: {
      duration: number;
      easing: string;
    };
    bubbleScale: {
      duration: number;
      easing: string;
    };
  };
  // Feature flags
  features: {
    enableReactions: boolean;
    enableReplies: boolean;
    enableForwards: boolean;
    enablePolls: boolean;
    enableStickers: boolean;
    enableLocation: boolean;
    enableContacts: boolean;
    enableVoiceMessages: boolean;
    enableVideoMessages: boolean;
    enableFileSharing: boolean;
    enableTypingIndicator: boolean;
    enableReadReceipts: boolean;
    enableMessageSearch: boolean;
    enableMessageThreading: boolean;
    enableMessagePinning: boolean;
    enableMessageEditing: boolean;
    enableMessageDeletion: boolean;
    enableMessageTranslation: boolean;
    enableMessageEncryption: boolean;
  };
  // Behavior settings
  behavior: {
    autoScrollToBottom: boolean;
    showTypingIndicator: boolean;
    showReadReceipts: boolean;
    showOnlineStatus: boolean;
    showMessageTimestamps: boolean;
    showMessageStatus: boolean;
    enableMessageGrouping: boolean;
    enableMessageBatching: boolean;
    maxMessageLength: number;
    maxFileSize: number;
    maxImageSize: number;
    maxVideoSize: number;
    maxAudioSize: number;
    typingIndicatorDelay: number;
    messageRetryAttempts: number;
    messageRetryDelay: number;
  };
}
