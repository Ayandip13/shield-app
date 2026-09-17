import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';
import { Guard } from '../../types/guard';
import { getMyGuardProfile } from '../../services/guardService';
import { GuardStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<GuardStackParamList, 'GuardHome'>;

export const GuardHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Guard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGuardProfile() {
      try {
        const data = await getMyGuardProfile();
        setProfile(data);
      } catch (err: any) {
        // Fallback gracefully if endpoint returns basic user info
      } finally {
        setIsLoading(false);
      }
    }
    loadGuardProfile();
  }, []);

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
    Alert.alert(
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
            <View style={styles.userInfoRow}>
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
              onPress={() => handlePlaceholderPress('Entry / Exit Logs')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="log-in-outline" size={26} color={theme.colors.primary} />
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>SOON</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Entry / Exit
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Log visitor & vehicle entries
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Sign Out of Terminal"
          variant="outline"
          onPress={logout}
          style={styles.logoutButton}
        />
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
});
