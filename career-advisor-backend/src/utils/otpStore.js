
const otpStore = new Map();

/**
 * Save an OTP (expires after 10 minutes)
 */
export function saveOTP(email, otp) {
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
}

/**
 * Verify OTP and remove it if valid
 */
export function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  const isValid = record.otp === otp && Date.now() < record.expiresAt;
  if (isValid) otpStore.delete(email);
  return isValid;
}

/**
 * Remove expired OTPs periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (record.expiresAt < now) otpStore.delete(email);
  }
}, 60 * 1000);

export default otpStore;
