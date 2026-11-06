import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Search,
  Zap,
  Shield,
  ChevronRight,
  Compass,
  LocateFixed,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { InteractiveMap } from '../components/parking/InteractiveMap';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

// Haversine formula for real-world GPS distance calculation
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export const NearbyParkingPage = () => {
  const {
    locations,
    slots,
    userLocation,
    detectUserLocation,
    isDetectingLocation,
    locationError
  } = useParking();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL | EV | COVERED
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [zoneSlotsModal, setZoneSlotsModal] = useState(null);

  // Computed locations with live GPS distances and proximity sorting
  const processedLocations = useMemo(() => {
    return locations.map((loc) => {
      let realDistKm = loc.distanceKm;
      let isLiveGPS = false;

      if (userLocation?.lat && userLocation?.lng && loc.lat && loc.lng) {
        const computed = calculateDistanceKm(userLocation.lat, userLocation.lng, loc.lat, loc.lng);
        if (computed !== null) {
          realDistKm = computed;
          isLiveGPS = true;
        }
      }

      return {
        ...loc,
        displayDistanceKm: realDistKm,
        isLiveGPS
      };
    }).sort((a, b) => {
      if (userLocation) {
        return a.displayDistanceKm - b.displayDistanceKm;
      }
      return 0;
    });
  }, [locations, userLocation]);

  const filteredLocations = processedLocations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === 'EV') matchesFilter = loc.hasEV;
    if (selectedFilter === 'COVERED') matchesFilter = loc.isCovered;

    return matchesSearch && matchesFilter;
  });

  const getGoogleMapsDirectionsUrl = (loc) => {
    const dest = loc.lat && loc.lng ? `${loc.lat},${loc.lng}` : encodeURIComponent(`${loc.name}, Vishwakarma University Pune`);
    if (userLocation?.lat && userLocation?.lng) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${dest}&travelmode=driving`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
  };

  const handleOpenZoneSlots = (loc) => {
    const zoneSlots = slots.filter((s) => s.zone === loc.zone);
    setZoneSlotsModal({ location: loc, slots: zoneSlots });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Vishwakarma University Branding & GPS Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
              Vishwakarma University (VU Pune)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Campus Smart Parking Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nearby Parking Locations & Turn-by-Turn GPS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live bay occupancy across VU Kondhwa Campus, distance estimation, and 1-tap Google Maps directions.
          </p>
        </div>

        {/* Live GPS Detection Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={detectUserLocation}
            disabled={isDetectingLocation}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              userLocation
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <LocateFixed className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>
              {isDetectingLocation
                ? 'Acquiring GPS Pin...'
                : userLocation
                ? 'Update Live GPS'
                : 'Detect My Location'}
            </span>
          </button>
        </div>
      </div>

      {/* GPS Status Banner */}
      {userLocation && (
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>
              <strong>GPS Active:</strong> Your location is locked at{' '}
              <code className="bg-emerald-100/80 px-2 py-0.5 rounded font-mono font-bold">
                {userLocation.lat.toFixed(5)}°N, {userLocation.lng.toFixed(5)}°E
              </code>
              . Parking facilities sorted by real travel distance.
            </span>
          </div>
          <span className="text-emerald-700 font-semibold text-[11px]">
            Accuracy ±{Math.round(userLocation.accuracy || 10)}m
          </span>
        </div>
      )}

      {locationError && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Interactive Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            Vishwakarma University Campus Navigation Grid
          </h3>
          <span className="text-xs text-slate-400">Click any pin on the map to inspect</span>
        </div>
        <InteractiveMap
          locations={processedLocations}
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

          // Format distance
          const distanceDisplay =
            loc.displayDistanceKm < 1
              ? `${Math.round(loc.displayDistanceKm * 1000)} m`
              : `${loc.displayDistanceKm.toFixed(1)} km`;

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
                {/* Header: Zone Badge & Live Distance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                      {loc.zone}
                    </span>
                    {loc.hasEV && (
                      <span className="p-1 rounded-md bg-emerald-50 text-emerald-600" title="EV Charging Station Available">
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
                    <span className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${
                      loc.isLiveGPS ? 'text-emerald-700 font-extrabold' : 'text-slate-700'
                    }`}>
                      {loc.isLiveGPS && <Compass className="w-3 h-3 text-emerald-500" />}
                      {distanceDisplay}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {loc.isLiveGPS ? 'from your live location' : `~${loc.walkingTimeMin} min walk`}
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
                        / {loc.totalSlots} Free
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Campus Gate
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 mt-0.5 block">
                      {loc.securityLevel || 'Active Patrol'}
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

              {/* Action Buttons: Google Maps Navigation & Inspect Bays */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={getGoogleMapsDirectionsUrl(loc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  title="Launch Google Maps Turn-by-Turn GPS Navigation"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenZoneSlots(loc);
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Bays</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone Slots Breakdown Modal */}
      {zoneSlotsModal && (
        <Modal
          isOpen={!!zoneSlotsModal}
          onClose={() => setZoneSlotsModal(null)}
          title={`Parking Bays in ${zoneSlotsModal.location.name}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">{zoneSlotsModal.location.zone}</span>
              <span className="text-slate-500">
                {zoneSlotsModal.slots.filter((s) => s.status === 'available').length} of{' '}
                {zoneSlotsModal.slots.length} bays open
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
              {zoneSlotsModal.slots.map((slot) => {
                const isAvail = slot.status === 'available';
                return (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isAvail
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {slot.code}
                      </span>
                      <Badge
                        variant={
                          isAvail
                            ? 'success'
                            : slot.status === 'occupied'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {slot.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{slot.type}</span>
                      {isAvail && (
                        <button
                          type="button"
                          onClick={() => {
                            setZoneSlotsModal(null);
                            navigate(`/qr-parking?code=${slot.code}`);
                          }}
                          className="font-bold text-emerald-600 hover:text-emerald-700"
                        >
                          Book &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
