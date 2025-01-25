import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AccountCard from '../components/AccountCard';
import {colors, globalStyles} from '../styles/theme';
import {auth} from '../firebaseConfig';

const KhatavahiScreen = ({navigation}) => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  // Helper to parse transaction date strings
  const parseTransactionDate = dateStr => {
    return dateStr ? new Date(dateStr) : null; // Convert string to Date object
  };

  // Fetch accounts and entries from Firebase
  const fetchAccountsAndEntries = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('User not authenticated');
        return;
      }

      // Fetch accounts
      const accountsRef = collection(db, `users/${userId}/accounts`);
      const accountsSnapshot = await getDocs(accountsRef);
      const accountsData = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        balance: 0, // Initialize balance to zero
        lastTransactionDate: null, // Initialize last transaction date
      }));

      // Fetch entries
      const entriesRef = collection(db, `users/${userId}/entries`);
      const entriesSnapshot = await getDocs(entriesRef);
      const entriesData = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        transactionDate: parseTransactionDate(doc.data().transactionDate),
      }));

      // Recalculate balances and last transaction date for each account
      const updatedAccounts = accountsData.map(account => {
        const accountEntries = entriesData.filter(
          entry => entry.accountId === account.id,
        );

        // Calculate balance
        const balance = accountEntries.reduce((acc, entry) => {
          if (entry.type === 'credit') return acc + parseFloat(entry.amount);
          if (entry.type === 'debit') return acc - parseFloat(entry.amount);
          return acc;
        }, 0);

        // Find the last transaction date
        const lastTransactionDate = accountEntries.length
          ? new Date(
              Math.max(
                ...accountEntries
                  .map(entry => entry.transactionDate)
                  .filter(date => date), // Ignore invalid dates
              ),
            ).toLocaleDateString()
          : 'No Transactions';

        return {
          ...account,
          balance,
          lastTransactionDate,
        };
      });

      setAccounts(updatedAccounts);
      setFilteredAccounts(updatedAccounts);
    } catch (error) {
      console.error('Error fetching accounts and entries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAccountsAndEntries();
    }, []),
  );

  // Function to filter accounts based on search query
  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = accounts.filter(account =>
      account.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredAccounts(filtered);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredAccounts(accounts);
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
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color={colors.lightText}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search accounts"
          placeholderTextColor={colors.lightText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={colors.lightText} />
          </TouchableOpacity>
        )}
      </View>

      {/* Accounts List */}
      <FlatList
        data={filteredAccounts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <AccountCard
            account={item}
            onPress={() =>
              navigation.navigate('AccountDetails', {
                accountId: item.id,
                accountName: item.name,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No accounts found.</Text>
        }
      />

      {/* Add Account Button */}
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('AddAccount')}>
        <Text style={globalStyles.buttonText}>Add Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 15,
    elevation: 5,
    shadowColor: colors.lightText,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.lightText,
    marginTop: 20,
  },
});

export default KhatavahiScreen;
