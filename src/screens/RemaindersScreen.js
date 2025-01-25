import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, globalStyles} from '../styles/theme';

const RemaindersScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>Remainders</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RemaindersScreen;
