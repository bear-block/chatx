import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { useChatThemeValue } from '../../theme/chatThemeProvider';
import type { Message } from '../../types';

interface MessageActionsProps {
  visible: boolean;
  message: Message | null;
  currentUserId: string;
  onClose: () => void;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  onCopy?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onUnpin?: (message: Message) => void;
  onStar?: (message: Message) => void;
  onUnstar?: (message: Message) => void;
  onReport?: (message: Message) => void;
  onBlock?: (message: Message) => void;
  style?: any;
}

interface ActionItem {
  id: string;
  title: string;
  icon: string;
  color?: string;
  onPress: () => void;
  show: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  visible,
  message,
  currentUserId,
  onClose,
  onReply,
  onForward,
  onEdit,
  onDelete,
  onCopy,
  onPin,
  onUnpin,
  onStar,
  onUnstar,
  onReport,
  onBlock,
  style,
}) => {
  const theme = useChatThemeValue();
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!message) return null;

  const isCurrentUser = message.user.id === currentUserId;
  const isPinned = message.isPinned;
  const isStarred = message.customData?.starred;

  const getActions = (): ActionItem[] => [
    {
      id: 'reply',
      title: 'Reply',
      icon: '↩️',
      onPress: () => {
        onReply?.(message);
        onClose();
      },
      show: !!onReply,
    },
    {
      id: 'forward',
      title: 'Forward',
      icon: '↗️',
      onPress: () => {
        onForward?.(message);
        onClose();
      },
      show: !!onForward,
    },
    {
      id: 'copy',
      title: 'Copy',
      icon: '📋',
      onPress: () => {
        onCopy?.(message);
        onClose();
      },
      show: !!onCopy && !!message.text,
    },
    {
      id: 'edit',
      title: 'Edit',
      icon: '✏️',
      onPress: () => {
        onEdit?.(message);
        onClose();
      },
      show: !!onEdit && isCurrentUser && message.type === 'text',
    },
    {
      id: 'pin',
      title: isPinned ? 'Unpin' : 'Pin',
      icon: isPinned ? '📌' : '📌',
      onPress: () => {
        if (isPinned) {
          onUnpin?.(message);
        } else {
          onPin?.(message);
        }
        onClose();
      },
      show: !!onPin || !!onUnpin,
    },
    {
      id: 'star',
      title: isStarred ? 'Unstar' : 'Star',
      icon: isStarred ? '⭐' : '☆',
      onPress: () => {
        if (isStarred) {
          onUnstar?.(message);
        } else {
          onStar?.(message);
        }
        onClose();
      },
      show: !!onStar || !!onUnstar,
    },
    {
      id: 'delete',
      title: 'Delete',
      icon: '🗑️',
      color: theme.colors.error,
      onPress: () => {
        onDelete?.(message);
        onClose();
      },
      show: !!onDelete && isCurrentUser,
    },
    {
      id: 'report',
      title: 'Report',
      icon: '⚠️',
      color: theme.colors.warning,
      onPress: () => {
        onReport?.(message);
        onClose();
      },
      show: !!onReport && !isCurrentUser,
    },
    {
      id: 'block',
      title: 'Block User',
      icon: '🚫',
      color: theme.colors.error,
      onPress: () => {
        onBlock?.(message);
        onClose();
      },
      show: !!onBlock && !isCurrentUser,
    },
  ];

  const actions = getActions().filter((action) => action.show);

  const renderAction = (action: ActionItem) => (
    <TouchableOpacity
      key={action.id}
      style={[
        styles.actionItem,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border.light,
        },
      ]}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.actionIcon}>{action.icon}</Text>
      <Text
        style={[
          styles.actionTitle,
          {
            color: action.color || theme.colors.text.primary,
          },
        ]}
      >
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.surface,
              opacity: fadeAnim,
            },
            style,
          ]}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: theme.colors.border.light },
            ]}
          >
            <Text
              style={[styles.headerTitle, { color: theme.colors.text.primary }]}
            >
              Message Options
            </Text>
          </View>

          <View style={styles.actionsList}>{actions.map(renderAction)}</View>

          <TouchableOpacity
            style={[
              styles.cancelButton,
              {
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.cancelText, { color: theme.colors.text.primary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsList: {
    maxHeight: 400,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  actionTitle: {
    fontSize: 16,
    flex: 1,
  },
  cancelButton: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
