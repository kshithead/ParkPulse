import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Search,
  Zap,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { InteractiveMap } from '../components/parking/InteractiveMap';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const NearbyParkingPage = () => {
  const { locations, slots } = useParking();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL | EV | COVERED
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [zoneSlotsModal, setZoneSlotsModal] = useState(null);
  const [routeNavModal, setRouteNavModal] = useState(null);

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === 'EV') matchesFilter = loc.hasEV;
    if (selectedFilter === 'COVERED') matchesFilter = loc.isCovered;

    return matchesSearch && matchesFilter;
  });

  const handleOpenZoneSlots = (loc) => {
    const zoneSlots = slots.filter((s) => s.zone === loc.zone);
    setZoneSlotsModal({ location: loc, slots: zoneSlots });
  };

  const handleSimulateRoute = (loc) => {
    setRouteNavModal(loc);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
              Campus Geospatial Grid
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">5 Monitored Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nearby Parking Locations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-zone bay availability, walking distances, and EV charging facilities.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Map Sync Active
          </span>
        </div>
      </div>

      {/* Interactive Map Placeholder */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            Interactive Smart Campus Navigation Map
          </h3>
          <span className="text-xs text-slate-400">Click any pin on the map to inspect</span>
        </div>
        <InteractiveMap
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={(loc) => setSelectedLocation(loc)}
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by zone, facility name, or gate..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Facilities ({locations.length})
          </button>
          <button
            onClick={() => setSelectedFilter('EV')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              selectedFilter === 'EV'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            EV Ready
          </button>
          <button
            onClick={() => setSelectedFilter('COVERED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              selectedFilter === 'COVERED'
                ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Covered Roof
          </button>
        </div>
      </div>

      {/* Parking Location Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => {
          const isSelected = selectedLocation?.id === loc.id;
          const isFull = loc.availableSlots === 0;

          return (
            <div
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-sm flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Zone Badge & Distance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      {loc.zone}
                    </span>
                    {loc.hasEV && (
                      <span className="p-1 rounded-md bg-emerald-50 text-emerald-600" title="EV Available">
                        <Zap className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {loc.isCovered && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        Covered
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {loc.distanceKm} km
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ~{loc.walkingTimeMin} min walk
                    </span>
                  </div>
                </div>

                {/* Title & Address */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {loc.address}
                  </p>
                </div>

                {/* Live Availability Metric */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Slot Availability
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span
                        className={`text-2xl font-bold font-mono ${
                          isFull
                            ? 'text-rose-600'
                            : loc.availableSlots <= 2
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {loc.availableSlots}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / {loc.totalSlots} Slots Free
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Access Status
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 mt-0.5 block">
                      Open to All
                    </span>
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {loc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulateRoute(loc);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-slate-500" />
                  <span>Route</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenZoneSlots(loc);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>View Bays</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Specific Bays Inspection Modal */}
      {zoneSlotsModal && (
        <Modal
          isOpen={!!zoneSlotsModal}
          onClose={() => setZoneSlotsModal(null)}
          title={`Parking Bays at ${zoneSlotsModal.location.name} (${zoneSlotsModal.location.zone})`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
              <span>{zoneSlotsModal.location.address}</span>
              <span className="font-semibold text-slate-800">
                {zoneSlotsModal.location.zone}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {zoneSlotsModal.slots.map((s) => (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-2xl border ${
                    s.status === 'available'
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                      : 'border-rose-200 bg-rose-50/40 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-base">{s.code}</span>
                    <Badge variant={s.status} size="xs">
                      {s.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">{s.level} • {s.type}</p>
                  <div className="mt-3">
                    {s.status === 'available' ? (
                      <button
                        onClick={() => {
                          setZoneSlotsModal(null);
                          navigate(`/qr-parking?code=${s.code}`);
                        }}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                      >
                        Park in {s.code}
                      </button>
                    ) : (
                      <span className="block text-center py-1 text-xs text-rose-600 font-medium">
                        Occupied
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Simulated Turn-by-Turn Navigation Modal */}
      {routeNavModal && (
        <Modal
          isOpen={!!routeNavModal}
          onClose={() => setRouteNavModal(null)}
          title={`Turn-by-Turn Navigation – ${routeNavModal.name}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] uppercase">Destination Zone</p>
                <h4 className="text-base font-bold text-emerald-400">{routeNavModal.zone}</h4>
                <p className="text-slate-300 text-xs">{routeNavModal.name}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xl font-bold text-white">{routeNavModal.distanceKm} km</span>
                <span className="block text-slate-400 text-[10px]">~{routeNavModal.driveTimeMin} min drive</span>
              </div>
            </div>

            <div className="space-y-3 p-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <p className="font-bold text-slate-800">Head North toward University Main Ring Road</p>
                  <p className="text-slate-500">Continue straight for 300 meters.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <p className="font-bold text-slate-800">Turn Right at Tech Innovation Corridor</p>
                  <p className="text-slate-500">Follow the directional parking signs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <p className="font-bold text-slate-800">Pass Security Checkpoint</p>
                  <p className="text-slate-500">Ensure campus parking permit or QR check-in is ready.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">★</div>
                <div>
                  <p className="font-bold text-slate-900">Arrive at {routeNavModal.zone} Parking Deck</p>
                  <p className="text-emerald-700 font-semibold">{routeNavModal.availableSlots} bays currently open for parking.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setRouteNavModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors mt-2"
            >
              Got It
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
