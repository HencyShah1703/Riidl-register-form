# RIIDL Visitor Registration & Attendance System

An end-to-end web application designed to manage and track visitor check-ins, attendance logs, and detailed visitor demographics/analytics for RIIDL.

---

## 🏗️ Architecture Overview

The project is structured as a decoupled monorepo containing a frontend client and a backend API server.

```
Riidl-register-form/
├── frontend/     # Single Page Application (SPA) client
└── backend/      # REST API server & database layers
```

### 1. Frontend Architecture
*   **Framework & Build Tool:** React 19 built with Vite.
*   **Styling:** Utility-first CSS using Tailwind CSS.
*   **State & Routing:** Component-driven local state management syncing URL history paths (`/visitor-entry`, `/visitor-analytics`, `/detailed-analytics`) to map routes dynamically.
*   **Visualizations:** Interactive charts and dashboard metrics powered by Recharts.
*   **File Exports:** Exporting functionality utilizing `xlsx`, `jspdf`, and `html2canvas` for reporting data.

### 2. Backend Architecture
*   **Runtime:** Node.js using ES Modules (`import`/`export`).
*   **Framework:** Express.js API framework.
*   **Database:** MongoDB mapped with Mongoose ODM schemas.
*   **Schema Indexing:** Configured optimizations on database query fields (e.g. `timestamp`, `visitor`, `location` indexes) to support fast analytics processing.
*   **Data Models:** 
    *   `Visitor`: Stores persistent user profiles (Name, Email, Phone, College, Role).
    *   `Attendance`: Logs individual check-in instances (Purpose, Location, Timestamp, Host/Person to meet).

---

## 🛡️ Implemented Security Features

To ensure production-readiness, the following security measures are configured within the application:

### 1. Secure HTTP Headers (Helmet)
*   Integrates **Helmet** middleware to secure Express-served headers.
*   Mitigates common attack vectors such as Cross-Site Scripting (XSS), Clickjacking, MIME type sniffing, and HTTP Strict Transport Security (HSTS) enforcement.

### 2. Request Rate Limiting
*   Employs `express-rate-limit` to restrict client request thresholds.
*   Capped at a maximum of **50 requests per minute per IP address**.
*   Prevents brute-force endpoint attacks (like scanning visitor database profiles via phone queries) and guards against Denial of Service (DoS) floods.

### 3. Configurable CORS Policies
*   Binds the Cross-Origin Resource Sharing (CORS) whitelist to the server's environment.
*   Retrieves allowed sources from the `FRONTEND_URL` environment variable, falling back to a developmental wildcard `*` only if undefined.

### 4. Database Connection Resiliency
*   Reconnection handler monitors and recovers from MongoDB connection states (`disconnected`, `reconnected`, `error`).
*   Instead of crashing the server on boot (via `process.exit(1)`), the server remains alive, logs warnings using `console.error`, and attempts automatic reconnection loops every 5 seconds.

### 5. Dynamic API Binding
*   Client endpoints rely on `import.meta.env.VITE_API_URL` instead of hardcoded addresses, keeping the deployment architecture customizable and isolated.

---

## ⚙️ Environment Configuration

Refer to the respective environment templates in the subdirectories:

*   **Backend:** Configured in [**`backend/.env.example`**](file:///c:/Users/hency/Documents/GitHub/Riidl-register-form/backend/.env.example) (`PORT`, `MONGO_URI`, `NODE_ENV`, `FRONTEND_URL`).
*   **Frontend:** Configured in [**`frontend/.env.example`**](file:///c:/Users/hency/Documents/GitHub/Riidl-register-form/frontend/.env.example) (`VITE_API_URL`).