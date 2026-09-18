import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';
import { CommitteeMember } from '../../types/committee';
import { getMyCommitteeProfile } from '../../services/committeeService';
import { getDashboard } from '../../services/dashboardService';
import { CommitteeDashboardData, ActivityItem } from '../../types/dashboard';
import { formatRelativeDateTime } from '../../utils/dateFormatter';
import { CommitteeStackParamList } from '../../types/navigation';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<CommitteeStackParamList, 'CommitteeHome'>;

export const CommitteeHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<CommitteeMember | null>(null);
  const [dashboardData, setDashboardData] = useState<CommitteeDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const fetchCommitteeData = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const [profData, dashData] = await Promise.all([
        getMyCommitteeProfile().catch(() => null),
        getDashboard(),
      ]);
      setProfile(profData);
      setDashboardData(dashData as CommitteeDashboardData);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load building operational summary.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCommitteeData();
    }, [])
  );

  const building = dashboardData?.building;
  const summary = dashboardData?.summary;
  const recentActivities = dashboardData?.recentActivity || [];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ENTRY':
        return <Ionicons name="log-in" size={18} color={theme.colors.success} />;
      case 'EXIT':
        return <Ionicons name="log-out" size={18} color="#D97706" />;
      case 'ATTENDANCE':
        return <Ionicons name="shield-checkmark" size={18} color={theme.colors.committee} />;
      default:
        return <Ionicons name="ellipse" size={18} color={theme.colors.textMuted} />;
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchCommitteeData(true)}
            colors={[theme.colors.committee]}
          />
        }
      >
        {/* Profile Card Header */}
        <Card variant="elevated" style={styles.card}>
          <View style={styles.headerTop}>
            <View style={styles.userInfoRow}>
              <View style={styles.avatarContainer}>
                <Ionicons name="people" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.userDetails}>
                <Text variant="heading" style={styles.userName}>
                  {profile?.name || user?.name || 'Committee Representative'}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>BUILDING COMMITTEE PORTAL</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => setShowLogoutModal(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="log-out-outline" size={22} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Building Info Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text variant="heading" style={styles.sectionTitle}>
            Represented Building
          </Text>
          <View style={styles.divider} />

          {isLoading && !isRefreshing ? (
            <ActivityIndicator color={theme.colors.committee} />
          ) : (
            <View style={styles.infoRow}>
              <Ionicons name="business" size={24} color={theme.colors.committee} />
              <View style={styles.infoCol}>
                <Text variant="caption">Building Name</Text>
                <Text variant="body" style={styles.infoValText}>
                  {building?.name || 'Assigned Building'}
                </Text>
                {building?.address ? (
                  <Text variant="caption" style={styles.infoSubValText}>
                    📍 {building.address}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
        </Card>

        {/* Today's Security Overview Box */}
        {summary && (
          <Card variant="outlined" style={styles.summaryBox}>
            <Text variant="caption" style={styles.boxTitle}>
              SECURITY TODAY OVERVIEW
            </Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text variant="caption" style={styles.summaryItemLabel}>
                  Active Guards
                </Text>
                <Text variant="title" style={styles.summaryItemVal}>
                  {summary.activeGuards}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.summaryItem}>
                <Text variant="caption" style={styles.summaryItemLabel}>
                  Present Today
                </Text>
                <Text variant="title" style={styles.summaryItemVal}>
                  {summary.presentToday}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.summaryItem}>
                <Text variant="caption" style={styles.summaryItemLabel}>
                  On Duty
                </Text>
                <Text variant="title" style={[styles.summaryItemVal, { color: theme.colors.committee }]}>
                  {summary.currentlyOnDuty}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.summaryItem}>
                <Text variant="caption" style={styles.summaryItemLabel}>
                  Inside
                </Text>
                <Text variant="title" style={[styles.summaryItemVal, { color: '#D97706' }]}>
                  {summary.currentlyInside}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Building Operations Module Section */}
        <View style={styles.modulesSection}>
          <Text variant="heading" style={styles.sectionHeaderTitle}>
            Building Management Operations
          </Text>

          <View style={styles.modulesGrid}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate('CommitteeAttendance')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="clipboard-outline" size={24} color={theme.colors.committee} />
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Attendance Summary
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Building guard attendance logs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate('CommitteeEntryExit')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="walk-outline" size={24} color={theme.colors.committee} />
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Entry / Exit Logs
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Visitor & vehicle entries
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigation.navigate('CommitteeSecurityActivity')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="shield-outline" size={24} color={theme.colors.committee} />
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Security Activity Log
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Chronological security feed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity List */}
        <View style={styles.sectionHeader}>
          <Text variant="heading" style={styles.sectionTitle}>
            Recent Security Activity
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CommitteeSecurityActivity')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {recentActivities.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={32} color={theme.colors.textMuted} />
            <Text variant="body" style={styles.emptyTitle}>
              No security activities recorded today
            </Text>
          </Card>
        ) : (
          <View style={styles.activityList}>
            {recentActivities.slice(0, 5).map((act) => (
              <Card key={act.id} variant="flat" style={styles.activityItemCard}>
                <View style={styles.actRow}>
                  <View style={styles.actIconBox}>{getActivityIcon(act.type)}</View>
                  <View style={styles.actContent}>
                    <View style={styles.actHeader}>
                      <Text variant="body" style={styles.actTitle} numberOfLines={1}>
                        {act.title}
                      </Text>
                      <Text variant="caption" style={styles.actTime}>
                        {formatRelativeDateTime(act.timestamp)}
                      </Text>
                    </View>
                    <Text variant="caption" style={styles.actDesc} numberOfLines={1}>
                      {act.description}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        <Button
          title="Sign Out"
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
        title="Sign Out of Committee Portal"
        message="Are you sure you want to sign out? You will need to log back in to monitor building security."
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
    backgroundColor: theme.colors.committee,
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
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
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
  summaryBox: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  boxTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  summaryItemVal: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.surfaceBorder,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.committee,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  emptyTitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  activityList: {
    gap: theme.spacing.xs,
  },
  activityItemCard: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actContent: {
    flex: 1,
  },
  actHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  actTime: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  actDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
});
