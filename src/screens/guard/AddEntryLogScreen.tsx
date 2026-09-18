import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme';
import { useToast } from '../../context/ToastContext';
import { PersonType } from '../../types/entryLog';
import { createEntryLog } from '../../services/entryLogService';
import { Ionicons } from '@expo/vector-icons';

export const AddEntryLogScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showSuccess } = useToast();

  const [personName, setPersonName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [personType, setPersonType] = useState<PersonType>('visitor');
  const [flatUnit, setFlatUnit] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<{
    personName?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const personTypeOptions: { type: PersonType; label: string; icon: string }[] = [
    { type: 'visitor', label: 'Visitor', icon: 'person' },
    { type: 'delivery', label: 'Delivery', icon: 'cube' },
    { type: 'staff', label: 'Staff', icon: 'construct' },
    { type: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!personName.trim()) {
      newErrors.personName = 'Person Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await createEntryLog({
        personName: personName.trim(),
        phone: phone.trim() || undefined,
        personType,
        flatUnit: flatUnit.trim() || undefined,
        purpose: purpose.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      showSuccess(
        'Entry Logged Successfully',
        `Access granted and recorded for ${personName.trim()}.`
      );
      navigation.goBack();
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to record entry log.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-add" size={28} color={theme.colors.primary} />
              <Text variant="title" style={styles.headerTitle}>
                Record New Building Entry
              </Text>
            </View>
            <Text variant="caption" style={styles.headerSubtitle}>
              Log visitor or personnel details entering the building security gate.
            </Text>

            {errors.general ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              {/* Person Type Selector */}
              <View style={styles.typeSelectorContainer}>
                <Text variant="caption" style={styles.typeLabel}>
                  PERSON TYPE *
                </Text>
                <View style={styles.typeGrid}>
                  {personTypeOptions.map((opt) => {
                    const isSelected = personType === opt.type;
                    return (
                      <TouchableOpacity
                        key={opt.type}
                        style={[
                          styles.typePill,
                          isSelected && styles.selectedTypePill,
                        ]}
                        onPress={() => setPersonType(opt.type)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={opt.icon as any}
                          size={18}
                          color={isSelected ? '#FFFFFF' : theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.typePillText,
                            isSelected && styles.selectedTypePillText,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Input
                label="Person Name *"
                placeholder="e.g. Rahul Sharma or Courier Agent"
                value={personName}
                onChangeText={(text) => {
                  setPersonName(text);
                  if (errors.personName) setErrors((prev) => ({ ...prev, personName: undefined }));
                }}
                error={errors.personName}
              />

              <Input
                label="Flat / Unit Number"
                placeholder="e.g. 4B or Tower A-102"
                value={flatUnit}
                onChangeText={setFlatUnit}
              />

              <Input
                label="Purpose of Visit"
                placeholder="e.g. Visiting Resident / Package Delivery"
                value={purpose}
                onChangeText={setPurpose}
              />

              <Input
                label="Phone Number (Optional)"
                placeholder="e.g. 9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Input
                label="Security Notes (Optional)"
                placeholder="e.g. Vehicle Reg No, ID verified"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
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
                title={isSubmitting ? 'Recording...' : 'Record Entry'}
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
  typeSelectorContainer: {
    marginBottom: theme.spacing.sm,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceHover,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    gap: 6,
  },
  selectedTypePill: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  selectedTypePillText: {
    color: '#FFFFFF',
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
