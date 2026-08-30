import { useState, useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const WARNING_THRESHOLD_MS = 9 * 60 * 1000;  // 9 minutes (triggers 60-second warning)

export function useIdleTimer({ onTimeout, enabled = true }) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef(null);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setRemainingSeconds(60);
  }, []);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) return;

    const handleUserActivity = () => {
      // Only reset if warning modal is not currently open, to allow conscious click to extend
      if (!showWarning) {
        lastActivityRef.current = Date.now();
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel', 'click'];
    events.forEach((evt) => window.addEventListener(evt, handleUserActivity, { passive: true }));

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        setShowWarning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (onTimeout) onTimeout();
      } else if (elapsed >= WARNING_THRESHOLD_MS) {
        setShowWarning(true);
        const timeLeftMs = INACTIVITY_TIMEOUT_MS - elapsed;
        setRemainingSeconds(Math.max(0, Math.ceil(timeLeftMs / 1000)));
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, onTimeout, showWarning]);

  return {
    showWarning,
    remainingSeconds,
    extendSession,
    resetTimer,
  };
}
