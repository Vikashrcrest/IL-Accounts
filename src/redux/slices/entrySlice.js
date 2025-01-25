import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getFirestore, collection, getDocs} from 'firebase/firestore';
import {auth} from '../../firebaseConfig';

const db = getFirestore();

// Fetch entries from Firebase
export const fetchEntries = createAsyncThunk('entry/fetchEntries', async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated.');

  const entriesCollection = collection(db, `users/${userId}/entries`);
  const snapshot = await getDocs(entriesCollection);

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
});

const entrySlice = createSlice({
  name: 'entry',
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEntries.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default entrySlice.reducer;
