import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';
import { UserProfile } from '../../types/profile';
import { getProfile, updateProfile } from '../../services/profileService';
import { Ionicons } from '@expo/vector-icons';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrentProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load profile details.');
      } finally {
        setIsLoading(false);
      }
    }
    loadCurrentProfile();
  }, []);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Validation Error', 'Full Name is required and cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = await updateProfile({
        name: trimmedName,
        phone: phone.trim(),
      });

      updateUser({
        name: updatedData.name,
      });

      Alert.alert('Success', 'Your personal profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Update Error', err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading Profile Editor...</Text>
          </View>
        ) : errorMessage ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Unable to Load Form
            </Text>
            <Text variant="caption" style={styles.errorSubtitle}>
              {errorMessage}
            </Text>
          </Card>
        ) : (
          <>
            <Card variant="elevated" style={styles.card}>
              <Text variant="heading" style={styles.headerTitle}>
                Edit Personal Information
              </Text>
              <Text variant="caption" style={styles.headerSub}>
                Update your name and phone number. Security assignment fields are read-only.
              </Text>
              <View style={styles.divider} />

              {/* Editable Fields */}
              <Input
                label="Full Name *"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <Input
                label="Phone Number"
                placeholder="Enter your contact phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              {/* Read-Only Account Identity Fields */}
              <View style={styles.readOnlyContainer}>
                <Text variant="caption" style={styles.readOnlyNotice}>
                  🔒 Account & Role Metadata (Read-Only)
                </Text>

                <View style={styles.readOnlyField}>
                  <Text variant="caption" style={styles.readOnlyLabel}>
                    Email Address (Login ID)
                  </Text>
                  <Text variant="body" style={styles.readOnlyVal}>
                    {profile?.email}
                  </Text>
                </View>

                <View style={styles.readOnlyField}>
                  <Text variant="caption" style={styles.readOnlyLabel}>
                    Role
                  </Text>
                  <Text variant="body" style={styles.readOnlyVal}>
                    {profile?.role?.toUpperCase()}
                  </Text>
                </View>

                {profile?.building?.name && (
                  <View style={styles.readOnlyField}>
                    <Text variant="caption" style={styles.readOnlyLabel}>
                      Assigned Building
                    </Text>
                    <Text variant="body" style={styles.readOnlyVal}>
                      {profile.building.name}
                    </Text>
                  </View>
                )}
              </View>

              {/* Buttons */}
              <Button
                title={isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
                variant="primary"
                onPress={handleSave}
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
          </>
        )}
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  errorCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  errorSubtitle: {
    textAlign: 'center',
    marginTop: 4,
    color: theme.colors.textSecondary,
  },
  card: {
    padding: theme.spacing.lg,
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
  readOnlyContainer: {
    backgroundColor: theme.colors.surfaceHover,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  readOnlyNotice: {
    color: theme.colors.textMuted,
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 2,
  },
  readOnlyField: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
    paddingBottom: 4,
  },
  readOnlyLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  readOnlyVal: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  saveBtn: {
    marginTop: theme.spacing.sm,
  },
  cancelBtn: {
    marginTop: theme.spacing.sm,
  },
});
