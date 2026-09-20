import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { AttendanceRecord } from '../../types/attendance';
import { Ionicons } from '@expo/vector-icons';
import { useBuildingsQuery } from '../../hooks/queries/useBuildings';
import { useProviderAttendanceQuery } from '../../hooks/queries/useAttendance';
import { ListSkeleton } from '../../components/skeletons/ListSkeleton';

export const ProviderAttendanceScreen: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('ALL');

  const { data: buildings = [] } = useBuildingsQuery();

  const {
    data: records = [],
    isLoading,
    isRefetching: isRefreshing,
    error: errorMsg,
    refetch: refetchAttendance,
  } = useProviderAttendanceQuery({
    buildingId: selectedBuildingId !== 'ALL' ? selectedBuildingId : undefined,
  });

  useFocusEffect(
    useCallback(() => {
      refetchAttendance();
    }, [selectedBuildingId])
  );

  const handleBuildingFilterChange = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
  };


  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('T')) {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return timeStr;
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getGuardName = (guard: AttendanceRecord['guardId']) => {
    if (typeof guard === 'object' && guard !== null) {
      return guard.name;
    }
    return 'Guard Officer';
  };

  const getGuardEmpId = (guard: AttendanceRecord['guardId']) => {
    if (typeof guard === 'object' && guard !== null && guard.employeeId) {
      return `ID: ${guard.employeeId}`;
    }
    return null;
  };

  const getBuildingName = (building: AttendanceRecord['buildingId']) => {
    if (typeof building === 'object' && building !== null) {
      return building.name;
    }
    return 'Assigned Building';
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => refetchAttendance()}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header Summary Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerCol}>
              <Text variant="heading" style={styles.titleText}>
                Attendance Monitor
              </Text>
              <Text variant="caption">Real-time guard duty logs</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{records.length} Logs</Text>
            </View>
          </View>
        </Card>

        {/* Building Filter Pills */}
        <View style={styles.filterSection}>
          <Text variant="caption" style={styles.filterLabel}>
            FILTER BY BUILDING
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedBuildingId === 'ALL' && styles.activeFilterPill,
              ]}
              onPress={() => handleBuildingFilterChange('ALL')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedBuildingId === 'ALL' && styles.activeFilterPillText,
                ]}
              >
                All Buildings
              </Text>
            </TouchableOpacity>

            {buildings.map((b) => (
              <TouchableOpacity
                key={b._id}
                style={[
                  styles.filterPill,
                  selectedBuildingId === b._id && styles.activeFilterPill,
                ]}
                onPress={() => handleBuildingFilterChange(b._id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedBuildingId === b._id && styles.activeFilterPillText,
                  ]}
                >
                  {b.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Area */}
        {isLoading && !isRefreshing ? (
          <ListSkeleton count={4} hasSearch={false} />
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Failed to Load Attendance
            </Text>
            <Text variant="caption" style={styles.errorSub}>{(errorMsg as any)?.message || 'Failed to load attendance records.'}</Text>
            <Button
              title="Try Again"
              variant="outline"
              size="sm"
              onPress={() => refetchAttendance()}
              style={styles.retryBtn}
            />
          </Card>
        ) : records.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={44} color={theme.colors.textMuted} />
            <Text variant="heading" style={styles.emptyTitle}>
              No attendance logs found
            </Text>
            <Text variant="caption" style={styles.emptySubtitle}>
              No duty check-ins have been recorded for the selected filter.
            </Text>
          </Card>
        ) : (
          <View style={styles.recordsList}>
            {records.map((item) => (
              <Card key={item._id} variant="elevated" style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.guardInfoCol}>
                    <Text variant="heading" style={styles.guardName}>
                      {getGuardName(item.guardId)}
                    </Text>
                    <Text variant="caption" style={styles.buildingSubText}>
                      🏢 {getBuildingName(item.buildingId)} {getGuardEmpId(item.guardId) ? `• ${getGuardEmpId(item.guardId)}` : ''}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      item.checkOut ? styles.completedBadge : styles.openBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.checkOut ? styles.completedBadgeText : styles.openBadgeText,
                      ]}
                    >
                      {item.checkOut ? 'Completed' : 'On Duty (Open)'}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.recordTimeRow}>
                  <View style={styles.timeBlock}>
                    <Text variant="caption">Date</Text>
                    <Text variant="body" style={styles.timeVal}>
                      {formatDateLabel(item.date)}
                    </Text>
                  </View>

                  <View style={styles.timeBlock}>
                    <Text variant="caption">Check-In</Text>
                    <Text variant="body" style={styles.timeVal}>
                      {formatTime(item.checkIn)}
                    </Text>
                  </View>

                  <View style={styles.timeBlock}>
                    <Text variant="caption">Check-Out</Text>
                    <Text variant="body" style={styles.timeVal}>
                      {item.checkOut ? formatTime(item.checkOut) : 'Open'}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
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
  headerCard: {
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCol: {
    flex: 1,
  },
  titleText: {
    color: theme.colors.textPrimary,
  },
  countBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  countBadgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterSection: {
    marginVertical: theme.spacing.xs,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  filterRow: {
    gap: theme.spacing.xs,
  },
  filterPill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  activeFilterPill: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeFilterPillText: {
    color: '#FFFFFF',
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
  retryBtn: {
    marginTop: theme.spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  recordsList: {
    gap: theme.spacing.md,
  },
  recordCard: {
    padding: theme.spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  guardInfoCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  guardName: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  buildingSubText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  completedBadge: {
    backgroundColor: theme.colors.successLight,
  },
  openBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  completedBadgeText: {
    color: '#065F46',
  },
  openBadgeText: {
    color: '#D97706',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.sm,
  },
  recordTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
  },
  timeVal: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 2,
    fontSize: 12,
  },
});
