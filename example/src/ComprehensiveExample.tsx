import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ChatApp, ChatThemeProvider } from '@bear-block/chatx';
import type { Message, User, Chat } from '@bear-block/chatx';

// Mock data
const currentUser: User = {
  id: 'user1',
  name: 'Alice Johnson',
  avatar: 'https://i.pravatar.cc/150?img=1',
  isOnline: true,
};

const mockChat: Chat = {
  id: 'chat1',
  type: 'group',
  name: 'Team Chat',
  description: 'Our awesome team chat',
  avatar: 'https://i.pravatar.cc/150?img=team',
  participants: [
    {
      id: 'p1',
      userId: 'user1',
      chatId: 'chat1',
      role: 'admin',
      permissions: ['read', 'write', 'admin'],
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
      isActive: true,
      user: currentUser,
    },
    {
      id: 'p2',
      userId: 'user2',
      chatId: 'chat1',
      role: 'member',
      permissions: ['read', 'write'],
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
      isActive: true,
      user: {
        id: 'user2',
        name: 'Bob Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        isOnline: true,
      },
    },
    {
      id: 'p3',
      userId: 'user3',
      chatId: 'chat1',
      role: 'member',
      permissions: ['read', 'write'],
      joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      isActive: true,
      user: {
        id: 'user3',
        name: 'Charlie Brown',
        avatar: 'https://i.pravatar.cc/150?img=3',
        isOnline: false,
      },
    },
  ],
  lastMessage: {
    id: 'msg1',
    text: 'Hey everyone! How are you doing?',
    user: currentUser,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
  },
  unreadCount: 0,
  isMuted: false,
  isPinned: true,
  isArchived: false,
  isBlocked: false,
  settings: {
    notifications: {
      enabled: true,
      sound: true,
      vibration: true,
      mentionsOnly: false,
    },
    privacy: {
      allowInvites: true,
      allowMemberAdd: true,
      allowMemberRemove: true,
      allowMessageEdit: true,
      allowMessageDelete: true,
      allowReactions: true,
      allowReplies: true,
      allowForwards: true,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
    },
    moderation: {
      allowProfanity: false,
      allowSpam: false,
      autoDelete: false,
    },
  },
  metadata: {
    createdBy: 'user1',
    totalMessages: 150,
    totalParticipants: 3,
    lastActivity: Date.now() - 1000 * 60 * 30,
    tags: ['work', 'team'],
  },
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 1 month ago
  updatedAt: Date.now() - 1000 * 60 * 30,
  timestamp: Date.now() - 1000 * 60 * 30,
};

const mockMessages: Message[] = [
  {
    id: 'msg1',
    text: 'Hey everyone! How are you doing?',
    user: currentUser,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
    reactions: [
      { emoji: '👍', count: 2, users: ['user2', 'user3'] },
      { emoji: '😊', count: 1, users: ['user2'] },
    ],
  },
  {
    id: 'msg2',
    text: "I'm doing great! Just finished the new feature implementation.",
    user: {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isOnline: true,
    },
    timestamp: Date.now() - 1000 * 60 * 25, // 25 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
  },
  {
    id: 'msg3',
    text: 'That sounds awesome! Can you show us a demo?',
    user: {
      id: 'user3',
      name: 'Charlie Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isOnline: false,
    },
    timestamp: Date.now() - 1000 * 60 * 20, // 20 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
    replyTo: 'msg2',
    replyMessage: {
      id: 'msg2',
      text: "I'm doing great! Just finished the new feature implementation.",
      user: {
        id: 'user2',
        name: 'Bob Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        isOnline: true,
      },
      timestamp: Date.now() - 1000 * 60 * 25,
      type: 'text',
      chatId: 'chat1',
      status: 'read',
      isRead: true,
    },
  },
  {
    id: 'msg4',
    text: 'Sure! Let me create a quick poll to see when everyone is available.',
    user: {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isOnline: true,
    },
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
  },
  {
    id: 'msg5',
    text: 'Demo Time!',
    user: {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isOnline: true,
    },
    timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
    customData: {
      poll: {
        question: 'When should we schedule the demo?',
        options: [
          {
            id: 'opt1',
            text: 'Today at 3 PM',
            votes: 2,
            voters: ['user1', 'user2'],
          },
          {
            id: 'opt2',
            text: 'Tomorrow at 10 AM',
            votes: 1,
            voters: ['user3'],
          },
          { id: 'opt3', text: 'Friday at 2 PM', votes: 0, voters: [] },
        ],
      },
    },
  },
  {
    id: 'msg6',
    text: 'Check out this cool sticker!',
    user: currentUser,
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
    customData: {
      sticker: {
        url: 'https://via.placeholder.com/120x120/007AFF/FFFFFF?text=😎',
        name: 'Cool Sticker',
      },
    },
  },
  {
    id: 'msg7',
    text: 'I shared my location',
    user: {
      id: 'user3',
      name: 'Charlie Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isOnline: false,
    },
    timestamp: Date.now() - 1000 * 60 * 2, // 2 minutes ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
    customData: {
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA',
      },
    },
  },
  {
    id: 'msg8',
    text: 'Here is my contact info',
    user: {
      id: 'user2',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isOnline: true,
    },
    timestamp: Date.now() - 1000 * 30, // 30 seconds ago
    type: 'text',
    chatId: 'chat1',
    status: 'read',
    isRead: true,
    customData: {
      contact: {
        name: 'Bob Smith',
        phone: '+1 (555) 123-4567',
        email: 'bob@example.com',
      },
    },
  },
  {
    id: 'msg9',
    text: 'This is a system message',
    user: {
      id: 'system',
      name: 'System',
      avatar: undefined,
      isOnline: false,
    },
    timestamp: Date.now() - 1000 * 10, // 10 seconds ago
    type: 'system',
    chatId: 'chat1',
    status: 'sent',
    isRead: true,
    systemData: {
      type: 'user_joined',
      data: {
        userName: 'New User',
      },
    },
  },
  {
    id: 'msg10',
    text: 'This message is pinned!',
    user: currentUser,
    timestamp: Date.now() - 1000 * 5, // 5 seconds ago
    type: 'text',
    chatId: 'chat1',
    status: 'sent',
    isRead: false,
    isPinned: true,
    pinnedAt: Date.now() - 1000 * 5,
  },
];

const ComprehensiveExample: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = useCallback(async (text: string, options?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      user: currentUser,
      timestamp: Date.now(),
      type: 'text',
      chatId: mockChat.id,
      status: 'sending',
      isRead: false,
      ...options,
    };

    setMessages(prev) => [newMessage, ...prev]);

    // Simulate sending
    setTimeout(() => {
      setMessages(prev) =>
        prev.map(msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);
  }, []);

  const handleEditMessage = useCallback(
    async (messageId: string, (_newText: string) => {
      setMessages(prev) =>
        prev.map(msg) =>
          msg.id === messageId
            ? { ...msg, text: newText, isEdited: true, editedAt: Date.now() }
            : msg
        )
      );
    },
    []
  );

  const handleDeleteMessage = useCallback(async (_messageId: string) => {
    setMessages(prev) => prev.filter(msg) => msg.id !== messageId));
  }, []);

  const handleLoadMessages = useCallback(async (_chatId: string) => {
    // Simulate loading
    return mockMessages;
  }, []);

  const handleLoadMoreMessages = useCallback(
    async (chatId: string, lastMessageId?: string) => {
      // Simulate loading more messages
      return [];
    },
    []
  );

  const handleSearchMessages = useCallback(async (_query: string) => {
    return mockMessages.filter(msg) =>
      msg.text?.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  const handleAddReaction = useCallback(
    async (messageId: string, (_emoji: string) => {
      setMessages(prev) =>
        prev.map(msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const existingReaction = reactions.find(r) => r.emoji === emoji);
            if (existingReaction) {
              existingReaction.count += 1;
              existingReaction.users.push(currentUser.id);
            } else {
              reactions.push({ emoji, count: 1, users: [currentUser.id] });
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    },
    []
  );

  const handleRemoveReaction = useCallback(
    async (messageId: string, (_emoji: string) => {
      setMessages(prev) =>
        prev.map(msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const existingReaction = reactions.find(r) => r.emoji === emoji);
            if (existingReaction) {
              existingReaction.count -= 1;
              existingReaction.users = existingReaction.users.filter(
                (id) => id !== currentUser.id
              );
              if (existingReaction.count <= 0) {
                msg.reactions = reactions.filter(r) => r.emoji !== emoji);
              }
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    },
    []
  );

  const handleTypingChange = useCallback(isTyping: boolean) => {
    console.log('Typing:', isTyping);
  }, []);

  return (
    <View style={styles.container}>
      <ChatApp
        currentUser={currentUser}
        currentChat={mockChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onLoadMessages={handleLoadMessages}
        onLoadMoreMessages={handleLoadMoreMessages}
        onSearchMessages={handleSearchMessages}
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
        onTypingChange={handleTypingChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ComprehensiveExample;
