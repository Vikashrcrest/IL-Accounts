// src/models/AccountModel.js

class Account {
  /**
   * Represents an account.
   * @param {string} id - Unique identifier for the account.
   * @param {string} name - Name of the client/vendor.
   * @param {string} address - Physical address of the account.
   * @param {string} gstNumber - GST number associated with the account.
   * @param {object} contactInfo - Contact information, e.g., phone and email.
   * @param {number} balance - Current balance for the account, defaults to 0.
   * @param {Date} createdAt - Date when the account was created.
   * @param {Date} updatedAt - Date when the account was last updated.
   * @param {Date} lastTransactionDate - Date of the last transaction.
   */
  constructor(id, name, address, gstNumber, contactInfo, balance = 0) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.gstNumber = gstNumber;
    this.contactInfo = contactInfo;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Updates the account balance and last transaction date.
   * @param {number} newBalance - New balance to set.
   * @param {Date} transactionDate - Date of the transaction.
   */
  updateBalance(newBalance, transactionDate = new Date()) {
    this.balance = newBalance;
    this.updatedAt = new Date();
    this.lastTransactionDate = transactionDate; // Set last transaction date
  }

  /**
   * Updates the account's contact information.
   * @param {object} newContactInfo - New contact details.
   */
  updateContactInfo(newContactInfo) {
    this.contactInfo = newContactInfo;
    this.updatedAt = new Date();
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      gstNumber: this.gstNumber,
      contactInfo: this.contactInfo,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export default Account;
