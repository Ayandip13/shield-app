import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { NavigationProp } from '../../types/navigation';
import { theme } from '../../theme';

export const GuardDashboardPlaceholder: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Guard'>>();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="heading" color={theme.colors.guard}>
            Role Group: guard
          </Text>
          <Text variant="title">Security Guard Shift Console</Text>
        </View>

        <Card variant="elevated">
          <Text variant="subtitle" style={styles.cardTitle}>
            Shift & Entry Actions
          </Text>
          <Text variant="body" style={styles.description}>
            Manually check in/check out for active shifts, record building entry/exit visitor events, and review personal attendance logs.
          </Text>

          <View style={styles.moduleGrid}>
            {['Manual Shift Check-In / Check-Out', 'Record Visitor Entry / Exit', 'Today\'s Log Overview', 'My Attendance History'].map(
              (item, idx) => (
                <View key={idx} style={styles.moduleItem}>
                  <Text variant="body" weight="medium" color={theme.colors.guard}>
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
    backgroundColor: '#FEF3C7',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
