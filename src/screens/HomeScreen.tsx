import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ApiClient } from '../api/client';
import { HealthCheckResponse } from '../types/api';
import { NavigationProp } from '../types/navigation';
import { theme } from '../theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Home'>>();
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    setLoading(true);
    setHealthError(null);
    try {
      const response = await ApiClient.checkHealth();
      if (response.success && response.data) {
        setHealthStatus(response.data);
      } else {
        setHealthError(response.message || 'Failed to reach API');
      }
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="title" color={theme.colors.primary}>
            Shield
          </Text>
          <Text variant="caption">Building Security Management SaaS</Text>
        </View>

        <Card variant="elevated">
          <Text variant="subtitle" style={styles.sectionTitle}>
            Role Navigation Groups
          </Text>
          <Text variant="caption" style={styles.description}>
            Verify React Navigation between the three initial system roles:
          </Text>

          <View style={styles.buttonGroup}>
            <Button
              title="Provider Admin Group"
              variant="primary"
              style={styles.navButton}
              onPress={() => navigation.navigate('ProviderAdmin')}
            />

            <Button
              title="Building Committee Group"
              variant="secondary"
              style={styles.navButton}
              onPress={() => navigation.navigate('Committee')}
            />

            <Button
              title="Security Guard Group"
              variant="outline"
              style={styles.navButton}
              onPress={() => navigation.navigate('Guard')}
            />

            <Button
              title="Authentication Group (Login)"
              variant="ghost"
              style={styles.navButton}
              onPress={() => navigation.navigate('Auth')}
            />
          </View>
        </Card>

        <Card variant="outlined">
          <Text variant="heading" style={styles.sectionTitle}>
            Backend Integration Check
          </Text>
          <Text variant="caption" style={styles.description}>
            Endpoint: GET /api/v1/health
          </Text>

          <Button
            title="Test Backend Health API"
            variant="secondary"
            loading={loading}
            onPress={testBackendConnection}
            style={styles.healthButton}
          />

          {healthStatus && (
            <View style={styles.statusBox}>
              <Text variant="caption" color={theme.colors.success} weight="bold">
                ✓ Backend Connected: {healthStatus.status}
              </Text>
              <Text variant="caption">Env: {healthStatus.environment}</Text>
              <Text variant="caption">Uptime: {Math.round(healthStatus.uptime)}s</Text>
              <Text variant="caption">
                DB State: {healthStatus.database.state} ({healthStatus.database.connected ? 'Connected' : 'Disconnected'})
              </Text>
            </View>
          )}

          {healthError && (
            <View style={styles.errorBox}>
              <Text variant="caption" color={theme.colors.danger} weight="bold">
                ✕ Connection Failed
              </Text>
              <Text variant="caption" color={theme.colors.danger}>
                {healthError}
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    marginBottom: theme.spacing.lg,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
  navButton: {
    width: '100%',
  },
  healthButton: {
    marginTop: theme.spacing.sm,
  },
  statusBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.successLight,
    borderRadius: theme.borderRadius.md,
    gap: 2,
  },
  errorBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.dangerLight,
    borderRadius: theme.borderRadius.md,
    gap: 2,
  },
});
