import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../components/common/Text';
import { theme } from '../theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

/**
 * Display native ToastAndroid popup on Android (with fallback)
 */
export const showToastMessage = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
};

interface ToastContextType {
  showToast: (config: ToastConfig | string, message?: string, type?: ToastType) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let globalShowToast: ((config: ToastConfig | string, message?: string, type?: ToastType) => void) | null = null;

/**
 * Static helper function to trigger toast anywhere, even outside React components
 */
export const toast = {
  show: (config: ToastConfig | string, message?: string, type?: ToastType) => {
    const msgStr = typeof config === 'string'
      ? (message ? `${config}: ${message}` : config)
      : (config.title && config.message ? `${config.title}: ${config.message}` : config.message || config.title || '');

    if (Platform.OS === 'android') {
      showToastMessage(msgStr);
    } else if (globalShowToast) {
      globalShowToast(config, message, type);
    }
  },
  success: (title: string, message?: string) => {
    const fullMsg = message ? `${title}: ${message}` : title;
    if (Platform.OS === 'android') {
      showToastMessage(fullMsg);
    } else if (globalShowToast) {
      globalShowToast({ title, message: message || '', type: 'success' });
    }
  },
  error: (title: string, message?: string) => {
    const fullMsg = message ? `${title}: ${message}` : title;
    if (Platform.OS === 'android') {
      showToastMessage(fullMsg);
    } else if (globalShowToast) {
      globalShowToast({ title, message: message || '', type: 'error' });
    }
  },
  info: (title: string, message?: string) => {
    const fullMsg = message ? `${title}: ${message}` : title;
    if (Platform.OS === 'android') {
      showToastMessage(fullMsg);
    } else if (globalShowToast) {
      globalShowToast({ title, message: message || '', type: 'info' });
    }
  },
  warning: (title: string, message?: string) => {
    const fullMsg = message ? `${title}: ${message}` : title;
    if (Platform.OS === 'android') {
      showToastMessage(fullMsg);
    } else if (globalShowToast) {
      globalShowToast({ title, message: message || '', type: 'warning' });
    }
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastData, setToastData] = useState<ToastConfig | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setToastData(null);
    });
  }, [translateY, opacity]);

  const showToast = useCallback(
    (config: ToastConfig | string, message?: string, type: ToastType = 'info') => {
      let parsedConfig: ToastConfig;
      if (typeof config === 'string') {
        parsedConfig = {
          title: message ? config : undefined,
          message: message || config,
          type,
        };
      } else {
        parsedConfig = config;
      }

      // Execute ONLY ToastAndroid on Android devices
      if (Platform.OS === 'android') {
        const androidMsg = parsedConfig.title && parsedConfig.message
          ? `${parsedConfig.title}: ${parsedConfig.message}`
          : parsedConfig.message || parsedConfig.title || '';
        if (androidMsg) {
          ToastAndroid.show(androidMsg, ToastAndroid.SHORT);
        }
        return; // Do not render custom top banner on Android
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToastData(parsedConfig);
      setVisible(true);

      translateY.setValue(-120);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const duration = parsedConfig.duration || 3500;
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [translateY, opacity, hideToast]
  );

  globalShowToast = showToast;

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({ title, message: message || '', type: 'success' });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({ title, message: message || '', type: 'error' });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({ title, message: message || '', type: 'info' });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast({ title, message: message || '', type: 'warning' });
  }, [showToast]);

  const getTypeStyle = (type: ToastType = 'info') => {
    switch (type) {
      case 'success':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          iconBg: '#10B981',
          iconName: 'checkmark-circle' as const,
          iconColor: '#FFFFFF',
          titleColor: '#065F46',
          msgColor: '#047857',
        };
      case 'error':
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          iconBg: '#EF4444',
          iconName: 'alert-circle' as const,
          iconColor: '#FFFFFF',
          titleColor: '#991B1B',
          msgColor: '#B91C1C',
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          iconBg: '#F59E0B',
          iconName: 'warning' as const,
          iconColor: '#FFFFFF',
          titleColor: '#92400E',
          msgColor: '#B45309',
        };
      case 'info':
      default:
        return {
          bg: '#EFF6FF',
          border: '#BFDBFE',
          iconBg: '#3B82F6',
          iconName: 'information-circle' as const,
          iconColor: '#FFFFFF',
          titleColor: '#1E40AF',
          msgColor: '#1D4ED8',
        };
    }
  };

  const styleConfig = getTypeStyle(toastData?.type);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        hideToast,
      }}
    >
      {children}
      {visible && toastData && (
        <SafeAreaView pointerEvents="box-none" style={styles.toastOverlay}>
          <Animated.View
            style={[
              styles.toastCard,
              {
                backgroundColor: styleConfig.bg,
                borderColor: styleConfig.border,
                transform: [{ translateY }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={hideToast}
              style={styles.toastContent}
            >
              <View style={[styles.iconCircle, { backgroundColor: styleConfig.iconBg }]}>
                <Ionicons name={styleConfig.iconName} size={20} color={styleConfig.iconColor} />
              </View>

              <View style={styles.textContainer}>
                {toastData.title ? (
                  <Text
                    style={[styles.toastTitle, { color: styleConfig.titleColor }]}
                    numberOfLines={1}
                  >
                    {toastData.title}
                  </Text>
                ) : null}
                {toastData.message ? (
                  <Text
                    style={[styles.toastMessage, { color: styleConfig.msgColor }]}
                    numberOfLines={2}
                  >
                    {toastData.message}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity onPress={hideToast} style={styles.closeBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={18} color={styleConfig.titleColor} />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  toastMessage: {
    fontSize: theme.typography.fontSizes.xs + 1,
    fontWeight: '500',
    lineHeight: 16,
  },
  closeBtn: {
    padding: 4,
  },
});
