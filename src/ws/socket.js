import { store } from '../app/store';
import { handleWSEvent, setConnected } from '../features/ws/wsSlice';
import { tokenService } from '../features/auth/token.service';

const BACKOFF_DELAYS = [1000, 2000, 4000, 8000, 30000];

class CinGenSocket {
  constructor() {
    this.ws = null;
    this.retryCount = 0;
    this.reconnectTimer = null;
    this.intentionalClose = false;
    this.lastToken = null;
  }

  connect(token) {
    const accessToken = token || tokenService.getAccessToken();
    if (!accessToken) {
      console.warn('[WS] No token available');
      return;
    }

    this.lastToken = accessToken;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    this.intentionalClose = false;

    const wsBase = import.meta.env.VITE_WS_BASE?.replace(/\/$/, '');
    const wsUrl = `${wsBase}/ws?token=${accessToken}`;
    

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WS] Connected');
        this.retryCount = 0;
        store.dispatch(setConnected(true));
      };

      this.ws.onmessage = (ev) => {
        try {
          const event = JSON.parse(ev.data);
          store.dispatch(handleWSEvent(event));
        } catch {
          console.warn('[WS] Failed to parse message', ev.data);
        }
      };

      this.ws.onclose = () => {
        store.dispatch(setConnected(false));
        if (!this.intentionalClose) {
          this._scheduleReconnect();
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[WS] Error', err);
      };
    } catch (err) {
      console.error('[WS] Connection failed', err);
      this._scheduleReconnect();
    }
  }

  disconnect() {
    this.intentionalClose = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    store.dispatch(setConnected(false));
  }

  _scheduleReconnect() {
    const delay = BACKOFF_DELAYS[Math.min(this.retryCount, BACKOFF_DELAYS.length - 1)];
    this.retryCount++;
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.retryCount})`);
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const socket = new CinGenSocket();