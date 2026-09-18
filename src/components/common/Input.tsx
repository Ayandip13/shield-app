import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { theme } from '../../theme';

export interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  style,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(!!secureTextEntry);

  useEffect(() => {
    if (secureTextEntry !== undefined) {
      setIsPasswordHidden(secureTextEntry);
    }
  }, [secureTextEntry]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : undefined,
        ]}
      >
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secureTextEntry ? isPasswordHidden : false}
          {...props}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeIconButton}
            onPress={() => setIsPasswordHidden((prev) => !prev)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isPasswordHidden ? 'Show password' : 'Hide password'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
  },
  inputContainerError: {
    borderColor: theme.colors.danger,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textPrimary,
  },
  eyeIconButton: {
    paddingLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
  hintText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

