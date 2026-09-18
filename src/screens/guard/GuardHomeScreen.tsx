import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { theme } from '../../theme';
import { Guard } from '../../types/guard';
import { getMyGuardProfile } from '../../services/guardService';
import { getGuardDashboard } from '../../services/dashboardService';
import { getUnreadCount } from '../../services/notificationService';
import { GuardStackParamList } from '../../types/navigation';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type NavigationProp = NativeStackNavigationProp<GuardStackParamList, 'GuardHome'>;

export const GuardHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const { showInfo } = useToast();
  const [profile, setProfile] = useState<Guard | null>(null);
  const [dutyStatus, setDutyStatus] = useState<any | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const loadGuardProfile = async () => {
    try {
      const [profData, dashData, uCount] = await Promise.all([
        getMyGuardProfile().catch(() => null),
        getGuardDashboard().catch(() => null),
        getUnreadCount().catch(() => 0),
      ]);
      setProfile(profData);
      setUnreadCount(uCount);
      if (dashData?.todayStatus) {
        setDutyStatus(dashData.todayStatus);
      }
    } catch (err: any) {
      // Fallback gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGuardProfile();
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

  const handlePlaceholderPress = (featureName: string) => {
    showInfo(
      `${featureName} (Coming Soon)`,
      `The ${featureName} module is part of a future system update.`
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Guard Profile Card */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.userInfoRow}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
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
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => navigation.navigate('Notifications')}
                activeOpacity={0.7}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
                {unreadCount > 0 && (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.7}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Assigned Post Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.sectionTitle}>
            Assigned Guard Post
          </Text>
          <View style={styles.divider} />

          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <>
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
                      Checked in at {dutyStatus?.checkInTime ? new Date(dutyStatus.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00 AM'}
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
            </>
          )}
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

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="notifications-outline" size={26} color={theme.colors.primary} />
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Notifications & Alerts
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Duty alerts & security notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="person-outline" size={26} color={theme.colors.primary} />
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                My Profile
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Personal details & security password
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Sign Out of Terminal"
          variant="outline"
          onPress={() => setShowLogoutModal(true)}
          style={styles.logoutButton}
        />
      </ScrollView>

      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        title="Sign Out of Guard Terminal"
        message="Are you sure you want to sign out? You will need to log back in to perform guard duty operations."
      />
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
  logoutBtn: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
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
  comingSoonBadge: {
    backgroundColor: theme.colors.infoLight,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primaryDark,
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
  statusRowContainer: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  dutyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceHover,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  dutyStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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

