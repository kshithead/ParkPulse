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

  // GPS User Live Location State
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const stored = localStorage.getItem('parkpulse_user_location');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

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
   * User: Detect live GPS location
   */
  const detectUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by your browser';
        setLocationError(msg);
        reject(new Error(msg));
        return;
      }
      setIsDetectingLocation(true);
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setUserLocation(loc);
          localStorage.setItem('parkpulse_user_location', JSON.stringify(loc));
          setIsDetectingLocation(false);
          addSystemLog(`GPS location acquired (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}).`, 'info', 'Geospatial');
          resolve(loc);
        },
        (error) => {
          setIsDetectingLocation(false);
          let msg = 'Could not retrieve your GPS location.';
          if (error.code === 1) msg = 'Location permission was denied. Please allow location in your browser.';
          if (error.code === 2) msg = 'Position unavailable. Make sure your device GPS is turned on.';
          if (error.code === 3) msg = 'Location request timed out.';
          setLocationError(msg);
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  /**
   * Admin: Allot new parking location and automatically provision bays
   */
  const addParkingLocation = (locationData) => {
    const newLoc = {
      id: 'loc-' + Date.now(),
      zone: locationData.zone || `Zone ${String.fromCharCode(65 + locations.length)}`,
      name: locationData.name,
      address: locationData.address || 'Vishwakarma University Campus, Kondhwa, Pune',
      lat: parseFloat(locationData.lat) || 18.4603133,
      lng: parseFloat(locationData.lng) || 73.8835838,
      distanceKm: 0.2,
      walkingTimeMin: 2,
      driveTimeMin: 1,
      totalSlots: parseInt(locationData.totalSlots, 10) || 6,
      availableSlots: parseInt(locationData.totalSlots, 10) || 6,
      tags: locationData.tags || ['VU Campus', 'QR Enabled'],
      hasEV: Boolean(locationData.hasEV),
      isCovered: Boolean(locationData.isCovered),
      securityLevel: locationData.securityLevel || 'Patrolled Area',
      coordinates: { x: Math.floor(Math.random() * 50) + 25, y: Math.floor(Math.random() * 50) + 25 },
      rating: 5.0
    };

    setLocations((prev) => [...prev, newLoc]);

    // Provision initial bays for this new lot
    const slotsCount = newLoc.totalSlots;
    const zoneLetter = newLoc.zone.replace('Zone ', '').trim() || 'X';
    const newSlots = [];
    for (let i = 1; i <= slotsCount; i++) {
      const codeNumber = (slots.length + i).toString().padStart(3, '0');
      newSlots.push({
        id: `s-${Date.now()}-${i}`,
        code: `P${codeNumber}`,
        zone: newLoc.zone,
        zoneName: newLoc.name,
        level: locationData.level || 'Ground Floor',
        type: i === 1 && newLoc.hasEV ? 'EV Charging' : 'Standard',
        status: 'available',
        isEV: i === 1 && newLoc.hasEV,
        isAccessible: i === 2,
        qrPlacardId: `QR-${zoneLetter}-${codeNumber}`,
        occupiedBy: null
      });
    }

    setSlots((prev) => [...prev, ...newSlots]);
    addSystemLog(`Admin alloted new parking hub: "${newLoc.name}" (${newLoc.zone}) with ${slotsCount} slots.`, 'success', 'Admin-Allotment');
    return newLoc;
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
    userLocation,
    isDetectingLocation,
    locationError,
    detectUserLocation,
    addParkingLocation,
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
