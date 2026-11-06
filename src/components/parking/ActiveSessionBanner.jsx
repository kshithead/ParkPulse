import React, { useState, useEffect } from 'react';
import { Clock, Car, StopCircle, CheckCircle2 } from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { Modal } from '../common/Modal';

export const ActiveSessionBanner = () => {
  const { activeSession, endParking } = useParking();
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!activeSession) return;

    const calculateElapsed = () => {
      const start = new Date(activeSession.startTime).getTime();
      const now = Date.now();
      setElapsedSec(Math.max(0, Math.floor((now - start) / 1000)));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  if (!activeSession) return null;

  const hours = Math.floor(elapsedSec / 3600);
  const minutes = Math.floor((elapsedSec % 3600) / 60);
  const seconds = elapsedSec % 60;

  const handleEndParking = async () => {
    try {
      setIsProcessing(true);
      const result = await endParking(activeSession);
      setCheckoutResult(result);
      setIsCheckoutOpen(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Info & Timer */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Active Parking Session In Progress
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white">
                Slot {activeSession.slotCode}
              </h3>
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {activeSession.zone}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-mono">
                <Car className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">{activeSession.vehicleNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>
                  {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Check-in active</span>
              </div>
            </div>
          </div>

          {/* Right: End Parking action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Elapsed Time
              </p>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                {minutes}m {seconds}s
              </p>
            </div>

            <button
              onClick={handleEndParking}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <StopCircle className="w-4 h-4" />
              {isProcessing ? 'Releasing Bay...' : 'End Parking & Vacate'}
            </button>
          </div>
        </div>
      </div>

      {/* Release Confirmation Modal */}
      {checkoutResult && (
        <Modal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title="Parking Session Completed"
        >
          <div className="space-y-5 text-slate-700">
            <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Bay Successfully Released</h4>
              <p className="text-xs text-slate-500">
                Slot {checkoutResult.slotCode} is now marked Available for other drivers.
              </p>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Vehicle Plate:</span>
                <span className="font-mono font-bold text-slate-900">
                  {checkoutResult.vehicleNumber}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Slot & Zone:</span>
                <span className="font-semibold text-slate-900">
                  {checkoutResult.slotCode} ({checkoutResult.zone})
                </span>
              </div>
              <div className="flex justify-between py-1.5 text-sm font-bold text-slate-900">
                <span>Total Parking Duration:</span>
                <span className="text-emerald-600 font-mono text-base">
                  {checkoutResult.durationMin} minutes
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
