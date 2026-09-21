import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme';
import { createBuilding } from '../../services/buildingService';
import { Ionicons } from '@expo/vector-icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-()]{5,20}$/;

export const AddBuildingScreen: React.FC = () => {
  const navigation = useNavigation();

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');

  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    contactPhone?: string;
    contactEmail?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Building Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Building Name must be at least 2 characters';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    } else if (address.trim().length < 3) {
      newErrors.address = 'Address must be at least 3 characters';
    }

    if (contactEmail.trim() && !EMAIL_REGEX.test(contactEmail.trim().toLowerCase())) {
      newErrors.contactEmail = 'Invalid email address format';
    }

    if (contactPhone.trim() && !PHONE_REGEX.test(contactPhone.trim())) {
      newErrors.contactPhone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await createBuilding({
        name: name.trim(),
        address: address.trim(),
        contactPhone: contactPhone.trim() || undefined,
        contactEmail: contactEmail.trim().toLowerCase() || undefined,
      });

      // Return to dashboard/buildings list
      navigation.goBack();
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to create building. Please check your network connection.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="business" size={28} color={theme.colors.primary} />
              <Text variant="subtitle" style={styles.headerTitle}>
                Register New Building
              </Text>
            </View>
            <Text variant="caption" style={styles.headerSubtitle}>
              Add a building managed under your security provider.
            </Text>

            {errors.general ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <Input
                label="Building Name *"
                placeholder="e.g. Green View Residency"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
              />

              <Input
                label="Full Address *"
                placeholder="e.g. 42 Park Avenue, Sector 5"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                multiline
                numberOfLines={3}
                style={styles.multilineInput}
                error={errors.address}
              />

              <Input
                label="Contact Phone (Optional)"
                placeholder="e.g. +1-555-0101"
                value={contactPhone}
                onChangeText={(text) => {
                  setContactPhone(text);
                  if (errors.contactPhone)
                    setErrors((prev) => ({ ...prev, contactPhone: undefined }));
                }}
                keyboardType="phone-pad"
                error={errors.contactPhone}
              />

              <Input
                label="Contact Email (Optional)"
                placeholder="e.g. info@greenviewresidency.com"
                value={contactEmail}
                onChangeText={(text) => {
                  setContactEmail(text);
                  if (errors.contactEmail)
                    setErrors((prev) => ({ ...prev, contactEmail: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.contactEmail}
              />
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => navigation.goBack()}
                disabled={isSubmitting}
                style={styles.cancelButton}
              />
              <Button
                title={isSubmitting ? 'Creating...' : 'Save Building'}
                variant="primary"
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  formCard: {
    padding: theme.spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.dangerLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 13,
    flex: 1,
  },
  formGroup: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
