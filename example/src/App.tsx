import React from 'react';
import { StyleSheet, View } from 'react-native';
import ComprehensiveExample from './ComprehensiveExample';

export default function App() {
  return (
    <View style={styles.container}>
      <ComprehensiveExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
