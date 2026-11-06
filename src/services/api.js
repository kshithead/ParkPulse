// ParkPulse API Service Layer
// Dual-Mode Architecture:
// 1. Cloud Mode: If VITE_API_BASE_URL is set or deployed to Cloud (Vercel Production), calls real REST endpoints.
// 2. Offline / Fallback Mode: Seamlessly falls back to LocalStorage if cloud URL is unset or offline.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// In production (Vercel) or when custom API URL is configured, cloud requests are enabled
const IS_API_ENABLED = Boolean(import.meta.env.VITE_API_BASE_URL) || import.meta.env.PROD;
const API_DELAY_MS = 150;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const parkingApi = {
  /**
   * Fetch all parking slots across all zones
   * Cloud: GET /api/v1/slots
   */
  async getSlots() {
    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/slots`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Failed to fetch slots from cloud, falling back to local state:', err.message);
      }
    }
    await sleep(API_DELAY_MS);
    const stored = localStorage.getItem('parkpulse_slots');
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Query slot information by QR identifier code (e.g., P001, P002)
   * Cloud: GET /api/v1/slots/qr/{code}
   */
  async getSlotByCode(code, slots) {
    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/slots/qr/${encodeURIComponent(code)}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Failed to query QR code from cloud, falling back to local search.');
      }
    }
    await sleep(API_DELAY_MS);
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return slots.find((s) => s.code.toUpperCase() === cleanCode) || null;
  },

  /**
   * Start a live parking session via QR check-in
   * Cloud: POST /api/v1/sessions/start
   */
  async startParkingSession({ slotId, slotCode, vehicleNumber, driverName, zone }) {
    const payload = {
      sessionId: 'sess_' + Date.now(),
      slotId,
      slotCode,
      vehicleNumber: vehicleNumber.toUpperCase(),
      driverName: driverName || 'Registered Driver',
      zone,
      startTime: new Date().toISOString(),
      status: 'active'
    };

    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/sessions/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Cloud session start unavailable, saving locally.');
      }
    }

    await sleep(API_DELAY_MS);
    return payload;
  },

  /**
   * End an active parking session and release slot
   * Cloud: POST /api/v1/sessions/end
   */
  async endParkingSession(session) {
    const endTime = new Date().toISOString();
    const durationMs = Math.max(0, new Date(endTime) - new Date(session.startTime));
    const durationMin = Math.max(1, Math.ceil(durationMs / (1000 * 60)));

    const payload = {
      ...session,
      endTime,
      durationMin,
      status: 'completed'
    };

    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/sessions/end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Cloud session checkout unavailable, updating locally.');
      }
    }

    await sleep(API_DELAY_MS);
    return payload;
  },

  /**
   * Submit a new violation report with photo evidence
   * Cloud: POST /api/v1/violations
   */
  async reportViolation(reportData) {
    const newViolation = {
      id: `VIO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: reportData.category,
      vehicleNumber: reportData.vehicleNumber.trim().toUpperCase(),
      zone: reportData.zone || 'Zone A',
      slotId: reportData.slotId || 'Unspecified',
      description: reportData.description,
      imageUrl: reportData.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      status: 'pending',
      urgency: reportData.urgency || 'medium',
      timestamp: new Date().toISOString(),
      reporterName: reportData.reporterName || 'Concerned Campus Citizen',
      reporterId: reportData.reporterId || 'usr-anonymous',
      adminNotes: 'Awaiting inspection by parking control officer.'
    };

    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/violations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newViolation)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Cloud violation submission unavailable, saving locally.');
      }
    }

    await sleep(API_DELAY_MS);
    return newViolation;
  },

  /**
   * Admin: Update violation status (e.g., warning_issued, resolved, dismissed)
   * Cloud: PATCH /api/v1/violations/{id}/status
   */
  async updateViolationStatus(violationId, newStatus, adminNotes) {
    const payload = {
      violationId,
      status: newStatus,
      adminNotes,
      updatedAt: new Date().toISOString()
    };

    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/violations/${violationId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Cloud violation status update failed, saving locally.');
      }
    }

    await sleep(API_DELAY_MS);
    return payload;
  },

  /**
   * Admin: Manual override for parking slot status
   * Cloud: PATCH /api/v1/slots/{slotId}
   */
  async updateSlotStatus(slotId, status, vehicleNumber = null) {
    const payload = { slotId, status, vehicleNumber, updatedAt: new Date().toISOString() };

    if (IS_API_ENABLED) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/slots/${slotId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('[Cloud API] Cloud slot override failed, updating locally.');
      }
    }

    await sleep(API_DELAY_MS);
    return payload;
  }
};
