import {store} from '../redux/store';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  where,
  getDocs,
  query,
} from 'firebase/firestore';
import Account from '../models/AccountModel';
import Entry from '../models/EntryModel';
import {auth} from '../firebaseConfig';

// Initialize Firestore
const db = getFirestore();

/**
 * Get the current user's Firestore path prefix.
 * @returns {string} The user's Firestore path prefix.
 */
const getUserPath = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated.');
  return `users/${userId}`;
};

/**
 * Adds a new account to Firebase and then to the Redux store.
 * @param {Account} account - The account object to add.
 */
export const addNewAccount = async account => {
  try {
    const userPath = getUserPath();
    const plainAccount = account.toPlainObject();
    const accountRef = doc(db, `${userPath}/accounts/${account.id}`);
    await setDoc(accountRef, plainAccount);
    // store.dispatch(addAccount(plainAccount));
  } catch (error) {
    console.error('Error adding account to Firebase:', error);
  }
};

/**
 * Updates an existing account in Firebase and then in the Redux store.
 * @param {string} accountId - The ID of the account to update.
 * @param {Object} updatedAccount - The updated account details.
 */
export const updateExistingAccount = async (accountId, updatedAccount) => {
  try {
    const userPath = getUserPath();
    const plainAccount = updatedAccount.toPlainObject();
    const accountRef = doc(db, `${userPath}/accounts/${accountId}`);
    await setDoc(accountRef, plainAccount, {merge: true});
  } catch (error) {
    console.error('Error updating account in Firebase:', error);
  }
};

/**
 * Adds a new transaction entry to Firebase and then to the Redux store.
 * @param {Entry} entry - The entry object to add.
 */
export const addNewEntry = async entry => {
  try {
    const userPath = getUserPath();
    const plainEntry = entry.toPlainObject();
    const entryRef = doc(db, `${userPath}/entries/${entry.id}`);
    await setDoc(entryRef, plainEntry);
  } catch (error) {
    console.error('Error adding entry to Firebase:', error);
  }
};

/**
 * Updates an existing transaction entry in Firebase and then in the Redux store.
 * @param {string} entryId - The ID of the entry to update.
 * @param {Object} updatedEntry - The updated entry details.
 */
export const updateExistingEntry = async (entryId, updatedEntry) => {
  try {
    const userPath = getUserPath();
    const plainEntry = updatedEntry.toPlainObject();
    const entryRef = doc(db, `${userPath}/entries/${entryId}`);
    await setDoc(entryRef, plainEntry, {merge: true});
  } catch (error) {
    console.error('Error updating entry in Firebase:', error);
  }
};

/**
 * Deletes a transaction entry from Firebase and then from the Redux store.
 * @param {string} entryId - The ID of the entry to delete.
 */
export const deleteExistingEntry = async entryId => {
  try {
    const userPath = getUserPath();
    const entryRef = doc(db, `${userPath}/entries/${entryId}`);
    await deleteDoc(entryRef);
  } catch (error) {
    console.error('Error deleting entry from Firebase:', error);
  }
};

/**
 * Deletes an account and all associated transaction entries from Firebase.
 * @param {string} accountId - The ID of the account to delete.
 */
export const deleteAccountAndEntries = async accountId => {
  try {
    const userId = auth.currentUser?.uid; // Ensure the user is authenticated
    if (!userId) throw new Error('User not authenticated.');

    const userPath = `users/${userId}`;
    const entriesRef = collection(db, `${userPath}/entries`);
    const accountRef = doc(db, `${userPath}/accounts/${accountId}`);

    // Fetch all related transactions for the account
    const entriesQuery = query(entriesRef, where('accountId', '==', accountId));
    const entriesSnapshot = await getDocs(entriesQuery);

    // Delete each related transaction
    for (const docSnap of entriesSnapshot.docs) {
      await deleteDoc(docSnap.ref);
    }

    // Delete the account itself
    await deleteDoc(accountRef);
    console.log('Account and related transactions deleted successfully.');
  } catch (error) {
    console.error('Error deleting account and entries:', error);
    throw error;
  }
};

/**
 * Fetch all transactions for a specific account from Firebase.
 * @param {string} accountId - The ID of the account to fetch transactions for.
 * @returns {Array} List of transactions.
 */
export const fetchEntriesByAccountId = async accountId => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated.');

  const entriesCollection = collection(db, `users/${userId}/entries`);
  const q = query(entriesCollection, where('accountId', '==', accountId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
};
