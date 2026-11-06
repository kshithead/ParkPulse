import React from 'react';
import { Zap, Accessibility, QrCode, Car } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SlotCard = ({ slot, onSelect, onAdminToggle, showAdminControls = false }) => {
  const isAvailable = slot.status === 'available';
  const isOccupied = slot.status === 'occupied';

  return (
    <div
      onClick={() => onSelect && onSelect(slot)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 border bg-white ${
        isAvailable
          ? 'border-emerald-200/90 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10'
          : isOccupied
          ? 'border-rose-200/90 hover:border-rose-300'
          : 'border-slate-200 hover:border-slate-300'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Top Header: Code & Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            {slot.code}
          </span>
          <Badge variant={slot.status} size="xs">
            {slot.status.toUpperCase()}
          </Badge>
        </div>

        {/* Feature Icons */}
        <div className="flex items-center gap-1.5 text-slate-400">
          {slot.isEV && (
            <span
              title="EV Charging Equipped"
              className="p-1 rounded-md bg-emerald-50 text-emerald-600"
            >
              <Zap className="w-3.5 h-3.5" />
            </span>
          )}
          {slot.isAccessible && (
            <span
              title="Accessible / Handicap Parking"
              className="p-1 rounded-md bg-blue-50 text-blue-600"
            >
              <Accessibility className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Middle: Zone & Level Info */}
      <div className="space-y-1 mb-3">
        <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>{slot.zone}</span>
          <span className="text-[11px] font-medium text-slate-500">{slot.type}</span>
        </div>
        <p className="text-[11px] text-slate-400 truncate">{slot.level}</p>
      </div>

      {/* Occupancy details if occupied */}
      {isOccupied && slot.occupiedBy && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-rose-50/70 border border-rose-100 text-[11px] space-y-0.5">
          <div className="flex items-center justify-between text-rose-800 font-mono font-bold">
            <span className="flex items-center gap-1">
              <Car className="w-3 h-3 text-rose-500" />
              {slot.occupiedBy.vehicleNumber}
            </span>
          </div>
          <p className="text-rose-600/80 text-[10px] truncate">
            Driver: {slot.occupiedBy.driverName}
          </p>
        </div>
      )}

      {/* QR Placard footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1 font-mono">
          <QrCode className={`w-3 h-3 ${isAvailable ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span>{slot.qrPlacardId || `QR-${slot.code}`}</span>
        </div>
        <span className="font-medium text-slate-500">
          {isAvailable ? 'Scan to Park' : 'In Session'}
        </span>
      </div>

      {/* Admin Quick Override Actions */}
      {showAdminControls && onAdminToggle && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdminToggle(slot.id, isAvailable ? 'occupied' : 'available');
            }}
            className={`w-full py-1 text-xs font-semibold rounded-lg transition-colors ${
              isAvailable
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Mark as {isAvailable ? 'Occupied' : 'Available'}
          </button>
        </div>
      )}
    </div>
  );
};
