import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  QrCode,
  Camera,
  Search,
  CheckCircle2,
  AlertCircle,
  Car,
  Clock,
  Play,
  StopCircle,
  ShieldCheck,
  VideoOff,
  Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { Badge } from '../components/common/Badge';
import { PlateBadge } from '../components/violations/PlateBadge';
import { ActiveSessionBanner } from '../components/parking/ActiveSessionBanner';

export const QRParkingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || 'P001';

  const { currentUser } = useAuth();
  const { slots, activeSession, startParking, endParking } = useParking();

  const [inputCode, setInputCode] = useState(initialCode);
  const [scannedSlot, setScannedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(
    currentUser?.vehicleNumber || 'KA-03-HA-8820'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Live Camera Stream State
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Quick preset sample QR codes
  const samplePresets = ['P001', 'P002', 'P003', 'P004', 'P007', 'P013'];

  // Lookup slot by code
  const lookupSlot = (codeToSearch) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!codeToSearch) {
      setScannedSlot(null);
      return;
    }
    const clean = codeToSearch.trim().toUpperCase();
    const found = slots.find((s) => s.code.toUpperCase() === clean);
    if (found) {
      setScannedSlot(found);
    } else {
      setScannedSlot(null);
      setErrorMessage(`Bay identifier "${clean}" not recognized. Please verify the code on the pillar placard.`);
    }
  };

  useEffect(() => {
    lookupSlot(inputCode);
  }, [slots]);

  // Turn on/off device webcam or mobile camera
  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera API is not supported in this browser environment.');
      }
    } catch (err) {
      setCameraError('Camera access unavailable or permission denied. You can enter the placard code manually.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle manual input submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    lookupSlot(inputCode);
  };

  // Click on a preset
  const handleSelectPreset = (code) => {
    setInputCode(code);
    lookupSlot(code);
  };

  // Simulate optical recognition
  const handleSimulateScan = () => {
    const candidate = 'P001';
    setInputCode(candidate);
    lookupSlot(candidate);
    setSuccessMessage('Optical QR placard recognized: Slot P001 verified.');
  };

  // Handle Start Parking
  const handleStartParking = async () => {
    if (!scannedSlot) return;
    try {
      setIsActionLoading(true);
      setErrorMessage('');
      await startParking({
        slotCode: scannedSlot.code,
        vehicleNumber: vehicleNumber,
        driverName: currentUser?.name || 'Alex Mercer'
      });
      setSuccessMessage(`Session started at ${scannedSlot.code}. Slot status is now Occupied.`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle End Parking
  const handleEndParking = async () => {
    try {
      setIsActionLoading(true);
      setErrorMessage('');
      const completed = await endParking();
      setSuccessMessage(`Session completed (${completed.durationMin} mins). Slot ${completed.slotCode} has been vacated.`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const isCurrentSlotMyActiveSession =
    activeSession && scannedSlot && activeSession.slotCode === scannedSlot.code;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">
            Touchless QR Check-In
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">Digital Bay Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          QR Parking Check-In & Metering
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Scan the QR placard affixed to your parking spot pillar or enter the code manually to start your parking session.
        </p>
      </div>

      {/* Active Session Banner if active */}
      <ActiveSessionBanner />

      {/* Main Grid: Left Scanner Viewfinder, Right Manual Input & Slot Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Optical Viewfinder (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-10 right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Camera QR Viewfinder
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isCameraActive
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-slate-400 bg-slate-900 border-slate-800'
              }`}>
                {isCameraActive ? 'LIVE VIDEO' : 'SCANNER STANDBY'}
              </span>
            </div>

            {/* Viewfinder Window */}
            <div className="relative mt-6 aspect-square max-w-[280px] mx-auto rounded-2xl border-2 border-dashed border-emerald-500/40 bg-slate-900/80 flex items-center justify-center overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400 z-10" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400 z-10" />
              <div className="absolute bottom-2 left-2 w-6 h-2 border-b-2 border-l-2 border-emerald-400 z-10" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400 z-10" />

              {/* Scanning laser line animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400 animate-scan pointer-events-none z-10" />

              {/* Live WebCam Video or Standby Graphic */}
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl shadow-lg flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded p-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                        <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                      </div>
                      <div className="text-[9px] font-mono font-bold text-white text-center">
                        {scannedSlot?.code || 'SCAN'}
                      </div>
                      <div className="flex justify-between">
                        <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                        <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-3">
                    Point camera at parking bay QR placard
                  </p>
                </div>
              )}
            </div>

            {cameraError && (
              <p className="text-[11px] text-amber-400 text-center mt-3 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                {cameraError}
              </p>
            )}
          </div>

          {/* Camera Controls */}
          <div className="pt-6 space-y-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Open Device Camera</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Scan Placard</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <VideoOff className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-400 text-center">
              Requires camera permission or use the manual entry on the right.
            </p>
          </div>
        </div>

        {/* Right Column: Manual Entry & Slot Inspection Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Manual Code Input Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                Bay Identifier Entry
              </h3>
              <span className="text-xs text-slate-400">Printed on pillar placard</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setInputCode(val);
                    lookupSlot(val);
                  }}
                  placeholder="Enter Bay Code (e.g. P001)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Inspect Bay
              </button>
            </form>

            {/* Quick Access Bay Chips */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Frequent Campus Bays:
              </p>
              <div className="flex flex-wrap gap-2">
                {samplePresets.map((code) => {
                  const s = slots.find((item) => item.code === code);
                  const isAvail = s?.status === 'available';
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleSelectPreset(code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                        inputCode === code
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : isAvail
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      {code} ({isAvail ? 'Available' : 'Occupied'})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification Messages */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Slot Information Card */}
          {scannedSlot ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold font-mono text-slate-900">
                      Slot {scannedSlot.code}
                    </h2>
                    <Badge variant={scannedSlot.status} size="sm">
                      {scannedSlot.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {scannedSlot.zone} • {scannedSlot.zoneName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium">Access Status</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    Campus Authorized
                  </p>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Level / Floor</span>
                  <span className="font-semibold text-slate-800">{scannedSlot.level}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Bay Type</span>
                  <span className="font-semibold text-slate-800">{scannedSlot.type}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Placard ID</span>
                  <div className="flex items-center gap-1 font-semibold text-emerald-600 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{scannedSlot.qrPlacardId || `QR-${scannedSlot.code}`}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Check-In Type</span>
                  <span className="font-semibold text-slate-800">
                    Mobile QR
                  </span>
                </div>
              </div>

              {/* Vehicle Occupancy info if occupied */}
              {scannedSlot.status === 'occupied' && scannedSlot.occupiedBy && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800">
                      Currently Occupied Bay
                    </span>
                    <PlateBadge plateNumber={scannedSlot.occupiedBy.vehicleNumber} size="sm" />
                  </div>
                  <p className="text-xs text-rose-700">
                    Driver: {scannedSlot.occupiedBy.driverName} • Parked since{' '}
                    {new Date(scannedSlot.occupiedBy.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {/* Action Buttons Section */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                {scannedSlot.status === 'available' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Confirm Vehicle License Plate
                      </label>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                        placeholder="KA-03-HA-8820"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm uppercase focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={handleStartParking}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isActionLoading ? 'Registering Check-In...' : 'Check-In to This Bay'}</span>
                    </button>
                  </div>
                ) : isCurrentSlotMyActiveSession ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                      This is your active parking session. When leaving, click below to release the bay.
                    </div>
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={handleEndParking}
                      className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      <StopCircle className="w-4 h-4" />
                      <span>{isActionLoading ? 'Ending Session...' : 'End Parking & Vacate Bay'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs text-center">
                    This slot is currently occupied by another campus vehicle. Please navigate to an open green slot.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-2">
              <QrCode className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-semibold text-sm">No slot currently selected</p>
              <p className="text-xs text-slate-400">
                Point your camera or click a bay code above to inspect details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
