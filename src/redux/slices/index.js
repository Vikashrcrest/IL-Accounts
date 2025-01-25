// src/redux/slices/index.js

import {combineReducers} from 'redux';
import accountReducer from './accountSlice';
import entryReducer from './entrySlice';

// Combine reducers for all slices
const rootReducer = combineReducers({
  account: accountReducer,
  entry: entryReducer,
});

export default rootReducer;
