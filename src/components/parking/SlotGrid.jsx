import React, { useState } from 'react';
import { SlotCard } from './SlotCard';
import { Filter, Zap, CheckCircle2, Car, Sparkles } from 'lucide-react';

export const SlotGrid = ({ slots, onSelectSlot, onAdminToggle, showAdminControls = false }) => {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const zones = ['ALL', 'Zone A', 'Zone B', 'Zone C', 'Zone D'];

  const filteredSlots = slots.filter((slot) => {
    const matchesZone = selectedZone === 'ALL' || slot.zone === selectedZone;
    let matchesStatus = true;
    if (statusFilter === 'AVAILABLE') matchesStatus = slot.status === 'available';
    if (statusFilter === 'OCCUPIED') matchesStatus = slot.status === 'occupied';
    if (statusFilter === 'EV') matchesStatus = slot.isEV === true;
    return matchesZone && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Zone Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedZone === zone
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {zone === 'ALL' ? 'All Zones' : zone}
            </button>
          ))}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({slots.length})
          </button>
          <button
            onClick={() => setStatusFilter('AVAILABLE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
              statusFilter === 'AVAILABLE'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Available
          </button>
          <button
            onClick={() => setStatusFilter('OCCUPIED')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
              statusFilter === 'OCCUPIED'
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'border-transparent text-slate-500 hover:text-rose-700'
            }`}
          >
            <Car className="w-3 h-3 text-rose-600" />
            Occupied
          </button>
          <button
            onClick={() => setStatusFilter('EV')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
              statusFilter === 'EV'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
          >
            <Zap className="w-3 h-3 text-emerald-600" />
            EV Only
          </button>
        </div>
      </div>

      {/* Grid of Slots */}
      {filteredSlots.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No parking slots found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onSelect={onSelectSlot}
              onAdminToggle={onAdminToggle}
              showAdminControls={showAdminControls}
            />
          ))}
        </div>
      )}
    </div>
  );
};

