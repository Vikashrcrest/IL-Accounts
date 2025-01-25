import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, fontSizes, globalStyles} from '../styles/theme';
import {useNavigation} from '@react-navigation/native';

const AccountCard = ({account}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('AccountDetails', {
      accountId: account.id,
      accountName: account.name,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[globalStyles.card, styles.card]}>
      {/* Account Name */}
      <Text style={styles.name}>{account.name}</Text>

      {/* Account Balance */}
      <Text style={styles.text}>
        Balance: ₹{Number(account.balance || 0).toFixed(2)}
      </Text>

      {/* Contact Information */}
      <Text style={styles.text}>
        Contact: {account?.contactInfo?.contact || 'No contact info available'}
      </Text>

      {/* Last Transaction Date */}
      <Text style={styles.text}>
        Last Transaction: {account.lastTransactionDate || 'No Transactions'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  name: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  text: {
    fontSize: fontSizes.medium,
    color: colors.white,
    marginBottom: 4,
  },
});

export default AccountCard;
