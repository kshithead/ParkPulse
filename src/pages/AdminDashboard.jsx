import React, { useState } from 'react';
import {
  ShieldAlert,
  Car,
  Clock,
  AlertTriangle,
  Server,
  Plus,
  RefreshCw,
  Layers,
  TrendingUp,
  FileText,
  MapPin,
  LocateFixed,
  ExternalLink,
  Zap,
  Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { StatCard } from '../components/common/StatCard';
import { SlotCard } from '../components/parking/SlotCard';
import { ViolationCard } from '../components/violations/ViolationCard';
import { PlateBadge } from '../components/violations/PlateBadge';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const {
    slots,
    locations,
    violations,
    allSessions,
    systemLogs,
    stats,
    userLocation,
    isDetectingLocation,
    detectUserLocation,
    addParkingLocation,
    updateSlotStatus,
    updateViolationStatus,
    endParking,
    addSlot,
    resetToDefaultData
  } = useParking();

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | SLOTS | LOCATIONS | SESSIONS | VIOLATIONS | LOGS

  // Slot Management Filters
  const [slotZoneFilter, setSlotZoneFilter] = useState('ALL');
  const [slotStatusFilter, setSlotStatusFilter] = useState('ALL');

  // Violation Management Filter
  const [violationStatusFilter, setViolationStatusFilter] = useState('ALL');

  // Add Slot Modal State
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    code: '',
    zone: 'Zone A',
    level: 'Ground Floor',
    type: 'Standard'
  });

  // Add Location Allotment Modal State (Admin Controlled)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    zone: 'Zone F',
    address: 'Vishwakarma University (VU Pune), Kondhwa',
    lat: '18.4603133',
    lng: '73.8835838',
    totalSlots: 6,
    hasEV: false,
    isCovered: false,
    securityLevel: 'Campus Guarded Gate'
  });

  const handleCaptureLocationPin = async () => {
    try {
      const loc = await detectUserLocation();
      setNewLocationData((prev) => ({
        ...prev,
        lat: loc.lat.toFixed(7),
        lng: loc.lng.toFixed(7)
      }));
    } catch (err) {
      alert(err.message || 'Could not acquire GPS pin.');
    }
  };

  const handleAddLocationSubmit = (e) => {
    e.preventDefault();
    if (!newLocationData.name) return;
    addParkingLocation(newLocationData);
    setIsAddLocationOpen(false);
    setNewLocationData({
      name: '',
      zone: `Zone ${String.fromCharCode(65 + locations.length)}`,
      address: 'Vishwakarma University (VU Pune), Kondhwa',
      lat: '18.4603133',
      lng: '73.8835838',
      totalSlots: 6,
      hasEV: false,
      isCovered: false,
      securityLevel: 'Campus Guarded Gate'
    });
  };

  // Calculate Active Sessions
  const activeSessionsList = allSessions.filter((s) => s.status === 'active');

  // Filtered Slots
  const filteredSlots = slots.filter((slot) => {
    const matchesZone = slotZoneFilter === 'ALL' || slot.zone === slotZoneFilter;
    const matchesStatus = slotStatusFilter === 'ALL' || slot.status === slotStatusFilter;
    return matchesZone && matchesStatus;
  });

  // Filtered Violations
  const filteredViolations = violations.filter((v) => {
    if (violationStatusFilter === 'ALL') return true;
    return v.status === violationStatusFilter;
  });

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    if (!newSlotData.code) return;
    addSlot(newSlotData);
    setIsAddSlotOpen(false);
    setNewSlotData({
      code: '',
      zone: 'Zone A',
      level: 'Ground Floor',
      type: 'Standard'
    });
  };

  const handleForceEndSession = async (session) => {
    if (window.confirm(`Force end active session for vehicle ${session.vehicleNumber} at slot ${session.slotCode}?`)) {
      await endParking(session);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              OPERATIONS CONSOLE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Campus Traffic & Security Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Parking Facility Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Authenticated Officer: <strong className="text-slate-200">{currentUser?.name || 'Officer Dave'}</strong> (Badge: PP-704)
          </p>
        </div>

        {/* Quick Actions in Header */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsAddLocationOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            title="Allot a new campus parking sector"
          >
            <MapPin className="w-4 h-4" />
            <span>Allot Parking Hub</span>
          </button>

          <button
            onClick={() => setIsAddSlotOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all slots, sessions, and violations to initial demo defaults?')) {
                resetToDefaultData();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Reset dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Campus Capacity"
          value={`${stats.totalSlots} Bays`}
          subtitle="Monitored across 4 zones"
          icon={Car}
          variant="default"
        />

        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyPercentage}%`}
          subtitle={`${stats.occupiedSlots} Occupied / ${stats.availableSlots} Free`}
          icon={TrendingUp}
          variant={stats.occupancyPercentage > 75 ? 'red' : 'green'}
          trend={stats.occupancyPercentage > 75 ? 'High Demand' : 'Optimal'}
        />

        <StatCard
          title="Active Sessions"
          value={activeSessionsList.length}
          subtitle="Currently checked-in vehicles"
          icon={Clock}
          variant="blue"
        />

        <StatCard
          title="Violation Reports"
          value={stats.activeViolationsCount}
          subtitle="Require officer investigation"
          icon={AlertTriangle}
          variant={stats.activeViolationsCount > 0 ? 'amber' : 'green'}
          trend={stats.activeViolationsCount > 0 ? 'Pending Review' : 'All Clear'}
        />
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'OVERVIEW', label: 'Operations Overview', icon: Layers },
          { id: 'SLOTS', label: `Slot Management (${slots.length})`, icon: Car },
          { id: 'LOCATIONS', label: `Campus Hubs (${locations.length})`, icon: MapPin },
          { id: 'SESSIONS', label: `Active Sessions (${activeSessionsList.length})`, icon: Clock },
          { id: 'VIOLATIONS', label: `Violations Registry (${violations.length})`, icon: ShieldAlert, alert: stats.activeViolationsCount > 0 },
          { id: 'LOGS', label: 'System Audit Logs', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OPERATIONS OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Real-time Zone Breakdown Progress Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Real-Time Facility Occupancy Distribution
                </h3>
                <p className="text-xs text-slate-500">Live breakdown by status</p>
              </div>
              <span className="font-mono text-sm font-bold text-slate-800">
                {stats.occupancyPercentage}% Occupied
              </span>
            </div>

            {/* Multi-segment progress bar */}
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${(stats.availableSlots / stats.totalSlots) * 100}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Available: ${stats.availableSlots}`}
              />
              <div
                style={{ width: `${(stats.occupiedSlots / stats.totalSlots) * 100}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Occupied: ${stats.occupiedSlots}`}
              />
              <div
                style={{ width: `${(stats.reservedSlots / stats.totalSlots) * 100}%` }}
                className="bg-purple-500 transition-all duration-500"
                title={`Reserved: ${stats.reservedSlots}`}
              />
              <div
                style={{ width: `${(stats.maintenanceSlots / stats.totalSlots) * 100}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Maintenance: ${stats.maintenanceSlots}`}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Available ({stats.availableSlots})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Occupied ({stats.occupiedSlots})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Reserved ({stats.reservedSlots})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Maintenance ({stats.maintenanceSlots})</span>
              </div>
            </div>
          </div>

          {/* Two-Column split: Active Sessions Snapshot & Pending Violations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Sessions Mini-View */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Live Active Parking Sessions ({activeSessionsList.length})
                </h3>
                <button
                  onClick={() => setActiveTab('SESSIONS')}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  Manage All
                </button>
              </div>

              <div className="space-y-3">
                {activeSessionsList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active vehicles parked.</p>
                ) : (
                  activeSessionsList.map((sess) => (
                    <div
                      key={sess.sessionId}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {sess.slotCode}
                        </span>
                        <div>
                          <PlateBadge plateNumber={sess.vehicleNumber} size="sm" />
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {sess.driverName} • {sess.zone}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleForceEndSession(sess)}
                        className="py-1 px-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                      >
                        Force Release
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Violations Action Hub */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Violations Awaiting Action ({stats.activeViolationsCount})
                </h3>
                <button
                  onClick={() => setActiveTab('VIOLATIONS')}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  View Registry
                </button>
              </div>

              <div className="space-y-3">
                {violations.filter((v) => v.status === 'pending' || v.status === 'investigating').length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    All violations investigated and resolved!
                  </p>
                ) : (
                  violations
                    .filter((v) => v.status === 'pending' || v.status === 'investigating')
                    .map((v) => (
                      <div
                        key={v.id}
                        className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800">{v.id}</span>
                            <span className="font-semibold text-rose-700">{v.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {v.zone} • Plate: {v.vehicleNumber}
                          </p>
                        </div>

                        <Badge variant={v.status} size="xs">
                          {v.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARKING SLOT MANAGEMENT */}
      {activeTab === 'SLOTS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Zone Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Zone:</span>
              {['ALL', 'Zone A', 'Zone B', 'Zone C', 'Zone D'].map((z) => (
                <button
                  key={z}
                  onClick={() => setSlotZoneFilter(z)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    slotZoneFilter === z
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {z === 'ALL' ? 'All Zones' : z}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
              <select
                value={slotStatusFilter}
                onChange={(e) => setSlotStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="available">Available Only</option>
                <option value="occupied">Occupied Only</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                showAdminControls={true}
                onAdminToggle={updateSlotStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB: PARKING HUBS & LOCATION ALLOTMENT (Admin Controlled) */}
      {activeTab === 'LOCATIONS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                  Allotment Authority
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Campus Infrastructure</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Vishwakarma University Parking Locations & Sectors
              </h3>
              <p className="text-xs text-slate-500">
                Admin control to allot new campus parking facilities, set real GPS coordinates, and provision bays.
              </p>
            </div>
            <button
              onClick={() => setIsAddLocationOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Allot New Campus Hub</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      {loc.zone}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                      {loc.totalSlots} Allotted Bays
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{loc.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{loc.address}</p>
                  </div>

                  {loc.lat && loc.lng && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        GPS Pin:
                      </span>
                      <span className="font-bold text-slate-800">
                        {loc.lat.toFixed(5)}°N, {loc.lng.toFixed(5)}°E
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    {loc.hasEV && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        ⚡ EV Charging
                      </span>
                    )}
                    {loc.isCovered && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                        ☂️ Covered Roof
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                      {loc.securityLevel || 'Patrolled'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    <strong className="text-emerald-600 font-mono font-bold text-sm">
                      {loc.availableSlots}
                    </strong>{' '}
                    bays currently open
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                  >
                    <span>Test Route</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE PARKING SESSIONS */}
      {activeTab === 'SESSIONS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  All Current & Historical Parking Sessions
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time database session tracking and manual force-checkout overrides.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                {activeSessionsList.length} Active Parked
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Slot</th>
                    <th className="py-3 px-4">Vehicle Plate</th>
                    <th className="py-3 px-4">Driver Name</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Check-In Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allSessions.map((sess) => {
                    const isActive = sess.status === 'active';
                    return (
                      <tr key={sess.sessionId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {sess.slotCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <PlateBadge plateNumber={sess.vehicleNumber} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {sess.driverName}
                        </td>
                        <td className="py-3.5 px-4">{sess.zone}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {new Date(sess.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isActive ? 'ACTIVE' : 'COMPLETED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isActive && (
                            <button
                              onClick={() => handleForceEndSession(sess)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                            >
                              Release Bay
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VIOLATION REPORTS MANAGEMENT */}
      {activeTab === 'VIOLATIONS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Violation Adjudication & Enforcement
              </h3>
              <p className="text-xs text-slate-500">
                Review citizen reports, issue warnings, or dispatch towing.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'pending', 'investigating', 'warning_issued', 'resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setViolationStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    violationStatusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredViolations.map((v) => (
              <ViolationCard
                key={v.id}
                violation={v}
                isAdmin={true}
                onStatusUpdate={updateViolationStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM TRANSACTION & AUDIT LOGS */}
      {activeTab === 'LOGS' && (
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-mono">
                System Transaction & Event Audit Logs
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Database Sync: ONLINE
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto">
            {systemLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
              >
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                    log.level === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : log.level === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-slate-400 shrink-0 font-bold">[{log.source}]</span>
                <span className="text-slate-200 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddSlotOpen}
        onClose={() => setIsAddSlotOpen(false)}
        title="Commission New Parking Slot"
      >
        <form onSubmit={handleAddSlotSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Slot Code (e.g. P025)
            </label>
            <input
              type="text"
              value={newSlotData.code}
              onChange={(e) =>
                setNewSlotData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              placeholder="P025"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm uppercase focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Zone</label>
              <select
                value={newSlotData.zone}
                onChange={(e) => setNewSlotData((prev) => ({ ...prev, zone: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="Zone A">Zone A - Central Gate</option>
                <option value="Zone B">Zone B - Library</option>
                <option value="Zone C">Zone C - Tech Hub</option>
                <option value="Zone D">Zone D - Sports Arena</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Bay Type</label>
              <select
                value={newSlotData.type}
                onChange={(e) => setNewSlotData((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="Standard">Standard</option>
                <option value="EV Charging">EV Charging</option>
                <option value="Accessible">Accessible / Handicap</option>
                <option value="Reserved">Reserved Official</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Floor / Level</label>
            <input
              type="text"
              value={newSlotData.level}
              onChange={(e) => setNewSlotData((prev) => ({ ...prev, level: e.target.value }))}
              placeholder="Ground Level"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddSlotOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
            >
              Commission Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Allot New Location Hub (Admin Controlled) */}
      <Modal
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        title="Allot New Campus Parking Facility"
      >
        <form onSubmit={handleAddLocationSubmit} className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            Commission a new parking sector for Vishwakarma University campus. Initial bays will be automatically generated with QR identifiers.
          </p>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Facility / Hub Name</label>
            <input
              type="text"
              required
              placeholder="e.g. VU Architecture & Design Workshop Bay"
              value={newLocationData.name}
              onChange={(e) => setNewLocationData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Campus Zone</label>
              <input
                type="text"
                required
                placeholder="Zone F"
                value={newLocationData.zone}
                onChange={(e) => setNewLocationData((prev) => ({ ...prev, zone: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Initial Bays to Allot</label>
              <input
                type="number"
                min="1"
                max="24"
                value={newLocationData.totalSlots}
                onChange={(e) => setNewLocationData((prev) => ({ ...prev, totalSlots: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Campus Address / Pillar Landmark</label>
            <input
              type="text"
              value={newLocationData.address}
              onChange={(e) => setNewLocationData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="VU Kondhwa Campus, West Block"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          {/* GPS Coordinates with Quick Pin Capture */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Real GPS Coordinates
              </span>
              <button
                type="button"
                onClick={handleCaptureLocationPin}
                disabled={isDetectingLocation}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center gap-1"
              >
                <LocateFixed className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span>{isDetectingLocation ? 'Pinning...' : 'Capture Current Pin'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block">Latitude</label>
                <input
                  type="text"
                  required
                  value={newLocationData.lat}
                  onChange={(e) => setNewLocationData((prev) => ({ ...prev, lat: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 block">Longitude</label>
                <input
                  type="text"
                  required
                  value={newLocationData.lng}
                  onChange={(e) => setNewLocationData((prev) => ({ ...prev, lng: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newLocationData.hasEV}
                onChange={(e) => setNewLocationData((prev) => ({ ...prev, hasEV: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">EV Station</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newLocationData.isCovered}
                onChange={(e) => setNewLocationData((prev) => ({ ...prev, isCovered: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700">Covered Structure</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddLocationOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20"
            >
              Allot Facility & Provision Bays
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
