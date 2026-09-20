import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BuildingPicker } from '../../components/common/BuildingPicker';
import { theme } from '../../theme';
import { Building } from '../../types/building';
import { getBuildings } from '../../services/buildingService';
import { createGuard } from '../../services/guardService';
import { Ionicons } from '@expo/vector-icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-()]{5,20}$/;

export const AddGuardScreen: React.FC = () => {
  const navigation = useNavigation();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState<boolean>(true);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [buildingId, setBuildingId] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>('');
  const [monthlySalary, setMonthlySalary] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    buildingId?: string;
    monthlySalary?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadBuildings() {
      try {
        const data = await getBuildings();
        setBuildings(data);
        if (data.length > 0) {
          setBuildingId(data[0]._id);
        }
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          general: 'Failed to load buildings. Please ensure at least one building exists.',
        }));
      } finally {
        setIsLoadingBuildings(false);
      }
    }
    loadBuildings();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Guard Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      newErrors.email = 'Invalid email address format';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!PHONE_REGEX.test(phone.trim())) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!buildingId) {
      newErrors.buildingId = 'Please select a building for this guard';
    }

    if (monthlySalary.trim()) {
      const sal = Number(monthlySalary.trim());
      if (isNaN(sal) || sal < 0) {
        newErrors.monthlySalary = 'Monthly salary must be a valid positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await createGuard({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        buildingId,
        employeeId: employeeId.trim() || undefined,
        joiningDate: joiningDate.trim() || undefined,
        monthlySalary: monthlySalary.trim() ? Number(monthlySalary.trim()) : undefined,
        designation: designation.trim() || undefined,
      });

      navigation.goBack();
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to create guard account.',
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
              <Ionicons name="person-add" size={28} color={theme.colors.guard} />
              <Text variant="title" style={styles.headerTitle}>
                Register Security Guard
              </Text>
            </View>
            <Text variant="caption" style={styles.headerSubtitle}>
              Create a guard login account assigned to one of your buildings.
            </Text>

            {errors.general ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            {isLoadingBuildings ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={theme.colors.primary} />
                <Text style={styles.loadingText}>Fetching available buildings...</Text>
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Input
                  label="Full Name *"
                  placeholder="e.g. John Miller"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  error={errors.name}
                />

                <Input
                  label="Email Address *"
                  placeholder="e.g. guard1.greenview@secureguard.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <Input
                  label="Phone Number *"
                  placeholder="e.g. +1-555-9301"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  keyboardType="phone-pad"
                  error={errors.phone}
                />

                <Input
                  label="Login Password *"
                  placeholder="At least 6 characters"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  secureTextEntry
                  error={errors.password}
                />

                <BuildingPicker
                  label="Assigned Building *"
                  selectedBuildingId={buildingId}
                  buildings={buildings}
                  onSelect={(id) => {
                    setBuildingId(id);
                    if (errors.buildingId) setErrors((prev) => ({ ...prev, buildingId: undefined }));
                  }}
                  error={errors.buildingId}
                />

                <Input
                  label="Employee ID (Optional)"
                  placeholder="e.g. EMP-1092"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                />

                <Input
                  label="Designation / Role (Optional)"
                  placeholder="e.g. Head Security Officer"
                  value={designation}
                  onChangeText={setDesignation}
                />

                <Input
                  label="Joining Date (Optional)"
                  placeholder="e.g. YYYY-MM-DD"
                  value={joiningDate}
                  onChangeText={setJoiningDate}
                />

                <Input
                  label="Monthly Salary (Optional)"
                  placeholder="e.g. 18000"
                  value={monthlySalary}
                  onChangeText={(text) => {
                    setMonthlySalary(text);
                    if (errors.monthlySalary)
                      setErrors((prev) => ({ ...prev, monthlySalary: undefined }));
                  }}
                  keyboardType="numeric"
                  error={errors.monthlySalary}
                />
              </View>
            )}

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => navigation.goBack()}
                disabled={isSubmitting}
                style={styles.cancelButton}
              />
              <Button
                title={isSubmitting ? 'Creating...' : 'Save Guard'}
                variant="primary"
                onPress={handleSubmit}
                disabled={isSubmitting || isLoadingBuildings}
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
  loadingBox: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  formGroup: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
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
