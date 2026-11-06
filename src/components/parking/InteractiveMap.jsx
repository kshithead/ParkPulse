import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Shield, Info, Layers, Compass } from 'lucide-react';
import { Badge } from '../common/Badge';

export const InteractiveMap = ({ locations, selectedLocation, onSelectLocation }) => {
  const [filterType, setFilterType] = useState('ALL'); // ALL | EV | HIGH_AVAIL

  const filteredPins = locations.filter((loc) => {
    if (filterType === 'EV') return loc.hasEV;
    if (filterType === 'HIGH_AVAIL') return loc.availableSlots >= 3;
    return true;
  });

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl select-none">
      {/* Map Graphic Layer (Stylized Smart Campus Map) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
          </pattern>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        <rect width="800" height="500" fill="#0f172a" />
        <rect width="800" height="500" fill="url(#campusGrid)" />

        {/* Campus Landscaping & Buildings */}
        {/* Main Quad Greenery */}
        <path
          d="M 220 120 Q 280 90 350 140 T 480 180 L 440 280 Q 300 320 220 250 Z"
          fill="#064e3b"
          opacity="0.3"
        />
        {/* Lake / Fountain Area */}
        <circle cx="580" cy="180" r="45" fill="#0369a1" opacity="0.25" />

        {/* Major Roads / Corridors */}
        <path
          d="M 0 250 C 200 250, 250 180, 400 180 S 600 280, 800 280"
          stroke="#475569"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 300 0 L 300 500"
          stroke="#334155"
          strokeWidth="12"
          strokeDasharray="8 6"
        />
        <path
          d="M 520 0 L 520 500"
          stroke="#334155"
          strokeWidth="12"
          strokeDasharray="8 6"
        />

        {/* Main Building Blocks */}
        <rect x="180" y="80" width="100" height="60" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <text x="230" y="115" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Admin Block</text>

        <rect x="420" y="70" width="110" height="75" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <text x="475" y="112" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Central Library</text>

        <rect x="540" y="310" width="140" height="90" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <text x="610" y="360" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Tech & Innovation Hub</text>

        <rect x="120" y="330" width="120" height="80" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <text x="180" y="375" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Auditorium & Sports</text>

        {/* Compass Needle */}
        <g transform="translate(740, 50)">
          <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#334155" />
          <polygon points="0,-16 -5,0 5,0" fill="#ef4444" />
          <polygon points="0,16 -5,0 5,0" fill="#94a3b8" />
          <text x="0" y="-19" fill="#e2e8f0" fontSize="9" textAnchor="middle" fontWeight="bold">N</text>
        </g>
      </svg>

      {/* Floating Map Controls & Filters */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Campus Radar</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              filterType === 'ALL'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Zones
          </button>
          <button
            onClick={() => setFilterType('HIGH_AVAIL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              filterType === 'HIGH_AVAIL'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            &ge;3 Free Slots
          </button>
          <button
            onClick={() => setFilterType('EV')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              filterType === 'EV'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EV Ready
          </button>
        </div>
      </div>

      {/* Interactive Map Pins */}
      {filteredPins.map((loc) => {
        const isSelected = selectedLocation?.id === loc.id;
        const isAlmostFull = loc.availableSlots <= 1;

        return (
          <div
            key={loc.id}
            onClick={() => onSelectLocation(loc)}
            style={{
              left: `${loc.coordinates.x}%`,
              top: `${loc.coordinates.y}%`
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
          >
            {/* Ping animation ring */}
            <span
              className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                isAlmostFull ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />

            {/* Pin Badge */}
            <div
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-2xl transition-all duration-200 group-hover:scale-110 ${
                isSelected
                  ? 'bg-white text-slate-950 ring-4 ring-emerald-500/50 shadow-emerald-500/50 scale-105'
                  : isAlmostFull
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="font-mono">{loc.zone}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20">
                {loc.availableSlots} Free
              </span>
            </div>

            {/* Hover Tooltip Card */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-slate-950/95 backdrop-blur-md rounded-xl border border-slate-700 text-white shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
              <p className="text-xs font-bold text-white truncate">{loc.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{loc.address}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
                <span className="text-emerald-400 font-bold">
                  {loc.availableSlots} / {loc.totalSlots} Slots Free
                </span>
                <span className="text-slate-400 font-mono">{loc.distanceKm} km</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected Location Quick Detail Overlay Bar at bottom */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{selectedLocation.name}</h4>
                <Badge variant="available" size="xs">
                  {selectedLocation.zone}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {selectedLocation.distanceKm} km away • ~{selectedLocation.driveTimeMin} min drive
                • ₹{selectedLocation.hourlyRate}/hr
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              {selectedLocation.availableSlots} Slots Available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

