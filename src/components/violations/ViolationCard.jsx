import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { PlateBadge } from './PlateBadge';
import { Modal } from '../common/Modal';

export const ViolationCard = ({
  violation,
  onStatusUpdate,
  isAdmin = false
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatTimestamp = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ', ' +
        d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  const handleAction = async (newStatus, notes) => {
    if (!onStatusUpdate) return;
    setIsUpdating(true);
    try {
      await onStatusUpdate(violation.id, newStatus, notes);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="space-y-4">
          {/* Card Top: Case ID & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">
                {violation.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {violation.category}
              </span>
            </div>
            <Badge variant={violation.status} size="xs">
              {violation.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Vehicle License Plate and Location */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <PlateBadge plateNumber={violation.vehicleNumber} size="md" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{violation.zone}</span>
              {violation.slotId && (
                <span className="font-mono font-semibold text-slate-700">
                  • {violation.slotId}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            {violation.description}
          </p>

          {/* Evidence Image Thumbnail */}
          {violation.imageUrl && (
            <div
              className="relative group rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100 cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            >
              <img
                src={violation.imageUrl}
                alt="Violation photographic evidence"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                <Eye className="w-4 h-4" />
                <span>View Full Photo Evidence</span>
              </div>
            </div>
          )}

          {/* Admin notes if present */}
          {violation.adminNotes && (
            <div className="text-[11px] bg-slate-100 p-2.5 rounded-lg text-slate-600 border border-slate-200/80">
              <span className="font-bold text-slate-800">Officer Note:</span> {violation.adminNotes}
            </div>
          )}
        </div>

        {/* Card Footer: Metadata & Admin Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(violation.timestamp)}</span>
            </div>
            <span className="truncate max-w-[150px]">
              By: {violation.reporterName}
            </span>
          </div>

          {/* Admin Action Controls */}
          {isAdmin && onStatusUpdate && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {violation.status === 'pending' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction('investigating', 'Assigned officer dispatched on scene.')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  Verify Incident
                </button>
              )}

              {(violation.status === 'pending' || violation.status === 'investigating') && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction('warning_issued', 'Official parking violation notice issued to driver.')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Issue Notice
                </button>
              )}

              {violation.status !== 'resolved' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction('resolved', 'Violation cleared and space recovered.')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  Mark Resolved
                </button>
              )}

              {violation.status !== 'dismissed' && violation.status !== 'resolved' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleAction('dismissed', 'Permission granted or false alarm.')}
                  className="py-1.5 px-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        title={`Evidence Photo – ${violation.id}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
            <img
              src={violation.imageUrl}
              alt="Full violation evidence"
              className="w-full max-h-[500px] object-contain mx-auto"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-800">Target Vehicle:</span>{' '}
              <span className="font-mono">{violation.vehicleNumber}</span>
            </div>
            <div>
              <span className="font-bold text-slate-800">Location:</span> {violation.zone} (
              {violation.slotId})
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
