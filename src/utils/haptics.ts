/**
 * Utility for triggering Web Vibration API (Haptic Feedback) on mobile devices
 */

export const hapticPatterns = {
  lightTap: 15,
  mediumTap: 25,
  heavyTap: 40,
  successPulse: [20, 50, 30],
  levelUpBurst: [30, 40, 50, 60, 100],
  errorShake: [50, 30, 50]
};

export const triggerHaptic = (pattern: number | number[] = 15) => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore security policy error if non-user gesture
    }
  }
};
