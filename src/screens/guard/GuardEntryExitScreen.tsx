import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { EntryLog } from '../../types/entryLog';
import { getActiveEntryLogs, markEntryLogExit } from '../../services/entryLogService';
import { GuardNavigationProp } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

export const GuardEntryExitScreen: React.FC = () => {
  const navigation = useNavigation<GuardNavigationProp<'GuardEntryExit'>>();

  const [activeEntries, setActiveEntries] = useState<EntryLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchActiveEntries = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    try {
      const data = await getActiveEntryLogs();
      setActiveEntries(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch active visitor logs.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveEntries();
    }, [])
  );

  const handleMarkExit = (entry: EntryLog) => {
    Alert.alert(
      'Confirm Exit',
      `Mark "${entry.personName}" as exited from building?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Exit',
          onPress: async () => {
            setActionId(entry._id);
            try {
              await markEntryLogExit(entry._id);
              Alert.alert('Exit Recorded', `${entry.personName} has been marked as exited.`);
              await fetchActiveEntries();
            } catch (err: any) {
              Alert.alert('Action Failed', err.message || 'Unable to record exit.');
            } finally {
              setActionId(null);
            }
          },
        },
      ]
    );
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
            onRefresh={() => fetchActiveEntries(true)}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header Summary & Action Area */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextCol}>
              <Text variant="caption" style={styles.headerSub}>
                BUILDING ACCESS CONTROL
              </Text>
              <Text variant="heading" style={styles.headerTitle}>
                Entry / Exit Terminal
              </Text>
            </View>
            <View style={styles.activeBadgeBox}>
              <Text style={styles.activeBadgeCount}>{activeEntries.length}</Text>
              <Text style={styles.activeBadgeLabel}>Inside</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionButtonsRow}>
            <Button
              title="+ Record Entry"
              variant="primary"
              leftIcon={<Ionicons name="person-add-outline" size={18} color="#FFFFFF" />}
              onPress={() => navigation.navigate('AddEntryLog')}
              style={styles.recordEntryBtn}
            />
            <Button
              title="History"
              variant="outline"
              leftIcon={<Ionicons name="time-outline" size={18} color={theme.colors.primary} />}
              onPress={() => navigation.navigate('EntryLogHistory')}
              style={styles.historyBtn}
            />
          </View>
        </Card>

        {/* Currently Inside Active Visitors Section */}
        <View style={styles.sectionHeader}>
          <Text variant="heading" style={styles.sectionTitle}>
            Currently Inside Building ({activeEntries.length})
          </Text>
        </View>

        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Fetching active building entries...</Text>
          </View>
        ) : errorMsg ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Failed to Load Entries
            </Text>
            <Text variant="caption" style={styles.errorSub}>{errorMsg}</Text>
            <Button
              title="Try Again"
              variant="outline"
              size="sm"
              onPress={() => fetchActiveEntries()}
              style={styles.retryBtn}
            />
          </Card>
        ) : activeEntries.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.success} />
            <Text variant="heading" style={styles.emptyTitle}>
              No one is currently inside
            </Text>
            <Text variant="caption" style={styles.emptySubtitle}>
              All registered visitors and staff have exited the building.
            </Text>
            <Button
              title="+ Record Entry"
              variant="primary"
              size="sm"
              onPress={() => navigation.navigate('AddEntryLog')}
              style={styles.emptyRecordBtn}
            />
          </Card>
        ) : (
          <View style={styles.entriesList}>
            {activeEntries.map((item) => {
              const typeStyle = getTypeBadgeStyle(item.personType);
              const isProcessingThis = actionId === item._id;

              return (
                <Card key={item._id} variant="elevated" style={styles.entryCard}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EntryLogDetails', { entryLogId: item._id })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.entryCardHeader}>
                      <View style={styles.personNameCol}>
                        <Text variant="heading" style={styles.personName}>
                          {item.personName}
                        </Text>
                        {item.flatUnit ? (
                          <Text variant="body" style={styles.flatText}>
                            📍 Unit / Flat: <Text style={styles.flatVal}>{item.flatUnit}</Text>
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

                    <View style={styles.timeInfoRow}>
                      <View style={styles.entryTimeBox}>
                        <Ionicons name="log-in" size={16} color={theme.colors.success} />
                        <Text variant="caption" style={styles.entryTimeText}>
                          Entered {formatTime(item.entryTime)}
                        </Text>
                      </View>
                      {item.phone ? (
                        <Text variant="caption" style={styles.phoneText}>
                          📞 {item.phone}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.cardDivider} />

                  <Button
                    title={isProcessingThis ? 'Recording Exit...' : 'Mark Exit'}
                    variant="outline"
                    onPress={() => handleMarkExit(item)}
                    disabled={isProcessingThis}
                    style={styles.exitBtn}
                  />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  activeBadgeBox: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeBadgeCount: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  activeBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  recordEntryBtn: {
    flex: 2,
  },
  historyBtn: {
    flex: 1,
  },
  sectionHeader: {
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
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
  emptyRecordBtn: {
    marginTop: theme.spacing.md,
  },
  entriesList: {
    gap: theme.spacing.md,
  },
  entryCard: {
    padding: theme.spacing.md,
  },
  entryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  personNameCol: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  personName: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  flatText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
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
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceHover,
  },
  entryTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryTimeText: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  phoneText: {
    color: theme.colors.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.sm,
  },
  exitBtn: {
    borderColor: theme.colors.danger,
    borderRadius: theme.borderRadius.md,
  },
});
