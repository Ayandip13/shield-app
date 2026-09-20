import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { theme } from '../../theme';
import { Guard } from '../../types/guard';
import { GuardShift } from '../../types/shift';
import { Ionicons } from '@expo/vector-icons';
import { useMyGuardProfileQuery } from '../../hooks/queries/useGuards';
import { useGuardShiftQuery } from '../../hooks/queries/useShifts';
import { DetailsSkeleton } from '../../components/skeletons/DetailsSkeleton';

export const GuardShiftScreen: React.FC = () => {
  const { data: profileRaw, refetch: refetchProfile } = useMyGuardProfileQuery();
  const profile = profileRaw as Guard | null;

  const guardId = profile?._id || '';
  const {
    data: shiftRaw,
    isLoading: isLoadingShift,
    isRefetching: isRefreshing,
    error: errorMsg,
    refetch: refetchShift,
  } = useGuardShiftQuery(guardId);

  const shift = shiftRaw as GuardShift | null;
  const isLoading = isLoadingShift || !profile;

  const handleRefresh = () => {
    refetchProfile();
    if (guardId) refetchShift();
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [guardId])
  );

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(formattedHour).padStart(2, '0')}:${m} ${ampm}`;
  };

  const getBuildingName = () => {
    if (profile && typeof profile.buildingId === 'object' && profile.buildingId) {
      return profile.buildingId.name;
    }
    return 'Assigned Building Post';
  };

  const getBuildingAddress = () => {
    if (profile && typeof profile.buildingId === 'object' && profile.buildingId) {
      return profile.buildingId.address;
    }
    return null;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {isLoading && !isRefreshing ? (
          <DetailsSkeleton />
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Error Loading Shift
            </Text>
            <Text variant="caption" style={styles.errorSub}>{(errorMsg as any)?.message || 'Unable to load shift schedule.'}</Text>
          </Card>
        ) : (
          <>
            {/* Header Roster Card */}
            <Card variant="elevated" style={styles.shiftCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={28} color={theme.colors.primary} />
                <View style={styles.cardHeaderCol}>
                  <Text variant="heading" style={styles.cardTitle}>
                    My Shift Schedule
                  </Text>
                  <Text variant="caption">Assigned Duty Roster</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Building Details */}
              <View style={styles.infoRow}>
                <Ionicons name="business" size={22} color={theme.colors.primary} />
                <View style={styles.infoCol}>
                  <Text variant="caption">Assigned Security Post</Text>
                  <Text variant="heading" style={styles.buildingName}>
                    {getBuildingName()}
                  </Text>
                  {getBuildingAddress() ? (
                    <Text variant="caption" style={styles.addressText}>
                      📍 {getBuildingAddress()}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Shift Timing Display */}
              <View style={styles.timingContainer}>
                <Text variant="caption" style={styles.timingLabel}>
                  DUTY ROSTER HOURS
                </Text>

                <View style={styles.timingRow}>
                  <View style={styles.timeBox}>
                    <Text variant="caption">SHIFT START</Text>
                    <Text variant="title" style={styles.timeText}>
                      {formatTime(shift?.startTime || '08:00')}
                    </Text>
                  </View>

                  <View style={styles.arrowBox}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.primary} />
                    <Text variant="caption" style={styles.toText}>
                      TO
                    </Text>
                  </View>

                  <View style={styles.timeBox}>
                    <Text variant="caption">SHIFT END</Text>
                    <Text variant="title" style={styles.timeText}>
                      {formatTime(shift?.endTime || '20:00')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Duty Tag */}
              <View style={styles.dutyTag}>
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                <Text style={styles.dutyTagText}>Today's Duty Schedule Active</Text>
              </View>
            </Card>

            {/* Shift Rules Info Card */}
            <Card variant="outlined" style={styles.rulesCard}>
              <Text variant="heading" style={styles.rulesTitle}>
                Roster Guidelines
              </Text>

              <View style={styles.ruleItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
                <Text variant="caption" style={styles.ruleText}>
                  Please ensure check-in at the duty terminal upon arrival at your assigned post.
                </Text>
              </View>

              <View style={styles.ruleItem}>
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                <Text variant="caption" style={styles.ruleText}>
                  Shift schedule changes are managed by your Security Provider Administrator.
                </Text>
              </View>
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
    gap: theme.spacing.lg,
  },
  centerContainer: {
    alignItems: 'center',
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
  errorSub: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  shiftCard: {
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  cardHeaderCol: {
    flex: 1,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoCol: {
    flex: 1,
  },
  buildingName: {
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  addressText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  timingContainer: {
    backgroundColor: theme.colors.surfaceHover,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  timingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  timeBox: {
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 4,
  },
  arrowBox: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  toText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  dutyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  dutyTagText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: theme.typography.fontSizes.sm,
  },
  rulesCard: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  rulesTitle: {
    color: theme.colors.textPrimary,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  ruleText: {
    flex: 1,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
