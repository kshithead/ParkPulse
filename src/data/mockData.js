// ParkPulse Mock Data Repository
// Pure Software & QR-Based Campus Smart Parking System
// No IoT hardware, no payment gateway, and no monetary fines required.

export const INITIAL_SLOTS = [
  // Zone A - Central Campus Gate (Ground Level)
  {
    id: 's-001',
    code: 'P001',
    zone: 'Zone A',
    zoneName: 'Central Campus Gate',
    level: 'Ground Floor',
    type: 'Standard',
    status: 'available', // available | occupied | reserved | maintenance
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-A-001',
    occupiedBy: null
  },
  {
    id: 's-002',
    code: 'P002',
    zone: 'Zone A',
    zoneName: 'Central Campus Gate',
    level: 'Ground Floor',
    type: 'EV Charging',
    status: 'available',
    isEV: true,
    isAccessible: false,
    qrPlacardId: 'QR-A-002',
    occupiedBy: null
  },
  {
    id: 's-003',
    code: 'P003',
    zone: 'Zone A',
    zoneName: 'Central Campus Gate',
    level: 'Ground Floor',
    type: 'Accessible',
    status: 'available',
    isEV: false,
    isAccessible: true,
    qrPlacardId: 'QR-A-003',
    occupiedBy: null
  },
  {
    id: 's-004',
    code: 'P004',
    zone: 'Zone A',
    zoneName: 'Central Campus Gate',
    level: 'Ground Floor',
    type: 'Standard',
    status: 'occupied',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-A-004',
    occupiedBy: {
      vehicleNumber: 'KA-01-MJ-4521',
      driverName: 'Rohit Sharma',
      startTime: new Date(Date.now() - 42 * 60 * 1000).toISOString() // 42 mins ago
    }
  },
  {
    id: 's-005',
    code: 'P005',
    zone: 'Zone A',
    zoneName: 'Central Campus Gate',
    level: 'Ground Floor',
    type: 'Standard',
    status: 'occupied',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-A-005',
    occupiedBy: {
      vehicleNumber: 'KA-03-EE-9012',
      driverName: 'Priya Nair',
      startTime: new Date(Date.now() - 110 * 60 * 1000).toISOString()
    }
  },
  {
    id: 's-006',
    code: 'P006',
    zone: 'Zone A',
    zoneName: 'Central Campus Gate',
    level: 'Ground Floor',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-A-006',
    occupiedBy: null
  },

  // Zone B - Academic Block & Library (Level 1 Covered)
  {
    id: 's-007',
    code: 'P007',
    zone: 'Zone B',
    zoneName: 'Academic Block & Library',
    level: 'Level 1 (Covered)',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-B-007',
    occupiedBy: null
  },
  {
    id: 's-008',
    code: 'P008',
    zone: 'Zone B',
    zoneName: 'Academic Block & Library',
    level: 'Level 1 (Covered)',
    type: 'EV Charging',
    status: 'occupied',
    isEV: true,
    isAccessible: false,
    qrPlacardId: 'QR-B-008',
    occupiedBy: {
      vehicleNumber: 'MH-02-BQ-8819',
      driverName: 'Arjun Das',
      startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString()
    }
  },
  {
    id: 's-009',
    code: 'P009',
    zone: 'Zone B',
    zoneName: 'Academic Block & Library',
    level: 'Level 1 (Covered)',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-B-009',
    occupiedBy: null
  },
  {
    id: 's-010',
    code: 'P010',
    zone: 'Zone B',
    zoneName: 'Academic Block & Library',
    level: 'Level 1 (Covered)',
    type: 'Accessible',
    status: 'available',
    isEV: false,
    isAccessible: true,
    qrPlacardId: 'QR-B-010',
    occupiedBy: null
  },
  {
    id: 's-011',
    code: 'P011',
    zone: 'Zone B',
    zoneName: 'Academic Block & Library',
    level: 'Level 1 (Covered)',
    type: 'Standard',
    status: 'maintenance',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-B-011',
    occupiedBy: null
  },
  {
    id: 's-012',
    code: 'P012',
    zone: 'Zone B',
    zoneName: 'Academic Block & Library',
    level: 'Level 1 (Covered)',
    type: 'Standard',
    status: 'occupied',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-B-012',
    occupiedBy: {
      vehicleNumber: 'DL-09-XY-3311',
      driverName: 'Kavita Menon',
      startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  },

  // Zone C - Engineering & Tech Hub
  {
    id: 's-013',
    code: 'P013',
    zone: 'Zone C',
    zoneName: 'Engineering & Tech Hub',
    level: 'Basement B1',
    type: 'EV Charging',
    status: 'available',
    isEV: true,
    isAccessible: false,
    qrPlacardId: 'QR-C-013',
    occupiedBy: null
  },
  {
    id: 's-014',
    code: 'P014',
    zone: 'Zone C',
    zoneName: 'Engineering & Tech Hub',
    level: 'Basement B1',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-C-014',
    occupiedBy: null
  },
  {
    id: 's-015',
    code: 'P015',
    zone: 'Zone C',
    zoneName: 'Engineering & Tech Hub',
    level: 'Basement B1',
    type: 'Standard',
    status: 'occupied',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-C-015',
    occupiedBy: {
      vehicleNumber: 'KA-51-MD-7700',
      driverName: 'Sanjay Verma',
      startTime: new Date(Date.now() - 95 * 60 * 1000).toISOString()
    }
  },
  {
    id: 's-016',
    code: 'P016',
    zone: 'Zone C',
    zoneName: 'Engineering & Tech Hub',
    level: 'Basement B1',
    type: 'Reserved',
    status: 'reserved',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-C-016',
    occupiedBy: null
  },
  {
    id: 's-017',
    code: 'P017',
    zone: 'Zone C',
    zoneName: 'Engineering & Tech Hub',
    level: 'Basement B1',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-C-017',
    occupiedBy: null
  },
  {
    id: 's-018',
    code: 'P018',
    zone: 'Zone C',
    zoneName: 'Engineering & Tech Hub',
    level: 'Basement B1',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-C-018',
    occupiedBy: null
  },

  // Zone D - Sports Complex & Auditorium
  {
    id: 's-019',
    code: 'P019',
    zone: 'Zone D',
    zoneName: 'Sports Arena & Complex',
    level: 'Open Surface Lot',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-D-019',
    occupiedBy: null
  },
  {
    id: 's-020',
    code: 'P020',
    zone: 'Zone D',
    zoneName: 'Sports Arena & Complex',
    level: 'Open Surface Lot',
    type: 'Standard',
    status: 'occupied',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-D-020',
    occupiedBy: {
      vehicleNumber: 'HR-26-AK-1102',
      driverName: 'Vikram Singh',
      startTime: new Date(Date.now() - 130 * 60 * 1000).toISOString()
    }
  },
  {
    id: 's-021',
    code: 'P021',
    zone: 'Zone D',
    zoneName: 'Sports Arena & Complex',
    level: 'Open Surface Lot',
    type: 'EV Charging',
    status: 'available',
    isEV: true,
    isAccessible: false,
    qrPlacardId: 'QR-D-021',
    occupiedBy: null
  },
  {
    id: 's-022',
    code: 'P022',
    zone: 'Zone D',
    zoneName: 'Sports Arena & Complex',
    level: 'Open Surface Lot',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-D-022',
    occupiedBy: null
  },
  {
    id: 's-023',
    code: 'P023',
    zone: 'Zone D',
    zoneName: 'Sports Arena & Complex',
    level: 'Open Surface Lot',
    type: 'Accessible',
    status: 'available',
    isEV: false,
    isAccessible: true,
    qrPlacardId: 'QR-D-023',
    occupiedBy: null
  },
  {
    id: 's-024',
    code: 'P024',
    zone: 'Zone D',
    zoneName: 'Sports Arena & Complex',
    level: 'Open Surface Lot',
    type: 'Standard',
    status: 'available',
    isEV: false,
    isAccessible: false,
    qrPlacardId: 'QR-D-024',
    occupiedBy: null
  }
];

export const INITIAL_LOCATIONS = [
  {
    id: 'loc-1',
    zone: 'Zone A',
    name: 'Central Campus Gate 1',
    address: 'Near Main Entrance & Administrative Block',
    distanceKm: 0.2,
    walkingTimeMin: 2,
    driveTimeMin: 1,
    totalSlots: 6,
    availableSlots: 4,
    tags: ['Gate 1', 'Fast QR Entry', 'EV Ready', '24/7 Security'],
    hasEV: true,
    isCovered: false,
    securityLevel: 'Guarded Booth',
    coordinates: { x: 38, y: 35 },
    rating: 4.8
  },
  {
    id: 'loc-2',
    zone: 'Zone B',
    name: 'Academic Block & Central Library',
    address: 'Library Ave, North Wing Parking Structure',
    distanceKm: 0.5,
    walkingTimeMin: 5,
    driveTimeMin: 2,
    totalSlots: 6,
    availableSlots: 3,
    tags: ['Covered Deck', 'EV Fast Charger', 'Rain Shield', 'Elevator'],
    hasEV: true,
    isCovered: true,
    securityLevel: 'Staff Monitored',
    coordinates: { x: 62, y: 28 },
    rating: 4.9
  },
  {
    id: 'loc-3',
    zone: 'Zone C',
    name: 'Engineering & Tech Hub',
    address: 'Innovation Corridor, Basement Multi-level',
    distanceKm: 0.8,
    walkingTimeMin: 8,
    driveTimeMin: 3,
    totalSlots: 6,
    availableSlots: 4,
    tags: ['Underground', 'Direct Lab Access', 'EV Level 2'],
    hasEV: true,
    isCovered: true,
    securityLevel: 'Security Patrol',
    coordinates: { x: 74, y: 64 },
    rating: 4.7
  },
  {
    id: 'loc-4',
    zone: 'Zone D',
    name: 'Sports Complex & Auditorium Arena',
    address: 'Athletics Ground & Convention Hall Outer Perimeter',
    distanceKm: 1.2,
    walkingTimeMin: 12,
    driveTimeMin: 4,
    totalSlots: 6,
    availableSlots: 5,
    tags: ['Open Surface', 'High Clearance', 'Event Overflow'],
    hasEV: true,
    isCovered: false,
    securityLevel: 'Patrolled Lot',
    coordinates: { x: 25, y: 72 },
    rating: 4.5
  },
  {
    id: 'loc-5',
    zone: 'Zone E',
    name: 'Medical Science Wing & Health Center',
    address: 'Emergency Response Route & Clinical OPD Bay',
    distanceKm: 1.6,
    walkingTimeMin: 16,
    driveTimeMin: 5,
    totalSlots: 8,
    availableSlots: 2,
    tags: ['Emergency Priority', 'Wheelchair Ramps', 'Rapid Access'],
    hasEV: false,
    isCovered: true,
    securityLevel: '24/7 Gate Guard',
    coordinates: { x: 48, y: 82 },
    rating: 4.9
  }
];

export const INITIAL_VIOLATIONS = [
  {
    id: 'VIO-2026-101',
    category: 'Unauthorized Parking',
    vehicleNumber: 'KA-05-MB-7712',
    zone: 'Zone A',
    slotId: 'P003',
    description: 'Vehicle parked in reserved accessible/handicap parking space without valid disability placard or campus permit.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    status: 'pending', // pending | investigating | warning_issued | resolved | dismissed
    urgency: 'high',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    reporterName: 'Alex Mercer (Driver)',
    reporterId: 'user-001',
    adminNotes: 'Officer assigned for physical verification.'
  },
  {
    id: 'VIO-2026-102',
    category: 'Wrong Parking',
    vehicleNumber: 'DL-08-CZ-9912',
    zone: 'Zone B',
    slotId: 'P008',
    description: 'Sedan parked diagonally across two marked parking bays (P008 and P009), blocking adjacent vehicle entry.',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80',
    status: 'investigating',
    urgency: 'medium',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    reporterName: 'Priya Nair (Driver)',
    reporterId: 'user-003',
    adminNotes: 'Warning notice issued on windshield. Towing standby.'
  },
  {
    id: 'VIO-2026-103',
    category: 'Blocked Parking',
    vehicleNumber: 'MH-12-PQ-4455',
    zone: 'Zone C',
    slotId: 'Entry Way',
    description: 'Commercial delivery van stopped right across the basement ramp emergency egress, obstructing fire lane.',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    status: 'warning_issued',
    urgency: 'critical',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    reporterName: 'Campus Security Guard',
    reporterId: 'user-sec-01',
    adminNotes: 'Official warning notice placed on vehicle windshield.'
  },
  {
    id: 'VIO-2026-104',
    category: 'Unauthorized Parking',
    vehicleNumber: 'KA-01-EE-3211',
    zone: 'Zone D',
    slotId: 'P020',
    description: 'Parked in EV-only charging spot without plugging in or actively charging vehicle.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    status: 'resolved',
    urgency: 'low',
    timestamp: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    reporterName: 'Rahul Verma',
    reporterId: 'user-004',
    adminNotes: 'Driver moved vehicle within 10 minutes following notification.'
  }
];

export const INITIAL_USER = {
  id: 'usr-driver-01',
  name: 'Alex Mercer',
  email: 'alex.mercer@campus.edu',
  role: 'user', // 'user' | 'admin'
  vehicleNumber: 'KA-03-HA-8820',
  vehicleModel: 'Honda City (Silver)',
  phone: '+91 98765 43210',
  joinedDate: 'Oct 2024'
};

export const INITIAL_ADMIN = {
  id: 'usr-admin-01',
  name: 'Officer Dave Matthews',
  email: 'dave.admin@parkpulse.io',
  role: 'admin',
  badgeId: 'PP-OFFICER-704',
  department: 'Campus Security & Traffic Control',
  phone: '+91 98450 11223',
  joinedDate: 'Jan 2023'
};

export const INITIAL_ACTIVITY = [
  {
    id: 'act-1',
    type: 'session_completed',
    slotCode: 'P007',
    zone: 'Zone B',
    vehicleNumber: 'KA-03-HA-8820',
    startTime: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    durationMin: 120,
    status: 'Completed & Checked Out'
  },
  {
    id: 'act-2',
    type: 'violation_reported',
    violationId: 'VIO-2026-101',
    category: 'Unauthorized Parking',
    slotCode: 'P003',
    time: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'Under Review'
  },
  {
    id: 'act-3',
    type: 'session_completed',
    slotCode: 'P001',
    zone: 'Zone A',
    vehicleNumber: 'KA-03-HA-8820',
    startTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(),
    durationMin: 90,
    status: 'Completed & Checked Out'
  }
];

// System Event / Audit Logs
export const INITIAL_SYSTEM_LOGS = [
  { id: 'log-1', time: '12:28:44', level: 'info', message: 'Driver check-in confirmed via QR placard at Slot P004.', source: 'QR-Service' },
  { id: 'log-2', time: '12:25:10', level: 'success', message: 'Vehicle KA-03-EE-9012 started session at Slot P005.', source: 'Session-Manager' },
  { id: 'log-3', time: '12:20:02', level: 'warning', message: 'Slot P011 marked for maintenance by Admin Dave.', source: 'Admin-Console' },
  { id: 'log-4', time: '12:15:33', level: 'info', message: 'Cloud database synchronized: 17 slots available campus-wide.', source: 'Cloud-Sync' }
];
