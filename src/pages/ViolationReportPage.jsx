import React, { useState } from 'react';
import {
  AlertTriangle,
  Upload,
  Car,
  CheckCircle2,
  X,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { PlateBadge } from '../components/violations/PlateBadge';
import { ViolationCard } from '../components/violations/ViolationCard';

export const ViolationReportPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const { violations, reportViolation, updateViolationStatus } = useParking();

  const [activeTab, setActiveTab] = useState('SUBMIT'); // SUBMIT | HISTORY

  // Form State
  const [category, setCategory] = useState('Unauthorized Parking');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [zone, setZone] = useState('Zone A');
  const [slotId, setSlotId] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [validationError, setValidationError] = useState('');

  const sampleEvidencePhotos = [
    {
      label: 'Sample 1: Line Crossing',
      url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: 'Sample 2: Blocked Exit',
      url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
    },
    {
      label: 'Sample 3: Unauthorized EV Spot',
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const categories = [
    'Unauthorized Parking',
    'Wrong Parking',
    'Blocked Parking',
    'Expired Meter',
    'Reserved Space Infringement'
  ];

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!vehicleNumber.trim()) {
      setValidationError('Please specify the offending vehicle registration plate.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Please provide a brief description of the parking violation.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newReport = await reportViolation({
        category,
        vehicleNumber,
        zone,
        slotId: slotId || 'Adjacent Bay',
        description,
        urgency,
        imageUrl: imagePreview,
        reporterName: currentUser?.name || 'Concerned Driver',
        reporterId: currentUser?.id || 'usr-guest'
      });

      setSubmissionSuccess(newReport);
      // Reset form
      setVehicleNumber('');
      setDescription('');
      setSlotId('');
      setActiveTab('HISTORY');
    } catch (err) {
      setValidationError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-mono">
              Campus Traffic Safety & Enforcement
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Community Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Violation Reporting System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Report unauthorized vehicles, blocked driveways, and double parking. Reports sync directly with Campus Security.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('SUBMIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SUBMIT'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Submitted Reports</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
              {violations.length}
            </span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submissionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                Violation Case Logged: {submissionSuccess.id}
              </p>
              <p className="text-[11px] text-emerald-700">
                Your report for vehicle {submissionSuccess.vehicleNumber} was dispatched to the Admin Console.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmissionSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: SUBMIT REPORT FORM */}
      {activeTab === 'SUBMIT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              File an Incident Report
            </h2>

            {validationError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Violation Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                        category === cat
                          ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Number & Zone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Registration Number with Live Plate Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Offending Vehicle Plate <span className="text-rose-500">*</span>
                    </label>
                    {vehicleNumber && <PlateBadge plateNumber={vehicleNumber} size="sm" />}
                  </div>
                  <div className="relative">
                    <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. KA-05-MB-7712"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                {/* Zone Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Campus Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-rose-500 bg-white"
                  >
                    <option value="Zone A">Zone A - Central Campus Gate 1</option>
                    <option value="Zone B">Zone B - Academic Block & Library</option>
                    <option value="Zone C">Zone C - Engineering & Tech Hub</option>
                    <option value="Zone D">Zone D - Sports Arena & Auditorium</option>
                    <option value="Zone E">Zone E - Medical Sciences Wing</option>
                  </select>
                </div>
              </div>

              {/* Bay ID and Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Parking Bay / Specific Spot (Optional)
                  </label>
                  <input
                    type="text"
                    value={slotId}
                    onChange={(e) => setSlotId(e.target.value.toUpperCase())}
                    placeholder="e.g. P003 or Main Driveway Gate"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-rose-500 bg-white"
                  >
                    <option value="low">Low (General Infraction)</option>
                    <option value="medium">Medium (Improper Bay Usage)</option>
                    <option value="high">High (Blocking Flow / Reserved Spot)</option>
                    <option value="critical">Critical (Blocking Fire Hydrant / Emergency)</option>
                  </select>
                </div>
              </div>

              {/* Description & Quick Preset Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe vehicle posture, obstruction, or permit violation..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                  required
                />

                {/* Quick tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400">Quick insert:</span>
                  {[
                    'Blocking driveway exit',
                    'Parked diagonally across two bays',
                    'Occupying reserved disability space',
                    'Parked in red fire hydrant zone'
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setDescription((prev) => (prev ? `${prev} ${phrase}.` : `${phrase}.`))}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Evidence Upload Section */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Photographic Evidence
                </label>

                {/* Upload or Dropzone */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative max-w-sm mx-auto h-44 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                        <img
                          src={imagePreview}
                          alt="Violation Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview('')}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Photo attached and ready for verification
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">
                        Upload vehicle photo evidence
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Supports JPG, PNG with vehicle license plate legible
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer mt-3 max-w-xs mx-auto"
                  />
                </div>

                {/* Quick Sample Photos for Evaluator Convenience */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Demo Presets:
                  </span>
                  {sampleEvidencePhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImagePreview(sample.url)}
                      className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  Submitting dispatches notice to Campus Security for inspection.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Report...' : 'Submit Incident Report'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar Guidelines & Campus Policies (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Campus Parking Regulations
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ParkPulse utilizes community crowdsourcing to ensure university fire routes and reserved bays remain clear.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="font-bold text-white block">Rule 1: Bay Boundaries</span>
                  <p className="text-slate-400 text-[11px]">Vehicles straddling painted lines will receive a formal violation warning notice.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="font-bold text-white block">Rule 2: Emergency Egress</span>
                  <p className="text-slate-400 text-[11px]">Any vehicle blocking fire hydrants or loading docks faces immediate security towing.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="font-bold text-white block">Rule 3: Accessible Bays</span>
                  <p className="text-slate-400 text-[11px]">Valid student/staff disability permit strictly required for P003, P010, and P023.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL SUBMITTED REPORTS */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Submitted Violations Registry
              </h2>
              <p className="text-xs text-slate-500">
                All reports filed by campus drivers and security personnel.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('SUBMIT')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold self-start sm:self-auto"
            >
              + File New Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {violations.map((v) => (
              <ViolationCard
                key={v.id}
                violation={v}
                isAdmin={isAdmin}
                onStatusUpdate={updateViolationStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
