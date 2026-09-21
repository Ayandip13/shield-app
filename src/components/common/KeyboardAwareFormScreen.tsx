import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ScreenWrapper, ScreenWrapperProps } from './ScreenWrapper';

export interface KeyboardAwareFormScreenProps extends ScreenWrapperProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  behavior?: 'height' | 'position' | 'padding';
}

export const KeyboardAwareFormScreen: React.FC<KeyboardAwareFormScreenProps> = ({
  children,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  behavior = Platform.OS === 'ios' ? 'padding' : 'height',
  safeArea,
  hasHeader,
  edges,
}) => {
  return (
    <ScreenWrapper
      style={style}
      safeArea={safeArea}
      hasHeader={hasHeader}
      edges={edges}
    >
      <KeyboardAvoidingView behavior={behavior} style={styles.flexOne}>
        <ScrollView
          contentContainerStyle={[styles.defaultContentContainer, contentContainerStyle]}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  defaultContentContainer: {
    flexGrow: 1,
  },
});
