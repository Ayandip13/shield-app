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
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';
import { UserProfile } from '../../types/profile';
import { formatSalary } from '../../utils/currencyFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useProfileQuery } from '../../hooks/queries/useProfile';
import { ProfileSkeleton } from '../../components/skeletons/ProfileSkeleton';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const {
    data: profileRaw,
    isLoading,
    isRefetching: isRefreshing,
    error: errorMessage,
    refetch,
  } = useProfileQuery();

  const profile = profileRaw as UserProfile | null;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const getInitials = (name?: string) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'provider_admin':
        return 'PROVIDER ADMINISTRATOR';
      case 'committee':
        return 'BUILDING COMMITTEE MEMBER';
      case 'guard':
        return 'SECURITY GUARD OFFICER';
      default:
        return 'SECURITY SYSTEM USER';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'provider_admin':
        return theme.colors.primary;
      case 'committee':
        return theme.colors.committee;
      case 'guard':
        return theme.colors.guard;
      default:
        return theme.colors.primary;
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
        {isLoading && !isRefreshing ? (
          <ProfileSkeleton />
        ) : errorMessage ? (
          <Card variant="outlined" style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
            <Text variant="heading" style={styles.errorTitle}>
              Failed to Load Profile
            </Text>
            <Text variant="caption" style={styles.errorSubtitle}>
              {(errorMessage as any)?.message || 'Failed to load user profile information.'}
            </Text>
            <Button
              title="Try Again"
              variant="outline"
              size="sm"
              onPress={() => refetch()}
              style={styles.retryButton}
            />
          </Card>
        ) : profile ? (
          <>
            {/* Header Identity Card */}
            <Card variant="elevated" style={styles.headerCard}>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.avatarContainer,
                    { backgroundColor: getRoleColor(profile.role) },
                  ]}
                >
                  <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
                </View>

                <View style={styles.headerInfo}>
                  <Text variant="heading" style={styles.nameText}>
                    {profile.name}
                  </Text>
                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: `${getRoleColor(profile.role)}15` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleBadgeText,
                        { color: getRoleColor(profile.role) },
                      ]}
                    >
                      {getRoleLabel(profile.role)}
                    </Text>
                  </View>
                  <Text variant="caption" style={styles.emailSubText}>
                    {profile.email}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Personal Information Card */}
            <Card variant="outlined" style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
                <Text variant="heading" style={styles.sectionTitle}>
                  Personal Information
                </Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text variant="caption" style={styles.fieldLabel}>
                  Full Name
                </Text>
                <Text variant="body" style={styles.fieldVal}>
                  {profile.name}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="caption" style={styles.fieldLabel}>
                  Email Address
                </Text>
                <Text variant="body" style={styles.fieldVal}>
                  {profile.email}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="caption" style={styles.fieldLabel}>
                  Phone Number
                </Text>
                <Text variant="body" style={styles.fieldVal}>
                  {profile.phone || 'Not provided'}
                </Text>
              </View>
            </Card>

            {/* Role & Assignment Information Card */}
            <Card variant="outlined" style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="briefcase-outline" size={20} color={theme.colors.primary} />
                <Text variant="heading" style={styles.sectionTitle}>
                  Assignment & Work Details
                </Text>
              </View>
              <View style={styles.divider} />

              {profile.role === 'guard' && (
                <>
                  <View style={styles.infoRow}>
                    <Text variant="caption" style={styles.fieldLabel}>
                      Employee ID
                    </Text>
                    <Text variant="body" style={styles.fieldVal}>
                      {profile.employeeId || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text variant="caption" style={styles.fieldLabel}>
                      Designation
                    </Text>
                    <Text variant="body" style={styles.fieldVal}>
                      {profile.designation || 'Security Guard'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text variant="caption" style={styles.fieldLabel}>
                      Assigned Building
                    </Text>
                    <Text variant="body" style={styles.fieldVal}>
                      {profile.building?.name || 'Unassigned'}
                    </Text>
                  </View>
                  {profile.joiningDate ? (
                    <View style={styles.infoRow}>
                      <Text variant="caption" style={styles.fieldLabel}>
                        Joining Date
                      </Text>
                      <Text variant="body" style={styles.fieldVal}>
                        {new Date(profile.joiningDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.infoRow}>
                    <Text variant="caption" style={styles.fieldLabel}>
                      Monthly Salary
                    </Text>
                    <Text variant="body" style={styles.fieldVal}>
                      {formatSalary(profile.monthlySalary)}
                    </Text>
                  </View>
                  {profile.building?.address ? (
                    <View style={styles.infoRow}>
                      <Text variant="caption" style={styles.fieldLabel}>
                        Address
                      </Text>
                      <Text variant="body" style={styles.fieldVal}>
                        📍 {profile.building.address}
                      </Text>
                    </View>
                  ) : null}
                </>
              )}

              {profile.role === 'committee' && (
                <>
                  <View style={styles.infoRow}>
                    <Text variant="caption" style={styles.fieldLabel}>
                      Designation
                    </Text>
                    <Text variant="body" style={styles.fieldVal}>
                      {profile.designation || 'Committee Member'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text variant="caption" style={styles.fieldLabel}>
                      Represented Building
                    </Text>
                    <Text variant="body" style={styles.fieldVal}>
                      {profile.building?.name || 'Unassigned'}
                    </Text>
                  </View>
                  {profile.building?.address ? (
                    <View style={styles.infoRow}>
                      <Text variant="caption" style={styles.fieldLabel}>
                        Address
                      </Text>
                      <Text variant="body" style={styles.fieldVal}>
                        📍 {profile.building.address}
                      </Text>
                    </View>
                  ) : null}
                </>
              )}

              {profile.role === 'provider_admin' && (
                <View style={styles.infoRow}>
                  <Text variant="caption" style={styles.fieldLabel}>
                    Security Provider
                  </Text>
                  <Text variant="body" style={styles.fieldVal}>
                    {profile.provider?.name || 'Security Service Provider'}
                  </Text>
                </View>
              )}
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <Button
                title="Edit Personal Profile"
                variant="primary"
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.actionBtn}
              />

              <Button
                title="Change Account Password"
                variant="outline"
                onPress={() => navigation.navigate('ChangePassword')}
                style={styles.actionBtn}
              />

              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={18} color={theme.colors.danger} />
                <Text style={styles.signOutBtnText}>Sign Out of Account</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
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
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  errorSubtitle: {
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  retryButton: {
    marginTop: theme.spacing.md,
    minWidth: 120,
  },
  headerCard: {
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: theme.typography.fontSizes.lg,
  },
  headerInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emailSubText: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  sectionCard: {
    padding: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: theme.spacing.md,
  },
  infoRow: {
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  fieldVal: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  actionBtn: {
    borderRadius: theme.borderRadius.md,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginTop: theme.spacing.xs,
  },
  signOutBtnText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '700',
    color: theme.colors.danger,
  },
});
