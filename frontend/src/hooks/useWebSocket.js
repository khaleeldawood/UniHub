import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import websocketService from '../services/websocketService';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for WebSocket subscriptions
 */
export const useWebSocket = () => {
  const { user } = useAuth();
  const [badgeEarned, setBadgeEarned] = useState(null);
  const [leaderboardUpdated, setLeaderboardUpdated] = useState(false);
  const [dashboardUpdated, setDashboardUpdated] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if notifications are enabled
    const notificationsEnabled = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    const shouldShowPopups = notificationsEnabled !== 'false'; // Default true

    // Subscribe to badge promotions
    const badgeSub = websocketService.subscribeToBadgePromotions(
      user.userId,
      (badgeData) => {
        console.log('Badge earned:', badgeData);
        if (shouldShowPopups) {
          setBadgeEarned(badgeData);
        }
      }
    );

    // Subscribe to leaderboard updates
    const leaderboardSub = websocketService.subscribeToLeaderboardUpdates(() => {
      console.log('Leaderboard updated');
      setLeaderboardUpdated(true);
      setTimeout(() => setLeaderboardUpdated(false), 1000);
    });

    // Subscribe to dashboard updates
    const dashboardSub = websocketService.subscribeToDashboardUpdates(
      user.userId,
      () => {
        console.log('Dashboard updated');
        setDashboardUpdated(true);
        setTimeout(() => setDashboardUpdated(false), 1000);
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      if (badgeSub) websocketService.unsubscribe(`badge-${user.userId}`);
      if (leaderboardSub) websocketService.unsubscribe('leaderboard');
      if (dashboardSub) websocketService.unsubscribe(`dashboard-${user.userId}`);
    };
  }, [user]);

  const clearBadgeNotification = () => {
    setBadgeEarned(null);
  };

  return {
    badgeEarned,
    leaderboardUpdated,
    dashboardUpdated,
    clearBadgeNotification
  };
};

export default useWebSocket;
