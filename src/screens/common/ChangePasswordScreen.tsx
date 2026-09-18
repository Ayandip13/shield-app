import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { theme } from '../../theme';
import { changePassword } from '../../services/profileService';
import { Ionicons } from '@expo/vector-icons';

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { showSuccess, showError, showWarning } = useToast();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showWarning('Validation Error', 'All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      showWarning('Validation Error', 'New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showWarning('Validation Error', 'New password and confirmation password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      });

      showSuccess('Success', res.message || 'Your account password has been changed successfully.');
      navigation.goBack();
    } catch (err: any) {
      showError(
        'Password Change Error',
        err.message || 'Failed to update password. Please check your current password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text variant="heading" style={styles.headerTitle}>
                Change Password
              </Text>
              <Text variant="caption" style={styles.headerSub}>
                Update your account password. Must be at least 8 characters.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Current Password Field */}
          <Input
            label="Current Password *"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />

          {/* New Password Field */}
          <Input
            label="New Password *"
            placeholder="Enter at least 8 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          {/* Confirm Password Field */}
          <Input
            label="Confirm New Password *"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            title={isSubmitting ? 'Updating Password...' : 'Update Password'}
            variant="primary"
            onPress={handleChangePassword}
            disabled={isSubmitting}
            style={styles.saveBtn}
          />

          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            style={styles.cancelBtn}
          />
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  card: {
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textPrimary,
  },
  headerSub: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.md,
  },
  saveBtn: {
    marginTop: theme.spacing.md,
  },
  cancelBtn: {
    marginTop: theme.spacing.sm,
  },
});
