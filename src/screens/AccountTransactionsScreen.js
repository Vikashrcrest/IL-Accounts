import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {colors, globalStyles} from '../styles/theme';
import TransactionItem from '../components/TransactionItem';
import {
  deleteAccountAndEntries,
  fetchEntriesByAccountId,
} from '../services/database';
import {useFocusEffect} from '@react-navigation/native';
// import Share from 'react-native-share'; // Commented out for now
import PDFGenerator from '../utils/pdfGenerator';

const AccountTransactionsScreen = ({route, navigation}) => {
  const {accountId, accountName} = route.params;
  const [accountTransactions, setAccountTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const transactions = await fetchEntriesByAccountId(accountId);
      setAccountTransactions(transactions);

      // Calculate balance dynamically
      const calculatedBalance = transactions.reduce((sum, entry) => {
        return sum + (entry.type === 'credit' ? entry.amount : -entry.amount);
      }, 0);
      setBalance(calculatedBalance);
    } catch (error) {
      console.error('Error fetching account transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [accountId]),
  );

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete ${accountName}? This will remove all related transactions.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccountAndEntries(accountId);
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {
              console.error('Error deleting account and entries:', error);
              Alert.alert('Error', 'Failed to delete account.');
            }
          },
        },
      ],
    );
  };

  const handleEditAccount = () => {
    navigation.navigate('AddAccount', {accountId, accountName}); // Pass accountId and accountName for editing
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction', {accountId, accountName});
  };

  const handleShareAccountReport = async () => {
    try {
      const filePath = await PDFGenerator.generateAccountReport(
        accountName,
        balance,
        accountTransactions,
      );
      if (filePath) {
        // Share implementation commented out
        /*
        await Share.open({
          url: `file://${filePath}`,
          title: 'Share Report',
          message: 'Here is the report you requested.',
          failOnCancel: false, // Prevent errors when the user cancels sharing
        });
        */
        Alert.alert(
          'Feature Pending',
          'The Share functionality is not implemented yet. The PDF is generated at: ' +
            filePath,
        );
      }
    } catch (error) {
      console.error('Error sharing account report:', error);
      Alert.alert('Error', 'Failed to generate or share the account report.');
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={styles.header}>{accountName} - Transactions</Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={handleEditAccount}
          style={[styles.actionButton, {backgroundColor: colors.lightText}]}>
          <Text style={styles.actionButtonText}>Edit Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={handleAddTransaction}
          style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShareAccountReport}
          style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Share Report</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <FlatList
        data={accountTransactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TransactionItem entry={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 15,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  actionButton: {
    flex: 1, // Equal width for all buttons
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    marginHorizontal: 5, // Space between buttons
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  shareButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },

  emptyText: {
    textAlign: 'center',
    color: colors.lightText,
    marginTop: 20,
  },
});

export default AccountTransactionsScreen;
