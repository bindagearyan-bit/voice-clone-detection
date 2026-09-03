/**
 * VoiceGuard WebSocket Streaming Service
 * Manages real-time bi-directional connection between frontend audio slicer and VoiceGuard backend
 */

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/detect';

export class VoiceGuardWebSocket {
  constructor(options = {}) {
    this.url = options.url || WS_URL;
    this.onResult = options.onResult || (() => {});
    this.onError = options.onError || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.onStatusChange('connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onResult(data);
        } catch (err) {
          console.warn('Error parsing WebSocket message', err);
        }
      };

      this.socket.onerror = (error) => {
        this.isConnected = false;
        this.onError(error);
        this.onStatusChange('error');
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.onStatusChange('disconnected');
      };
    } catch (e) {
      this.isConnected = false;
      this.onStatusChange('simulated');
    }
  }

  sendAudioChunk(chunkData) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(chunkData));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.onStatusChange('disconnected');
    }
  }
}
