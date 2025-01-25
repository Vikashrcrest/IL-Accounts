import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Share from 'react-native-share';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {colors, fontSizes, globalStyles} from '../styles/theme';
import {safeValue} from '../utils/safeValue';
import PDFGenerator from '../utils/pdfGenerator';
import {auth} from '../firebaseConfig';

const ReportsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();

  // Fetch accounts and entries from Firebase
  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      // Fetch accounts
      const accountsRef = collection(db, `users/${userId}/accounts`);
      const accountsSnapshot = await getDocs(accountsRef);
      const accountsData = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch entries
      const entriesRef = collection(db, `users/${userId}/entries`);
      const entriesSnapshot = await getDocs(entriesRef);
      const entriesData = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate balances dynamically based on entries
      const updatedAccounts = accountsData.map(account => {
        const relatedEntries = entriesData.filter(
          entry => entry.accountId === account.id,
        );
        const balance = relatedEntries.reduce((sum, entry) => {
          return sum + (entry.type === 'credit' ? entry.amount : -entry.amount);
        }, 0);
        const lastTransactionDate = relatedEntries.length
          ? new Date(
              Math.max(
                ...relatedEntries.map(entry =>
                  new Date(entry.transactionDate).getTime(),
                ),
              ),
            ).toLocaleDateString()
          : 'No Transactions';

        return {
          ...account,
          balance: safeValue(balance),
          lastTransactionDate,
        };
      });

      setAccounts(updatedAccounts);
      setEntries(entriesData);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      Alert.alert('Error', 'Failed to fetch reports data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchReportsData();
    }, []),
  );

  // Calculate reports data
  const totalParties = safeValue(accounts.length);
  const totalBalance = accounts.reduce(
    (sum, account) => sum + safeValue(account.balance),
    0,
  );
  const totalCredit = entries
    .filter(entry => entry.type === 'credit')
    .reduce((sum, entry) => sum + safeValue(entry.amount), 0);
  const totalDebit = entries
    .filter(entry => entry.type === 'debit')
    .reduce((sum, entry) => sum + safeValue(entry.amount), 0);
  const topDueAccounts = [...accounts]
    .sort((a, b) => safeValue(b.balance) - safeValue(a.balance))
    .slice(0, 3);

  const totals = {totalParties, totalBalance, totalCredit, totalDebit};

  const handleSharePDF = async filePath => {
    try {
      await Share.open({
        url: `file://${filePath}`,
        title: 'Share Report',
        message: 'Here is the report you requested.',
        failOnCancel: false, // Prevent errors when the user cancels sharing
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Failed to share the PDF.');
    }
  };

  const handleDownloadKhataPDF = async () => {
    setModalVisible(false);
    try {
      const filePath = await PDFGenerator.generateKhataPDF(accounts, entries);
      if (filePath) {
        Alert.alert(
          'Report Generated',
          'Do you want to open or share the report?',
          [
            {
              text: 'Open',
              onPress: () => Linking.openURL(`file://${filePath}`),
            },
            {
              text: 'Share',
              onPress: () => handleSharePDF(filePath),
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }
    } catch (error) {
      console.error('Error downloading Khata PDF:', error);
      Alert.alert('Error', 'Failed to generate or share the Khata PDF.');
    }
  };

  const handleDownloadRojmelPDF = async () => {
    setModalVisible(false);
    try {
      const filePath = await PDFGenerator.generateRojmelPDF(entries);
      if (filePath) {
        Alert.alert(
          'Report Generated',
          'Do you want to open or share the report?',
          [
            {
              text: 'Open',
              onPress: () => Linking.openURL(`file://${filePath}`),
            },
            {
              text: 'Share',
              onPress: () => handleSharePDF(filePath),
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }
    } catch (error) {
      console.error('Error downloading Rojmel PDF:', error);
      Alert.alert('Error', 'Failed to generate or share the Rojmel PDF.');
    }
  };

  const handleDownloadTotalsPDF = async () => {
    setModalVisible(false);
    try {
      const filePath = await PDFGenerator.generateTotalsPDF(
        accounts,
        entries,
        totals,
      );
      if (filePath) {
        Alert.alert(
          'Report Generated',
          'Do you want to open or share the report?',
          [
            {
              text: 'Open',
              onPress: () => Linking.openURL(`file://${filePath}`),
            },
            {
              text: 'Share',
              onPress: () => handleSharePDF(filePath),
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }
    } catch (error) {
      console.error('Error downloading Totals PDF:', error);
      Alert.alert('Error', 'Failed to generate or share the Totals PDF.');
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
    <View style={[globalStyles.container, styles.container]}>
      {/* Summary Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>Total Parties</Text>
          <Text style={styles.gridValue}>{totalParties}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>Total Balance</Text>
          <Text style={styles.gridValue}>
            ₹{safeValue(totalBalance).toFixed(2)}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>Cashflow</Text>
          <Text style={styles.gridValue}>
            ₹{safeValue(totalCredit - totalDebit).toFixed(2)}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>Total Credit</Text>
          <Text style={styles.gridValue}>
            ₹{safeValue(totalCredit).toFixed(2)}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridTitle}>Total Debit</Text>
          <Text style={styles.gridValue}>
            ₹{safeValue(totalDebit).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Top Due Accounts */}
      <Text style={styles.sectionTitle}>Top 3 Parties with Max Due Amount</Text>
      <FlatList
        data={topDueAccounts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.dueAccountCard}>
            <Text style={styles.dueAccountName}>{item.name}</Text>
            <Text style={styles.dueAccountBalance}>
              ₹{safeValue(item.balance).toFixed(2)}
            </Text>
          </View>
        )}
      />

      {/* Download Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.downloadButtonText}>Download Reports</Text>
      </TouchableOpacity>

      {/* Modal for Download Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Download Options</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDownloadKhataPDF}>
              <Text style={styles.modalButtonText}>Download Khata</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDownloadRojmelPDF}>
              <Text style={styles.modalButtonText}>Download Rojmel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDownloadTotalsPDF}>
              <Text style={styles.modalButtonText}>Download Totals</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.lightText,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  gridTitle: {
    fontSize: fontSizes.small,
    color: colors.lightText,
    marginBottom: 5,
    textAlign: 'center',
  },
  gridValue: {
    fontSize: fontSizes.medium,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: fontSizes.medium,
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  dueAccountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  dueAccountName: {
    fontSize: fontSizes.medium,
    color: colors.text,
    flex: 1,
  },
  dueAccountBalance: {
    fontSize: fontSizes.medium,
    color: colors.primary,
    fontWeight: 'bold',
    maxWidth: '50%',
  },
  downloadButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSizes.medium,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: fontSizes.large,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: fontSizes.medium,
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: colors.lightText,
    fontSize: fontSizes.small,
  },
});

export default ReportsScreen;
