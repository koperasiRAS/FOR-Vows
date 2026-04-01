interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const attempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if an IP is allowed to attempt login.
 * Returns { allowed: true } if the IP is not locked out.
 * Returns { allowed: false, message: string } if the IP is locked.
 */
export function checkLoginAttempts(
  ip: string
): { allowed: true } | { allowed: false; message: string } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (record?.lockedUntil && now < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `Akun terkunci. Coba lagi dalam ${minutesLeft} menit.`,
    };
  }

  // Clean up expired lockout
  if (record?.lockedUntil && now >= record.lockedUntil) {
    attempts.delete(ip);
  }

  return { allowed: true };
}

/**
 * Record a failed login attempt for this IP.
 * After MAX_ATTEMPTS, the IP is locked for LOCKOUT_DURATION_MS.
 */
export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const existing = attempts.get(ip);
  const record: AttemptRecord = existing ?? { count: 0, firstAttempt: now };
  const newCount = record.count + 1;

  if (newCount >= MAX_ATTEMPTS) {
    attempts.set(ip, {
      count: newCount,
      firstAttempt: record.firstAttempt,
      lockedUntil: now + LOCKOUT_DURATION_MS,
    });
  } else {
    attempts.set(ip, { ...record, count: newCount });
  }
}

/**
 * Clear all attempt records for this IP (called on successful login).
 */
export function clearAttempts(ip: string): void {
  attempts.delete(ip);
}
