import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { useToast } from '../../context/ToastContext';
import { AttendanceRecord, TodayAttendanceStatusResponse } from '../../types/attendance';
import {
  getGuardTodayAttendance,
  getGuardAttendanceHistory,
  checkInGuard,
  checkOutGuard,
} from '../../services/attendanceService';
import { Ionicons } from '@expo/vector-icons';

export const GuardAttendanceScreen: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [todayData, setTodayData] = useState<TodayAttendanceStatusResponse | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAttendanceData = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    try {
      const [todayRes, historyRes] = await Promise.all([
        getGuardTodayAttendance(),
        getGuardAttendanceHistory(),
      ]);
      setTodayData(todayRes);
      setHistory(historyRes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load attendance records.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handleCheckIn = async () => {
    setIsActionLoading(true);
    try {
      await checkInGuard();
      showSuccess('Check-In Successful', 'Your duty session has been registered.');
      await loadAttendanceData();
    } catch (err: any) {
      showError('Check-In Failed', err.message || 'Unable to complete check-in.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsActionLoading(true);
    try {
      await checkOutGuard('Shift completed');
      showSuccess('Check-Out Successful', 'Your duty session has ended.');
      await loadAttendanceData();
    } catch (err: any) {
      showError('Check-Out Failed', err.message || 'Unable to complete check-out.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return '--:--';
    // Handles ISO strings like 2026-09-17T08:07:00.000Z or HH:mm format
    if (timeStr.includes('T')) {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    // Handles "08:00" -> 08:00 AM
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(formattedHour).padStart(2, '0')}:${m} ${ampm}`;
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getBuildingName = () => {
    if (todayData?.guard?.building) {
      return todayData.guard.building.name;
    }
    return 'Assigned Building Post';
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadAttendanceData(true)}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Today Duty Header Card */}
        <Card variant="elevated" style={styles.todayCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerTitleCol}>
              <Text variant="caption" style={styles.headerLabel}>
                TODAY'S DUTY SESSION
              </Text>
              <Text variant="heading" style={styles.buildingNameText}>
                {getBuildingName()}
              </Text>
            </View>
            <View style={styles.shiftBadge}>
              <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.shiftBadgeText}>
                {todayData?.shift
                  ? `${formatTime(todayData.shift.startTime)} — ${formatTime(todayData.shift.endTime)}`
                  : '08:00 AM — 08:00 PM'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {isLoading && !isRefreshing ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          ) : errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={24} color={theme.colors.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
              <Button
                title="Retry"
                variant="outline"
                size="sm"
                onPress={() => loadAttendanceData()}
                style={styles.retryBtn}
              />
            </View>
          ) : (
            <>
              {/* Duty Status Indicator */}
              <View style={styles.statusBox}>
                {todayData?.state === 'CHECKED_IN' ? (
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                    <View>
                      <Text variant="caption">Status</Text>
                      <Text variant="heading" style={styles.statusTitleActive}>
                        Checked In
                      </Text>
                      <Text variant="caption" style={styles.timeDetailText}>
                        Entry Time: {formatTime(todayData.attendance?.checkIn)}
                      </Text>
                    </View>
                  </View>
                ) : todayData?.state === 'CHECKED_OUT' ? (
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
                    <View>
                      <Text variant="caption">Status</Text>
                      <Text variant="heading" style={styles.statusTitleCompleted}>
                        Duty Shift Completed
                      </Text>
                      <Text variant="caption" style={styles.timeDetailText}>
                        Check-in: {formatTime(todayData.attendance?.checkIn)} | Check-out:{' '}
                        {formatTime(todayData.attendance?.checkOut)}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: theme.colors.warning }]} />
                    <View>
                      <Text variant="caption">Status</Text>
                      <Text variant="heading" style={styles.statusTitlePending}>
                        Not Checked In
                      </Text>
                      <Text variant="caption" style={styles.timeDetailText}>
                        Please check in when arriving at post
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {todayData?.state === 'NOT_CHECKED_IN' && (
                  <Button
                    title={isActionLoading ? 'Checking In...' : 'Check In'}
                    variant="primary"
                    onPress={handleCheckIn}
                    disabled={isActionLoading}
                    style={styles.actionBtn}
                  />
                )}

                {todayData?.state === 'CHECKED_IN' && (
                  <Button
                    title={isActionLoading ? 'Checking Out...' : 'Check Out'}
                    variant="outline"
                    onPress={handleCheckOut}
                    disabled={isActionLoading}
                    style={[styles.actionBtn, { borderColor: theme.colors.danger }]}
                  />
                )}

                {todayData?.state === 'CHECKED_OUT' && (
                  <View style={styles.completedBadgeBox}>
                    <Ionicons name="checkmark-done-circle" size={24} color={theme.colors.success} />
                    <Text style={styles.completedText}>Shift Log Completed for Today</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </Card>

        {/* Attendance History Section */}
        <View style={styles.historySection}>
          <Text variant="heading" style={styles.historySectionTitle}>
            Attendance History
          </Text>

          {history.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={40} color={theme.colors.textMuted} />
              <Text variant="body" style={styles.emptyTitle}>
                No attendance logs found
              </Text>
              <Text variant="caption" style={styles.emptySubtitle}>
                Your past duty check-ins will appear here.
              </Text>
            </Card>
          ) : (
            <View style={styles.historyList}>
              {history.map((item) => (
                <Card key={item._id} variant="outlined" style={styles.historyItemCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyDateCol}>
                      <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                      <Text variant="heading" style={styles.historyDateText}>
                        {formatDateLabel(item.date)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        item.checkOut ? styles.presentBadge : styles.openBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          item.checkOut ? styles.presentBadgeText : styles.openBadgeText,
                        ]}
                      >
                        {item.checkOut ? 'Present' : 'On Duty (Open)'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyTimeRow}>
                    <View style={styles.timeBlock}>
                      <Text variant="caption">Check-In</Text>
                      <Text variant="body" style={styles.timeValText}>
                        {formatTime(item.checkIn)}
                      </Text>
                    </View>

                    <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />

                    <View style={styles.timeBlock}>
                      <Text variant="caption">Check-Out</Text>
                      <Text variant="body" style={styles.timeValText}>
                        {item.checkOut ? formatTime(item.checkOut) : 'Active Duty'}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
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
  todayCard: {
    padding: theme.spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleCol: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  headerLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buildingNameText: {
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.infoLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
  },
  shiftBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.md,
  },
  loader: {
    paddingVertical: theme.spacing.lg,
  },
  errorBox: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: theme.spacing.sm,
  },
  statusBox: {
    backgroundColor: theme.colors.surfaceHover,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  statusTitleActive: {
    color: theme.colors.success,
  },
  statusTitleCompleted: {
    color: theme.colors.primary,
  },
  statusTitlePending: {
    color: theme.colors.warning,
  },
  timeDetailText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    marginTop: theme.spacing.xs,
  },
  actionBtn: {
    borderRadius: theme.borderRadius.md,
  },
  completedBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.successLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  completedText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: theme.typography.fontSizes.sm,
  },
  historySection: {
    gap: theme.spacing.md,
  },
  historySectionTitle: {
    color: theme.colors.textPrimary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  historyList: {
    gap: theme.spacing.md,
  },
  historyItemCard: {
    padding: theme.spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  historyDateCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  historyDateText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  badge: {
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
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  presentBadgeText: {
    color: '#065F46',
  },
  openBadgeText: {
    color: '#D97706',
  },
  historyTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceHover,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeValText: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
});
