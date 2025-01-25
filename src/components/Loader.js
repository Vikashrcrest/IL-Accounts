// src/components/Loader.js

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {colors, globalStyles} from '../styles/theme';

const Loader = () => (
  <View style={[globalStyles.container, styles.loaderContainer]}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
