import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import CustomInput from '../components/CustomInput';
import {colors, globalStyles} from '../styles/theme';

const LoginScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  // Firebase auth instance
  const auth = getAuth();

  // Validation schema for email and password
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = async values => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      setLoading(false);
      Alert.alert('Success', `Welcome ${userCredential.user.email}!`);
      // Navigate to the home screen or dashboard
      // navigation.replace('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>
      <Text style={styles.subHeader}>Please login to your account</Text>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Email Field */}
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              icon="mail-outline"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={errors.email}
              touched={touched.email}
              autoCapitalize="none"
            />

            {/* Password Field */}
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              icon="lock-outline"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={errors.password}
              touched={touched.password}
            />

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        Forgot Password?{' '}
        <Text
          style={styles.footerLink}
          onPress={() => navigation.navigate('ForgotPassword')}>
          Reset it here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    opacity: 0.9,
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
