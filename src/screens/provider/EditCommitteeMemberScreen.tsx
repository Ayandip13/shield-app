import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BuildingPicker } from '../../components/common/BuildingPicker';
import { theme } from '../../theme';
import { Building } from '../../types/building';
import { getBuildings } from '../../services/buildingService';
import { updateCommitteeMember } from '../../services/committeeService';
import { ProviderStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type EditRouteProp = RouteProp<ProviderStackParamList, 'EditCommitteeMember'>;

const PHONE_REGEX = /^[+0-9\s\-()]{5,20}$/;

export const EditCommitteeMemberScreen: React.FC = () => {
  const route = useRoute<EditRouteProp>();
  const navigation = useNavigation();
  const { member } = route.params;

  const initialBuildingId =
    typeof member.buildingId === 'object' && member.buildingId
      ? member.buildingId._id
      : (member.buildingId as string) || '';

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState<boolean>(true);

  const [name, setName] = useState<string>(member.name);
  const [phone, setPhone] = useState<string>(member.phone || '');
  const [buildingId, setBuildingId] = useState<string>(initialBuildingId);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    buildingId?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadBuildings() {
      try {
        const data = await getBuildings();
        setBuildings(data);
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          general: 'Failed to load buildings directory.',
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
      newErrors.name = 'Member Name is required';
    }

    if (phone.trim() && !PHONE_REGEX.test(phone.trim())) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!buildingId) {
      newErrors.buildingId = 'Assigned building is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await updateCommitteeMember(member._id, {
        name: name.trim(),
        phone: phone.trim() || undefined,
        buildingId,
      });

      navigation.goBack();
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to update member details.',
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
              <Ionicons name="create" size={28} color={theme.colors.committee} />
              <Text variant="title" style={styles.headerTitle}>
                Edit Committee Member
              </Text>
            </View>
            <Text variant="caption" style={styles.headerSubtitle}>
              Update contact info or building assignment for {member.name}.
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
                <Text style={styles.loadingText}>Fetching building options...</Text>
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Input
                  label="Full Name *"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  error={errors.name}
                />

                <Input
                  label="Email (Account Username)"
                  value={member.email}
                  editable={false}
                  hint="Account email address cannot be changed."
                />

                <Input
                  label="Phone Number"
                  placeholder="e.g. +1-555-9101"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  keyboardType="phone-pad"
                  error={errors.phone}
                />

                <BuildingPicker
                  label="Represented Building *"
                  selectedBuildingId={buildingId}
                  buildings={buildings}
                  onSelect={(id) => {
                    setBuildingId(id);
                    if (errors.buildingId) setErrors((prev) => ({ ...prev, buildingId: undefined }));
                  }}
                  error={errors.buildingId}
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
                title={isSubmitting ? 'Saving...' : 'Update Member'}
                variant="primary"
                onPress={handleUpdate}
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
