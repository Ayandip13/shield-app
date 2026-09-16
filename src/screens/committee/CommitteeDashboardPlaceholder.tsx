import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { NavigationProp } from '../../types/navigation';
import { theme } from '../../theme';

export const CommitteeDashboardPlaceholder: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Committee'>>();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="heading" color={theme.colors.committee}>
            Role Group: committee
          </Text>
          <Text variant="title">Building Committee Portal</Text>
        </View>

        <Card variant="elevated">
          <Text variant="subtitle" style={styles.cardTitle}>
            Building Overview & Security Feed
          </Text>
          <Text variant="body" style={styles.description}>
            View security activities, active guard status, and visitor entry/exit records strictly scoped to your assigned building.
          </Text>

          <View style={styles.moduleGrid}>
            {['Assigned Building Details', 'Guard Duty Status', 'Entry/Exit Activity Feed', 'Monthly Security Summary'].map(
              (item, idx) => (
                <View key={idx} style={styles.moduleItem}>
                  <Text variant="body" weight="medium" color={theme.colors.committee}>
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
    backgroundColor: '#F0FDF4',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
