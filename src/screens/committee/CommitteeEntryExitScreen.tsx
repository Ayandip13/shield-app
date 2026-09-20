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
import { EntryLog, PersonType } from '../../types/entryLog';
import { CommitteeMember } from '../../types/committee';
import { Ionicons } from '@expo/vector-icons';
import { useMyCommitteeProfileQuery } from '../../hooks/queries/useCommittee';
import { useActiveEntryLogsQuery, useEntryLogsQuery } from '../../hooks/queries/useEntryLogs';
import { ListSkeleton } from '../../components/skeletons/ListSkeleton';

export const CommitteeEntryExitScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<PersonType | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'inside' | 'history'>('inside');

  const { data: profileRaw, refetch: refetchProfile } = useMyCommitteeProfileQuery();
  const profile = profileRaw as CommitteeMember | null;

  const {
    data: activeEntries = [],
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useActiveEntryLogsQuery();

  const {
    data: historyLogs = [],
    isLoading: isLoadingHistory,
    isRefetching: isRefreshingHistory,
    error: errorMsg,
    refetch: refetchHistory,
  } = useEntryLogsQuery({
    personType: selectedType !== 'ALL' ? selectedType : undefined,
  });

  const isLoading = isLoadingActive || isLoadingHistory;
  const isRefreshing = isRefreshingHistory;

  const handleRefresh = () => {
    refetchProfile();
    refetchActive();
    refetchHistory();
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [selectedType])
  );

  const handleTypeChange = (type: PersonType | 'ALL') => {
    setSelectedType(type);
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
            onRefresh={handleRefresh}
            colors={[theme.colors.committee]}
          />
        }
      >
        {/* Committee Header Card */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerCol}>
              <Text variant="caption" style={styles.headerBadge}>
                BUILDING SECURITY MONITOR
              </Text>
              <Text variant="heading" style={styles.buildingTitle}>
                {getBuildingName()}
              </Text>
            </View>
            <View style={styles.insideBadgeBox}>
              <Text style={styles.insideCount}>{activeEntries.length}</Text>
              <Text style={styles.insideLabel}>Inside Now</Text>
            </View>
          </View>
        </Card>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'inside' && styles.activeTabBtn]}
            onPress={() => setActiveTab('inside')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'inside' && styles.activeTabText]}>
              Currently Inside ({activeEntries.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.activeTabBtn]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              Entry History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        {isLoading && !isRefreshing ? (
          <ListSkeleton count={4} hasSearch={false} />
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Failed to Load Access Logs
            </Text>
            <Text variant="caption" style={styles.errorSub}>{(errorMsg as any)?.message || 'Failed to load visitor logs.'}</Text>
            <Button
              title="Try Again"
              variant="outline"
              size="sm"
              onPress={handleRefresh}
              style={styles.retryBtn}
            />
          </Card>
        ) : activeTab === 'inside' ? (
          /* TAB 1: Currently Inside */
          activeEntries.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Ionicons name="checkmark-circle-outline" size={44} color={theme.colors.success} />
              <Text variant="heading" style={styles.emptyTitle}>
                No active visitors inside
              </Text>
              <Text variant="caption" style={styles.emptySubtitle}>
                All entrants have completed their visit and exited the building.
              </Text>
            </Card>
          ) : (
            <View style={styles.logsList}>
              {activeEntries.map((item) => {
                const typeStyle = getTypeBadgeStyle(item.personType);
                return (
                  <Card key={item._id} variant="elevated" style={styles.logCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.nameCol}>
                        <Text variant="heading" style={styles.personName}>
                          {item.personName}
                        </Text>
                        {item.flatUnit ? (
                          <Text variant="caption" style={styles.flatText}>
                            Visiting Unit: <Text style={styles.flatVal}>{item.flatUnit}</Text>
                          </Text>
                        ) : null}
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

                    <View style={styles.timeRow}>
                      <Ionicons name="log-in" size={16} color={theme.colors.success} />
                      <Text variant="caption" style={styles.entryTimeText}>
                        Entered at {formatDateTime(item.entryTime)}
                      </Text>
                    </View>
                  </Card>
                );
              })}
            </View>
          )
        ) : (
          /* TAB 2: Entry History */
          <View style={styles.historyContainer}>
            {/* Person Type Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
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
                    {t === 'ALL' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {historyLogs.length === 0 ? (
              <Card variant="outlined" style={styles.emptyCard}>
                <Ionicons name="time-outline" size={44} color={theme.colors.textMuted} />
                <Text variant="heading" style={styles.emptyTitle}>
                  No Entry History Records
                </Text>
                <Text variant="caption" style={styles.emptySubtitle}>
                  Historical access logs will appear here.
                </Text>
              </Card>
            ) : (
              <View style={styles.logsList}>
                {historyLogs.map((item) => {
                  const typeStyle = getTypeBadgeStyle(item.personType);
                  const isInside = !item.exitTime;

                  return (
                    <Card key={item._id} variant="elevated" style={styles.logCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.nameCol}>
                          <Text variant="heading" style={styles.personName}>
                            {item.personName}
                          </Text>
                          {item.flatUnit ? (
                            <Text variant="caption" style={styles.flatText}>
                              Unit: <Text style={styles.flatVal}>{item.flatUnit}</Text>
                            </Text>
                          ) : null}
                        </View>

                        <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                          <Text style={[styles.typeBadgeText, { color: typeStyle.text }]}>
                            {typeStyle.label}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.timeInfoRow}>
                        <View style={styles.timeCol}>
                          <Text variant="caption">Entered</Text>
                          <Text variant="body" style={styles.timeVal}>
                            {formatDateTime(item.entryTime)}
                          </Text>
                        </View>

                        <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />

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
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
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
  headerTop: {
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
  insideBadgeBox: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  insideCount: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: '#065F46',
  },
  insideLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#065F46',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceHover,
    padding: 3,
    borderRadius: theme.borderRadius.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  activeTabBtn: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
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
  cardHeader: {
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
  flatText: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  flatVal: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryTimeText: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  historyContainer: {
    gap: theme.spacing.md,
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
    backgroundColor: theme.colors.committee,
    borderColor: theme.colors.committee,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeFilterPillText: {
    color: '#FFFFFF',
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 12,
    marginTop: 2,
  },
});
