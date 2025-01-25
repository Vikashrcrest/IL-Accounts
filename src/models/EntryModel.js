class Entry {
  /**
   * Represents a transaction entry.
   * @param {string} id - Unique identifier for the entry.
   * @param {string} accountId - Identifier for the associated account.
   * @param {Date} transactionDate - Date of the transaction.
   * @param {string} type - Type of transaction, either 'credit' or 'debit'.
   * @param {number} amount - Transaction amount.
   * @param {string} description - Description or notes about the transaction.
   * @param {Date} createdAt - Date when the entry was created.
   * @param {Date} updatedAt - Date when the entry was last updated.
   */
  constructor(id, accountId, transactionDate, type, amount, description) {
    this.id = id;
    this.accountId = accountId;
    this.transactionDate = transactionDate;
    this.type = type;
    this.amount = amount;
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Updates the transaction amount.
   * @param {number} newAmount - New amount for the transaction.
   */
  updateAmount(newAmount) {
    this.amount = newAmount;
    this.updatedAt = new Date();
  }

  /**
   * Updates the transaction description.
   * @param {string} newDescription - New description for the transaction.
   */
  updateDescription(newDescription) {
    this.description = newDescription;
    this.updatedAt = new Date();
  }

  /**
   * Converts the instance to a plain JavaScript object for Firebase Firestore.
   * @returns {Object} - A plain object representation of the entry.
   */
  toPlainObject() {
    return {
      id: this.id,
      accountId: this.accountId,
      transactionDate: this.transactionDate,
      type: this.type,
      amount: this.amount,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export default Entry;
