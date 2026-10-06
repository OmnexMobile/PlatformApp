import React, { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast, { BaseToast } from 'react-native-toast-message';

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

// Use a light endpoint of your own API if you can (e.g. a /health route)
const PING_URL = 'https://clients3.google.com/generate_204';
const SLOW_MS = 1500;      // slower than this = "slow"
const TIMEOUT_MS = 5000;   // no response by this = "slow"
const RECHECK_MS = 15000;  // re-measure while connected

// Change colors here
const COLORS = {
  offline: { bg: '#D32F2F', accent: '#B71C1C', title: '#FFFFFF', message: '#FFEBEE' },
  slow:    { bg: '#FFA000', accent: '#FF6F00', title: '#000000', message: '#333333' },
  online:  { bg: '#388E3C', accent: '#1B5E20', title: '#FFFFFF', message: '#E8F5E9' },
};

/* ------------------------------------------------------------------ */
/* Toast config (pass to <Toast config={toastConfig} />)               */
/* ------------------------------------------------------------------ */

const makeToast = ({ bg, accent, title, message }) => (props) => (
  <BaseToast
    {...props}
    style={{
      backgroundColor: bg,
      borderLeftColor: accent,
      height: undefined,   // grow with content
      minHeight: 60,
      paddingVertical: 8,
    }}
    contentContainerStyle={{ paddingHorizontal: 15 }}
    text1Style={{ color: title, fontSize: 15, fontWeight: '700' }}
    text2Style={{ color: message, fontSize: 13 }}
    text1NumberOfLines={2}
    text2NumberOfLines={3}
  />
);

export const toastConfig = {
  offline: makeToast(COLORS.offline),
  slow: makeToast(COLORS.slow),
  online: makeToast(COLORS.online),
};

/* ------------------------------------------------------------------ */
/* Network status                                                      */
/* ------------------------------------------------------------------ */

const measureLatency = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = Date.now();
  try {
    await fetch(PING_URL, { method: 'HEAD', cache: 'no-store', signal: controller.signal });
    return Date.now() - start;
  } catch {
    return null; // timeout or failure
  } finally {
    clearTimeout(timer);
  }
};

const getStatus = async (state) => {
  if (!state.isConnected || state.isInternetReachable === false) return 'offline';

  const gen = state.type === 'cellular' ? state.details?.cellularGeneration : null;
  if (gen === '2g' || gen === '3g') return 'slow';

  const latency = await measureLatency();
  if (latency === null) return 'slow';
  return latency > SLOW_MS ? 'slow' : 'online';
};

const showToast = (status) => {
  Toast.hide(); // dismiss the previous toast (e.g. the persistent offline one)

  if (status === 'offline') {
    Toast.show({
      type: 'offline',
      text1: 'No internet connection',
      text2: 'Please check your network.',
      autoHide: false, // stays until we're back online
    });
  } else if (status === 'slow') {
    Toast.show({
      type: 'slow',
      text1: 'Slow internet connection',
      text2: 'Some actions may take longer.',
      visibilityTime: 4000,
    });
  } else {
    Toast.show({
      type: 'online',
      text1: 'Back online',
      visibilityTime: 2000,
    });
  }
};

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export const useNetworkToast = () => {
  const lastStatus = useRef(null);

  useEffect(() => {
    const evaluate = async (state) => {
      const status = await getStatus(state);
      if (status === lastStatus.current) return;

      const previous = lastStatus.current;
      lastStatus.current = status;

      // Don't show "Back online" on first launch
      if (status === 'online' && previous === null) return;
      showToast(status);
    };

    const unsubscribe = NetInfo.addEventListener(evaluate);

    // NetInfo only fires on connection changes, so re-check speed periodically
    const timer = setInterval(async () => {
      const state = await NetInfo.fetch();
      evaluate(state);
    }, RECHECK_MS);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);
};

/* ------------------------------------------------------------------ */
/* Optional: one component that does both                              */
/* ------------------------------------------------------------------ */

export const NetworkToast = () => {
  useNetworkToast();
  return <Toast config={toastConfig} />;
};

export default NetworkToast;