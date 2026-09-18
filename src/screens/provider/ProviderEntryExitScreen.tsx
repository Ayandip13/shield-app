import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { EntryLog, PersonType } from '../../types/entryLog';
import { Building } from '../../types/building';
import { getEntryLogs } from '../../services/entryLogService';
import { getBuildings } from '../../services/buildingService';
import { Ionicons } from '@expo/vector-icons';

export const ProviderEntryExitScreen: React.FC = () => {
  const [logs, setLogs] = useState<EntryLog[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<PersonType | 'ALL'>('ALL');
  const [activeOnly, setActiveOnly] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async (
    bId?: string,
    pType?: PersonType | 'ALL',
    actOnly?: boolean,
    isPullToRefresh = false
  ) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    const targetBuilding = bId !== undefined ? bId : selectedBuildingId;
    const targetType = pType !== undefined ? pType : selectedType;
    const targetActive = actOnly !== undefined ? actOnly : activeOnly;

    try {
      const buildingsList = await getBuildings();
      setBuildings(buildingsList);

      const data = await getEntryLogs({
        buildingId: targetBuilding !== 'ALL' ? targetBuilding : undefined,
        personType: targetType !== 'ALL' ? targetType : undefined,
        active: targetActive ? true : undefined,
      });

      setLogs(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load provider visitor logs.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedBuildingId, selectedType, activeOnly])
  );

  const handleBuildingChange = (id: string) => {
    setSelectedBuildingId(id);
    loadData(id);
  };

  const handleTypeChange = (t: PersonType | 'ALL') => {
    setSelectedType(t);
    loadData(undefined, t);
  };

  const handleActiveToggle = () => {
    const nextVal = !activeOnly;
    setActiveOnly(nextVal);
    loadData(undefined, undefined, nextVal);
  };

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${dateStr}, ${timeStr}`;
    } catch {
      return isoString;
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'visitor':
        return { bg: theme.colors.infoLight, text: theme.colors.primaryDark, label: 'Visitor' };
      case 'delivery':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Delivery' };
      case 'staff':
        return { bg: theme.colors.successLight, text: '#065F46', label: 'Staff' };
      default:
        return { bg: theme.colors.surfaceHover, text: theme.colors.textSecondary, label: 'Other' };
    }
  };

  const getGuardName = (guard: EntryLog['guardId']) => {
    if (typeof guard === 'object' && guard !== null) {
      return guard.name;
    }
    return 'Guard Officer';
  };

  const getBuildingName = (building: EntryLog['buildingId']) => {
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
            onRefresh={() => loadData(undefined, undefined, undefined, true)}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header Summary Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerCol}>
              <Text variant="heading" style={styles.headerTitle}>
                Visitor & Entry Logs
              </Text>
              <Text variant="caption">Security access control monitor</Text>
            </View>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>{logs.length} Entries</Text>
            </View>
          </View>
        </Card>

        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          {/* Active Only Toggle Pill */}
          <View style={styles.filterRowHeader}>
            <Text variant="caption" style={styles.filterLabel}>
              FILTER ACCESS LOGS
            </Text>
            <TouchableOpacity
              style={[
                styles.activeTogglePill,
                activeOnly && styles.activeTogglePillSelected,
              ]}
              onPress={handleActiveToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeOnly ? 'radio-button-on' : 'radio-button-off'}
                size={14}
                color={activeOnly ? '#FFFFFF' : theme.colors.primary}
              />
              <Text
                style={[
                  styles.activeToggleText,
                  activeOnly && styles.activeToggleTextSelected,
                ]}
              >
                Inside Only
              </Text>
            </TouchableOpacity>
          </View>

          {/* Building Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedBuildingId === 'ALL' && styles.activeFilterPill,
              ]}
              onPress={() => handleBuildingChange('ALL')}
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
                onPress={() => handleBuildingChange(b._id)}
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

          {/* Person Type Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {(['ALL', 'visitor', 'delivery', 'staff', 'other'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.filterPill,
                  selectedType === t && styles.activeFilterPill,
                ]}
                onPress={() => handleTypeChange(t)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedType === t && styles.activeFilterPillText,
                  ]}
                >
                  {t === 'ALL' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Section */}
        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Fetching visitor log feeds...</Text>
          </View>
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Failed to Fetch Logs
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
        ) : logs.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={44} color={theme.colors.textMuted} />
            <Text variant="heading" style={styles.emptyTitle}>
              No Entry Logs Match Filter
            </Text>
            <Text variant="caption" style={styles.emptySubtitle}>
              Try adjusting the building or person type filters.
            </Text>
          </Card>
        ) : (
          <View style={styles.logsList}>
            {logs.map((item) => {
              const typeStyle = getTypeBadgeStyle(item.personType);
              const isInside = !item.exitTime;

              return (
                <Card key={item._id} variant="elevated" style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <View style={styles.nameCol}>
                      <Text variant="heading" style={styles.personName}>
                        {item.personName}
                      </Text>
                      <Text variant="caption" style={styles.buildingText}>
                        🏢 {getBuildingName(item.buildingId)} {item.flatUnit ? `• Unit ${item.flatUnit}` : ''}
                      </Text>
                    </View>

                    <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                      <Text style={[styles.typeBadgeText, { color: typeStyle.text }]}>
                        {typeStyle.label}
                      </Text>
                    </View>
                  </View>

                  {item.purpose ? (
                    <Text variant="caption" style={styles.purposeText}>
                      Purpose: {item.purpose}
                    </Text>
                  ) : null}

                  <View style={styles.divider} />

                  <View style={styles.timeInfoRow}>
                    <View style={styles.timeCol}>
                      <Text variant="caption">Entered</Text>
                      <Text variant="body" style={styles.timeVal}>
                        {formatDateTime(item.entryTime)}
                      </Text>
                    </View>

                    <View style={styles.timeCol}>
                      <Text variant="caption">Exited</Text>
                      <Text
                        variant="body"
                        style={[
                          styles.timeVal,
                          isInside && { color: theme.colors.success, fontWeight: '700' },
                        ]}
                      >
                        {isInside ? 'Currently Inside' : formatDateTime(item.exitTime)}
                      </Text>
                    </View>

                    <View style={styles.timeCol}>
                      <Text variant="caption">Guard</Text>
                      <Text variant="body" style={styles.timeVal}>
                        {getGuardName(item.guardId)}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
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
  headerTitle: {
    color: theme.colors.textPrimary,
  },
  badgeBox: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  filtersContainer: {
    gap: theme.spacing.xs,
  },
  filterRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  activeTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    gap: 4,
  },
  activeTogglePillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  activeToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeToggleTextSelected: {
    color: '#FFFFFF',
  },
  pillsScroll: {
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
  logsList: {
    gap: theme.spacing.md,
  },
  logCard: {
    padding: theme.spacing.md,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  personName: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  buildingText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  purposeText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.sm,
  },
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceHover,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  timeCol: {
    flex: 1,
  },
  timeVal: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
    fontSize: 11,
    marginTop: 2,
  },
});
