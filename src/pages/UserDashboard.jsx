import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Activity,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { StatCard } from '../components/common/StatCard';
import { ActiveSessionBanner } from '../components/parking/ActiveSessionBanner';
import { SlotGrid } from '../components/parking/SlotGrid';
import { PlateBadge } from '../components/violations/PlateBadge';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { slots, locations, stats, activeSession, activityHistory, startParking } = useParking();
  const navigate = useNavigate();

  const [selectedSlotForPark, setSelectedSlotForPark] = useState(null);
  const [vehicleInput, setVehicleInput] = useState(currentUser?.vehicleNumber || 'KA-03-HA-8820');
  const [isStarting, setIsStarting] = useState(false);

  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlotForPark(slot);
    } else if (slot.status === 'occupied') {
      navigate(`/qr-parking?code=${slot.code}`);
    }
  };

  const handleConfirmPark = async () => {
    if (!selectedSlotForPark) return;
    try {
      setIsStarting(true);
      await startParking({
        slotCode: selectedSlotForPark.code,
        vehicleNumber: vehicleInput,
        driverName: currentUser?.name || 'Alex Mercer'
      });
      setSelectedSlotForPark(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Persona Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
              Driver Portal
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Campus Smart Grid v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Driver'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time QR-based slot availability and digital check-in across all campus parking zones.
          </p>
        </div>

        {/* User Vehicle Badge */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Registered Plate:</span>
              <PlateBadge plateNumber={currentUser?.vehicleNumber || 'KA-03-HA-8820'} size="sm" />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
              {currentUser?.vehicleModel || 'Standard Sedan'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Session Card (if user has active parking) */}
      <ActiveSessionBanner />

      {/* KPI Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Parking Slots"
          value={stats.totalSlots}
          subtitle="4 monitored campus zones"
          icon={Car}
          variant="default"
        />

        <StatCard
          title="Available Slots"
          value={stats.availableSlots}
          subtitle="Real-time database sync"
          icon={CheckCircle2}
          variant="green"
          trend={`${Math.round((stats.availableSlots / stats.totalSlots) * 100)}% Free`}
        />

        <StatCard
          title="Occupied Slots"
          value={stats.occupiedSlots}
          subtitle={`${stats.occupancyPercentage}% Campus Occupancy`}
          icon={AlertCircle}
          variant="red"
          trend="Live Sessions"
        />

        <StatCard
          title="Active Sessions"
          value={activeSession ? '1 (You)' : '0 Active'}
          subtitle={activeSession ? `Parked at ${activeSession.slotCode}` : 'No active session'}
          icon={Clock}
          variant={activeSession ? 'green' : 'blue'}
        />
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/qr-parking"
          className="group bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 hover:to-teal-500/10 p-5 rounded-2xl border border-emerald-500/30 shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Scan QR to Park
              </h3>
              <p className="text-xs text-slate-500">Touchless spot check-in</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/nearby"
          className="group bg-gradient-to-br from-blue-500/10 to-indigo-500/5 hover:from-blue-500/20 hover:to-indigo-500/10 p-5 rounded-2xl border border-blue-500/30 shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Nearby Parking
              </h3>
              <p className="text-xs text-slate-500">Map view & distances</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/report-violation"
          className="group bg-gradient-to-br from-rose-500/10 to-amber-500/5 hover:from-rose-500/20 hover:to-amber-500/10 p-5 rounded-2xl border border-rose-500/30 shadow-sm transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                Report Violation
              </h3>
              <p className="text-xs text-slate-500">Wrong & blocked spots</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Live Campus Slots Grid Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Campus Parking Slots Visualizer
            </h2>
            <p className="text-xs text-slate-500">
              Click any available green slot to initiate instant QR parking check-in.
            </p>
          </div>
          <Link
            to="/qr-parking"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Launch QR Scanner <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <SlotGrid slots={slots} onSelectSlot={handleSlotClick} />
      </div>

      {/* Two Column Layout: Recent Parking Activity & Nearby Parking Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Recent Activity Timeline (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              Recent Parking Activity & History
            </h3>
            <span className="text-xs text-slate-400">Past 72 hours</span>
          </div>

          <div className="space-y-3">
            {activityHistory.slice(0, 5).map((act) => {
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        act.type === 'session_started'
                          ? 'bg-emerald-100 text-emerald-700'
                          : act.type === 'session_completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {act.type === 'violation_reported' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Car className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {act.type === 'session_started' && `Started Parking at ${act.slotCode}`}
                        {act.type === 'session_completed' && `Completed Parking at ${act.slotCode}`}
                        {act.type === 'violation_reported' && `Reported Violation (${act.category})`}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {act.zone && `${act.zone} • `}
                        {act.durationMin ? `${act.durationMin} mins • ` : ''}
                        {new Date(act.startTime || act.time).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
                      {act.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nearby Locations Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                Nearby Campus Zones
              </h3>
              <Link to="/nearby" className="text-xs text-emerald-600 font-semibold hover:underline">
                View Map
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              {locations.slice(0, 4).map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => navigate('/nearby')}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {loc.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {loc.distanceKm} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {loc.availableSlots} of {loc.totalSlots} Free
                    </span>
                    <span className="text-slate-500 font-medium">{loc.zone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/nearby"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-4"
          >
            <span>Open Campus Navigation Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Modal for Quick Parking from Slot Visualizer */}
      {selectedSlotForPark && (
        <Modal
          isOpen={!!selectedSlotForPark}
          onClose={() => setSelectedSlotForPark(null)}
          title={`Check-In to Slot ${selectedSlotForPark.code}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-extrabold">{selectedSlotForPark.code}</span>
                <Badge variant="available">AVAILABLE</Badge>
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                {selectedSlotForPark.zone} • {selectedSlotForPark.level}
              </p>
              <p className="text-xs text-emerald-800 font-medium pt-1">
                Bay Type: {selectedSlotForPark.type}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Confirm Vehicle Registration Number
              </label>
              <input
                type="text"
                value={vehicleInput}
                onChange={(e) => setVehicleInput(e.target.value.toUpperCase())}
                placeholder="e.g. KA-03-HA-8820"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm uppercase focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Starting this session will mark slot {selectedSlotForPark.code} as occupied in real time.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlotForPark(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isStarting}
                onClick={handleConfirmPark}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                {isStarting ? 'Initiating Session...' : 'Start Parking Now'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
