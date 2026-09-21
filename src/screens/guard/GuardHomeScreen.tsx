import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { theme } from '../../theme';
import { Guard } from '../../types/guard';
import { GuardStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useMyGuardProfileQuery } from '../../hooks/queries/useGuards';
import { useGuardDashboardQuery } from '../../hooks/queries/useDashboard';
import { DashboardSkeleton } from '../../components/skeletons/DashboardSkeleton';

type NavigationProp = NativeStackNavigationProp<GuardStackParamList, 'GuardHome'>;

export const GuardHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { showInfo } = useToast();

  const { data: profileRaw, refetch: refetchProfile } = useMyGuardProfileQuery();
  const { data: guardDash, isLoading, refetch: refetchDash } = useGuardDashboardQuery();

  const profile = profileRaw as Guard | null;
  const dutyStatus = guardDash?.todayStatus;

  const handleRefresh = () => {
    refetchProfile();
    refetchDash();
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  const getBuildingName = () => {
    if (profile && typeof profile.buildingId === 'object' && profile.buildingId) {
      return profile.buildingId.name;
    }
    return 'Assigned Building';
  };

  const getBuildingAddress = () => {
    if (profile && typeof profile.buildingId === 'object' && profile.buildingId) {
      return profile.buildingId.address;
    }
    return null;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Guard Profile Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.headerTop}>
            <View style={styles.userInfoRow}>
              <View style={styles.avatarContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.userDetails}>
                <Text variant="heading" style={styles.userName}>
                  {profile?.name || user?.name || 'Guard Officer'}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>DUTY GUARD TERMINAL</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Assigned Post Card */}
            <Card variant="outlined" style={styles.infoCard}>
              <Text variant="heading" style={styles.sectionTitle}>
                Assigned Guard Post
              </Text>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons name="business" size={22} color={theme.colors.primary} />
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

              {profile?.employeeId ? (
                <View style={styles.infoRow}>
                  <Ionicons name="card-outline" size={22} color={theme.colors.primary} />
                  <View style={styles.infoCol}>
                    <Text variant="caption">Employee ID</Text>
                    <Text variant="body" style={styles.infoValText}>
                      {profile.employeeId}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Prominent Duty Status Banner */}
              <View style={styles.dutyCardBanner}>
                {dutyStatus?.status === 'CHECKED_IN' ? (
                  <View style={styles.onDutyContent}>
                    <View style={styles.dutyHeaderRow}>
                      <View style={styles.statusDotGreen} />
                      <Text variant="heading" style={styles.onDutyTitle}>
                        You're on duty
                      </Text>
                    </View>
                    <Text variant="caption" style={styles.dutySubText}>
                      Checked in at {dutyStatus?.checkIn ? new Date(dutyStatus.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00 AM'}
                    </Text>
                    <Button
                      title="Manage Shift & Attendance"
                      variant="primary"
                      size="sm"
                      leftIcon={<Ionicons name="time-outline" size={16} color="#FFFFFF" />}
                      onPress={() => navigation.navigate('GuardAttendance')}
                      style={styles.dutyActionBtn}
                    />
                  </View>
                ) : (
                  <View style={styles.offDutyContent}>
                    <View style={styles.dutyHeaderRow}>
                      <View style={styles.statusDotGray} />
                      <Text variant="heading" style={styles.offDutyTitle}>
                        You're currently off duty
                      </Text>
                    </View>
                    <Text variant="caption" style={styles.dutySubText}>
                      Check in when you begin your shift.
                    </Text>
                    <Button
                      title="Check In Now"
                      variant="primary"
                      size="sm"
                      leftIcon={<Ionicons name="log-in-outline" size={16} color="#FFFFFF" />}
                      onPress={() => navigation.navigate('GuardAttendance')}
                      style={styles.dutyActionBtn}
                    />
                  </View>
                )}
              </View>
            </Card>

            {/* Duty Operations Section */}
            <View style={styles.modulesSection}>
              <Text variant="heading" style={styles.sectionHeaderTitle}>
                Duty Operations
              </Text>

              <View style={styles.modulesGrid}>
                <TouchableOpacity
                  style={styles.moduleCard}
                  onPress={() => navigation.navigate('GuardAttendance')}
                  activeOpacity={0.7}
                >
                  <View style={styles.moduleHeader}>
                    <Ionicons name="time-outline" size={26} color={theme.colors.primary} />
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text variant="heading" style={styles.moduleTitle}>
                    Attendance
                  </Text>
                  <Text variant="caption" style={styles.moduleSubtitle}>
                    Shift check-in & check-out history
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.moduleCard}
                  onPress={() => navigation.navigate('GuardShift')}
                  activeOpacity={0.7}
                >
                  <View style={styles.moduleHeader}>
                    <Ionicons name="calendar-outline" size={26} color={theme.colors.primary} />
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text variant="heading" style={styles.moduleTitle}>
                    My Shift
                  </Text>
                  <Text variant="caption" style={styles.moduleSubtitle}>
                    View roster & duty hours
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.moduleCard}
                  onPress={() => navigation.navigate('GuardEntryExit')}
                  activeOpacity={0.7}
                >
                  <View style={styles.moduleHeader}>
                    <Ionicons name="log-in-outline" size={26} color={theme.colors.primary} />
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text variant="heading" style={styles.moduleTitle}>
                    Entry / Exit
                  </Text>
                  <Text variant="caption" style={styles.moduleSubtitle}>
                    Log visitor & vehicle entries
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.guard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  headerActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingLeft: theme.spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.surfaceBorder,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
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
  infoValText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  infoSubValText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  modulesSection: {
    marginTop: theme.spacing.xs,
  },
  sectionHeaderTitle: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  modulesGrid: {
    gap: theme.spacing.md,
  },
  moduleCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  activeBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#065F46',
  },
  moduleTitle: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  moduleSubtitle: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
  dutyCardBanner: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceHover,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  onDutyContent: {},
  offDutyContent: {},
  dutyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
  },
  statusDotGray: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.textMuted,
  },
  onDutyTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '700',
    color: theme.colors.success,
  },
  offDutyTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dutySubText: {
    color: theme.colors.textSecondary,
    marginVertical: 4,
  },
  dutyActionBtn: {
    marginTop: theme.spacing.xs,
  },
});
