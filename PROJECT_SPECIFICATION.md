# ParkPulse – Complete Technical & Architectural Project Specification
## Cloud-Based Smart Parking Availability & Violation Reporting System

> **Document Type:** Comprehensive Project Specification, SRS & Architectural Reference  
> **Target Audience:** Project Evaluators, College Viva Committees, LLM/Report Generation Agents  
> **Project Category:** College Minor Project (Semester 5 / S5 Computer Science & Engineering)  
> **Current Version:** 2.1 (Pure Software & QR Architecture, Free Campus Access, No Payments or Fines)

---

## 1. Executive Summary & Problem Formulation

### 1.1 Project Title & Metadata
- **Project Title:** ParkPulse
- **Full Name:** Cloud-Based Smart Parking Availability & Violation Reporting System
- **Domain:** Smart Cities, Campus Automation, Cloud Computing, Web Engineering
- **Architecture Model:** Software-as-a-Service (SaaS), Serverless-Ready Cloud Single-Page Application (SPA)

### 1.2 The Real-World Problem Statement
University campuses, research institutes, and commercial technology hubs encounter acute vehicle congestion and space misallocation:
1. **Blind Parking Hunting:** Drivers circle lots looking for vacant spaces, creating localized congestion, increasing carbon emissions, and causing class/work delays.
2. **Erratic & Unauthorized Parking:** Vehicles park diagonally across two marked bays, block critical emergency driveways and fire hydrants, or occupy reserved spaces (e.g., handicap or faculty slots) without authorization.
3. **No Expensive Hardware or Payment Gates:** Campus parking is typically permit-based or free for authorized students and faculty. Implementing payment gateways, wallet transactions, and monetary fines introduces unnecessary commercial friction and legal overhead for an academic institution.
4. **Lack of Community Enforcement:** Campus security cannot patrol every bay 24/7. There is no streamlined channel for students and staff to report infractions with verifiable photographic evidence.

### 1.3 The ParkPulse Solution
ParkPulse adopts a **Touchless QR Placard & Cloud Database Architecture** paired with **Community-Driven Violation Enforcement**:
- Every parking bay features a permanent weather-resistant QR placard.
- Drivers scan or enter the slot code upon arrival, locking the slot as **Occupied** in real time.
- Drivers conclude parking via their smartphone upon departure, tracking duration and releasing the slot back to **Available**.
- Students, faculty, and security personnel report parking violations with photo evidence and vehicle plate tracking, feeding directly into a centralized Security Operations Console for warning notices or vehicle towing.

---

## 2. Core Operational Mechanisms & Workflows

### 2.1 The QR Check-In & Check-Out Mechanism
```
+---------------+      Scans Bay QR Code      +--------------------+
|               | --------------------------> |  Slot Information  |
| Campus Driver |                             |  Inspection View   |
|               | <-------------------------- |  (Zone, Level)     |
+---------------+                             +--------------------+
       |                                                |
       | Confirms License Plate                         | Validates Status == 'available'
       v                                                v
+-----------------------------+               +--------------------+
|  Session Initiated          | ------------> | Slot Status Set    |
|  - Start Timestamp Recorded |               | to 'occupied' in   |
|  - Real-Time Stopwatch Runs |               | Central Database   |
+-----------------------------+               +--------------------+
       |
       | Driver taps "End Parking & Vacate"
       v
+-----------------------------+               +--------------------+
|  Checkout & Release Engine  | ------------> | Slot Status Reset  |
|  - Computes Elapsed Minutes |               | to 'available' for |
|  - Releases Parking Bay     |               | Next Campus Driver |
|  - Stores Audit Receipt     |               +--------------------+
+-----------------------------+
```

1. **Placard Identification:** Each parking bay is assigned a unique alphanumeric code (`P001` to `P024`) and a corresponding QR identifier (`QR-A-001`).
2. **Occupancy Transition:** When a driver initiates a session, the slot state transitions atomically from `available` to `occupied`, associating the driver's vehicle registration plate and start timestamp.
3. **Session Duration Tracking:** The client computes the active session duration dynamically:
   $$\text{Duration (min)} = \max\left(1, \left\lceil \frac{T_{\text{now}} - T_{\text{start}}}{60000} \right\rceil\right)$$
4. **Release & Vacate:** On ending the session, the bay returns to `available`, and an audit record is stored in the session history.

### 2.2 Community Violation Reporting Mechanism
```
+--------------------+        Uploads Photo Evidence        +------------------------+
| Student / Guard    | -----------------------------------> | Violation Filing Engine|
| Spots Infraction   |        Inputs Offending Plate        | - Validates Plate      |
+--------------------+                                      | - Assigns Case ID      |
                                                            +------------------------+
                                                                        |
                                                                        v
+------------------------+      Officer Changes Status      +------------------------+
| Action Dispatch:       | <------------------------------- | Admin Adjudication:    |
| - Warning Notice Sent  |                                  | - Verify Incident      |
| - Vehicle Towed/Clamp  |                                  | - Issue Formal Warning |
| - Marked Resolved      |                                  | - Dismiss False Alarm  |
+------------------------+                                  +------------------------+
```

1. **Incident Intake:** User captures photographic evidence (or uploads a file) and provides the offending vehicle plate, category, campus zone, and urgency level.
2. **Case ID Generation:** The system issues a unique tracking ID (`VIO-2026-XXXX`).
3. **Centralized Adjudication:** The report immediately appears in the Admin Console with full image preview.
4. **Enforcement State Machine:**
   $$\text{pending} \longrightarrow \text{investigating} \longrightarrow \text{warning\_issued} \longrightarrow \text{resolved}$$
   $$( \text{or } \text{dismissed} )$$

---

## 3. Technology Stack & Technical Specifications

| Component | Technology | Version | Purpose in ParkPulse |
|---|---|---|---|
| **Frontend Framework** | React.js | 19.3.1 | Component-based dynamic rendering and virtual DOM |
| **Build Tool & Bundler** | Vite | 8.3.6 | Hot Module Replacement (HMR) and optimized ES build |
| **CSS Framework** | Tailwind CSS | 3.4.17 | Utility-first responsive design, custom palettes |
| **Icons Library** | Lucide React | Latest | Semantic vector iconography |
| **Routing Engine** | React Router DOM | Latest (v7) | Declarative single-page routing and URL parameter handling |
| **State Synchronization**| React Context + LocalStorage | Native | Global reactive state with browser persistence |
| **API Client Abstraction**| Modular ES Services (`api.js`)| Native | Decoupled client layer mapped to REST endpoints |

---

## 4. Complete Data Models & Database Schemas

### 4.1 Parking Slot Entity (`ParkingSlot`)
```json
{
  "id": "s-001",
  "code": "P001",
  "zone": "Zone A",
  "zoneName": "Central Campus Gate",
  "level": "Ground Floor",
  "type": "Standard",
  "status": "available",
  "isEV": false,
  "isAccessible": false,
  "qrPlacardId": "QR-A-001",
  "occupiedBy": null
}
```

### 4.2 Parking Session Entity (`ParkingSession`)
```json
{
  "sessionId": "sess_1730800000000",
  "slotId": "s-001",
  "slotCode": "P001",
  "vehicleNumber": "KA-03-HA-8820",
  "driverName": "Alex Mercer",
  "zone": "Zone A",
  "startTime": "2026-11-05T12:00:00.000Z",
  "endTime": "2026-11-05T13:30:00.000Z",
  "durationMin": 90,
  "status": "completed"
}
```

### 4.3 Violation Report Entity (`ViolationReport`)
```json
{
  "id": "VIO-2026-101",
  "category": "Unauthorized Parking",
  "vehicleNumber": "KA-05-MB-7712",
  "zone": "Zone A",
  "slotId": "P003",
  "description": "Vehicle parked in reserved accessible space without valid permit.",
  "imageUrl": "https://images.unsplash.com/...",
  "status": "pending",
  "urgency": "high",
  "timestamp": "2026-11-05T11:45:00.000Z",
  "reporterName": "Alex Mercer (Driver)",
  "reporterId": "usr-001",
  "adminNotes": "Officer assigned for physical verification."
}
```

### 4.4 Campus Zone / Location Entity (`ParkingLocation`)
```json
{
  "id": "loc-1",
  "zone": "Zone A",
  "name": "Central Campus Gate 1",
  "address": "Near Main Entrance & Administrative Block",
  "distanceKm": 0.2,
  "walkingTimeMin": 2,
  "driveTimeMin": 1,
  "totalSlots": 6,
  "availableSlots": 4,
  "tags": ["Gate 1", "Fast QR Entry", "EV Ready", "24/7 Security"],
  "hasEV": true,
  "isCovered": false,
  "securityLevel": "Guarded Booth",
  "coordinates": { "x": 38, "y": 35 },
  "rating": 4.8
}
```

---

## 5. Architectural Modules & File Breakdown

### 5.1 Presentation Layer (`src/pages/`)
1. **`LandingPage.jsx`**: Marketing front-door featuring commercial dark SaaS theme, interactive live slot visualizer, real-time metrics ticker, feature highlights, and direct CTAs.
2. **`LoginPage.jsx`**: Persona authentication with 1-click evaluation shortcuts (`Driver Demo` & `Admin Demo`) and custom form validation.
3. **`RegisterPage.jsx`**: User registration with real-time Indian vehicle license plate preview component.
4. **`UserDashboard.jsx`**: Driver command center featuring KPI cards, interactive 24-bay campus grid visualizer, active session alert, and past parking history.
5. **`QRParkingPage.jsx`**: Optical scanner viewfinder with animated laser scan bar, manual entry with clickable demonstration chips (`P001`, `P002`, `P003`, etc.), bay inspection, and Start/End parking lifecycle.
6. **`NearbyParkingPage.jsx`**: Geospatial campus map rendered via custom SVG with interactive pins, tooltips, facility cards, and simulated turn-by-turn routing modal.
7. **`ViolationReportPage.jsx`**: Citizen reporting form supporting 5 violation categories, photo upload, quick description chips, and submitted reports registry.
8. **`AdminDashboard.jsx`**: Centralized security console featuring capacity distribution bars, bay status manual overrides, active session force-checkout, violation warning adjudication, and transaction audit logs.

### 5.2 Service & State Layer (`src/context/` & `src/services/`)
- **`ParkingContext.jsx`**: Reactive state store managing slots, active sessions, violations, locations, and audit logs with bidirectional `localStorage` synchronization.
- **`AuthContext.jsx`**: Handles authentication state, driver vs. admin role privileges, and demo profiles.
- **`services/api.js`**: Abstracted asynchronous API client designed to swap effortlessly between LocalStorage and AWS API Gateway endpoints.

---

## 6. College Viva & Technical Defense Guide (Q&A)

### Q1: Why is there no payment or fine gateway?
**Answer:** Campus parking for educational institutions is provided as part of campus infrastructure for students, faculty, and visitors. Incorporating payment gateways and financial fines creates unnecessary legal complications, merchant account overhead, and transaction disputes for an academic project. Instead, ParkPulse enforces compliance through **Security Warning Notices**, **Wheel Clamping**, and **Towing Dispatch**.

### Q2: Why pure software and QR codes instead of physical IoT sensors?
**Answer:** Physical IoT sensors (e.g., ultrasonic or magnetometer sensors connected to ESP32/Arduino) introduce significant real-world failure points: high hardware cost per bay, battery depletion, wiring maintenance, weather vulnerability, and calibration drift. Commercial parking systems rely on software-based QR check-in because it scales to thousands of bays with zero hardware cost, works on any smartphone, and leverages community verification.

### Q3: How do you catch someone who parks without scanning the QR code?
**Answer:** Through a dual verification model:
1. **Community & Guard Reporting:** Any student, driver, or campus parking attendant can report an unscanned vehicle via the Violation Reporting feature.
2. **Visual ANPR / Bay Checks:** Guards can view the live floor visualizer on their mobile device. If bay `P004` has a car physically parked in it but displays as green (`Available`) on the dashboard, the guard immediately knows the driver failed to check in and issues a violation notice.

### Q4: How is data persisted in the prototype?
**Answer:** Using a synchronized combination of the React Context API and the browser's `localStorage` API. Any changes made (e.g., parking in a slot, filing a violation, or updating a status in Admin) persist across page reloads and browser restarts. A "Reset Data" button is also provided to restore pristine defaults at any point during demonstration.
