import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import TransactionItem from '../components/TransactionItem';
import {colors, globalStyles} from '../styles/theme';
import {auth} from '../firebaseConfig';
import {useFocusEffect} from '@react-navigation/native';

const RojmelScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('All'); // Tab state for Dr/All/Cr
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();

  // Fetch entries from Firebase
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      const entriesRef = collection(db, `users/${userId}/entries`);
      const entriesSnapshot = await getDocs(entriesRef);
      const entriesData = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEntries(entriesData);
    } catch (error) {
      console.error('Error fetching entries:', error);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // UseFocusEffect to fetch data every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, []),
  );

  // Filter entries based on selected tab
  const filteredEntries = entries.filter(entry => {
    if (selectedTab === 'Dr') return entry.type === 'debit';
    if (selectedTab === 'Cr') return entry.type === 'credit';
    return true; // 'All' tab shows all entries
  });

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {/* Tabs for Dr/All/Cr */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Dr' && styles.activeTab]}
          onPress={() => setSelectedTab('Dr')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'Dr' && styles.activeTabText,
            ]}>
            Dr
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'All' && styles.activeTab]}
          onPress={() => setSelectedTab('All')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'All' && styles.activeTabText,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Cr' && styles.activeTab]}
          onPress={() => setSelectedTab('Cr')}>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'Cr' && styles.activeTabText,
            ]}>
            Cr
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TransactionItem
            entry={item}
            onDelete={deletedId => {
              setEntries(current =>
                current.filter(transaction => transaction.id !== deletedId),
              );
            }}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found.</Text>
        }
      />

      {/* Navigate to AddTransaction */}
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={globalStyles.buttonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.primary,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.primary,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.lightText,
    marginTop: 20,
  },
});

export default RojmelScreen;
