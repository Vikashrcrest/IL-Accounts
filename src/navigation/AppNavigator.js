import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {TouchableOpacity, Text, Alert, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {signOut, getAuth, onAuthStateChanged} from 'firebase/auth';

// Import Screens
import RojmelScreen from '../screens/RojmelScreen';
import KhatavahiScreen from '../screens/KhatavahiScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import AccountTransactionsScreen from '../screens/AccountTransactionsScreen';
import LoginScreen from '../screens/Login';

import {colors, globalStyles} from '../styles/theme';
import RemaindersScreen from '../screens/RemaindersScreen';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RojmelStack = createStackNavigator();
const KhatavahiStack = createStackNavigator();
const ReportsStack = createStackNavigator();

const headerOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerTitleAlign: 'center',
};

// Logout Button Component
const LogoutButton = ({navigation}) => {
  const handleLogout = () => {
    const auth = getAuth();
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{marginRight: 15, padding: 5}}>
      <Icon name="log-out-outline" size={25} color={colors.white} />
    </TouchableOpacity>
  );
};

// Stack navigator for Rojmel tab
const RojmelStackNavigator = ({navigation}) => (
  <RojmelStack.Navigator
    screenOptions={{
      ...headerOptions,
      headerRight: () => <LogoutButton navigation={navigation} />,
    }}>
    <RojmelStack.Screen
      name="RojmelMain"
      component={RojmelScreen}
      options={{title: 'Rojmel'}}
    />
    <RojmelStack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{title: 'Add Transaction'}}
    />
  </RojmelStack.Navigator>
);

// Stack navigator for Khatavahi tab
const KhatavahiStackNavigator = ({navigation}) => (
  <KhatavahiStack.Navigator
    screenOptions={{
      ...headerOptions,
      headerRight: () => <LogoutButton navigation={navigation} />,
    }}>
    <KhatavahiStack.Screen
      name="KhatavahiMain"
      component={KhatavahiScreen}
      options={{title: 'Khatavahi'}}
    />
    <KhatavahiStack.Screen
      name="AddAccount"
      component={AddAccountScreen}
      options={{title: 'Add Account'}}
    />
    <KhatavahiStack.Screen
      name="AccountDetails"
      component={AccountTransactionsScreen}
      options={{title: 'Account Details'}}
    />
    <KhatavahiStack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{title: 'Add Transaction'}}
    />
  </KhatavahiStack.Navigator>
);

// Stack navigator for Reports tab
const ReportsStackNavigator = ({navigation}) => (
  <ReportsStack.Navigator
    screenOptions={{
      ...headerOptions,
      headerRight: () => <LogoutButton navigation={navigation} />,
    }}>
    <ReportsStack.Screen
      name="ReportsMain"
      component={ReportsScreen}
      options={{title: 'Reports'}}
    />
  </ReportsStack.Navigator>
);

// Stack navigator for Remainders tab
const RemaindersStack = createStackNavigator();

const RemaindersStackNavigator = ({navigation}) => (
  <RemaindersStack.Navigator
    screenOptions={{
      ...headerOptions,
      headerRight: () => <LogoutButton navigation={navigation} />,
    }}>
    <RemaindersStack.Screen
      name="RemaindersMain"
      component={RemaindersScreen}
      options={{title: 'Remainders'}}
    />
    {/* Add any additional screens related to Remainders here */}
  </RemaindersStack.Navigator>
);

// Updated Bottom Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName;
        if (route.name === 'Rojmel') {
          iconName = 'document-text-outline';
        } else if (route.name === 'Khatavahi') {
          iconName = 'book-outline';
        } else if (route.name === 'Reports') {
          iconName = 'bar-chart-outline';
        } else if (route.name === 'Remainders') {
          iconName = 'alarm-outline'; // Icon for Remainders
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.lightText,
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 5,
      },
      headerShown: false,
    })}>
    <Tab.Screen name="Khatavahi" component={KhatavahiStackNavigator} />
    <Tab.Screen name="Reports" component={ReportsStackNavigator} />
    <Tab.Screen name="Rojmel" component={RojmelStackNavigator} />
    {/* <Tab.Screen name="Remainders" component={RemaindersStackNavigator} /> */}
  </Tab.Navigator>
);

// Authentication stack navigator
const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={headerOptions}>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      setLoading(false); // Stop loading once auth state is determined
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) {
    // Show a loading screen or spinner
    return (
      <View style={[globalStyles.container, {justifyContent: 'center'}]}>
        <Text style={{fontSize: 18, color: colors.primary}}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
