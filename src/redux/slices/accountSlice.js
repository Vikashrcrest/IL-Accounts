import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {auth} from '../../firebaseConfig';

const db = getFirestore();

// Fetch accounts from Firebase
export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated.');

    const accountsCollection = collection(db, `users/${userId}/accounts`);
    const snapshot = await getDocs(accountsCollection);

    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  },
);

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAccounts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default accountSlice.reducer;
