import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Initial State (24 bays, 5 zones, initial sample violations)
const INITIAL_DATA = {
  slots: [
    { id: 's-001', code: 'P001', zone: 'Zone A', zoneName: 'Central Campus Gate', level: 'Ground Floor', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-A-001', occupiedBy: null },
    { id: 's-002', code: 'P002', zone: 'Zone A', zoneName: 'Central Campus Gate', level: 'Ground Floor', type: 'EV Charging', status: 'available', isEV: true, isAccessible: false, qrPlacardId: 'QR-A-002', occupiedBy: null },
    { id: 's-003', code: 'P003', zone: 'Zone A', zoneName: 'Central Campus Gate', level: 'Ground Floor', type: 'Accessible', status: 'available', isEV: false, isAccessible: true, qrPlacardId: 'QR-A-003', occupiedBy: null },
    { id: 's-004', code: 'P004', zone: 'Zone A', zoneName: 'Central Campus Gate', level: 'Ground Floor', type: 'Standard', status: 'occupied', isEV: false, isAccessible: false, qrPlacardId: 'QR-A-004', occupiedBy: { vehicleNumber: 'KA-01-MJ-4521', driverName: 'Rohit Sharma', startTime: new Date(Date.now() - 42 * 60 * 1000).toISOString() } },
    { id: 's-005', code: 'P005', zone: 'Zone A', zoneName: 'Central Campus Gate', level: 'Ground Floor', type: 'Standard', status: 'occupied', isEV: false, isAccessible: false, qrPlacardId: 'QR-A-005', occupiedBy: { vehicleNumber: 'KA-03-EE-9012', driverName: 'Priya Nair', startTime: new Date(Date.now() - 110 * 60 * 1000).toISOString() } },
    { id: 's-006', code: 'P006', zone: 'Zone A', zoneName: 'Central Campus Gate', level: 'Ground Floor', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-A-006', occupiedBy: null },
    { id: 's-007', code: 'P007', zone: 'Zone B', zoneName: 'Science & Tech Annex', level: 'Basement B1', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-B-007', occupiedBy: null },
    { id: 's-008', code: 'P008', zone: 'Zone B', zoneName: 'Science & Tech Annex', level: 'Basement B1', type: 'Standard', status: 'occupied', isEV: false, isAccessible: false, qrPlacardId: 'QR-B-008', occupiedBy: { vehicleNumber: 'MH-02-BQ-8819', driverName: 'Arjun Das', startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString() } },
    { id: 's-009', code: 'P009', zone: 'Zone B', zoneName: 'Science & Tech Annex', level: 'Basement B1', type: 'EV Charging', status: 'available', isEV: true, isAccessible: false, qrPlacardId: 'QR-B-009', occupiedBy: null },
    { id: 's-010', code: 'P010', zone: 'Zone B', zoneName: 'Science & Tech Annex', level: 'Basement B1', type: 'Accessible', status: 'available', isEV: false, isAccessible: true, qrPlacardId: 'QR-B-010', occupiedBy: null },
    { id: 's-011', code: 'P011', zone: 'Zone B', zoneName: 'Science & Tech Annex', level: 'Basement B1', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-B-011', occupiedBy: null },
    { id: 's-012', code: 'P012', zone: 'Zone B', zoneName: 'Science & Tech Annex', level: 'Basement B1', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-B-012', occupiedBy: null },
    { id: 's-013', code: 'P013', zone: 'Zone C', zoneName: 'Academic Block 4 East', level: 'Ground Floor', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-C-013', occupiedBy: null },
    { id: 's-014', code: 'P014', zone: 'Zone C', zoneName: 'Academic Block 4 East', level: 'Ground Floor', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-C-014', occupiedBy: null },
    { id: 's-015', code: 'P015', zone: 'Zone C', zoneName: 'Academic Block 4 East', level: 'Ground Floor', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-C-015', occupiedBy: null },
    { id: 's-016', code: 'P016', zone: 'Zone C', zoneName: 'Academic Block 4 East', level: 'Ground Floor', type: 'EV Charging', status: 'available', isEV: true, isAccessible: false, qrPlacardId: 'QR-C-016', occupiedBy: null },
    { id: 's-017', code: 'P017', zone: 'Zone D', zoneName: 'Sports Complex West', level: 'Open Ground Lot', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-D-017', occupiedBy: null },
    { id: 's-018', code: 'P018', zone: 'Zone D', zoneName: 'Sports Complex West', level: 'Open Ground Lot', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-D-018', occupiedBy: null },
    { id: 's-019', code: 'P019', zone: 'Zone D', zoneName: 'Sports Complex West', level: 'Open Ground Lot', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-D-019', occupiedBy: null },
    { id: 's-020', code: 'P020', zone: 'Zone D', zoneName: 'Sports Complex West', level: 'Open Ground Lot', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-D-020', occupiedBy: null },
    { id: 's-021', code: 'P021', zone: 'Zone E', zoneName: 'Hostel Quadrangle North', level: 'Ground Level', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-E-021', occupiedBy: null },
    { id: 's-022', code: 'P022', zone: 'Zone E', zoneName: 'Hostel Quadrangle North', level: 'Ground Level', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-E-022', occupiedBy: null },
    { id: 's-023', code: 'P023', zone: 'Zone E', zoneName: 'Hostel Quadrangle North', level: 'Ground Level', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-E-023', occupiedBy: null },
    { id: 's-024', code: 'P024', zone: 'Zone E', zoneName: 'Hostel Quadrangle North', level: 'Ground Level', type: 'Standard', status: 'available', isEV: false, isAccessible: false, qrPlacardId: 'QR-E-024', occupiedBy: null }
  ],
  sessions: [
    { sessionId: 'sess_init_1', slotId: 's-004', slotCode: 'P004', vehicleNumber: 'KA-01-MJ-4521', driverName: 'Rohit Sharma', zone: 'Zone A', startTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(), status: 'active' },
    { sessionId: 'sess_init_2', slotId: 's-005', slotCode: 'P005', vehicleNumber: 'KA-03-EE-9012', driverName: 'Priya Nair', zone: 'Zone A', startTime: new Date(Date.now() - 110 * 60 * 1000).toISOString(), status: 'active' },
    { sessionId: 'sess_init_3', slotId: 's-008', slotCode: 'P008', vehicleNumber: 'MH-02-BQ-8819', driverName: 'Arjun Das', zone: 'Zone B', startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(), status: 'active' }
  ],
  violations: [
    {
      id: 'VIO-2026-8812',
      category: 'Unauthorized Parking',
      vehicleNumber: 'DL-04-CX-1029',
      zone: 'Zone A',
      slotId: 'P003',
      description: 'Vehicle parked in designated handicap accessibility bay without displaying a disability permit on the windshield.',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      status: 'pending',
      urgency: 'high',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      reporterName: 'Karan Mehra',
      reporterId: 'usr-karan',
      adminNotes: 'Security patrol notified to inspect permit credentials.'
    },
    {
      id: 'VIO-2026-6634',
      category: 'Blocked Parking',
      vehicleNumber: 'KA-05-NB-7744',
      zone: 'Zone B',
      slotId: 'Ramp Entrance',
      description: 'Car parked right in front of the emergency basement ramp, obstructing ambulance and delivery vehicle passage.',
      imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
      status: 'warning_issued',
      urgency: 'high',
      timestamp: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      reporterName: 'Campus Security Patrol #2',
      reporterId: 'sec-patrol-02',
      adminNotes: 'Official warning placed on windshield. Tow dispatch alerted.'
    }
  ]
};

// In-Memory state for serverless instances
let db = { ...INITIAL_DATA };

// Health
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'healthy', provider: 'Vercel Serverless', timestamp: new Date().toISOString() });
});

// Slots
app.get('/api/v1/slots', (req, res) => {
  res.json(db.slots);
});

app.get('/api/v1/slots/qr/:code', (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const slot = db.slots.find((s) => s.code.toUpperCase() === code);
  if (!slot) return res.status(404).json({ error: `Slot ${code} not found` });
  res.json(slot);
});

app.patch('/api/v1/slots/:slotId', (req, res) => {
  const { slotId } = req.params;
  const { status, vehicleNumber } = req.body;
  const slotIndex = db.slots.findIndex((s) => s.id === slotId);
  if (slotIndex === -1) return res.status(404).json({ error: `Slot ${slotId} not found` });

  db.slots[slotIndex].status = status;
  if (status === 'occupied') {
    db.slots[slotIndex].occupiedBy = {
      vehicleNumber: vehicleNumber || 'ADMIN-OVERRIDE',
      driverName: 'Staff / Authorized Vehicle',
      startTime: new Date().toISOString()
    };
  } else {
    db.slots[slotIndex].occupiedBy = null;
  }
  res.json(db.slots[slotIndex]);
});

// Sessions
app.get('/api/v1/sessions', (req, res) => {
  res.json(db.sessions);
});

app.post('/api/v1/sessions/start', (req, res) => {
  const { slotId, slotCode, vehicleNumber, driverName, zone, sessionId } = req.body;
  const targetSlot = db.slots.find((s) => s.code.toUpperCase() === slotCode.toUpperCase());
  if (targetSlot && targetSlot.status !== 'available') {
    return res.status(409).json({ error: `Slot ${slotCode} is already ${targetSlot.status}` });
  }

  const newSession = {
    sessionId: sessionId || `sess_${Date.now()}`,
    slotId: slotId || (targetSlot ? targetSlot.id : 'unknown'),
    slotCode: slotCode.toUpperCase(),
    vehicleNumber: (vehicleNumber || 'KA-03-HA-8820').toUpperCase(),
    driverName: driverName || 'Registered Driver',
    zone: zone || (targetSlot ? targetSlot.zone : 'Zone A'),
    startTime: new Date().toISOString(),
    status: 'active'
  };

  if (targetSlot) {
    targetSlot.status = 'occupied';
    targetSlot.occupiedBy = {
      vehicleNumber: newSession.vehicleNumber,
      driverName: newSession.driverName,
      startTime: newSession.startTime
    };
  }

  db.sessions.unshift(newSession);
  res.status(201).json(newSession);
});

app.post('/api/v1/sessions/end', (req, res) => {
  const { sessionId, slotCode } = req.body;
  const targetSlot = db.slots.find((s) => s.code.toUpperCase() === slotCode?.toUpperCase());
  if (targetSlot) {
    targetSlot.status = 'available';
    targetSlot.occupiedBy = null;
  }

  const sessionIdx = db.sessions.findIndex((s) => s.sessionId === sessionId);
  const endTime = new Date().toISOString();
  let completedSession = req.body;

  if (sessionIdx !== -1) {
    const s = db.sessions[sessionIdx];
    const durationMs = Math.max(0, new Date(endTime) - new Date(s.startTime));
    const durationMin = Math.max(1, Math.ceil(durationMs / (1000 * 60)));

    db.sessions[sessionIdx] = {
      ...s,
      endTime,
      durationMin,
      status: 'completed'
    };
    completedSession = db.sessions[sessionIdx];
  }

  res.json(completedSession);
});

// Violations
app.get('/api/v1/violations', (req, res) => {
  res.json(db.violations);
});

app.post('/api/v1/violations', (req, res) => {
  const reportData = req.body;
  const newViolation = {
    id: reportData.id || `VIO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    category: reportData.category || 'Unauthorized Parking',
    vehicleNumber: (reportData.vehicleNumber || 'UNKNOWN').trim().toUpperCase(),
    zone: reportData.zone || 'Zone A',
    slotId: reportData.slotId || 'General Area',
    description: reportData.description || 'No description provided.',
    imageUrl: reportData.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    urgency: reportData.urgency || 'medium',
    timestamp: new Date().toISOString(),
    reporterName: reportData.reporterName || 'Campus Citizen',
    reporterId: reportData.reporterId || 'usr-anon',
    adminNotes: 'Awaiting inspection by parking control officer.'
  };

  db.violations.unshift(newViolation);
  res.status(201).json(newViolation);
});

app.patch('/api/v1/violations/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const vioIndex = db.violations.findIndex((v) => v.id === id);
  if (vioIndex === -1) return res.status(404).json({ error: `Violation ${id} not found` });

  db.violations[vioIndex].status = status;
  if (adminNotes) db.violations[vioIndex].adminNotes = adminNotes;
  db.violations[vioIndex].updatedAt = new Date().toISOString();

  res.json(db.violations[vioIndex]);
});

export default app;

