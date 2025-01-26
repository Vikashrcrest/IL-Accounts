import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors, globalStyles} from '../styles/theme';
import Entry from '../models/EntryModel';
import CustomInput from '../components/CustomInput';
import CustomDropdown from '../components/CustomDropdown';
import {addNewEntry} from '../services/database';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {auth} from '../firebaseConfig';

const AddTransactionScreen = ({navigation, route}) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const accountIdFromParams = route.params?.accountId;

  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  // Fetch accounts from Firebase
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsRef = collection(db, `users/${userId}/accounts`);
        const snapshot = await getDocs(accountsRef);
        const accountsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        Alert.alert('Error', 'Failed to fetch accounts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [db, userId]);

  // Refs for input navigation
  const amountRef = useRef();
  const descriptionRef = useRef();

  // Validation schema
  const entrySchema = Yup.object().shape({
    accountId: Yup.string().required('Account is required'),
    transactionDate: Yup.date()
      .required('Date is required')
      .max(new Date(), 'Transaction date cannot be in the future'),
    type: Yup.string().required('Transaction type is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .test(
        'len',
        'Amount cannot exceed 10 digits',
        val => val && val.toString().length <= 10,
      ),
    description: Yup.string().max(
      100,
      'Description cannot be more than 100 characters',
    ),
  });

  const handleAddTransaction = async values => {
    const amount = parseFloat(values.amount);

    const newEntry = new Entry(
      Date.now().toString(),
      values.accountId,
      values.transactionDate,
      values.type,
      amount,
      values.description,
    );

    try {
      await addNewEntry(newEntry);
      Alert.alert('Success', 'Transaction added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    }
  };

  const handleDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      const formattedDate = selected.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <Formik
      initialValues={{
        accountId: accountIdFromParams || '',
        transactionDate: selectedDate,
        type: 'credit',
        amount: '',
        description: '',
      }}
      validationSchema={entrySchema}
      onSubmit={handleAddTransaction}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        errors,
        touched,
      }) => (
        <View style={globalStyles.container}>
          {accountIdFromParams ? (
            <CustomInput
              label="Account"
              value={
                accounts.find(acc => acc.id === accountIdFromParams)?.name || ''
              }
              editable={false}
            />
          ) : (
            <CustomDropdown
              data={accounts}
              onSelect={accountId => setFieldValue('accountId', accountId)}
              selectedValue={values.accountId}
              placeholder="Select Account"
            />
          )}
          {errors.accountId && touched.accountId && (
            <Text style={globalStyles.errorText}>{errors.accountId}</Text>
          )}

          {/* Transaction Date */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}>
            <Text style={styles.dateText}>{values.transactionDate}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(values.transactionDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()} // Prevent future dates
              onChange={(event, selectedDate) =>
                handleDateChange(event, selectedDate || new Date())
              }
            />
          )}

          {/* Transaction Type */}
          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                values.type === 'credit'
                  ? styles.activeToggle
                  : styles.inactiveToggle,
              ]}
              onPress={() => setFieldValue('type', 'credit')}>
              <Text
                style={
                  values.type === 'credit'
                    ? styles.activeText
                    : styles.inactiveText
                }>
                Credit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                values.type === 'debit'
                  ? styles.activeToggle
                  : styles.inactiveToggle,
              ]}
              onPress={() => setFieldValue('type', 'debit')}>
              <Text
                style={
                  values.type === 'debit'
                    ? styles.activeText
                    : styles.inactiveText
                }>
                Debit
              </Text>
            </TouchableOpacity>
          </View>
          {errors.type && touched.type && (
            <Text style={globalStyles.errorText}>{errors.type}</Text>
          )}

          {/* Amount Input */}
          <CustomInput
            label="Amount"
            icon="attach-money"
            placeholder="Enter amount"
            keyboardType="numeric"
            onChangeText={handleChange('amount')}
            onBlur={handleBlur('amount')}
            value={values.amount}
            error={errors.amount}
            touched={touched.amount}
            maxLength={10}
            ref={amountRef}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current.focus()}
          />

          {/* Description Input */}
          <CustomInput
            label="Description"
            icon="description"
            placeholder="Enter description"
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            error={errors.description}
            touched={touched.description}
            maxLength={100}
            ref={descriptionRef}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          {/* Submit Button */}
          <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
            <Text style={globalStyles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.text,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  inactiveToggle: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  activeText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  inactiveText: {
    color: colors.primary,
  },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    color: colors.text,
    fontSize: 16,
  },
});

export default AddTransactionScreen;
