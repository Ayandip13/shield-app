import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { NavigationProp } from '../../types/navigation';
import { theme } from '../../theme';

export const LoginScreenPlaceholder: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Auth'>>();

  return (
    <ScreenWrapper style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Text variant="title" color={theme.colors.primary} style={styles.title}>
          Shield
        </Text>
        <Text variant="heading" style={styles.subtitle}>
          Authentication Group
        </Text>
        <Text variant="caption" style={styles.badge}>
          [Placeholder - Feature Implementation Deferred]
        </Text>

        <View style={styles.formPlaceholder}>
          <Input label="Email or Username" placeholder="user@securityprovider.com" editable={false} />
          <Input label="Password" placeholder="••••••••" secureTextEntry editable={false} />
          
          <Button title="Login (Disabled in Foundation)" variant="primary" disabled style={styles.button} />
        </View>

        <Button title="← Back to Launcher" variant="ghost" onPress={() => navigation.goBack()} />
      </Card>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.xl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
  },
  badge: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.textMuted,
  },
  formPlaceholder: {
    marginVertical: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});
