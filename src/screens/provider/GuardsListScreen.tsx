import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme';
import { Guard } from '../../types/guard';
import { formatSalary } from '../../utils/currencyFormatter';
import { ProviderStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useGuardsQuery } from '../../hooks/queries/useGuards';
import { ListSkeleton } from '../../components/skeletons/ListSkeleton';

type NavigationProp = NativeStackNavigationProp<ProviderStackParamList, 'GuardsList'>;

export const GuardsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: guards = [],
    isLoading,
    isRefetching: isRefreshing,
    error,
    refetch,
  } = useGuardsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const filteredGuards = guards.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const buildingName = typeof g.buildingId === 'object' && g.buildingId ? g.buildingId.name : '';
    return (
      g.name.toLowerCase().includes(q) ||
      (g.employeeId && g.employeeId.toLowerCase().includes(q)) ||
      (g.phone && g.phone.toLowerCase().includes(q)) ||
      buildingName.toLowerCase().includes(q)
    );
  });

  const getBuildingName = (buildingId?: any) => {
    if (!buildingId) return 'Unassigned';
    if (typeof buildingId === 'object' && buildingId.name) {
      return buildingId.name;
    }
    return 'Assigned Building';
  };

  const renderGuardItem = ({ item }: { item: Guard }) => (
    <Card variant="elevated" style={styles.cardItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('GuardDetails', { guardId: item._id })}
        activeOpacity={0.7}
        style={styles.cardTouch}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarCol}>
            <View style={styles.avatarCircle}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.infoCol}>
            <View style={styles.nameRow}>
              <Text variant="heading" style={styles.guardName}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  item.isActive ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.isActive ? styles.activeStatusText : styles.inactiveStatusText,
                  ]}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>

            {item.employeeId ? (
              <Text variant="caption" style={styles.contactText}>
                ID: {item.employeeId}
              </Text>
            ) : null}

            <Text variant="caption" style={styles.buildingText}>
              🏢 {getBuildingName(item.buildingId)}
            </Text>

            {item.monthlySalary !== undefined && item.monthlySalary !== null ? (
              <Text variant="caption" style={styles.salaryText}>
                Monthly Salary: {formatSalary(item.monthlySalary)}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScreenWrapper style={styles.container}>
      {/* Top Header & Search Bar */}
      <View style={styles.headerBar}>
        <View style={styles.titleRow}>
          <Text variant="subtitle" style={styles.screenTitle}>
            Security Guards
          </Text>
          <Button
            title="+ Add"
            variant="primary"
            size="sm"
            onPress={() => navigation.navigate('AddGuard')}
          />
        </View>

        <Input
          placeholder="Search by guard name, ID, phone or building..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Content List / States */}
      {isLoading && !isRefreshing ? (
        <ListSkeleton count={5} hasSearch={false} />
      ) : error ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={44} color={theme.colors.danger} />
          <Text variant="heading" style={styles.errorTitle}>
            Failed to Load Guards
          </Text>
          <Text variant="caption" style={styles.errorSubtitle}>
            {(error as any)?.message || 'Failed to fetch guards list.'}
          </Text>
          <Button
            title="Retry"
            variant="outline"
            size="sm"
            onPress={() => refetch()}
            style={styles.retryBtn}
          />
        </View>
      ) : filteredGuards.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="people-outline" size={54} color={theme.colors.textMuted} />
          <Text variant="heading" style={styles.emptyTitle}>
            {searchQuery.trim() ? 'No matching guards found' : 'No guards registered yet'}
          </Text>
          <Text variant="caption" style={styles.emptySubtitle}>
            {searchQuery.trim()
              ? 'Try adjusting your search criteria.'
              : 'Add security personnel to manage guard operations and shifts.'}
          </Text>
          {!searchQuery.trim() && (
            <Button
              title="+ Add Guard"
              variant="primary"
              onPress={() => navigation.navigate('AddGuard')}
              style={styles.emptyAddBtn}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredGuards}
          keyExtractor={(item) => item._id}
          renderItem={renderGuardItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refetch()}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  headerBar: {
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  screenTitle: {
    color: theme.colors.textPrimary,
  },
  searchInput: {
    marginVertical: theme.spacing.xs,
  },
  listContent: {
    paddingBottom: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },
  cardItem: {
    padding: 0,
    overflow: 'hidden',
  },
  cardTouch: {
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarCol: {
    marginRight: theme.spacing.md,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.guard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guardName: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  employeeIdText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  buildingText: {
    color: theme.colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  contactText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  salaryText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
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
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeStatusText: {
    color: '#065F46',
  },
  inactiveStatusText: {
    color: '#475569',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  stateText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
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
  retryBtn: {
    marginTop: theme.spacing.md,
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
});
