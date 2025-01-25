import React, {useRef, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSelector} from 'react-redux';
import {colors, globalStyles} from '../styles/theme';
import {addNewAccount, updateExistingAccount} from '../services/database';
import Account from '../models/AccountModel';
import CustomInput from '../components/CustomInput';

const AddAccountScreen = ({navigation, route}) => {
  const accounts = useSelector(state => state.account.accounts);
  const accountId = route.params?.accountId;
  const accountName = route.params?.accountName;

  const accountToEdit = accountId
    ? accounts.find(acc => acc.id === accountId)
    : null;

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    if (accountId) {
      navigation.setOptions({
        title: `Edit (${accountName || 'Account'})`,
      });
    }
  }, [accountId, accountName, navigation]);

  const addressRef = useRef();
  const gstNumberRef = useRef();
  const contactInfoRef = useRef();

  const accountSchema = Yup.object().shape({
    name: Yup.string()
      .required('Account name is required')
      .max(100, 'Name cannot be more than 100 characters')
      .test(
        'unique-name',
        'Account name already exists',
        name =>
          !accounts.some(
            acc =>
              acc.name.toLowerCase() === name.toLowerCase() &&
              acc.id !== accountId,
          ),
      ),
    address: Yup.string().max(
      100,
      'Address cannot be more than 100 characters',
    ),
    gstNumber: Yup.string()
      .matches(
        /^[0-9A-Z]{15}$/,
        'Invalid GST number. It should be 15 alphanumeric characters.',
      )
      .nullable(),
    contactInfo: Yup.string()
      .matches(/^[0-9]{10}$/, 'Invalid mobile number. It should be 10 digits.')
      .nullable(),
  });

  const handleSubmitAccount = async values => {
    try {
      if (accountId) {
        await updateExistingAccount(accountId, {
          ...accountToEdit,
          ...values,
        });
        Alert.alert('Success', 'Account updated successfully');
      } else {
        const newAccount = new Account(
          Date.now().toString(),
          values.name,
          values.address,
          values.gstNumber,
          {contact: values.contactInfo},
          0,
        );
        await addNewAccount(newAccount);
        Alert.alert('Success', 'Account added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save account. Please try again.');
      console.error('Error saving account:', error);
    }
  };

  return (
    <Formik
      initialValues={{
        name: accountToEdit?.name || '',
        address: accountToEdit?.address || '',
        gstNumber: accountToEdit?.gstNumber || '',
        contactInfo: accountToEdit?.contactInfo?.contact || '',
      }}
      validationSchema={accountSchema}
      onSubmit={handleSubmitAccount}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        initialValues,
      }) => {
        useEffect(() => {
          const isChanged =
            values.name !== initialValues.name ||
            values.address !== initialValues.address ||
            values.gstNumber !== initialValues.gstNumber ||
            values.contactInfo !== initialValues.contactInfo;
          setIsButtonEnabled(isChanged);
        }, [values, initialValues]);

        return (
          <View style={globalStyles.container}>
            <CustomInput
              label="Account Name"
              icon="person"
              placeholder="Enter account name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={errors.name}
              touched={touched.name}
              maxLength={100}
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current.focus()}
            />

            <CustomInput
              label="Address"
              icon="home"
              placeholder="Enter address (optional)"
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              value={values.address}
              error={errors.address}
              touched={touched.address}
              maxLength={100}
              ref={addressRef}
              returnKeyType="next"
              onSubmitEditing={() => gstNumberRef.current.focus()}
            />

            <CustomInput
              label="GST Number"
              icon="account-balance"
              placeholder="Enter GST number (optional)"
              onChangeText={handleChange('gstNumber')}
              onBlur={handleBlur('gstNumber')}
              value={values.gstNumber}
              error={errors.gstNumber}
              touched={touched.gstNumber}
              maxLength={15}
              keyboardType="default"
              ref={gstNumberRef}
              returnKeyType="next"
              onSubmitEditing={() => contactInfoRef.current.focus()}
            />

            <CustomInput
              label="Contact Information"
              icon="phone"
              placeholder="Enter mobile number (optional)"
              onChangeText={handleChange('contactInfo')}
              onBlur={handleBlur('contactInfo')}
              value={values.contactInfo}
              error={errors.contactInfo}
              touched={touched.contactInfo}
              maxLength={10}
              keyboardType="numeric"
              ref={contactInfoRef}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <TouchableOpacity
              style={[
                globalStyles.button,
                {opacity: isButtonEnabled ? 1 : 0.5},
              ]}
              onPress={handleSubmit}
              disabled={!isButtonEnabled}>
              <Text style={globalStyles.buttonText}>
                {accountId ? 'Update Account' : 'Add Account'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
    </Formik>
  );
};

export default AddAccountScreen;
