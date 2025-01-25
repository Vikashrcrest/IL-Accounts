import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration extracted from google-services.json
const firebaseConfig = {
  apiKey: 'AIzaSyDQM1vz9X70zK52nNpzyMC06EaTt2a0knM',
  authDomain: 'ss-santa.firebaseapp.com', // Auth domain is typically the project ID with .firebaseapp.com
  projectId: 'ss-santa',
  storageBucket: 'ss-santa.firebasestorage.app',
  messagingSenderId: '342116384527', // Project number is usually the messagingSenderId
  appId: '1:342116384527:android:a04658169b0cbe28c1487a',
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export {app, auth};
