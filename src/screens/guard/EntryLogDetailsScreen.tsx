import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { GuardStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useEntryLogDetailsQuery } from '../../hooks/queries/useEntryLogs';
import { useMarkEntryLogExitMutation } from '../../hooks/mutations/useEntryLogMutations';
import { DetailsSkeleton } from '../../components/skeletons/DetailsSkeleton';

type DetailsRouteProp = RouteProp<GuardStackParamList, 'EntryLogDetails'>;

export const EntryLogDetailsScreen: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  const { entryLogId } = route.params;

  const {
    data: log,
    isLoading,
    error: errorMsg,
    refetch,
  } = useEntryLogDetailsQuery(entryLogId);

  const markExitMutation = useMarkEntryLogExitMutation();
  const isProcessing = markExitMutation.isPending;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [entryLogId])
  );

  const handleMarkExit = async () => {
    if (!log) return;

    try {
      await markExitMutation.mutateAsync(log._id);
      showSuccess('Exit Recorded', `${log.personName} has been marked as exited.`);
    } catch (err: any) {
      showError('Action Failed', err.message || 'Unable to mark exit.');
    }
  };

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return 'Not recorded';
    try {
      const d = new Date(isoString);
      return d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const getGuardName = () => {
    if (log && typeof log.guardId === 'object' && log.guardId) {
      return log.guardId.name;
    }
    return 'Guard Officer';
  };

  const getBuildingName = () => {
    if (log && typeof log.buildingId === 'object' && log.buildingId) {
      return log.buildingId.name;
    }
    return 'Assigned Building';
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'visitor':
        return { label: 'Visitor', bg: theme.colors.infoLight, text: theme.colors.primaryDark };
      case 'delivery':
        return { label: 'Delivery', bg: '#FEF3C7', text: '#D97706' };
      case 'staff':
        return { label: 'Staff', bg: theme.colors.successLight, text: '#065F46' };
      default:
        return { label: 'Other', bg: theme.colors.surfaceHover, text: theme.colors.textSecondary };
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper style={styles.container}>
        <DetailsSkeleton />
      </ScreenWrapper>
    );
  }

  if (errorMsg || !log) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.danger} />
        <Text variant="heading" style={styles.errorTitle}>
          Record Not Found
        </Text>
        <Text variant="caption" style={styles.errorSub}>{(errorMsg as any)?.message || 'Log data unavailable.'}</Text>
        <Button
          title="Back"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />
      </ScreenWrapper>
    );
  }

  const badge = getTypeBadge(log.personType);
  const isInside = !log.exitTime;

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Person Summary Card Header */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.personCol}>
              <Text variant="heading" style={styles.personName}>
                {log.personName}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.typeBadgeText, { color: badge.text }]}>{badge.label}</Text>
              </View>
            </View>

            <View
              style={[
                styles.statusBadge,
                isInside ? styles.insideBadge : styles.completedBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isInside ? styles.insideStatusText : styles.completedStatusText,
                ]}
              >
                ● {isInside ? 'Currently Inside' : 'Completed Exit'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Access Details Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.sectionTitle}>
            Access & Unit Information
          </Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Visiting Unit / Flat</Text>
              <Text variant="body" style={styles.infoVal}>
                {log.flatUnit || 'General / Unspecified'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Purpose of Visit</Text>
              <Text variant="body" style={styles.infoVal}>
                {log.purpose || 'Not specified'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Phone Contact</Text>
              <Text variant="body" style={styles.infoVal}>
                {log.phone || 'Not provided'}
              </Text>
            </View>
          </View>

          {log.notes ? (
            <View style={styles.infoRow}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color={theme.colors.primary} />
              <View style={styles.infoCol}>
                <Text variant="caption">Security Notes</Text>
                <Text variant="body" style={styles.infoVal}>
                  {log.notes}
                </Text>
              </View>
            </View>
          ) : null}
        </Card>

        {/* Timestamp & Guard Log Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.sectionTitle}>
            Entry / Exit Log Timestamps
          </Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="log-in-outline" size={20} color={theme.colors.success} />
            <View style={styles.infoCol}>
              <Text variant="caption">Entry Timestamp</Text>
              <Text variant="body" style={styles.infoVal}>
                {formatDateTime(log.entryTime)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="log-out-outline" size={20} color={isInside ? theme.colors.textMuted : theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Exit Timestamp</Text>
              <Text
                variant="body"
                style={[
                  styles.infoVal,
                  isInside && { color: theme.colors.success, fontWeight: '700' },
                ]}
              >
                {isInside ? 'Currently Inside' : formatDateTime(log.exitTime)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="shield-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Recorded By Guard</Text>
              <Text variant="body" style={styles.infoVal}>
                {getGuardName()}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color={theme.colors.primary} />
            <View style={styles.infoCol}>
              <Text variant="caption">Security Building</Text>
              <Text variant="body" style={styles.infoVal}>
                {getBuildingName()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Button for Guards */}
        {isInside && user?.role === 'guard' && (
          <Button
            title={isProcessing ? 'Recording Exit...' : 'Mark Exit Now'}
            variant="outline"
            onPress={handleMarkExit}
            disabled={isProcessing}
            style={styles.exitActionBtn}
          />
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
  errorSub: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  backBtn: {
    marginTop: theme.spacing.md,
  },
  headerCard: {
    padding: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  personCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  personName: {
    fontSize: theme.typography.fontSizes.xl,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    marginTop: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  insideBadge: {
    backgroundColor: theme.colors.successLight,
  },
  completedBadge: {
    backgroundColor: theme.colors.surfaceHover,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  insideStatusText: {
    color: '#065F46',
  },
  completedStatusText: {
    color: theme.colors.textSecondary,
  },
  infoCard: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
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
  infoVal: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  exitActionBtn: {
    borderColor: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
});
