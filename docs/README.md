# @bear-block/chatx

A comprehensive, customizable React Native chat library with modern features and excellent developer experience.

## 🚀 Features

### Core Features
- ✅ **Real-time Messaging** - Send and receive messages instantly
- ✅ **Message Types** - Text, Image, Video, Audio, File, GIF, Location, Contact
- ✅ **Message Actions** - Reply, Forward, Edit, Delete, Pin, Star, Report
- ✅ **Reactions** - Add emoji reactions to messages
- ✅ **Typing Indicators** - See when someone is typing
- ✅ **Read Receipts** - Know when messages are read
- ✅ **Message Search** - Find messages quickly
- ✅ **Media Viewer** - Full-screen media viewing
- ✅ **Notifications** - Push notifications and sounds
- ✅ **Themes** - Light, dark, and custom themes
- ✅ **Accessibility** - Full accessibility support

### Advanced Features
- ✅ **Message Threading** - Reply to specific messages
- ✅ **Message Pinning** - Pin important messages
- ✅ **Message Starring** - Star favorite messages
- ✅ **Message Encryption** - End-to-end encryption support
- ✅ **Offline Support** - Work without internet
- ✅ **Message Caching** - Smart message caching
- ✅ **Performance Optimization** - Virtualization and lazy loading
- ✅ **Customization** - Highly customizable UI and behavior

## 📦 Installation

```bash
npm install @bear-block/chatx
# or
yarn add @bear-block/chatx
```

## 🎯 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { ChatApp } from '@bear-block/chatx';

const App = () => {
  const currentUser = {
    id: 'user1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    isOnline: true,
  };

  const currentChat = {
    id: 'chat1',
    type: 'group',
    name: 'My Chat',
    participants: [/* ... */],
    // ... other chat properties
  };

  const messages = [
    {
      id: '1',
      type: 'text',
      text: 'Hello world!',
      user: currentUser,
      timestamp: Date.now(),
      // ... other message properties
    },
    // ... more messages
  ];

  const handleSendMessage = async (text: string) => {
    // Send message logic
    console.log('Sending message:', text);
  };

  return (
    <ChatApp
      currentUser={currentUser}
      currentChat={currentChat}
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  );
};
```

### Advanced Usage with Configuration

```tsx
import React from 'react';
import { 
  ChatApp, 
  ChatConfigProvider, 
  ChatThemeProvider,
  chatConfigPresets 
} from '@bear-block/chatx';

const App = () => {
  return (
    <ChatConfigProvider
      initialConfig={{
        features: {
          enableReactions: true,
          enableReplies: true,
          enableTypingIndicator: true,
          // ... other features
        },
        behavior: {
          maxMessageLength: 1000,
          autoScrollToBottom: true,
          // ... other behavior settings
        },
        // ... other config
      }}
    >
      <ChatThemeProvider
        theme={{
          colors: {
            primary: '#007AFF',
            background: '#FFFFFF',
            // ... other theme colors
          },
          // ... other theme settings
        }}
      >
        <ChatApp
          currentUser={currentUser}
          currentChat={currentChat}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </ChatThemeProvider>
    </ChatConfigProvider>
  );
};
```

## 🎨 Customization

### Theme Customization

```tsx
import { ChatThemeProvider } from '@bear-block/chatx';

const customTheme = {
  colors: {
    primary: '#FF6B6B',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      disabled: '#BDC3C7',
      inverse: '#FFFFFF',
    },
    // ... other colors
  },
  appearance: {
    messageBubble: {
      borderRadius: 20,
      maxWidth: 300,
      // ... other bubble settings
    },
    // ... other appearance settings
  },
  // ... other theme properties
};

<ChatThemeProvider theme={customTheme}>
  <ChatApp />
</ChatThemeProvider>
```

### Feature Configuration

```tsx
import { ChatConfigProvider, chatConfigPresets } from '@bear-block/chatx';

// Use predefined presets
<ChatConfigProvider initialConfig={chatConfigPresets.minimal}>
  <ChatApp />
</ChatConfigProvider>

// Or create custom configuration
<ChatConfigProvider
  initialConfig={{
    features: {
      enableReactions: true,
      enableReplies: false,
      enableTypingIndicator: true,
      // ... other features
    },
    behavior: {
      maxMessageLength: 500,
      autoScrollToBottom: true,
      // ... other behavior settings
    },
    // ... other config
  }}
>
  <ChatApp />
</ChatConfigProvider>
```

### Custom Message Types

```tsx
import { MessageRegistryProvider, useMessageRegistry } from '@bear-block/chatx';

const CustomMessage = ({ message }) => {
  return (
    <View>
      <Text>Custom Message: {message.text}</Text>
    </View>
  );
};

const App = () => {
  const { register } = useMessageRegistry();
  
  React.useEffect(() => {
    register('custom', CustomMessage);
  }, [register]);

  return (
    <MessageRegistryProvider>
      <ChatApp />
    </MessageRegistryProvider>
  );
};
```

## 🔧 API Reference

### Components

#### ChatApp
Main chat application component.

```tsx
interface ChatAppProps {
  currentUser: User;
  currentChat: Chat;
  messages: Message[];
  onSendMessage?: (text: string, options?: any) => Promise<void>;
  onEditMessage?: (messageId: string, newText: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onLoadMessages?: (chatId: string) => Promise<Message[]>;
  onLoadMoreMessages?: (chatId: string, lastMessageId?: string) => Promise<Message[]>;
  onSearchMessages?: (query: string) => Promise<Message[]>;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction?: (messageId: string, emoji: string) => Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
  theme?: Partial<ChatTheme>;
  style?: any;
}
```

#### ChatConfigProvider
Configuration provider for customizing behavior and features.

```tsx
interface ChatConfigProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<ChatConfig>;
  onConfigChange?: (config: ChatConfig) => void;
}
```

#### ChatThemeProvider
Theme provider for customizing appearance.

```tsx
interface ChatThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<ChatTheme>;
  mode?: 'light' | 'dark' | 'auto';
}
```

### Hooks

#### useChatConfig
Access and modify chat configuration.

```tsx
const {
  config,
  updateConfig,
  resetConfig,
  isFeatureEnabled,
  getBehaviorSetting,
  getUISetting,
  getPerformanceSetting,
} = useChatConfig();
```

#### useChatTheme
Access current theme values.

```tsx
const theme = useChatTheme();
```

#### useFeatureFlag
Check if a feature is enabled.

```tsx
const isReactionsEnabled = useFeatureFlag('enableReactions');
```

### Types

#### Message
```tsx
interface Message {
  id: string;
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
  media?: MediaFile[];
  reactions?: Reaction[];
  replies?: Reply[];
  forwards?: Forward[];
  replyTo?: string;
  replyMessage?: Message;
  systemData?: SystemMessageData;
  customData?: Record<string, any>;
  metadata?: MessageMetadata;
  createdAt: number;
  updatedAt: number;
  timestamp: number;
}
```

#### User
```tsx
interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: number;
  status?: string;
  // ... other user properties
}
```

#### Chat
```tsx
interface Chat {
  id: string;
  type: ChatType;
  name?: string;
  description?: string;
  avatar?: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isBlocked: boolean;
  settings: ChatSettings;
  metadata: ChatMetadata;
  createdAt: number;
  updatedAt: number;
  timestamp: number;
}
```

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run tests in watch mode
yarn test --watch
```

## 🚀 Performance

The library is optimized for performance with:

- **Virtualization** - Only render visible messages
- **Lazy Loading** - Load images and media on demand
- **Memoization** - Cache expensive calculations
- **Message Compression** - Compress large messages
- **Image Compression** - Optimize image sizes
- **Memory Management** - Smart caching and cleanup

## 🔒 Security

- **Message Encryption** - End-to-end encryption support
- **Input Validation** - Validate all user inputs
- **XSS Protection** - Prevent cross-site scripting
- **Secure Storage** - Encrypt sensitive data
- **Permission Management** - Handle permissions properly

## 🌍 Internationalization

The library supports internationalization with:

- **RTL Support** - Right-to-left language support
- **Date Formatting** - Localized date and time
- **Number Formatting** - Localized numbers
- **Text Direction** - Automatic text direction detection

## 📱 Platform Support

- **iOS** - Full iOS support
- **Android** - Full Android support
- **Web** - React Native Web support
- **Expo** - Expo compatibility

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation** - [Full Documentation](https://github.com/bear-block/chatx/docs)
- **Issues** - [GitHub Issues](https://github.com/bear-block/chatx/issues)
- **Discussions** - [GitHub Discussions](https://github.com/bear-block/chatx/discussions)
- **Discord** - [Join our Discord](https://discord.gg/chatx)

## 🙏 Acknowledgments

- React Native community
- All contributors
- Open source libraries used

---

Made with ❤️ by [Bear Block](https://github.com/bear-block)
