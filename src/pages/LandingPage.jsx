import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  QrCode,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Zap,
  ArrowRight,
  Layers,
  Clock,
  Server,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const LandingPage = () => {
  const { stats, slots } = useParking();

  const previewSlots = slots.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Park<span className="text-emerald-400">Pulse</span>
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Campus Smart Parking
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login?portal=admin"
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Officer Login</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Driver Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Smart Campus Grid</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">Real-Time Availability</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Cloud-Based <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">QR Smart Parking</span> & Violation Reporting
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate parking hunting and enforce campus traffic order. ParkPulse pairs touchless QR check-in and dynamic cloud availability tracking with community violation reporting.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login?portal=user"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Driver Portal Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login?portal=admin"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Campus Security Login</span>
            </Link>
          </div>

          {/* Live System Stats Pill Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available Slots: <strong className="text-white">{stats.availableSlots}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Occupied Slots: <strong className="text-white">{stats.occupiedSlots}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Active Reports: <strong className="text-white">{stats.activeViolationsCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Database Sync: <strong className="text-emerald-400">Online</strong></span>
            </div>
          </div>
        </div>

        {/* Live Slot Interactive Showcase Card */}
        <div className="mt-16 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Live Smart Grid Snapshot
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Zone A - Central Entrance
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Real-Time QR Check-In & Availability
              </h3>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View Full 24-Bay Facility <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mini Slot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
            {previewSlots.map((slot) => {
              const isAvail = slot.status === 'available';
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAvail
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/20'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-base font-bold text-white">
                      {slot.code}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvail ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] font-semibold capitalize">
                    {slot.status}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    {slot.type}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Designed For Campuses & Modern Facilities
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              End-to-End Parking Operations Platform
            </h2>
            <p className="text-sm text-slate-400">
              A streamlined, software-driven system ensuring optimal space utilization and strict policy enforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">QR Code Bay Placards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each parking bay has a printed QR placard. Drivers scan with their smartphone camera on arrival to check in, automatically marking the slot as Occupied.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Digital Check-Out</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When leaving, drivers tap End Parking on their phone. The system records session duration and immediately releases the bay back to Available for other campus drivers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Community Violation Reporting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students, faculty, and guards report cars parked without scanning, blocking exits, or straddling bays using photo evidence and license plate tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Zone Interactive Map</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual campus map highlighting 5 strategic parking zones, live walking distance, driving minutes, and EV fast-charging stations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Admin Operations Console</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus security dashboard with real-time session monitoring, manual slot overrides, warning notice dispatch, and system transaction history.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cloud Database Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Architecture designed with an abstracted service layer (`src/services/api.js`) ready to connect to cloud REST APIs and relational or NoSQL databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">ParkPulse</span>
            <span>– Smart Campus Parking Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/login?portal=user" className="hover:text-white transition-colors">Driver Login</Link>
            <Link to="/login?portal=admin" className="hover:text-white transition-colors">Security Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Vehicle Registration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
