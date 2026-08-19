/**
 * Parses a phone number into its country code and local number.
 * Defaults to country code '+91' if none is found or if length is exactly 10.
 * 
 * @param {string} fullPhone 
 * @returns {{ countryCode: string, localNumber: string }}
 */
export function parsePhoneNumber(fullPhone) {
  if (!fullPhone) {
    return { countryCode: '', localNumber: '' };
  }
  
  // Remove all non-digits
  const cleanPhone = fullPhone.trim().replace(/\D/g, '');
  
  // Get last 10 digits
  const localNumber = cleanPhone.length > 10 ? cleanPhone.slice(cleanPhone.length - 10) : cleanPhone;
  
  return { countryCode: '', localNumber };
}
