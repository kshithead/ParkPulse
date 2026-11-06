import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  Server,
  LogOut,
  Car,
  Layers,
  Clock,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { stats, activeSession } = useParking();
  const navigate = useNavigate();

  // Navigation Items for Driver / Student
  const driverNavItems = [
    {
      to: '/dashboard',
      label: 'Driver Dashboard',
      icon: LayoutDashboard,
      badge: activeSession ? 'Active Session' : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      to: '/qr-parking',
      label: 'QR Check-In',
      icon: QrCode,
      badge: activeSession ? '1 Parked' : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-semibold'
    },
    {
      to: '/nearby',
      label: 'Nearby Parking',
      icon: MapPin,
      badge: '5 Zones',
      badgeColor: 'bg-slate-800 text-slate-400'
    },
    {
      to: '/report-violation',
      label: 'Report Violation',
      icon: AlertTriangle,
      badge: null
    }
  ];

  // Navigation Items for Security Officer / Campus Admin
  const adminNavItems = [
    {
      to: '/admin',
      label: 'Operations Center',
      icon: ShieldAlert,
      badge: stats.activeViolationsCount > 0 ? `${stats.activeViolationsCount} Alert` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      to: '/dashboard',
      label: 'Campus Bay Visualizer',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/nearby',
      label: 'Geospatial Radar',
      icon: MapPin,
      badge: null
    },
    {
      to: '/report-violation',
      label: 'Citizen Reports Intake',
      icon: AlertTriangle,
      badge: null
    }
  ];

  const currentNavItems = isAdmin ? adminNavItems : driverNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#0A0F1D] text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
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
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {isAdmin ? 'Security Console' : 'Smart Campus Parking'}
              </p>
            </div>
          </NavLink>
        </div>

        {/* Authenticated Account Card */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.name || 'Driver'}
              </p>
              <p className="text-[11px] text-slate-400 capitalize truncate">
                {isAdmin ? '🛡️ Security Officer' : `🚗 ${currentUser?.vehicleNumber || 'Student Vehicle'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isAdmin ? 'Security Management' : 'Driver Navigation'}
          </div>
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Public
          </div>
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Landing Page</span>
          </NavLink>
        </nav>

        {/* Cloud Status Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Database Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
              <span>Bays: 24 Synchronized</span>
              <span>Latency: 12ms</span>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
