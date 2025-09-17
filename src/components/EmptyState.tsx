import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { EmptyStateProps } from '../types';

const EmptyState: React.FC<EmptyStateProps> = ({
  text = 'No messages yet',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default EmptyState;
