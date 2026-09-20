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
import { useCommitteeMemberDetailsQuery } from '../../hooks/queries/useCommittee';
import { useUpdateCommitteeStatusMutation } from '../../hooks/mutations/useCommitteeMutations';
import { DetailsSkeleton } from '../../components/skeletons/DetailsSkeleton';

type DetailsRouteProp = RouteProp<ProviderStackParamList, 'CommitteeDetails'>;
type DetailsNavProp = NativeStackNavigationProp<ProviderStackParamList, 'CommitteeDetails'>;

export const CommitteeDetailsScreen: React.FC = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<DetailsNavProp>();
  const { showSuccess, showError } = useToast();
  const { memberId } = route.params;

  const {
    data: member,
    isLoading,
    isRefetching: isRefreshing,
    error,
    refetch,
  } = useCommitteeMemberDetailsQuery(memberId);

  const updateStatusMutation = useUpdateCommitteeStatusMutation(memberId);
  const isTogglingStatus = updateStatusMutation.isPending;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [memberId])
  );

  const handleToggleStatus = async () => {
    if (!member) return;

    const newStatus = !member.isActive;
    const actionLabel = newStatus ? 'Activate' : 'Deactivate';

    Alert.alert(
      `${actionLabel} Committee Account?`,
      `Are you sure you want to ${actionLabel.toLowerCase()} "${member.name}"? ${
        !newStatus ? 'Inactive members cannot log in.' : ''
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionLabel,
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync(newStatus);
              showSuccess('Member Updated', `Committee member account has been ${newStatus ? 'activated' : 'deactivated'}.`);
            } catch (err: any) {
              showError('Update Failed', err.message || 'Failed to update member status.');
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
    if (!member || !member.buildingId) return 'Unassigned';
    if (typeof member.buildingId === 'object' && member.buildingId.name) {
      return member.buildingId.name;
    }
    return 'Assigned Building';
  };

  const getBuildingAddress = () => {
    if (member && typeof member.buildingId === 'object' && member.buildingId.address) {
      return member.buildingId.address;
    }
    return null;
  };

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={styles.container}>
        <DetailsSkeleton />
      </ScreenWrapper>
    );
  }

  if (error || !member) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
        <Text variant="heading" style={styles.errorTitle}>
          Member Not Found
        </Text>
        <Text variant="caption" style={styles.errorSubtitle}>
          {(error as any)?.message || 'Unable to retrieve member record.'}
        </Text>
        <Button
          title="Back to Committee List"
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
        {/* Profile Card Header */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                member.isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  member.isActive ? styles.activeStatusText : styles.inactiveStatusText,
                ]}
              >
                ● {member.isActive ? 'Active Committee Member' : 'Account Deactivated'}
              </Text>
            </View>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="people" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.profileDetails}>
              <Text variant="title" style={styles.memberName}>
                {member.name}
              </Text>
              <Text variant="caption" style={styles.roleBadgeText}>
                BUILDING COMMITTEE REPRESENTATIVE
              </Text>
            </View>
          </View>
        </Card>

        {/* Building Assignment Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Represented Building
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

        {/* Contact & Account Info */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.cardSectionTitle}>
            Contact & Account Details
          </Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Email Address (Login)</Text>
              <Text variant="body" style={styles.infoValText}>
                {member.email}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Phone Number</Text>
              <Text variant="body" style={styles.infoValText}>
                {member.phone || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Account Created</Text>
              <Text variant="body" style={styles.infoValText}>
                {formatDate(member.createdAt)}
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
              title="Edit Member Details"
              variant="outline"
              leftIcon={<Ionicons name="create-outline" size={18} color={theme.colors.primary} />}
              onPress={() => navigation.navigate('EditCommitteeMember', { member })}
              style={styles.actionBtn}
            />

            <Button
              title={
                isTogglingStatus
                  ? 'Updating...'
                  : member.isActive
                  ? 'Deactivate Member Account'
                  : 'Activate Member Account'
              }
              variant={member.isActive ? 'outline' : 'primary'}
              leftIcon={
                <Ionicons
                  name={member.isActive ? 'pause-circle-outline' : 'play-circle-outline'}
                  size={18}
                  color={member.isActive ? theme.colors.danger : '#FFFFFF'}
                />
              }
              onPress={handleToggleStatus}
              disabled={isTogglingStatus}
              style={[
                styles.actionBtn,
                member.isActive ? styles.deactivateBtn : undefined,
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
    backgroundColor: theme.colors.committee,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  profileDetails: {
    flex: 1,
  },
  memberName: {
    color: theme.colors.textPrimary,
  },
  roleBadgeText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 10,
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
