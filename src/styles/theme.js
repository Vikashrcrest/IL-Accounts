// src/styles/theme.js

import {StyleSheet} from 'react-native';

export const colors = {
  primary: '#4CAF50',
  secondary: '#FF9800',
  background: '#F5F5F5',
  text: '#333333',
  lightText: '#777777',
  error: '#FF5252',
  white: '#FFFFFF',
};

export const fontSizes = {
  small: 14,
  medium: 18,
  large: 22,
};

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  card: {
    padding: spacing.medium,
    marginVertical: spacing.small,
    borderRadius: 10,
    shadowColor: colors.text,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.small,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.medium,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.small,
    marginTop: spacing.small,
  },
});
