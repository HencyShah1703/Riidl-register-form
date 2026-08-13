/**
 * Parses a phone number into its country code and local number.
 * Defaults to country code '+91' if none is found or if length is exactly 10.
 * 
 * @param {string} fullPhone 
 * @returns {{ countryCode: string, localNumber: string }}
 */
export function parsePhoneNumber(fullPhone) {
  if (!fullPhone) {
    return { countryCode: '+91', localNumber: '' };
  }
  
  // Remove all whitespace
  const cleanPhone = fullPhone.trim().replace(/\s+/g, '');
  
  // If it starts with '+'
  if (cleanPhone.startsWith('+')) {
    if (cleanPhone.length > 10) {
      return {
        countryCode: cleanPhone.slice(0, cleanPhone.length - 10),
        localNumber: cleanPhone.slice(cleanPhone.length - 10)
      };
    }
    return { countryCode: cleanPhone, localNumber: '' };
  }
  
  // If it's a 10 digit number
  if (cleanPhone.length === 10 && /^\d+$/.test(cleanPhone)) {
    return { countryCode: '+91', localNumber: cleanPhone };
  }
  
  // If it's greater than 10 digits but doesn't start with '+'
  if (cleanPhone.length > 10) {
    return {
      countryCode: '+' + cleanPhone.slice(0, cleanPhone.length - 10),
      localNumber: cleanPhone.slice(cleanPhone.length - 10)
    };
  }
  
  // Fallback
  return { countryCode: '+91', localNumber: cleanPhone };
}
