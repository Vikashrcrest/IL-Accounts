import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, fontSizes, globalStyles} from '../styles/theme';
import {getFirestore, doc, getDoc, deleteDoc} from 'firebase/firestore';
import {auth} from '../firebaseConfig';

const TransactionItem = ({entry, onDelete}) => {
  const [accountName, setAccountName] = useState('Loading...');
  const db = getFirestore();

  // Fetch the account name from Firebase
  useEffect(() => {
    const fetchAccountName = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated.');

        const accountRef = doc(
          db,
          `users/${userId}/accounts/${entry.accountId}`,
        );
        const accountSnap = await getDoc(accountRef);

        if (accountSnap.exists()) {
          const accountData = accountSnap.data();
          setAccountName(accountData.name || 'Unknown');
        } else {
          setAccountName('Unknown');
        }
      } catch (error) {
        console.error('Error fetching account name:', error);
        setAccountName('Unknown');
      }
    };

    fetchAccountName();
  }, [entry.accountId]);

  // Handle transaction deletion
  const handleDeleteTransaction = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated.');

      const transactionRef = doc(db, `users/${userId}/entries/${entry.id}`);
      await deleteDoc(transactionRef);

      if (onDelete) {
        onDelete(entry.id); // Notify the parent to update the list
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert(
        'Error',
        'Failed to delete the transaction. Please try again.',
      );
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleteTransaction,
        },
      ],
    );
  };

  return (
    <View style={[globalStyles.card, styles.item]}>
      {/* Display Account Name as "Party Name" */}
      <Text style={styles.partyName}>Party Name: {accountName}</Text>

      <View style={styles.row}>
        {/* Display Transaction Type (Credit/Debit) */}
        <Text style={styles.type}>
          {entry.type === 'credit' ? 'Credit  ' : 'Debit  '}
        </Text>

        {/* Bin Icon for Deleting Transaction */}
        <TouchableOpacity onPress={confirmDelete}>
          <Icon name="trash-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Display Amount */}
      <Text style={styles.amount}>
        Amount: ₹{Number(entry?.amount || 0).toFixed(2)}
      </Text>

      {/* Display Description */}
      <Text style={styles.description}>
        Description: {entry?.description || 'No description provided'}
      </Text>

      {/* Display Date */}
      <Text style={styles.date}>
        Date:{' '}
        {entry?.transactionDate
          ? new Date(entry.transactionDate).toLocaleDateString()
          : 'Date not available'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  partyName: {
    fontSize: fontSizes.medium,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  type: {
    fontSize: fontSizes.small,
    fontWeight: 'bold',
    color: colors.lightText,
  },
  amount: {
    fontSize: fontSizes.medium,
    color: colors.white,
    marginTop: 5,
  },
  description: {
    fontSize: fontSizes.small,
    color: colors.lightText,
    marginTop: 5,
  },
  date: {
    fontSize: fontSizes.small,
    color: colors.lightText,
    marginTop: 5,
  },
});

export default TransactionItem;
