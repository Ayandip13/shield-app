import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export const LoginScreen: React.FC = () => {
  const { login, isLoading, sessionNotice, clearSessionNotice } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (isSubmitting || isLoading) return;
    if (!validate()) return;

    try {
      setErrorMsg(null);
      clearSessionNotice();
      setIsSubmitting(true);
      await login(email.trim(), password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (type: 'admin' | 'committee' | 'guard') => {
    setErrorMsg(null);
    clearSessionNotice();
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

  const activeNotice = errorMsg || sessionNotice;

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            {activeNotice ? (
              <View style={sessionNotice && !errorMsg ? styles.sessionNoticeBanner : styles.errorBanner}>
                <Text style={sessionNotice && !errorMsg ? styles.sessionNoticeText : styles.errorText}>
                  {activeNotice}
                </Text>
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
                  if (sessionNotice) clearSessionNotice();
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
                  if (sessionNotice) clearSessionNotice();
                }}
                secureTextEntry
              />

              <Button
                title={isLoading || isSubmitting ? 'Signing in...' : 'Sign In'}
                variant="primary"
                onPress={handleLogin}
                disabled={isLoading || isSubmitting}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  sessionNoticeBanner: {
    backgroundColor: '#FEF3C7',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  sessionNoticeText: {
    color: '#92400E',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
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

