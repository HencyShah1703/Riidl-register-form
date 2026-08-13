/**
 * Normalizes a country-code string.
 * Retains the '+' prefix and handles basic formatting.
 * 
 * @param {string} cc 
 * @returns {string}
 */
export function normalizeCountryCode(cc) {
  if (!cc) return '+91';
  const trimmed = cc.trim();
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  return '+' + trimmed;
}

/**
 * Normalizes the local phone number.
 * Trims spaces, hyphens, parentheses, and keeps only digits.
 * 
 * @param {string} phone 
 * @returns {string}
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  const trimmed = phone.trim();
  // Remove spaces, hyphens, and parentheses, then keep only digits
  return trimmed.replace(/[\s\-\(\)]/g, '').replace(/\D/g, '');
}

/**
 * Combines normalized country code and phone number into a canonical analytics key.
 * 
 * @param {string} countryCode 
 * @param {string} phone 
 * @returns {string}
 */
export function normalizePhoneForAnalytics(countryCode, phone) {
  const normCC = normalizeCountryCode(countryCode);
  const normPhone = normalizePhone(phone);
  return `${normCC}${normPhone}`;
}

/**
 * Parses a combined phone number string from the database and returns the canonical key.
 * 
 * @param {string} fullPhone 
 * @returns {string}
 */
export function getCanonicalPhoneKey(fullPhone) {
  if (!fullPhone) {
    return '+91';
  }

  // Remove all whitespace
  const cleanPhone = fullPhone.trim().replace(/\s+/g, '');

  let countryCode = '+91';
  let localNumber = '';

  if (cleanPhone.startsWith('+')) {
    if (cleanPhone.length > 10) {
      countryCode = cleanPhone.slice(0, cleanPhone.length - 10);
      localNumber = cleanPhone.slice(cleanPhone.length - 10);
    } else {
      countryCode = cleanPhone;
      localNumber = '';
    }
  } else if (cleanPhone.length === 10 && /^\d+$/.test(cleanPhone)) {
    countryCode = '+91';
    localNumber = cleanPhone;
  } else if (cleanPhone.length > 10) {
    countryCode = '+' + cleanPhone.slice(0, cleanPhone.length - 10);
    localNumber = cleanPhone.slice(cleanPhone.length - 10);
  } else {
    countryCode = '+91';
    localNumber = cleanPhone;
  }

  return normalizePhoneForAnalytics(countryCode, localNumber);
}
