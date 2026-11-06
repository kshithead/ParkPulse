import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SLOTS,
  INITIAL_LOCATIONS,
  INITIAL_VIOLATIONS,
  INITIAL_ACTIVITY,
  INITIAL_SYSTEM_LOGS
} from '../data/mockData';
import { parkingApi } from '../services/api';

const ParkingContext = createContext(null);

export const ParkingProvider = ({ children }) => {
  // Slots state
  const [slots, setSlots] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_slots');
      return stored ? JSON.parse(stored) : INITIAL_SLOTS;
    } catch {
      return INITIAL_SLOTS;
    }
  });

  // Nearby Locations state
  const [locations, setLocations] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_locations');
      return stored ? JSON.parse(stored) : INITIAL_LOCATIONS;
    } catch {
      return INITIAL_LOCATIONS;
    }
  });

  // Violations state
  const [violations, setViolations] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_violations');
      return stored ? JSON.parse(stored) : INITIAL_VIOLATIONS;
    } catch {
      return INITIAL_VIOLATIONS;
    }
  });

  // Active Session for current user
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_active_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // All Sessions (active & history)
  const [allSessions, setAllSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_all_sessions');
      return stored
        ? JSON.parse(stored)
        : [
            {
              sessionId: 'sess_init_1',
              slotId: 's-004',
              slotCode: 'P004',
              vehicleNumber: 'KA-01-MJ-4521',
              driverName: 'Rohit Sharma',
              zone: 'Zone A',
              startTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
              status: 'active'
            },
            {
              sessionId: 'sess_init_2',
              slotId: 's-005',
              slotCode: 'P005',
              vehicleNumber: 'KA-03-EE-9012',
              driverName: 'Priya Nair',
              zone: 'Zone A',
              startTime: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
              status: 'active'
            },
            {
              sessionId: 'sess_init_3',
              slotId: 's-008',
              slotCode: 'P008',
              vehicleNumber: 'MH-02-BQ-8819',
              driverName: 'Arjun Das',
              zone: 'Zone B',
              startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
              status: 'active'
            }
          ];
    } catch {
      return [];
    }
  });

  // User Activity timeline
  const [activityHistory, setActivityHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_activity');
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  // System Audit & Transaction logs
  const [systemLogs, setSystemLogs] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_system_logs');
      return stored ? JSON.parse(stored) : INITIAL_SYSTEM_LOGS;
    } catch {
      return INITIAL_SYSTEM_LOGS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('parkpulse_slots', JSON.stringify(slots));
  }, [slots]);

  // Initial Cloud Sync: If VITE_API_BASE_URL is configured, hydrate initial slots from cloud
  useEffect(() => {
    if (import.meta.env.VITE_API_BASE_URL) {
      parkingApi.getSlots().then((cloudSlots) => {
        if (cloudSlots && Array.isArray(cloudSlots) && cloudSlots.length > 0) {
          setSlots(cloudSlots);
          addSystemLog('Connected to Cloud API. Synchronized real-time bay state.', 'info', 'Cloud-Sync');
        }
      }).catch((err) => {
        console.warn('Initial cloud sync notice:', err.message);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('parkpulse_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('parkpulse_violations', JSON.stringify(violations));
  }, [violations]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('parkpulse_active_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('parkpulse_active_session');
    }
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem('parkpulse_all_sessions', JSON.stringify(allSessions));
  }, [allSessions]);

  useEffect(() => {
    localStorage.setItem('parkpulse_activity', JSON.stringify(activityHistory));
  }, [activityHistory]);

  useEffect(() => {
    localStorage.setItem('parkpulse_system_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  // Recalculate location slot counts when slots state changes
  useEffect(() => {
    setLocations((prevLocations) =>
      prevLocations.map((loc) => {
        const matchingSlots = slots.filter((s) => s.zone === loc.zone);
        if (matchingSlots.length > 0) {
          const avail = matchingSlots.filter((s) => s.status === 'available').length;
          return {
            ...loc,
            totalSlots: matchingSlots.length,
            availableSlots: avail
          };
        }
        return loc;
      })
    );
  }, [slots]);

  // Log system transaction helper
  const addSystemLog = (message, level = 'info', source = 'System') => {
    const timeStr = new Date().toLocaleTimeString('en-GB');
    const newLog = {
      id: 'log-' + Date.now(),
      time: timeStr,
      level,
      message,
      source
    };
    setSystemLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  /**
   * Start parking session from QR Scanner or Slot detail
   */
  const startParking = async ({ slotCode, vehicleNumber, driverName }) => {
    const targetSlot = slots.find((s) => s.code.toUpperCase() === slotCode.toUpperCase());
    if (!targetSlot) {
      throw new Error(`Slot with QR code "${slotCode}" not found.`);
    }

    if (targetSlot.status !== 'available') {
      throw new Error(`Slot ${slotCode} is currently ${targetSlot.status}. Please pick an available slot.`);
    }

    const sessionPayload = {
      slotId: targetSlot.id,
      slotCode: targetSlot.code,
      vehicleNumber: vehicleNumber || 'KA-03-HA-8820',
      driverName: driverName || 'Alex Mercer',
      zone: targetSlot.zone
    };

    const newSession = await parkingApi.startParkingSession(sessionPayload);

    // 1. Update slot status to 'occupied'
    setSlots((prev) =>
      prev.map((s) =>
        s.id === targetSlot.id
          ? {
              ...s,
              status: 'occupied',
              occupiedBy: {
                vehicleNumber: newSession.vehicleNumber,
                driverName: newSession.driverName,
                startTime: newSession.startTime
              }
            }
          : s
      )
    );

    // 2. Set current active session
    setActiveSession(newSession);

    // 3. Append to allSessions
    setAllSessions((prev) => [newSession, ...prev]);

    // 4. Add to Activity
    const act = {
      id: 'act-' + Date.now(),
      type: 'session_started',
      slotCode: targetSlot.code,
      zone: targetSlot.zone,
      vehicleNumber: newSession.vehicleNumber,
      startTime: newSession.startTime,
      status: 'Active Session'
    };
    setActivityHistory((prev) => [act, ...prev]);

    // 5. System Transaction Log
    addSystemLog(
      `QR Check-In: Vehicle ${newSession.vehicleNumber} checked into slot ${targetSlot.code} (${targetSlot.zone}).`,
      'success',
      'QR-CheckIn'
    );

    return newSession;
  };

  /**
   * End the current parking session or admin ends a specific session
   */
  const endParking = async (sessionToEnd = activeSession) => {
    if (!sessionToEnd) {
      throw new Error('No active parking session found to terminate.');
    }

    const completedSession = await parkingApi.endParkingSession(sessionToEnd);

    // 1. Release slot back to available
    setSlots((prev) =>
      prev.map((s) =>
        s.code.toUpperCase() === sessionToEnd.slotCode.toUpperCase()
          ? { ...s, status: 'available', occupiedBy: null }
          : s
      )
    );

    // 2. Clear active session if it was the user's
    if (activeSession && activeSession.sessionId === sessionToEnd.sessionId) {
      setActiveSession(null);
    }

    // 3. Update allSessions
    setAllSessions((prev) =>
      prev.map((s) => (s.sessionId === sessionToEnd.sessionId ? completedSession : s))
    );

    // 4. Record completed activity
    const act = {
      id: 'act-' + Date.now(),
      type: 'session_completed',
      slotCode: sessionToEnd.slotCode,
      zone: sessionToEnd.zone,
      vehicleNumber: sessionToEnd.vehicleNumber,
      startTime: sessionToEnd.startTime,
      endTime: completedSession.endTime,
      durationMin: completedSession.durationMin,
      status: 'Checked Out & Vacated'
    };
    setActivityHistory((prev) => [act, ...prev]);

    // 5. System Transaction Log
    addSystemLog(
      `Bay Released: Slot ${sessionToEnd.slotCode} vacated by ${sessionToEnd.vehicleNumber} (Parked ${completedSession.durationMin} mins).`,
      'info',
      'Session-Manager'
    );

    return completedSession;
  };

  /**
   * Submit violation report
   */
  const reportViolation = async (violationData) => {
    const newViolation = await parkingApi.reportViolation(violationData);

    setViolations((prev) => [newViolation, ...prev]);

    const act = {
      id: 'act-' + Date.now(),
      type: 'violation_reported',
      violationId: newViolation.id,
      category: newViolation.category,
      slotCode: newViolation.slotId,
      time: newViolation.timestamp,
      status: 'Pending Verification'
    };
    setActivityHistory((prev) => [act, ...prev]);

    addSystemLog(
      `New violation report logged [${newViolation.id}] for vehicle ${newViolation.vehicleNumber} (${newViolation.category}).`,
      'warning',
      'Citizen-Reporting'
    );

    return newViolation;
  };

  /**
   * Admin: Update violation status (e.g. warning_issued, resolved, dismissed)
   */
  const updateViolationStatus = async (violationId, newStatus, adminNotes = '') => {
    const result = await parkingApi.updateViolationStatus(violationId, newStatus, adminNotes);

    setViolations((prev) =>
      prev.map((v) =>
        v.id === violationId
          ? {
              ...v,
              status: newStatus,
              adminNotes: adminNotes || v.adminNotes,
              updatedAt: result.updatedAt
            }
          : v
      )
    );

    addSystemLog(
      `Violation [${violationId}] status updated to "${newStatus.toUpperCase()}" by Admin.`,
      'info',
      'Admin-Console'
    );

    return result;
  };

  /**
   * Admin: Override slot status
   */
  const updateSlotStatus = (slotId, newStatus) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const isNowOccupied = newStatus === 'occupied';
          return {
            ...s,
            status: newStatus,
            occupiedBy: isNowOccupied
              ? s.occupiedBy || {
                  vehicleNumber: 'ADMIN-OVERRIDE',
                  driverName: 'Staff Vehicle',
                  startTime: new Date().toISOString()
                }
              : null
          };
        }
        return s;
      })
    );

    addSystemLog(
      `Slot ID ${slotId} manually overridden to "${newStatus.toUpperCase()}".`,
      'warning',
      'Slot-Manager'
    );
  };

  /**
   * Admin: Add new slot
   */
  const addSlot = (newSlotData) => {
    const newSlot = {
      id: 's-' + Date.now(),
      code: newSlotData.code.toUpperCase(),
      zone: newSlotData.zone,
      zoneName: newSlotData.zoneName || newSlotData.zone,
      level: newSlotData.level || 'Ground Floor',
      type: newSlotData.type || 'Standard',
      status: 'available',
      isEV: newSlotData.type === 'EV Charging',
      isAccessible: newSlotData.type === 'Accessible',
      qrPlacardId: `QR-${newSlotData.code.toUpperCase()}`,
      occupiedBy: null
    };

    setSlots((prev) => [...prev, newSlot]);
    addSystemLog(`New parking slot ${newSlot.code} commissioned in ${newSlot.zone}.`, 'success', 'Admin-Console');
    return newSlot;
  };

  /**
   * Reset data back to default mock state
   */
  const resetToDefaultData = () => {
    setSlots(INITIAL_SLOTS);
    setLocations(INITIAL_LOCATIONS);
    setViolations(INITIAL_VIOLATIONS);
    setActiveSession(null);
    setActivityHistory(INITIAL_ACTIVITY);
    setSystemLogs(INITIAL_SYSTEM_LOGS);
    localStorage.removeItem('parkpulse_slots');
    localStorage.removeItem('parkpulse_locations');
    localStorage.removeItem('parkpulse_violations');
    localStorage.removeItem('parkpulse_active_session');
    localStorage.removeItem('parkpulse_all_sessions');
    localStorage.removeItem('parkpulse_activity');
    localStorage.removeItem('parkpulse_system_logs');
  };

  // Aggregated Real-time Stats
  const totalSlots = slots.length;
  const availableSlots = slots.filter((s) => s.status === 'available').length;
  const occupiedSlots = slots.filter((s) => s.status === 'occupied').length;
  const reservedSlots = slots.filter((s) => s.status === 'reserved').length;
  const maintenanceSlots = slots.filter((s) => s.status === 'maintenance').length;
  const occupancyPercentage = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
  const activeViolationsCount = violations.filter(
    (v) => v.status === 'pending' || v.status === 'investigating'
  ).length;

  const value = {
    slots,
    locations,
    violations,
    activeSession,
    allSessions,
    activityHistory,
    systemLogs,
    stats: {
      totalSlots,
      availableSlots,
      occupiedSlots,
      reservedSlots,
      maintenanceSlots,
      occupancyPercentage,
      activeViolationsCount
    },
    startParking,
    endParking,
    reportViolation,
    updateViolationStatus,
    updateSlotStatus,
    addSlot,
    resetToDefaultData,
    addSystemLog
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
