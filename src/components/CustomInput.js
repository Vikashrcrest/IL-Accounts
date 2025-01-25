import React, {forwardRef} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors, fontSizes, spacing} from '../styles/theme';

const CustomInput = forwardRef(
  ({label, icon, error, touched, ...props}, ref) => (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Icon
          name={icon}
          size={20}
          color={colors.primary}
          style={styles.icon}
        />
        <TextInput style={styles.input} ref={ref} {...props} />
      </View>
      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  ),
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.medium,
  },
  label: {
    fontSize: fontSizes.medium,
    color: colors.text,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.small,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.medium,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.small,
    marginTop: 4,
  },
});

export default CustomInput;
