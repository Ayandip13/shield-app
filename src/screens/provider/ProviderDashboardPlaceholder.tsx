import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { NavigationProp } from '../../types/navigation';
import { theme } from '../../theme';

export const ProviderDashboardPlaceholder: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'ProviderAdmin'>>();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="heading" color={theme.colors.primary}>
            Role Group: provider_admin
          </Text>
          <Text variant="title">Security Provider Admin</Text>
        </View>

        <Card variant="elevated">
          <Text variant="subtitle" style={styles.cardTitle}>
            Provider Admin Console
          </Text>
          <Text variant="body" style={styles.description}>
            Manages buildings, committees, guards, guard attendance, entry/exit logs, and salary overview across all registered properties.
          </Text>

          <View style={styles.moduleGrid}>
            {['Buildings Management', 'Guard Roster & Shifts', 'Committee Accounts', 'Attendance Logs', 'Salary & Payroll Overview'].map(
              (item, idx) => (
                <View key={idx} style={styles.moduleItem}>
                  <Text variant="body" weight="medium" color={theme.colors.primary}>
                    • {item}
                  </Text>
                  <Text variant="caption">[Foundation Ready]</Text>
                </View>
              )
            )}
          </View>
        </Card>

        <Button title="← Return to Launcher" variant="outline" onPress={() => navigation.goBack()} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    marginBottom: theme.spacing.sm,
  },
  description: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.textSecondary,
  },
  moduleGrid: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  moduleItem: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
