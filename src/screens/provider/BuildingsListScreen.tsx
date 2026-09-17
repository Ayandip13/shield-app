import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
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
import { Input } from '../../components/common/Input';
import { theme } from '../../theme';
import { Building } from '../../types/building';
import { getBuildings } from '../../services/buildingService';
import { ProviderStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<ProviderStackParamList, 'BuildingsList'>;

export const BuildingsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBuildingsData = async (isPullToRefresh = false) => {
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
      setErrorMessage(err.message || 'Failed to fetch buildings list.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBuildingsData();
    }, [])
  );

  const filteredBuildings = buildings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q);
  });

  const renderBuildingItem = ({ item }: { item: Building }) => (
    <Card variant="elevated" style={styles.cardItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BuildingDetails', { buildingId: item._id })}
        activeOpacity={0.7}
        style={styles.cardTouch}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleCol}>
            <Text variant="heading" style={styles.buildingName}>
              {item.name}
            </Text>
            <Text variant="caption" style={styles.buildingAddress}>
              📍 {item.address}
            </Text>
          </View>
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

        {(item.contactPhone || item.contactEmail) && (
          <View style={styles.contactRow}>
            {item.contactPhone ? (
              <Text variant="caption" style={styles.contactText}>
                📞 {item.contactPhone}
              </Text>
            ) : null}
            {item.contactEmail ? (
              <Text variant="caption" style={styles.contactText}>
                ✉️ {item.contactEmail}
              </Text>
            ) : null}
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScreenWrapper style={styles.container}>
      {/* Top Action & Search Bar */}
      <View style={styles.headerBar}>
        <View style={styles.titleRow}>
          <Text variant="title" style={styles.screenTitle}>
            Security Buildings
          </Text>
          <Button
            title="+ Add"
            variant="primary"
            size="sm"
            onPress={() => navigation.navigate('AddBuilding')}
          />
        </View>

        <Input
          placeholder="Search by building name or address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Main Content List / States */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading building directory...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={44} color={theme.colors.danger} />
          <Text variant="heading" style={styles.errorTitle}>
            Failed to Load Buildings
          </Text>
          <Text variant="caption" style={styles.errorSubtitle}>
            {errorMessage}
          </Text>
          <Button
            title="Retry"
            variant="outline"
            size="sm"
            onPress={() => fetchBuildingsData()}
            style={styles.retryBtn}
          />
        </View>
      ) : filteredBuildings.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="business-outline" size={54} color={theme.colors.textMuted} />
          <Text variant="heading" style={styles.emptyTitle}>
            {searchQuery.trim() ? 'No matching buildings found' : 'No buildings yet'}
          </Text>
          <Text variant="caption" style={styles.emptySubtitle}>
            {searchQuery.trim()
              ? 'Try adjusting your search criteria.'
              : 'Add your first building to start managing security operations.'}
          </Text>
          {!searchQuery.trim() && (
            <Button
              title="+ Add Building"
              variant="primary"
              onPress={() => navigation.navigate('AddBuilding')}
              style={styles.emptyAddBtn}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredBuildings}
          keyExtractor={(item) => item._id}
          renderItem={renderBuildingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchBuildingsData(true)}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  buildingName: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  buildingAddress: {
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
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceHover,
    gap: theme.spacing.md,
  },
  contactText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
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
