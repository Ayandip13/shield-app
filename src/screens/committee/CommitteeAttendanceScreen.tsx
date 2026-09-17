import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { AttendanceRecord } from '../../types/attendance';
import { getCommitteeAttendance } from '../../services/attendanceService';
import { getMyCommitteeProfile } from '../../services/committeeService';
import { CommitteeMember } from '../../types/committee';
import { Ionicons } from '@expo/vector-icons';

export const CommitteeAttendanceScreen: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [profile, setProfile] = useState<CommitteeMember | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    try {
      const committeeProfile = await getMyCommitteeProfile();
      setProfile(committeeProfile);

      const attendanceLogs = await getCommitteeAttendance();
      setRecords(attendanceLogs);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to load building attendance records.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

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

  const getGuardEmployeeId = (guard: AttendanceRecord['guardId']) => {
    if (typeof guard === 'object' && guard !== null && guard.employeeId) {
      return guard.employeeId;
    }
    return null;
  };

  const getBuildingName = () => {
    if (profile && typeof profile.buildingId === 'object' && profile.buildingId) {
      return profile.buildingId.name;
    }
    return 'Represented Building';
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadData(true)}
            colors={[theme.colors.committee]}
          />
        }
      >
        {/* Committee Building Header Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerCol}>
              <Text variant="caption" style={styles.headerBadge}>
                BUILDING SECURITY ROSTER
              </Text>
              <Text variant="heading" style={styles.buildingTitle}>
                {getBuildingName()}
              </Text>
            </View>
            <View style={styles.logsBadge}>
              <Text style={styles.logsBadgeText}>{records.length} Logs</Text>
            </View>
          </View>
        </Card>

        {/* Content Section */}
        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.committee} />
            <Text style={styles.loadingText}>Loading building attendance...</Text>
          </View>
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Unable to Load Logs
            </Text>
            <Text variant="caption" style={styles.errorSub}>{errorMsg}</Text>
            <Button
              title="Try Again"
              variant="outline"
              size="sm"
              onPress={() => loadData()}
              style={styles.retryBtn}
            />
          </Card>
        ) : records.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="shield-checkmark-outline" size={44} color={theme.colors.textMuted} />
            <Text variant="heading" style={styles.emptyTitle}>
              No Attendance Logs Found
            </Text>
            <Text variant="caption" style={styles.emptySubtitle}>
              Attendance records for guards assigned to this building will appear here.
            </Text>
          </Card>
        ) : (
          <View style={styles.recordsList}>
            <Text variant="heading" style={styles.sectionHeading}>
              Recent Guard Duty Activity
            </Text>

            {records.map((item) => (
              <Card key={item._id} variant="elevated" style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.guardCol}>
                    <Text variant="heading" style={styles.guardNameText}>
                      {getGuardName(item.guardId)}
                    </Text>
                    {getGuardEmployeeId(item.guardId) ? (
                      <Text variant="caption" style={styles.empIdText}>
                        Emp ID: {getGuardEmployeeId(item.guardId)}
                      </Text>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      item.checkOut ? styles.presentBadge : styles.openBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.checkOut ? styles.presentBadgeText : styles.openBadgeText,
                      ]}
                    >
                      {item.checkOut ? 'Present' : 'On Duty (Open)'}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <Text variant="caption">Duty Date</Text>
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
    gap: theme.spacing.lg,
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
  headerBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  buildingTitle: {
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  logsBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  logsBadgeText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
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
  sectionHeading: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  recordCard: {
    padding: theme.spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  guardCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  guardNameText: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  empIdText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  presentBadge: {
    backgroundColor: theme.colors.successLight,
  },
  openBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  presentBadgeText: {
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
  timeRow: {
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
