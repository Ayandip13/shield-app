import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { theme } from '../../theme';
import { EntryLog, PersonType } from '../../types/entryLog';
import { GuardNavigationProp } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useEntryLogsQuery } from '../../hooks/queries/useEntryLogs';
import { ListSkeleton } from '../../components/skeletons/ListSkeleton';

export const EntryLogHistoryScreen: React.FC = () => {
  const navigation = useNavigation<GuardNavigationProp<'EntryLogHistory'>>();
  const [selectedType, setSelectedType] = useState<PersonType | 'ALL'>('ALL');

  const {
    data: logs = [],
    isLoading,
    isRefetching: isRefreshing,
    error: errorMsg,
    refetch,
  } = useEntryLogsQuery({
    personType: selectedType !== 'ALL' ? selectedType : undefined,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
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

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => refetch()}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text variant="caption" style={styles.filterLabel}>
            FILTER BY PERSON TYPE
          </Text>
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
                  {t === 'ALL' ? 'All Logs' : t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List Content Area */}
        {isLoading && !isRefreshing ? (
          <ListSkeleton count={4} hasSearch={false} />
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Unable to Load Logs
            </Text>
            <Text variant="caption" style={styles.errorSub}>{(errorMsg as any)?.message || 'Failed to fetch entry log history.'}</Text>
          </Card>
        ) : logs.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="time-outline" size={44} color={theme.colors.textMuted} />
            <Text variant="heading" style={styles.emptyTitle}>
              No Entry Records Found
            </Text>
            <Text variant="caption" style={styles.emptySubtitle}>
              Access logs matching the selected filter will appear here.
            </Text>
          </Card>
        ) : (
          <View style={styles.logsList}>
            {logs.map((item) => {
              const typeStyle = getTypeBadgeStyle(item.personType);
              const isInside = !item.exitTime;

              return (
                <Card key={item._id} variant="elevated" style={styles.logCard}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EntryLogDetails', { entryLogId: item._id })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.nameCol}>
                        <Text variant="heading" style={styles.personName}>
                          {item.personName}
                        </Text>
                        {item.flatUnit ? (
                          <Text variant="caption" style={styles.flatText}>
                            Unit / Flat: <Text style={styles.flatVal}>{item.flatUnit}</Text>
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

                    <View style={styles.timeRow}>
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
                            isInside && styles.insideStatusText,
                          ]}
                        >
                          {isInside ? 'Currently Inside' : formatDateTime(item.exitTime)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
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
  filterSection: {
    marginBottom: theme.spacing.xs,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
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
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.sm,
  },
  timeRow: {
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
  insideStatusText: {
    color: theme.colors.success,
    fontWeight: '700',
  },
});
