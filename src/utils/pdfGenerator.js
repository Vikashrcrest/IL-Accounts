import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Alert, Linking} from 'react-native';

const PDFGenerator = {
  /**
   * Generates a PDF report for a Khata account, displaying credit and debit entries.
   * @param {Array} accounts - List of accounts
   * @param {Array} entries - List of transaction entries
   * @returns {Promise<string>} - The file path of the generated PDF
   */
  async generateKhataPDF(accounts, entries) {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 20px; }
            h1 { color: #2C3E50; text-align: center; font-size: 24px; }
            h2 { color: #34495E; font-size: 18px; text-align: center; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #F4F6F7; color: #2C3E50; font-weight: bold; text-align: center; }
            td { text-align: center; }
            .amount { font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #7F8C8D; }
          </style>
        </head>
        <body>
          <h1>Khata Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()}</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${entries
                .map(
                  entry => `
                <tr>
                  <td>${
                    entry.type.charAt(0).toUpperCase() + entry.type.slice(1)
                  }</td>
                  <td class="amount">${entry.amount.toFixed(2)}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Khata Management System | Professional Accounting Reports</p>
          </div>
        </body>
      </html>
    `;
    return await this.generatePDF(htmlContent, 'Khata_Report');
  },

  /**
   * Generates a PDF report for Rojmel transactions.
   * @param {Array} entries - List of transaction entries
   * @returns {Promise<string>} - The file path of the generated PDF
   */
  async generateRojmelPDF(entries) {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 20px; }
            h1 { color: #2C3E50; text-align: center; font-size: 24px; }
            h2 { color: #34495E; font-size: 18px; text-align: center; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #F4F6F7; color: #2C3E50; font-weight: bold; text-align: center; }
            td { text-align: center; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #7F8C8D; }
          </style>
        </head>
        <body>
          <h1>Rojmel Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()}</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${entries
                .map(
                  entry => `
                <tr>
                  <td>${entry.transactionDate || 'N/A'}</td>
                  <td>${
                    entry.type.charAt(0).toUpperCase() + entry.type.slice(1)
                  }</td>
                  <td class="amount">${entry.amount.toFixed(2)}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Khata Management System | Professional Accounting Reports</p>
          </div>
        </body>
      </html>
    `;
    return await this.generatePDF(htmlContent, 'Rojmel_Report');
  },

  /**
   * Generates a PDF report for account totals.
   * @param {Object} totals - Object containing total balance, credit, and debit
   * @returns {Promise<string>} - The file path of the generated PDF
   */
  async generateTotalsPDF(totals) {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; margin: 20px; }
            h1 { color: #2C3E50; text-align: center; font-size: 24px; }
            h2 { color: #34495E; font-size: 18px; text-align: center; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: center; border: 1px solid #ddd; }
            th { background-color: #F4F6F7; color: #2C3E50; font-weight: bold; }
            .totals { font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #7F8C8D; }
          </style>
        </head>
        <body>
          <h1>Totals Report</h1>
          <h2>Generated on: ${new Date().toLocaleDateString()}</h2>
          <table>
            <thead>
              <tr>
                <th>Total Balance</th>
                <th>Total Debit</th>
                <th>Total Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="totals">₹${totals.balance.toFixed(2)}</td>
                <td class="totals">₹${totals.debit.toFixed(2)}</td>
                <td class="totals">₹${totals.credit.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>Khata Management System | Professional Accounting Reports</p>
          </div>
        </body>
      </html>
    `;
    return await this.generatePDF(htmlContent, 'Totals_Report');
  },

  /**
   * Helper function to generate a PDF file from HTML content.
   * @param {string} htmlContent - The HTML content to convert to PDF
   * @param {string} fileName - The name of the PDF file
   * @returns {Promise<string>} - The file path of the generated PDF
   */
  async generatePDF(htmlContent, fileName) {
    try {
      const options = {
        html: htmlContent,
        fileName: `${fileName}_${Date.now()}`,
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);

      // Alert.alert(
      //   'Report Generated',
      //   `The report has been saved to Documents: ${file.filePath}`,
      //   [
      //     {
      //       text: 'Open',
      //       onPress: () => Linking.openURL(`file://${file.filePath}`),
      //     },
      //     {text: 'OK'},
      //   ],
      // );

      return file.filePath;
    } catch (error) {
      Alert.alert('Error', 'Unable to generate the report.');
      throw error;
    }
  },
  async generateAccountReport(accountName, balance, transactions) {
    const credits = transactions.filter(entry => entry.type === 'credit');
    const debits = transactions.filter(entry => entry.type === 'debit');

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            h1 { text-align: left; font-size: 24px; margin-bottom: 5px; }
            h2 { text-align: right; font-size: 18px; margin-top: 0; margin-bottom: 10px; }
            p { font-size: 16px; font-weight: bold; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: center; border: 1px solid #ddd; }
            th { background-color: #f4f4f4; font-weight: bold; }
            .table-container { display: flex; width: 100%; }
            .table { width: 48%; margin-right: 4%; }
            .table:last-child { margin-right: 0; }
            .header { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .balance { text-align: left; font-size: 16px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${accountName}</h1>
            <h2>${new Date().toLocaleDateString()}</h2>
          </div>
          <p class="balance">Balance: ₹${balance.toFixed(2)}</p>
  
          <div class="table-container">
            <!-- Debit (DR) Table -->
            <div class="table">
              <h3>Debit (DR)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Ref</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    debits.length
                      ? debits
                          .map(
                            entry => `
                    <tr>
                      <td>${entry.transactionDate || 'N/A'}</td>
                      <td>${entry.comment || '-'}</td>
                      <td>${entry.ref || '-'}</td>
                      <td>${entry.amount.toFixed(2)}</td>
                    </tr>
                  `,
                          )
                          .join('')
                      : `<tr><td colspan="4">No Debit Transactions</td></tr>`
                  }
                </tbody>
              </table>
            </div>
  
            <!-- Credit (CR) Table -->
            <div class="table">
              <h3>Credit (CR)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Ref</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    credits.length
                      ? credits
                          .map(
                            entry => `
                    <tr>
                      <td>${entry.transactionDate || 'N/A'}</td>
                      <td>${entry.comment || '-'}</td>
                      <td>${entry.ref || '-'}</td>
                      <td>${entry.amount.toFixed(2)}</td>
                    </tr>
                  `,
                          )
                          .join('')
                      : `<tr><td colspan="4">No Credit Transactions</td></tr>`
                  }
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.generatePDF(htmlContent, `${accountName}_Report`);
  },
};

export default PDFGenerator;
