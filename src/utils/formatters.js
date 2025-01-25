// src/utils/formatters.js

/**
 * Formats a date to a readable string.
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string (e.g., 'Jan 01, 2023').
 */
export const formatDate = date => {
  if (!(date instanceof Date)) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a number to a currency format.
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string (e.g., '₹1,000.00').
 */
export const formatCurrency = amount => {
  if (typeof amount !== 'number') return '';
  return `₹${amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};
