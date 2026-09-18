import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { useToast } from '../../context/ToastContext';
import { Guard } from '../../types/guard';
import { getGuard, updateGuardStatus } from '../../services/guardService';
import { ProviderStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type DetailsRouteProp = RouteProp<ProviderStackParamList, 'GuardDetails'>;
type DetailsNavProp = NativeStackNavigationProp<ProviderStackParamList, 'GuardDetails'>;

export const GuardDetailsScreen: React.FC = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<DetailsNavProp>();
  const { showSuccess, showError } = useToast();
  const { guardId } = route.params;

  const [guard, setGuard] = useState<Guard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDetails = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await getGuard(guardId);
      setGuard(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch guard details.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDetails();
    }, [guardId])
  );

  const handleToggleStatus = async () => {
    if (!guard) return;

    const newStatus = !guard.isActive;
    const actionLabel = newStatus ? 'Activate' : 'Deactivate';

    Alert.alert(
      `${actionLabel} Guard Account?`,
      `Are you sure you want to ${actionLabel.toLowerCase()} "${guard.name}"? ${
        !newStatus ? 'Inactive guards cannot log in.' : ''
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionLabel,
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            setIsTogglingStatus(true);
            try {
              const updated = await updateGuardStatus(guard._id, newStatus);
              setGuard(updated);
              showSuccess('Guard Updated', `Guard account has been ${newStatus ? 'activated' : 'deactivated'}.`);
            } catch (err: any) {
              showError('Update Failed', err.message || 'Failed to update guard status.');
            } finally {
              setIsTogglingStatus(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getBuildingName = () => {
    if (!guard || !guard.buildingId) return 'Unassigned';
    if (typeof guard.buildingId === 'object' && guard.buildingId.name) {
      return guard.buildingId.name;
    }
    return 'Assigned Building';
  };

  const getBuildingAddress = () => {
    if (guard && typeof guard.buildingId === 'object' && guard.buildingId.address) {
      return guard.buildingId.address;
    }
    return null;
  };

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading guard record...</Text>
      </ScreenWrapper>
    );
  }

  if (errorMessage || !guard) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
        <Text variant="heading" style={styles.errorTitle}>
          Guard Not Found
        </Text>
        <Text variant="caption" style={styles.errorSubtitle}>
          {errorMessage || 'Unable to retrieve guard record.'}
        </Text>
        <Button
          title="Back to Guards"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchDetails(true)}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Profile Card Header */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                guard.isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  guard.isActive ? styles.activeStatusText : styles.inactiveStatusText,
                ]}
              >
                ● {guard.isActive ? 'Active Guard' : 'Account Deactivated'}
              </Text>
            </View>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.profileDetails}>
              <Text variant="title" style={styles.guardTitle}>
                {guard.name}
              </Text>
              {guard.designation ? (
                <Text variant="caption" style={styles.designationText}>
                  {guard.designation}
                </Text>
              ) : null}
              {guard.employeeId ? (
                <Text variant="caption" style={styles.employeeBadgeText}>
                  ID: {guard.employeeId}
                </Text>
              ) : null}
            </View>
          </View>
        </Card>

        {/* Building Assignment Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Assigned Duty Location
          </Text>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={22} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Building Name</Text>
              <Text variant="body" style={styles.infoValText}>
                {getBuildingName()}
              </Text>
              {getBuildingAddress() ? (
                <Text variant="caption" style={styles.infoSubValText}>
                  📍 {getBuildingAddress()}
                </Text>
              ) : null}
            </View>
          </View>
        </Card>

        {/* Contact & Employee Information */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Personnel & Contract Details
          </Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Email Address</Text>
              <Text variant="body" style={styles.infoValText}>
                {guard.email}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Phone Number</Text>
              <Text variant="body" style={styles.infoValText}>
                {guard.phone || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Joining Date</Text>
              <Text variant="body" style={styles.infoValText}>
                {formatDate(guard.joiningDate)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Base Monthly Salary</Text>
              <Text variant="body" style={styles.infoValText}>
                {guard.monthlySalary !== undefined && guard.monthlySalary !== null
                  ? `$${guard.monthlySalary}`
                  : 'Not specified'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions Card */}
        <Card variant="elevated" style={styles.actionsCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Management Actions
          </Text>
          <View style={styles.divider} />

          <View style={styles.actionButtonsCol}>
            <Button
              title="Edit Guard Details"
              variant="outline"
              leftIcon={<Ionicons name="create-outline" size={18} color={theme.colors.primary} />}
              onPress={() => navigation.navigate('EditGuard', { guard })}
              style={styles.actionBtn}
            />

            <Button
              title={
                isTogglingStatus
                  ? 'Updating...'
                  : guard.isActive
                  ? 'Deactivate Guard Account'
                  : 'Activate Guard Account'
              }
              variant={guard.isActive ? 'outline' : 'primary'}
              leftIcon={
                <Ionicons
                  name={guard.isActive ? 'pause-circle-outline' : 'play-circle-outline'}
                  size={18}
                  color={guard.isActive ? theme.colors.danger : '#FFFFFF'}
                />
              }
              onPress={handleToggleStatus}
              disabled={isTogglingStatus}
              style={[
                styles.actionBtn,
                guard.isActive ? styles.deactivateBtn : undefined,
              ]}
            />
          </View>
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
    gap: theme.spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  errorTitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  errorSubtitle: {
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  backBtn: {
    marginTop: theme.spacing.md,
  },
  headerCard: {
    padding: theme.spacing.xl,
  },
  statusRow: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  activeBadge: {
    backgroundColor: theme.colors.successLight,
  },
  inactiveBadge: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeStatusText: {
    color: '#065F46',
  },
  inactiveStatusText: {
    color: '#475569',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.guard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  profileDetails: {
    flex: 1,
  },
  guardTitle: {
    color: theme.colors.textPrimary,
  },
  designationText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  employeeBadgeText: {
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  infoCard: {
    padding: theme.spacing.lg,
  },
  cardSectionTitle: {
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  infoValText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  infoSubValText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionsCard: {
    padding: theme.spacing.lg,
  },
  actionButtonsCol: {
    gap: theme.spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
  deactivateBtn: {
    borderColor: theme.colors.danger,
  },
});
