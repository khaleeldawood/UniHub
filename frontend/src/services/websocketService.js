import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = new Map();
  }

  /**
   * Connect to WebSocket
   */
  connect(onConnected) {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket Connected');
        this.connected = true;
        if (onConnected) onConnected();
      },
      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    this.client.activate();
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscribers.clear();
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Subscribe to badge promotions for specific user
   */
  subscribeToBadgePromotions(userId, callback) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(
      `/topic/badge-promotion/${userId}`,
      (message) => {
        const badgeData = JSON.parse(message.body);
        callback(badgeData);
      }
    );

    this.subscribers.set(`badge-${userId}`, subscription);
    return subscription;
  }

  /**
   * Subscribe to leaderboard updates
   */
  subscribeToLeaderboardUpdates(callback) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(
      '/topic/leaderboard-update',
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    this.subscribers.set('leaderboard', subscription);
    return subscription;
  }

  /**
   * Subscribe to dashboard updates for specific user
   */
  subscribeToDashboardUpdates(userId, callback) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(
      `/topic/dashboard-update/${userId}`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    this.subscribers.set(`dashboard-${userId}`, subscription);
    return subscription;
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(key) {
    const subscription = this.subscribers.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscribers.delete(key);
    }
  }

  /**
   * Unsubscribe from all topics
   */
  unsubscribeAll() {
    this.subscribers.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscribers.clear();
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
