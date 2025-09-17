import React, { useEffect, useRef } from 'react';
import { Platform, Vibration, Alert } from 'react-native';
import { useChat } from '../../contexts/ChatContext';
import { useChatThemeValue } from '../../theme/chatThemeProvider';

interface NotificationManagerProps {
  children: React.ReactNode;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  children,
}) => {
  const { state } = useChat();
  const lastMessageId = useRef<string | null>(null);

  useEffect(() => {
    if (!state.enableNotifications || !state.currentUser) return;

    // Check for new messages
    const latestMessage = state.messages[0];
    if (
      latestMessage &&
      latestMessage.id !== lastMessageId.current &&
      latestMessage.user.id !== state.currentUser.id &&
      !latestMessage.isRead
    ) {
      handleNewMessage(latestMessage);
      lastMessageId.current = latestMessage.id;
    }
  }, [state.messages, state.enableNotifications, state.currentUser, handleNewMessage]);

  const handleNewMessage = useCallback(message: any) => {
    // Show local notification
    if (Platform.OS === 'ios') {
      // iOS local notification
      showIOSNotification(message);
    } else {
      // Android local notification
      showAndroidNotification(message);
    }

    // Vibrate if enabled
    if (state.enableVibrations) {
      const vibrationPattern = [0, 200, 100, 200];
      Vibration.vibrate(vibrationPattern);
    }

    // Play sound if enabled
    if (state.enableSounds) {
      playNotificationSound();
    }
  };

  const showIOSNotification = (message: any) => {
    // In a real app, you would use react-native-push-notification
    // or @react-native-async-storage/async-storage for local notifications
    console.log('iOS Notification:', {
      title: message.user.name,
      body: message.text || 'New message',
      data: { messageId: message.id },
    });
  };

  const showAndroidNotification = (message: any) => {
    // In a real app, you would use react-native-push-notification
    console.log('Android Notification:', {
      title: message.user.name,
      body: message.text || 'New message',
      data: { messageId: message.id },
    });
  };

  const playNotificationSound = () => {
    // In a real app, you would use react-native-sound
    // or react-native-track-player for audio
    console.log('Playing notification sound');
  };

  return <>{children}</>;
};

// Notification permission hook
export const useNotificationPermissions = () => {
  const [permissions, setPermissions] = React.useState({
    alert: false,
    badge: false,
    sound: false,
  });

  const requestPermissions = async () => {
    try {
      // In a real app, you would use @react-native-async-storage/async-storage
      // or react-native-permissions for permission handling
      const granted = await new Promise(resolve) => {
        Alert.alert(
          'Notification Permission',
          'This app would like to send you notifications for new messages.',
          [
            { text: 'Deny', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Allow', onPress: () => resolve(true) },
          ]
        );
      });

      setPermissions({
        alert: granted,
        badge: granted,
        sound: granted,
      });

      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const checkPermissions = async () => {
    // In a real app, you would check actual permissions
    return permissions;
  };

  return {
    permissions,
    requestPermissions,
    checkPermissions,
  };
};

// Push notification service
export class PushNotificationService {
  private static instance: PushNotificationService;
  private token: string | null = null;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize() {
    try {
      // In a real app, you would initialize push notifications here
      // using libraries like @react-native-firebase/messaging
      console.log('Push notification service initialized');
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      // In a real app, you would get the actual FCM token
      this.token = 'mock-fcm-token';
      return this.token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  async sendNotification(to: string, message: any) {
    try {
      // In a real app, you would send the notification via your backend
      console.log('Sending notification to:', to, message);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async subscribeToTopic(topic: string) {
    try {
      // In a real app, you would subscribe to FCM topics
      console.log('Subscribed to topic:', topic);
    } catch (error) {
      console.error('Failed to subscribe to topic:', error);
    }
  }

  async unsubscribeFromTopic(topic: string) {
    try {
      // In a real app, you would unsubscribe from FCM topics
      console.log('Unsubscribed from topic:', topic);
    } catch (error) {
      console.error('Failed to unsubscribe from topic:', error);
    }
  }
}
