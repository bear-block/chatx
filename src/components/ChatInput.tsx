import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { ChatInputProps } from '../types';

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Type a message...',
  maxLength = 1000,
  disabled = false,
  style,
  inputStyle,
  buttonStyle,
  multiline = true,
  autoFocus = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !multiline) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            inputStyle,
            disabled && styles.disabledInput,
          ]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
          autoFocus={autoFocus}
          onKeyPress={handleKeyPress}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            buttonStyle,
            (!text.trim() || disabled) && styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.sendButtonText,
              (!text.trim() || disabled) && styles.disabledButtonText,
            ]}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>

      {maxLength && (
        <Text style={styles.characterCount}>
          {text.length}/{maxLength}
        </Text>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F2F2F7',
  },
  disabledInput: {
    backgroundColor: '#F2F2F7',
    color: '#8E8E93',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButtonText: {
    color: '#8E8E93',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default ChatInput;
