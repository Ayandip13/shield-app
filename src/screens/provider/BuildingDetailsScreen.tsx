import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
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
import { ProviderStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useBuildingDetailsQuery } from '../../hooks/queries/useBuildings';
import {
  useUpdateBuildingStatusMutation,
  useDeleteBuildingMutation,
} from '../../hooks/mutations/useBuildingMutations';
import { DetailsSkeleton } from '../../components/skeletons/DetailsSkeleton';

type DetailsRouteProp = RouteProp<ProviderStackParamList, 'BuildingDetails'>;
type DetailsNavProp = NativeStackNavigationProp<ProviderStackParamList, 'BuildingDetails'>;

export const BuildingDetailsScreen: React.FC = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<DetailsNavProp>();
  const { showSuccess, showError } = useToast();
  const { buildingId } = route.params;

  const {
    data: building,
    isLoading,
    isRefetching: isRefreshing,
    error,
    refetch,
  } = useBuildingDetailsQuery(buildingId);

  const updateStatusMutation = useUpdateBuildingStatusMutation(buildingId);
  const isTogglingStatus = updateStatusMutation.isPending;

  const deleteBuildingMutation = useDeleteBuildingMutation();
  const isDeleting = deleteBuildingMutation.isPending;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [buildingId])
  );

  const handleToggleStatus = async () => {
    if (!building) return;

    const newStatus = !building.isActive;
    const actionLabel = newStatus ? 'Activate' : 'Deactivate';

    Alert.alert(
      `${actionLabel} Building?`,
      `Are you sure you want to ${actionLabel.toLowerCase()} "${building.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionLabel,
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync(newStatus);
              showSuccess('Building Updated', `Building has been ${newStatus ? 'activated' : 'deactivated'}.`);
            } catch (err: any) {
              showError('Update Failed', err.message || 'Failed to update building status.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteBuilding = async () => {
    if (!building) return;

    Alert.alert(
      'Delete Building?',
      `Are you sure you want to permanently delete "${building.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBuildingMutation.mutateAsync(building._id);
              showSuccess('Building Deleted', `"${building.name}" has been permanently deleted.`);
              navigation.goBack();
            } catch (err: any) {
              showError('Delete Failed', err.message || 'Failed to delete building.');
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

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={styles.container}>
        <DetailsSkeleton />
      </ScreenWrapper>
    );
  }

  if (error || !building) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
        <Text variant="heading" style={styles.errorTitle}>
          Building Not Found
        </Text>
        <Text variant="caption" style={styles.errorSubtitle}>
          {(error as any)?.message || 'Unable to retrieve building record.'}
        </Text>
        <Button
          title="Back to Buildings"
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
            onRefresh={() => refetch()}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Top Header Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                building.isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  building.isActive ? styles.activeStatusText : styles.inactiveStatusText,
                ]}
              >
                ● {building.isActive ? 'Active Security Status' : 'Deactivated'}
              </Text>
            </View>
          </View>

          <Text variant="title" style={styles.buildingTitle}>
            {building.name}
          </Text>
          <Text variant="body" style={styles.buildingAddress}>
            📍 {building.address}
          </Text>
        </Card>

        {/* Contact Information Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Contact Details
          </Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Contact Phone</Text>
              <Text variant="body" style={styles.infoValText}>
                {building.contactPhone || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Contact Email</Text>
              <Text variant="body" style={styles.infoValText}>
                {building.contactEmail || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Registered On</Text>
              <Text variant="body" style={styles.infoValText}>
                {formatDate(building.createdAt)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Operational Actions */}
        <Card variant="elevated" style={styles.actionsCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Management Actions
          </Text>
          <View style={styles.divider} />

          <View style={styles.actionGrid}>
            <View style={styles.actionRow}>
              <Button
                title="+ Add Guard"
                variant="primary"
                size="sm"
                leftIcon={<Ionicons name="person-add-outline" size={16} color="#FFFFFF" />}
                onPress={() => navigation.navigate('AddGuard', { buildingId: building._id })}
                style={styles.actionBtnGrid}
              />

              <Button
                title="+ Add Member"
                variant="outline"
                size="sm"
                leftIcon={<Ionicons name="people-outline" size={16} color={theme.colors.primary} />}
                onPress={() => navigation.navigate('AddCommitteeMember', { buildingId: building._id })}
                style={styles.actionBtnGrid}
              />
            </View>

            <View style={styles.actionRow}>
              <Button
                title="Edit Details"
                variant="outline"
                size="sm"
                leftIcon={<Ionicons name="create-outline" size={16} color={theme.colors.primary} />}
                onPress={() => navigation.navigate('EditBuilding', { building })}
                style={styles.actionBtnGrid}
              />

              <Button
                title={
                  isTogglingStatus
                    ? 'Updating...'
                    : building.isActive
                    ? 'Deactivate'
                    : 'Activate'
                }
                variant={building.isActive ? 'outline' : 'primary'}
                size="sm"
                leftIcon={
                  <Ionicons
                    name={building.isActive ? 'pause-circle-outline' : 'play-circle-outline'}
                    size={16}
                    color={building.isActive ? theme.colors.danger : '#FFFFFF'}
                  />
                }
                onPress={handleToggleStatus}
                disabled={isTogglingStatus}
                style={[
                  styles.actionBtnGrid,
                  building.isActive ? styles.deactivateBtn : undefined,
                ]}
              />
            </View>
          </View>
        </Card>

        {/* Delete Building Button */}
        <Button
          title={isDeleting ? 'Deleting Building...' : 'Delete Building'}
          variant="danger"
          leftIcon={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
          onPress={handleDeleteBuilding}
          disabled={isDeleting}
          style={styles.deleteBtn}
        />

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
  buildingTitle: {
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  buildingAddress: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
  actionsCard: {
    padding: theme.spacing.lg,
  },
  actionGrid: {
    gap: theme.spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionBtnGrid: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  deactivateBtn: {
    borderColor: theme.colors.danger,
  },
  deleteBtn: {
    marginTop: theme.spacing.xs,
  },
});
