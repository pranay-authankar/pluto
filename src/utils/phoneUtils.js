/**
 * Masks the last 5 digits of a phone number string with asterisks for privacy.
 * Example: "+91 98201 44520" -> "+91 98201 *****"
 * Example: "+91 9820144520"  -> "+91 98201*****"
 * Example: "9820144520"      -> "98201*****"
 *
 * If the string is already masked with asterisks or 'X', it is returned as is.
 *
 * @param {string} phone - Phone number to mask
 * @returns {string} Phone number with last 5 digits replaced by '*'
 */
export function maskPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return phone || '';

  // Prevent double-masking if already masked
  if (phone.includes('*') || phone.includes('XXXXX')) {
    return phone;
  }

  let digitsCount = 0;
  const chars = phone.split('');

  for (let i = chars.length - 1; i >= 0; i--) {
    if (/\d/.test(chars[i])) {
      chars[i] = '*';
      digitsCount++;
      if (digitsCount === 5) {
        break;
      }
    }
  }

  return chars.join('');
}
