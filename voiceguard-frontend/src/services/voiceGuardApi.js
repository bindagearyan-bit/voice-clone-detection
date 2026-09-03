/**
 * VoiceGuard Enterprise API Service Client
 * Ready for backend integration (FastAPI / Node.js)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const USE_REAL_BACKEND = false; // Set to true when real backend is connected

export const voiceGuardApi = {
    /**
   * Submit a 2-second audio chunk for VoiceGuard analysis
   * @param {Object} chunkPayload - { chunk_id, call_id, audio_data (base64/wav), timestamp, phone_number }
   * @returns {Promise<Object>} { chunk_id, risk_score, risk_level, is_fake, reason, confidence }
   */
  async analyzeAudioChunk(chunkPayload) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/audio/analyze-chunk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunkPayload),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    }

    // Mock fallback handled by scenario generator
    return null;
  },

  /**
   * Fetch call logs from backend database (e.g. Supabase / Postgres)
   */
  async getCallHistory() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/calls/history`);
      return await response.json();
    }
    return null;
  },

  /**
   * Save finalized call session summary
   */
  async saveCallSummary(summaryPayload) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/calls/save-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summaryPayload),
      });
      return await response.json();
    }
    return { success: true, id: summaryPayload.callId };
  },

  /**
   * Fetch real-time security notifications
   */
  async getNotifications() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      return await response.json();
    }
    return null;
  },

  /**
   * Check backend & model health
   */
  async getSystemStatus() {
    if (USE_REAL_BACKEND) {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return await response.json();
      } catch (err) {
        return { status: 'offline', model: 'VoiceGuard-v1.2 (Local Mock)' };
      }
    }
    return {
      status: 'active',
      model: 'VoiceGuard-v1.2 (Neural Core)',
      latencyMs: 780,
      mode: 'Demo Simulation Active'
    };
  }
};
