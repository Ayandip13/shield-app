import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';
import { Building } from '../../types/building';
import { getBuildings } from '../../services/buildingService';
import { getDashboard } from '../../services/dashboardService';
import { ProviderDashboardData, ActivityItem } from '../../types/dashboard';
import { formatRelativeDateTime } from '../../utils/dateFormatter';
import { ProviderStackParamList } from '../../types/navigation';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<ProviderStackParamList, 'ProviderDashboard'>;

export const ProviderDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string | undefined>(undefined);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dashboardData, setDashboardData] = useState<ProviderDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const fetchDashboardData = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const [bList, dash] = await Promise.all([
        getBuildings(),
        getDashboard(selectedBuildingId),
      ]);
      setBuildings(bList);
      setDashboardData(dash as ProviderDashboardData);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load operational dashboard data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [selectedBuildingId])
  );

  const getInitials = (name?: string) => {
    if (!name) return 'PA';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ENTRY':
        return <Ionicons name="log-in" size={18} color={theme.colors.success} />;
      case 'EXIT':
        return <Ionicons name="log-out" size={18} color="#D97706" />;
      case 'ATTENDANCE':
        return <Ionicons name="shield-checkmark" size={18} color={theme.colors.primary} />;
      default:
        return <Ionicons name="ellipse" size={18} color={theme.colors.textMuted} />;
    }
  };

  const summary = dashboardData?.summary;
  const recentActivities = dashboardData?.recentActivity || [];

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchDashboardData(true)}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Profile / Header Area */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.userInfoRow}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text variant="heading" style={styles.userName}>
                  {user?.name || 'Provider Admin'}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>PROVIDER CONTROL CENTER</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="person-circle-outline" size={26} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="log-out-outline" size={24} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Building Filter Bar */}
        {buildings.length > 0 && (
          <View style={styles.filterSection}>
            <Text variant="caption" style={styles.filterLabel}>
              Filter Operational View:
            </Text>
            <FlatList
              horizontal
              data={[{ _id: 'ALL', name: 'All Buildings' }, ...buildings]}
              keyExtractor={(b) => b._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerContainer}
              renderItem={({ item }) => {
                const isSelected =
                  item._id === 'ALL' ? !selectedBuildingId : selectedBuildingId === item._id;
                return (
                  <TouchableOpacity
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setSelectedBuildingId(item._id === 'ALL' ? undefined : item._id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* Quick Operations Navigation Grid */}
        <View style={styles.quickActionContainer}>
          <Text variant="heading" style={styles.navSectionTitle}>
            Quick Operations
          </Text>
          <View style={styles.navButtonsRow}>
            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('BuildingsList')}
              activeOpacity={0.7}
            >
              <Ionicons name="business" size={20} color={theme.colors.primary} />
              <Text variant="body" style={styles.navCardText} numberOfLines={1}>
                Buildings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('GuardsList')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.guard} />
              <Text variant="body" style={styles.navCardText} numberOfLines={1}>
                Guards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('CommitteeList')}
              activeOpacity={0.7}
            >
              <Ionicons name="people" size={20} color={theme.colors.committee} />
              <Text variant="body" style={styles.navCardText} numberOfLines={1}>
                Committee
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('ProviderAttendance')}
              activeOpacity={0.7}
            >
              <Ionicons name="time" size={20} color={theme.colors.primaryDark} />
              <Text variant="body" style={styles.navCardText} numberOfLines={1}>
                Attendance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('ProviderEntryExit')}
              activeOpacity={0.7}
            >
              <Ionicons name="walk" size={20} color={theme.colors.warning} />
              <Text variant="body" style={styles.navCardText} numberOfLines={1}>
                Entry Logs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <Ionicons name="person" size={20} color={theme.colors.primary} />
              <Text variant="body" style={styles.navCardText} numberOfLines={1}>
                My Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading Security Metrics...</Text>
          </View>
        ) : errorMessage ? (
          /* Error State */
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Unable to Load Dashboard
            </Text>
            <Text variant="caption" style={styles.errorSubtitle}>
              {errorMessage}
            </Text>
            <Button
              title="Try Again"
              variant="outline"
              size="sm"
              onPress={() => fetchDashboardData()}
              style={styles.retryButton}
            />
          </Card>
        ) : (
          <>
            {/* Live Operational Metrics Section */}
            <View style={styles.sectionHeader}>
              <Text variant="heading" style={styles.sectionTitle}>
                Live Security Metrics
              </Text>
            </View>

            {/* Metrics Row 1 */}
            <View style={styles.metricsGrid}>
              <Card variant="flat" style={[styles.metricCard, styles.cardBlue]}>
                <View style={styles.metricHeaderRow}>
                  <Ionicons name="business" size={20} color={theme.colors.primary} />
                  <Text variant="title" style={styles.metricNumber}>
                    {summary?.totalBuildings ?? 0}
                  </Text>
                </View>
                <Text variant="caption" style={styles.metricLabel}>
                  Total Buildings
                </Text>
              </Card>

              <Card variant="flat" style={[styles.metricCard, styles.cardGreen]}>
                <View style={styles.metricHeaderRow}>
                  <Ionicons name="shield-checkmark" size={20} color={theme.colors.success} />
                  <Text variant="title" style={styles.metricNumber}>
                    {summary?.activeGuards ?? 0}
                  </Text>
                </View>
                <Text variant="caption" style={styles.metricLabel}>
                  Active Guards
                </Text>
              </Card>
            </View>

            {/* Metrics Row 2: Today's Security Attendance & Visitors */}
            <Card variant="outlined" style={styles.summaryBox}>
              <Text variant="caption" style={styles.boxTitle}>
                TODAY'S SECURITY ACTIVITY
              </Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text variant="caption" style={styles.summaryItemLabel}>
                    Present Today
                  </Text>
                  <Text variant="title" style={styles.summaryItemVal}>
                    {summary?.presentToday ?? 0}
                  </Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.summaryItem}>
                  <Text variant="caption" style={styles.summaryItemLabel}>
                    Currently On Duty
                  </Text>
                  <Text variant="title" style={[styles.summaryItemVal, { color: theme.colors.primary }]}>
                    {summary?.currentlyOnDuty ?? 0}
                  </Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.summaryItem}>
                  <Text variant="caption" style={styles.summaryItemLabel}>
                    Currently Inside
                  </Text>
                  <Text variant="title" style={[styles.summaryItemVal, { color: '#D97706' }]}>
                    {summary?.currentlyInside ?? 0}
                  </Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.summaryItem}>
                  <Text variant="caption" style={styles.summaryItemLabel}>
                    Today's Entries
                  </Text>
                  <Text variant="title" style={styles.summaryItemVal}>
                    {summary?.todayEntries ?? 0}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Recent Security Activity Stream Section */}
            <View style={styles.sectionHeader}>
              <Text variant="heading" style={styles.sectionTitle}>
                Recent Security Activity
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProviderSecurityActivity', {
                    buildingId: selectedBuildingId,
                  })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>

            {recentActivities.length === 0 ? (
              <Card variant="outlined" style={styles.emptyCard}>
                <Ionicons name="notifications-off-outline" size={36} color={theme.colors.textMuted} />
                <Text variant="body" style={styles.emptyTitle}>
                  No recent activities recorded today
                </Text>
                <Text variant="caption" style={styles.emptySubtitle}>
                  Guard check-ins and visitor entry logs will appear here in real-time.
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
                        <View style={styles.actMeta}>
                          <Text variant="caption" style={styles.actBuildingTag}>
                            📍 {act.buildingName}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        title="Sign Out of Provider Admin"
        message="Are you sure you want to sign out? You will need to log back in to access the control center."
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
  },
  headerCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: theme.typography.fontSizes.md,
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
    backgroundColor: theme.colors.infoLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionIconBtn: {
    padding: theme.spacing.xs,
  },
  logoutBtn: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  pickerContainer: {
    gap: theme.spacing.xs,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  quickActionContainer: {
    marginBottom: theme.spacing.md,
  },
  navSectionTitle: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  navButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  navCardBtn: {
    width: '31%',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  navCardText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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
    marginVertical: theme.spacing.md,
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
  retryButton: {
    marginTop: theme.spacing.md,
    minWidth: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
  },
  viewAllText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  cardBlue: {
    backgroundColor: theme.colors.primaryLight,
  },
  cardGreen: {
    backgroundColor: theme.colors.successLight,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  summaryBox: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
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
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  emptyTitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 2,
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
  actMeta: {
    marginTop: 2,
  },
  actBuildingTag: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
