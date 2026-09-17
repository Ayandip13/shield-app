import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';
import { CommitteeMember } from '../../types/committee';
import { getMyCommitteeProfile } from '../../services/committeeService';
import { Ionicons } from '@expo/vector-icons';

export const CommitteeHomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<CommitteeMember | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCommitteeProfile() {
      try {
        const data = await getMyCommitteeProfile();
        setProfile(data);
      } catch (err: any) {
        // Fallback gracefully
      } finally {
        setIsLoading(false);
      }
    }
    loadCommitteeProfile();
  }, []);

  const getBuildingName = () => {
    if (profile && typeof profile.buildingId === 'object' && profile.buildingId) {
      return profile.buildingId.name;
    }
    return 'Represented Building';
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
      `The ${featureName} portal is scheduled for an upcoming feature release.`
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              onPress={logout}
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

          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <View style={styles.infoRow}>
              <Ionicons name="business" size={22} color={theme.colors.committee} />
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
          )}
        </Card>

        {/* Future Overview Sections */}
        <View style={styles.modulesSection}>
          <Text variant="heading" style={styles.sectionHeaderTitle}>
            Building Management Overview
          </Text>

          <View style={styles.modulesGrid}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => handlePlaceholderPress('Security Activity Log')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="shield-outline" size={26} color={theme.colors.committee} />
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>SOON</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Security Activity
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Live building security feeds
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => handlePlaceholderPress('Assigned Guards Roster')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="shield-checkmark-outline" size={26} color={theme.colors.committee} />
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>SOON</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Guards Roster
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                On-duty guard assignments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => handlePlaceholderPress('Guard Attendance Summary')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="clipboard-outline" size={26} color={theme.colors.committee} />
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>SOON</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Attendance Summary
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Guard attendance reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => handlePlaceholderPress('Visitor Entry Logs')}
              activeOpacity={0.7}
            >
              <View style={styles.moduleHeader}>
                <Ionicons name="walk-outline" size={26} color={theme.colors.committee} />
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>SOON</Text>
                </View>
              </View>
              <Text variant="heading" style={styles.moduleTitle}>
                Entry / Exit Logs
              </Text>
              <Text variant="caption" style={styles.moduleSubtitle}>
                Visitor & vehicle entries
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Sign Out"
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
