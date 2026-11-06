import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Clock,
  Car,
  ShieldCheck,
  User,
  ArrowRight,
  LogOut,
  Settings,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';
import { PlateBadge } from '../violations/PlateBadge';
import { Modal } from './Modal';

export const Navbar = ({ onOpenSidebar }) => {
  const { currentUser, isAdmin, logout, updateProfile } = useAuth();
  const { activeSession, stats } = useParking();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    vehicleNumber: currentUser?.vehicleNumber || '',
    vehicleModel: currentUser?.vehicleModel || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Left: Mobile trigger & campus grid status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-800 font-semibold">Campus Parking Network</span>
            <span>/</span>
            <span className="text-slate-600 font-mono">
              {stats.availableSlots} of {stats.totalSlots} Slots Free
            </span>
          </div>
        </div>

        {/* Right: Active session alert, user profile, logout */}
        <div className="flex items-center gap-3">
          {/* Active Parking Pill for drivers */}
          {!isAdmin && activeSession && (
            <Link
              to="/qr-parking"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all text-xs font-medium shadow-sm animate-pulse-subtle"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold font-mono">{activeSession.slotCode}</span>
              <span className="hidden md:inline text-emerald-700">Active Session</span>
              <ArrowRight className="w-3 h-3 text-emerald-600" />
            </Link>
          )}

          {/* User Profile Pill */}
          <button
            onClick={() => {
              setProfileForm({
                name: currentUser?.name || '',
                phone: currentUser?.phone || '',
                vehicleNumber: currentUser?.vehicleNumber || '',
                vehicleModel: currentUser?.vehicleModel || ''
              });
              setIsProfileOpen(true);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-left"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                isAdmin ? 'bg-indigo-600 ring-2 ring-indigo-500/20' : 'bg-slate-900 ring-2 ring-emerald-500/20'
              }`}
            >
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">
                {isAdmin ? 'Campus Security' : 'Registered Driver'}
              </p>
            </div>
          </button>

          {/* Quick Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* User Profile / Vehicle Settings Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setIsEditing(false);
        }}
        title={isAdmin ? "Officer Security Profile" : "Driver & Vehicle Profile"}
      >
        <div className="space-y-5">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentUser?.name}</h4>
                  <p className="text-slate-500">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    {isAdmin ? 'Campus Security & Enforcement' : 'Authorized Campus Driver'}
                  </span>
                </div>
              </div>

              {!isAdmin && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Linked Vehicle Information
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">License Plate:</span>
                    <PlateBadge plateNumber={currentUser?.vehicleNumber} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vehicle Model:</span>
                    <span className="font-semibold text-slate-800">{currentUser?.vehicleModel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Registered Mobile:</span>
                    <span className="font-mono text-slate-800">{currentUser?.phone}</span>
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Security Credentials
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Badge ID:</span>
                    <span className="font-mono font-bold text-slate-900">{currentUser?.badgeId || 'PP-OFFICER-704'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-slate-800">{currentUser?.department || 'Traffic Control'}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Vehicle Details</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle License Plate</label>
                <input
                  type="text"
                  value={profileForm.vehicleNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, vehicleNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={profileForm.vehicleModel}
                  onChange={(e) => setProfileForm({ ...profileForm, vehicleModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};
