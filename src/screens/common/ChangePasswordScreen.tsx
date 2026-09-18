import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { changePassword } from '../../services/profileService';
import { Ionicons } from '@expo/vector-icons';

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showCurrentPw, setShowCurrentPw] = useState<boolean>(false);
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [showConfirmPw, setShowConfirmPw] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Validation Error', 'New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New password and confirmation password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      });

      Alert.alert('Success', res.message || 'Your account password has been changed successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      Alert.alert(
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
          <View style={styles.inputWrapper}>
            <Input
              label="Current Password *"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPw}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowCurrentPw(!showCurrentPw)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showCurrentPw ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* New Password Field */}
          <View style={styles.inputWrapper}>
            <Input
              label="New Password *"
              placeholder="Enter at least 8 characters"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPw}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowNewPw(!showNewPw)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showNewPw ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputWrapper}>
            <Input
              label="Confirm New Password *"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPw}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirmPw(!showConfirmPw)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirmPw ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

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
  inputWrapper: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 38,
    padding: 4,
    zIndex: 10,
  },
  saveBtn: {
    marginTop: theme.spacing.md,
  },
  cancelBtn: {
    marginTop: theme.spacing.sm,
  },
});
