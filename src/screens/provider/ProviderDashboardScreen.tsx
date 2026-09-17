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
import { Building } from '../../types/building';
import { getBuildings } from '../../services/buildingService';
import { ProviderStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<ProviderStackParamList, 'ProviderDashboard'>;

export const ProviderDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await getBuildings();
      setBuildings(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load buildings data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const activeCount = buildings.filter((b) => b.isActive).length;
  const inactiveCount = buildings.filter((b) => !b.isActive).length;
  const recentBuildings = buildings.slice(0, 4);

  const getInitials = (name?: string) => {
    if (!name) return 'PA';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
            <View style={styles.userInfoRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text variant="heading" style={styles.userName}>
                  {user?.name || 'Provider Admin'}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>PROVIDER ADMIN</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={logout}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="log-out-outline" size={22} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Action Navigation Items */}
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
              <Ionicons name="business" size={24} color={theme.colors.primary} />
              <Text variant="body" style={styles.navCardText}>
                Buildings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('GuardsList')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-checkmark" size={24} color={theme.colors.guard} />
              <Text variant="body" style={styles.navCardText}>
                Guards
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCardBtn}
              onPress={() => navigation.navigate('CommitteeList')}
              activeOpacity={0.7}
            >
              <Ionicons name="people" size={24} color={theme.colors.committee} />
              <Text variant="body" style={styles.navCardText}>
                Committee
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="+ Add Building"
            variant="primary"
            onPress={() => navigation.navigate('AddBuilding')}
            style={styles.addBuildingButton}
          />
        </View>

        {/* Loading State */}
        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading Security Provider Overview...</Text>
          </View>
        ) : errorMessage ? (
          /* Error State */
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Unable to Load Data
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
            {/* Metric Summary Cards */}
            <View style={styles.metricsRow}>
              <Card variant="flat" style={[styles.metricCard, styles.totalCard]}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="business" size={24} color={theme.colors.primary} />
                  <Text variant="title" style={styles.metricNumber}>
                    {buildings.length}
                  </Text>
                </View>
                <Text variant="caption" style={styles.metricLabel}>
                  Total Buildings
                </Text>
              </Card>

              <Card variant="flat" style={[styles.metricCard, styles.activeCard]}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                  <Text variant="title" style={styles.metricNumber}>
                    {activeCount}
                  </Text>
                </View>
                <Text variant="caption" style={styles.metricLabel}>
                  Active Buildings
                </Text>
              </Card>

              <Card variant="flat" style={[styles.metricCard, styles.inactiveCard]}>
                <View style={styles.metricIconRow}>
                  <Ionicons name="pause-circle" size={24} color={theme.colors.textMuted} />
                  <Text variant="title" style={styles.metricNumber}>
                    {inactiveCount}
                  </Text>
                </View>
                <Text variant="caption" style={styles.metricLabel}>
                  Inactive Buildings
                </Text>
              </Card>
            </View>

            {/* Recent Buildings Section */}
            <View style={styles.sectionHeader}>
              <Text variant="heading" style={styles.sectionTitle}>
                Managed Buildings
              </Text>
              {buildings.length > 0 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('BuildingsList')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>View All ({buildings.length}) →</Text>
                </TouchableOpacity>
              )}
            </View>

            {recentBuildings.length === 0 ? (
              /* Empty State */
              <Card variant="outlined" style={styles.emptyCard}>
                <Ionicons name="business-outline" size={48} color={theme.colors.textMuted} />
                <Text variant="heading" style={styles.emptyTitle}>
                  No buildings registered yet
                </Text>
                <Text variant="caption" style={styles.emptySubtitle}>
                  Add your first building to start managing security operations and guards.
                </Text>
                <Button
                  title="+ Add Building"
                  variant="primary"
                  size="sm"
                  onPress={() => navigation.navigate('AddBuilding')}
                  style={styles.emptyAddBtn}
                />
              </Card>
            ) : (
              /* Recent Buildings List */
              <View style={styles.buildingsListContainer}>
                {recentBuildings.map((building) => (
                  <Card
                    key={building._id}
                    variant="elevated"
                    style={styles.buildingItemCard}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('BuildingDetails', { buildingId: building._id })
                      }
                      activeOpacity={0.7}
                      style={styles.buildingItemTouch}
                    >
                      <View style={styles.buildingItemHeader}>
                        <View style={styles.buildingNameCol}>
                          <Text variant="heading" style={styles.buildingNameText}>
                            {building.name}
                          </Text>
                          <Text variant="caption" style={styles.buildingAddressText}>
                            📍 {building.address}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            building.isActive ? styles.activeBadge : styles.inactiveBadge,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              building.isActive
                                ? styles.activeBadgeText
                                : styles.inactiveBadgeText,
                            ]}
                          >
                            {building.isActive ? 'Active' : 'Inactive'}
                          </Text>
                        </View>
                      </View>

                      {(building.contactPhone || building.contactEmail) && (
                        <View style={styles.contactRow}>
                          {building.contactPhone ? (
                            <Text variant="caption" style={styles.contactItem}>
                              📞 {building.contactPhone}
                            </Text>
                          ) : null}
                          {building.contactEmail ? (
                            <Text variant="caption" style={styles.contactItem}>
                              ✉️ {building.contactEmail}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
            )}
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
  },
  headerCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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
  logoutBtn: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  quickActionContainer: {
    marginBottom: theme.spacing.lg,
  },
  navSectionTitle: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  navButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  navCardBtn: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  navCardText: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  addBuildingButton: {
    borderRadius: theme.borderRadius.md,
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  metricCard: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'flex-start',
    borderRadius: theme.borderRadius.md,
  },
  totalCard: {
    backgroundColor: theme.colors.primaryLight,
  },
  activeCard: {
    backgroundColor: theme.colors.successLight,
  },
  inactiveCard: {
    backgroundColor: theme.colors.surfaceHover,
  },
  metricIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.xs,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
  },
  viewAllText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  emptyAddBtn: {
    marginTop: theme.spacing.md,
  },
  buildingsListContainer: {
    gap: theme.spacing.md,
  },
  buildingItemCard: {
    padding: 0,
    overflow: 'hidden',
  },
  buildingItemTouch: {
    padding: theme.spacing.md,
  },
  buildingItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buildingNameCol: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  buildingNameText: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  buildingAddressText: {
    marginTop: 2,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  activeBadge: {
    backgroundColor: theme.colors.successLight,
  },
  inactiveBadge: {
    backgroundColor: '#E2E8F0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeBadgeText: {
    color: '#065F46',
  },
  inactiveBadgeText: {
    color: '#475569',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceHover,
    gap: theme.spacing.md,
  },
  contactItem: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});
