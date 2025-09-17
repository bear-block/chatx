import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { useChatThemeValue } from '../../theme/chatThemeProvider';
import type { Message } from '../../types';
import { MessageItem } from '../MessageItem';

interface MessageSearchProps {
  messages: Message[];
  onSearch: (query: string) => void;
  onClear: () => void;
  onMessagePress?: (message: Message) => void;
  placeholder?: string;
  style?: any;
}

interface SearchResult {
  message: Message;
  highlights: Array<{
    field: string;
    text: string;
    start: number;
    end: number;
  }>;
  score: number;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  messages,
  onSearch,
  onClear,
  onMessagePress,
  placeholder = 'Search messages...',
  style,
}) => {
  const theme = useChatThemeValue();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchMessages = useCallback(
    (_searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const searchResults: SearchResult[] = [];

      messages.forEach(message) => {
        const searchText = message.text?.toLowerCase() || '';
        const queryLower = searchQuery.toLowerCase();

        if (searchText.includes(queryLower)) {
          const highlights = [];
          let startIndex = 0;
          let index = searchText.indexOf(queryLower, startIndex);

          while (index !== -1) {
            highlights.push({
              field: 'text',
              text:
                message.text?.substring(index, index + queryLower.length) || '',
              start: index,
              end: index + queryLower.length,
            });
            startIndex = index + 1;
            index = searchText.indexOf(queryLower, startIndex);
          }

          searchResults.push({
            message,
            highlights,
            score: highlights.length,
          });
        }
      });

      // Sort by score (number of matches) and timestamp
      searchResults.sort(a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return b.message.timestamp - a.message.timestamp;
      });

      setResults(searchResults);
      setIsSearching(false);
    },
    [messages]
  );

  const handleSearch = useCallback(
    (_text: string) => {
      setQuery(text);
      searchMessages(text);
      onSearch(text);
    },
    [searchMessages, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    onClear();
  }, [onClear]);

  const renderSearchResult = useCallback(
    ({ item }: { item: SearchResult }) => {
      const { message, highlights } = item;

      return (
        <TouchableOpacity
          style={[
            styles.resultItem,
            {
              backgroundColor: theme.colors.surface,
              borderBottomColor: theme.colors.border.light,
            },
          ]}
          onPress={() => onMessagePress?.(message)}
          activeOpacity={0.7}
        >
          <View style={styles.resultContent}>
            <Text
              style={[
                styles.messagePreview,
                { color: theme.colors.text.primary },
              ]}
            >
              {message.text}
            </Text>

            <View style={styles.resultFooter}>
              <Text
                style={[
                  styles.userName,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {message.user.name}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  { color: theme.colors.text.disabled },
                ]}
              >
                {new Date(message.timestamp).toLocaleDateString()}
              </Text>
            </View>

            {highlights.length > 0 && (
              <View style={styles.highlightsContainer}>
                {highlights.slice(0, 2).map(highlight, index) => (
                  <Text
                    key={index}
                    style={[styles.highlight, { color: theme.colors.primary }]}
                  >
                    ...{highlight.text}...
                  </Text>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [theme, onMessagePress]
  );

  const renderEmptyResults = useCallback(() => {
    if (isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[styles.emptyText, { color: theme.colors.text.secondary }]}
          >
            Searching...
          </Text>
        </View>
      );
    }

    if (query && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[styles.emptyText, { color: theme.colors.text.secondary }]}
          >
            No messages found for "{query}"
          </Text>
        </View>
      );
    }

    return null;
  }, [isSearching, query, results.length, theme.colors.text.secondary]);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.border.medium,
            borderWidth: 1,
          },
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.md,
            },
          ]}
          value={query}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.disabled}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.clearText, { color: theme.colors.text.secondary }]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {query.length > 0 && (
        <View
          style={[
            styles.resultsContainer,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border.light,
              borderTopWidth: 1,
            },
          ]}
        >
          <FlatList
            data={results}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.message.id}
            ListEmptyComponent={renderEmptyResults}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 8,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  resultContent: {
    flex: 1,
  },
  messagePreview: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
  },
  highlightsContainer: {
    marginTop: 4,
  },
  highlight: {
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
