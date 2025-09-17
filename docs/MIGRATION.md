# Migration Guide

This guide helps you migrate between different versions of @bear-block/chatx.

## Migration from v0.0.x to v0.1.x

### Breaking Changes

#### 1. Theme System Changes

**Before:**
```tsx
import { ThemeProvider } from '@bear-block/chatx';

<ThemeProvider mode="light">
  <ChatApp />
</ThemeProvider>
```

**After:**
```tsx
import { ChatThemeProvider } from '@bear-block/chatx';

<ChatThemeProvider
  theme={{
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      // ... other colors
    },
    // ... other theme properties
  }}
>
  <ChatApp />
</ChatThemeProvider>
```

#### 2. Configuration System

**Before:**
```tsx
<ChatApp
  showReactions={true}
  showTimestamps={true}
  enableReplies={true}
  // ... other props
/>
```

**After:**
```tsx
import { ChatConfigProvider } from '@bear-block/chatx';

<ChatConfigProvider
  initialConfig={{
    features: {
      enableReactions: true,
      enableReplies: true,
      // ... other features
    },
    ui: {
      showTimestamps: true,
      // ... other UI settings
    },
    // ... other config
  }}
>
  <ChatApp />
</ChatConfigProvider>
```

#### 3. Message Types

**Before:**
```tsx
const message = {
  id: '1',
  text: 'Hello',
  user: user,
  timestamp: Date.now(),
  // ... other properties
};
```

**After:**
```tsx
const message = {
  id: '1',
  type: 'text',
  text: 'Hello',
  user: user,
  chatId: 'chat1',
  status: 'sent',
  isRead: false,
  timestamp: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  // ... other properties
};
```

#### 4. Component Imports

**Before:**
```tsx
import { ChatList, MessageItem, TextMessage } from '@bear-block/chatx';
```

**After:**
```tsx
import { 
  ChatApp, 
  ChatConfigProvider, 
  ChatThemeProvider,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  FileMessage,
  GifMessage
} from '@bear-block/chatx';
```

### New Features

#### 1. Error Boundaries

```tsx
import { ErrorBoundary } from '@bear-block/chatx';

<ErrorBoundary
  fallback={(error, retry) => (
    <View>
      <Text>Something went wrong: {error.message}</Text>
      <Button onPress={retry} title="Try Again" />
    </View>
  )}
>
  <ChatApp />
</ErrorBoundary>
```

#### 2. Performance Monitoring

```tsx
import { usePerformanceMonitor } from '@bear-block/chatx';

const MyComponent = () => {
  const { startTiming, endTiming } = usePerformanceMonitor('my-operation');
  
  const handleOperation = () => {
    startTiming();
    // ... do work
    endTiming();
  };
  
  return <View />;
};
```

#### 3. Development Tools

```tsx
import { ChatDevToolsProvider } from '@bear-block/chatx';

<ChatDevToolsProvider>
  <ChatApp />
</ChatDevToolsProvider>
```

### Migration Steps

1. **Update Dependencies**
   ```bash
   npm install @bear-block/chatx@latest
   # or
   yarn add @bear-block/chatx@latest
   ```

2. **Update Imports**
   - Replace `ThemeProvider` with `ChatThemeProvider`
   - Add `ChatConfigProvider` for configuration
   - Update component imports

3. **Update Theme Configuration**
   - Move theme configuration to `ChatThemeProvider`
   - Update theme structure to match new format

4. **Update Message Structure**
   - Add required fields: `type`, `chatId`, `status`, `isRead`
   - Add timestamp fields: `createdAt`, `updatedAt`

5. **Update Component Usage**
   - Wrap with `ChatConfigProvider` and `ChatThemeProvider`
   - Use new `ChatApp` component instead of individual components

6. **Test Your Application**
   - Run your application
   - Check for any console errors
   - Verify all features work as expected

### Common Issues

#### Issue: Theme not applying
**Solution:** Make sure you're using `ChatThemeProvider` instead of `ThemeProvider`.

#### Issue: Configuration not working
**Solution:** Wrap your app with `ChatConfigProvider` and use the new configuration structure.

#### Issue: Messages not displaying
**Solution:** Check that your message objects have all required fields (`type`, `chatId`, `status`, `isRead`).

#### Issue: Performance issues
**Solution:** Enable performance optimizations in your configuration:
```tsx
<ChatConfigProvider
  initialConfig={{
    performance: {
      enableVirtualization: true,
      enableImageLazyLoading: true,
      enableMessageMemoization: true,
    },
  }}
>
  <ChatApp />
</ChatConfigProvider>
```

### Getting Help

If you encounter issues during migration:

1. Check the [documentation](README.md)
2. Search [GitHub issues](https://github.com/bear-block/chatx/issues)
3. Create a new issue with migration details
4. Join our [Discord community](https://discord.gg/chatx)

### Rollback Plan

If you need to rollback:

1. Revert to previous version:
   ```bash
   npm install @bear-block/chatx@0.0.x
   # or
   yarn add @bear-block/chatx@0.0.x
   ```

2. Revert code changes
3. Test your application
4. Report issues to help improve the library
