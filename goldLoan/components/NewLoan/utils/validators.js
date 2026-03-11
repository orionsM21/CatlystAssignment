export const validators = {
  pan: (v = '') => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v),
  aadhaar: (v = '') => /^\d{12}$/.test(v),
  mobile: (v = '') => /^\d{10}$/.test(v),
  email: (v = '') => /\S+@\S+\.\S+/.test(v),
};
