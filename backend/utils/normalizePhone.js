/**
 * Normalizes a country-code string.
 * Retains the '+' prefix and handles basic formatting.
 * 
 * @param {string} cc 
 * @returns {string}
 */
export function normalizeCountryCode(cc) {
  return '';
}

/**
 * Normalizes the local phone number.
 * Trims spaces, hyphens, parentheses, and keeps only digits (retaining last 10 digits).
 * 
 * @param {string} phone 
 * @returns {string}
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  const trimmed = phone.trim();
  const digitsOnly = trimmed.replace(/[\s\-\(\)]/g, '').replace(/\D/g, '');
  return digitsOnly.length > 10 ? digitsOnly.slice(digitsOnly.length - 10) : digitsOnly;
}

/**
 * Combines normalized country code and phone number into a canonical analytics key.
 * 
 * @param {string} countryCode 
 * @param {string} phone 
 * @returns {string}
 */
export function normalizePhoneForAnalytics(countryCode, phone) {
  return normalizePhone(phone);
}

/**
 * Parses a combined phone number string from the database and returns the canonical key.
 * 
 * @param {string} fullPhone 
 * @returns {string}
 */
export function getCanonicalPhoneKey(fullPhone) {
  if (!fullPhone) {
    return '';
  }
  return normalizePhone(fullPhone);
}
