// src/utils/safeValue.js

export const safeValue = (value, defaultValue = 0) => {
  return value === undefined || value === null ? defaultValue : value;
};
