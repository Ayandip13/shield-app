import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    try {
      setErrorMsg(null);
      await login(email.trim(), password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillCredentials = (type: 'admin' | 'committee' | 'guard') => {
    setErrorMsg(null);
    if (type === 'admin') {
      setEmail('admin@secureguard.com');
      setPassword('Admin@123');
    } else if (type === 'committee') {
      setEmail('committee.greenview@secureguard.com');
      setPassword('Committee@123');
    } else if (type === 'guard') {
      setEmail('guard1.greenview@secureguard.com');
      setPassword('Guard@123');
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Card variant="elevated" style={styles.card}>
        <Text variant="title" color={theme.colors.primary} style={styles.title}>
          SecuShield
        </Text>
        <Text variant="heading" style={styles.subtitle}>
          Sign In
        </Text>
        <Text variant="caption" style={styles.badge}>
          Building Security Management System
        </Text>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="admin@secureguard.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMsg) setErrorMsg(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMsg) setErrorMsg(null);
            }}
            secureTextEntry
          />

          <Button
            title={isLoading ? 'Signing in...' : 'Sign In'}
            variant="primary"
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.button}
          />
        </View>

        <View style={styles.seedSection}>
          <Text variant="caption" style={styles.seedLabel}>
            Dev Quick-Fill Credentials:
          </Text>
          <View style={styles.seedButtonsRow}>
            <Button
              title="Admin"
              variant="outline"
              size="sm"
              onPress={() => fillCredentials('admin')}
              style={styles.seedBtn}
            />
            <Button
              title="Committee"
              variant="outline"
              size="sm"
              onPress={() => fillCredentials('committee')}
              style={styles.seedBtn}
            />
            <Button
              title="Guard"
              variant="outline"
              size="sm"
              onPress={() => fillCredentials('guard')}
              style={styles.seedBtn}
            />
          </View>
        </View>
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
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
  },
  form: {
    marginVertical: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  seedSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceHover,
  },
  seedLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  seedButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seedBtn: {
    minWidth: 90,
  },
});
