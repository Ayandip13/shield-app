import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  iconName?: keyof typeof Ionicons.glyphMap;
  isLoading?: boolean;
}

const { width } = Dimensions.get('window');

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Sign Out',
  message = 'Are you sure you want to sign out? You will need to log back in to access your security portal.',
  confirmText = 'Sign Out',
  cancelText = 'Cancel',
  variant = 'danger',
  iconName = 'log-out-outline',
  isLoading = false,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: '#FEE2E2',
          iconColor: '#DC2626',
          buttonBg: '#DC2626',
          buttonText: '#FFFFFF',
        };
      case 'warning':
        return {
          iconBg: '#FEF3C7',
          iconColor: '#D97706',
          buttonBg: '#D97706',
          buttonText: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          iconBg: '#EFF6FF',
          iconColor: theme.colors.primary,
          buttonBg: theme.colors.primary,
          buttonText: '#FFFFFF',
        };
    }
  };

  const colors = getVariantColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalCard}>
              {/* Top Accent / Icon */}
              <View style={[styles.iconCircle, { backgroundColor: colors.iconBg }]}>
                <Ionicons name={iconName} size={30} color={colors.iconColor} />
              </View>

              {/* Title & Message */}
              <Text variant="heading" style={styles.titleText}>
                {title}
              </Text>
              <Text variant="body" style={styles.messageText}>
                {message}
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelBtnText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: colors.buttonBg }]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <Text style={[styles.confirmBtnText, { color: colors.buttonText }]}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalCard: {
    width: Math.min(width - theme.spacing.lg * 2, 380),
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  titleText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  messageText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceHover,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmBtnText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '700',
  },
});
