// src/components/ErrorBoundary.js

import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, globalStyles} from '../styles/theme';

class ErrorBoundary extends Component {
  state = {hasError: false};

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error, info) {
    console.error('Error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[globalStyles.container, styles.centered]}>
          <Text style={globalStyles.errorText}>
            Something went wrong. Please try again later.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ErrorBoundary;
