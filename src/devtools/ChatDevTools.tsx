import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { useChatConfig } from '../config/ChatConfigProvider';
import { useChatThemeValue } from '../theme/chatThemeProvider';
import { PerformanceMonitor } from '../utils/performance';

interface ChatDevToolsProps {
  visible: boolean;
  onClose: () => void;
}

export const ChatDevTools: React.FC<ChatDevToolsProps> = ({
  useCallback(
    (feature: keyof typeof config.features)
  useCallback(
    (setting: keyof typeof config.ui)
  useCallback(
    (setting: keyof typeof config.performance)
  useState(false)
  useEffect(()

  visible,
  onClose,
}) => {
  const theme = useChatThemeValue();
  const { config, updateConfig } = useChatConfig();
  const [activeTab, setActiveTab] = useState<
    'features' | 'performance' | 'theme' | 'logs'
  >('features');

  if (!visible || !config.development.enableDebugMode) return null;

  const handleFeatureToggle =  => {
      updateConfig({
        features: {
          ...config.features,
          [feature]: !config.features[feature],
        },
      });
    },
    [config.features, updateConfig]
  );

  const handleUISettingToggle =  => {
      updateConfig({
        ui: {
          ...config.ui,
          [setting]: !config.ui[setting],
        },
      });
    },
    [config.ui, updateConfig]
  );

  const handlePerformanceToggle =  => {
      updateConfig({
        performance: {
          ...config.performance,
          [setting]: !config.performance[setting],
        },
      });
    },
    [config.performance, updateConfig]
  );

  const renderFeaturesTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Feature Flags
      </Text>

      {Object.entries(config.features).map(([key, value]) => (
        <View key={key} style={styles.settingRow}>
          <Text
            style={[styles.settingLabel, { color: theme.colors.text.primary }]}
          >
            {key
              .replace('enable', '')
              .replace(/([A-Z])/g, ' $1')
              .trim()}
          </Text>
          <Switch
            value={value}
            onValueChange={() =>
              handleFeatureToggle(key as keyof typeof config.features)
            }
            trackColor={{
              false: theme.colors.border.light,
              true: theme.colors.primary,
            }}
            thumbColor={
              value ? theme.colors.text.inverse : theme.colors.text.disabled
            }
          />
        </View>
      ))}
    </ScrollView>
  );

  const renderPerformanceTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Performance Settings
      </Text>

      {Object.entries(config.performance).map(([key, value]) => (
        <View key={key} style={styles.settingRow}>
          <Text
            style={[styles.settingLabel, { color: theme.colors.text.primary }]}
          >
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </Text>
          {typeof value === 'boolean' ? (
            <Switch
              value={value}
              onValueChange={() =>
                handlePerformanceToggle(key as keyof typeof config.performance)
              }
              trackColor={{
                false: theme.colors.border.light,
                true: theme.colors.primary,
              }}
              thumbColor={
                value ? theme.colors.text.inverse : theme.colors.text.disabled
              }
            />
          ) : (
            <Text
              style={[
                styles.settingValue,
                { color: theme.colors.text.secondary },
              ]}
            >
              {value}
            </Text>
          )}
        </View>
      ))}

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text.primary, marginTop: 20 },
        ]}
      >
        Performance Metrics
      </Text>

      <View
        style={[
          styles.metricsContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text
          style={[styles.metricText, { color: theme.colors.text.secondary }]}
        >
          Memory Usage: {JSON.stringify(PerformanceMonitor.getInstance())}
        </Text>
      </View>
    </ScrollView>
  );

  const renderThemeTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Theme Settings
      </Text>

      <View
        style={[
          styles.themePreview,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.themeText, { color: theme.colors.text.primary }]}>
          Theme Preview
        </Text>
        <View
          style={[
            styles.themeBubble,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[
              styles.themeBubbleText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Sample Message
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderLogsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Debug Logs
      </Text>

      <View
        style={[
          styles.logsContainer,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={[styles.logText, { color: theme.colors.text.secondary }]}>
          Debug logs will appear here...
        </Text>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'features':
        return renderFeaturesTab();
      case 'performance':
        return renderPerformanceTab();
      case 'theme':
        return renderThemeTab();
      case 'logs':
        return renderLogsTab();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.colors.border.light },
        ]}
      >
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Chat Dev Tools
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.closeButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View
        style={[styles.tabs, { borderBottomColor: theme.colors.border.light }]}
      >
        {[
          { key: 'features', label: 'Features' },
          { key: 'performance', label: 'Performance' },
          { key: 'theme', label: 'Theme' },
          { key: 'logs', label: 'Logs' },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              activeTab === key && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab(key as any)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === key
                      ? theme.colors.primary
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLabel: {
    fontSize: 14,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  metricText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  themePreview: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  themeText: {
    fontSize: 16,
    marginBottom: 12,
  },
  themeBubble: {
    padding: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  themeBubbleText: {
    fontSize: 14,
  },
  logsContainer: {
    padding: 12,
    borderRadius: 8,
    minHeight: 200,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

// Dev Tools Provider
export const ChatDevToolsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [devToolsVisible, setDevToolsVisible] = ;

  // Add shake gesture to open dev tools in development
  React. => {
    if (__DEV__) {
      // Add shake detection here if needed
    }
  }, []);

  return (
    <>
      {children}
      <ChatDevTools
        visible={devToolsVisible}
        onClose={() => setDevToolsVisible(false)}
      />
    </>
  );
};
