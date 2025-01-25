// src/redux/persistConfig.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['account', 'entry'], // Only persist account and entry slices
};

export default persistConfig;
