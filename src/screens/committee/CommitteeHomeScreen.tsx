import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export const CommitteeHomeScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ScreenWrapper style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.badgeContainer}>
          <Text variant="caption" style={styles.roleBadge}>
            ROLE: BUILDING COMMITTEE
          </Text>
        </View>

        <Text variant="title" color={theme.colors.primary} style={styles.title}>
          Committee Portal
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
            <Text variant="caption">Assigned Building:</Text>
            <Text variant="body" style={styles.infoValue}>{user?.buildingId || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="caption">Provider ID:</Text>
            <Text variant="body" style={styles.infoValue}>{user?.providerId}</Text>
          </View>
        </View>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={logout}
          style={styles.logoutButton}
        />
      </Card>
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
    backgroundColor: '#DCFCE7',
    color: '#15803D',
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
