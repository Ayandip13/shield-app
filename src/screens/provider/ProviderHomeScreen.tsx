import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export const ProviderHomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  return (
    <ScreenWrapper style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.badgeContainer}>
          <Text variant="caption" style={styles.roleBadge}>
            ROLE: PROVIDER ADMIN
          </Text>
        </View>

        <Text variant="title" color={theme.colors.primary} style={styles.title}>
          Provider Control Center
        </Text>
        <Text variant="body" style={styles.welcomeText}>
          Welcome, {user?.name}
        </Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text variant="caption">Email:</Text>
            <Text variant="body" style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="caption">Provider ID:</Text>
            <Text variant="body" style={styles.infoValue}>{user?.providerId}</Text>
          </View>
        </View>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={() => setShowLogoutModal(true)}
          style={styles.logoutButton}
        />
      </Card>

      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        title="Sign Out of Provider Admin"
        message="Are you sure you want to sign out of your account?"
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  card: {
    padding: theme.spacing.xl,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    fontWeight: '700',
  },
  title: {
    textAlign: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    backgroundColor: theme.colors.surfaceHover,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xs,
  },
  infoValue: {
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
});
