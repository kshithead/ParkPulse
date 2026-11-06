# ParkPulse 🚗⚡
### Cloud-Based Smart Parking Availability & Violation Reporting System
*A modern, responsive, pure software & QR-driven smart parking prototype designed for college minor projects.*

---

## 📌 Project Overview
**ParkPulse** is a software-driven smart parking management and community enforcement platform. 

Instead of relying on costly physical sensors or payment gateways, ParkPulse adopts a clean **Campus QR Check-In & Enforcement Architecture**:
1. **Printed QR Placards**: Each campus parking bay features a unique QR code placard (`P001`, `P002`, etc.).
2. **Instant Check-In**: Drivers scan the QR code with their mobile device or enter the bay code to begin their parking session, immediately marking the slot as **Occupied** in the central cloud database.
3. **Check-Out & Bay Release**: When departing, drivers tap "End Parking", which tracks their session duration and immediately releases the bay back to **Available** for other campus drivers.
4. **Community Violation Reporting**: Drivers and security guards report unauthorized, double-parked, or blocked vehicles with photo evidence and license plate tracking for rapid security notice dispatch and towing.

**No physical IoT sensors, payment gateways, or monetary fines are required.**

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | JavaScript (ESNext) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **State & Persistence** | React Context API + LocalStorage Synchronization |
| **Architecture** | Service-oriented abstraction layer (`src/services/api.js`) |

---

## 🌟 Key Features & Pages

### 1. 🌐 Landing Page (`/`)
- Commercial SaaS homepage aesthetic with dark styling and clean typography.
- Explains the pure QR software model for campus parking.
- Real-time stats ticker displaying available bays, occupancy percentage, and active reports.
- Interactive live slot preview card showcasing real-time bay availability.

### 2. 🔐 Authentication (`/login` & `/register`)
- Dual persona support: **Student / Driver** vs. **Campus Admin / Security Officer**.
- **1-Click Instant Demo Login Buttons**:
  - *Driver Demo (Alex Mercer)*
  - *Admin Demo (Officer Dave Matthews)*
- Registration form with vehicle make/model and **live Indian license plate badge preview (`[IND] KA-05-EV-2026`)**.
- Local state authentication with `localStorage` persistence.

### 3. 📊 User Dashboard (`/dashboard`)
- KPI Stat Cards: Total Slots, Available Slots (Green), Occupied Slots (Red), and Active Sessions.
- **Active Parking Session Card**: Real-time ticking elapsed timer, slot information, and instant checkout/release trigger.
- **Campus Floor & Slot Visualizer**: Interactive slot grid filtered by zone (Zone A, B, C, D) and bay status (Available, Occupied, EV Charging). Clicking any available slot lets drivers park immediately.
- Recent parking activity timeline (past sessions and reported violations).

### 4. 📱 QR Parking & Metering (`/qr-parking`)
- **Camera QR Scanner Viewfinder**: Animated laser scan bar, corner brackets, and simulated camera optical detection.
- **Manual QR Code Entry**: Demonstration presets for instant testing (`P001`, `P002`, `P003`, `P004`, `P007`, `P013`).
- **Slot Information Inspection Card**:
  - Bay code, zone, floor level, bay type (Standard, EV, Accessible).
- **Start Parking**: Drivers enter or confirm their vehicle number; slot dynamically turns Occupied across the entire app!
- **End Parking**: Generates an itemized summary modal with elapsed duration. Marks the slot back to Available immediately.

### 5. 📍 Nearby Parking & Geospatial Map (`/nearby`)
- **Interactive Smart Campus Radar Map**: Visually appealing SVG map with interactive pins for 5 strategic parking zones, hover tooltips, and layer filters (All, &ge;3 Free Slots, EV Ready).
- **Parking Facility Cards**: Displays zone, address, distance (km), walking/driving minutes, available vs. total bays.
- **Simulated Turn-by-Turn Route Preview**: Step-by-step campus driving route modal with security checkpoint guidance.

### 6. 🚨 Violation Reporting (`/report-violation`)
- Categories:
  - *Unauthorized Parking* (no permit / permit expired)
  - *Wrong Parking* (straddling lines, double parking)
  - *Blocked Parking* (blocking driveway or emergency fire hydrant)
  - *Expired Meter*
  - *Reserved / Accessible Space Infringement*
- Offending vehicle plate input with live formatted license plate badge.
- Campus zone and specific bay selector.
- Photo evidence upload with drag-and-drop, file picker, and 3 quick demo preset violation photos.
- **Live Sync with Admin**: Submitted reports generate unique Case IDs (e.g. `VIO-2026-894`) and appear instantly on the Admin Dashboard!

### 7. 🛡️ Admin Operations Console (`/admin`)
- **Overview Statistics**: Facility capacity, live occupancy percentage bar, active parking sessions, and pending violations alert count.
- **Slot Management**: Zone filter, status filter, manual override controls (toggle slot Available &harr; Occupied &harr; Maintenance), and an **Add New Slot** modal.
- **Session Management**: Live table of all currently parked vehicles, start times, driver names, and "Release Bay" capability.
- **Violation Reports Management**: Adjudicate reports with status updates:
  - *Verify Incident* (moves to Investigating)
  - *Issue Warning Notice* (issues formal notice to vehicle)
  - *Mark as Resolved*
  - *Dismiss*
- **System Audit Logs**: Real-time event log feed tracking all check-ins, check-outs, and security overrides.

---

## 🚀 Installation & Execution

### 1. Run Development Server
```bash
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

### 2. Build for Production (Optional)
```bash
npm run build
npm run preview
```

---

## 📄 License
Developed for academic minor project evaluation.
