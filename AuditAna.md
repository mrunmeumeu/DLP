# Audit Analysis Component

**File Path:** [`./AuditPage/DataAnalyse.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/AuditPage/DataAnalyse.jsx)

---

## **Purpose**
The `AuditAna` component provides an overview of client violations, including:
- Displaying a list of clients with the total number of policy violations.
- Allowing further analysis of individual client violations.
- Aggregating data from various sources such as clipboard logs, screenshot violations, USB attempts, and executable monitoring.

---

## **Imported Dependencies**

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/AuditPage/Sidebar.jsx)**
   - **Purpose:** Navigation menu for switching between application pages.

2. **[`AuditPage`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/AuditPage/AuditAnalysis.jsx)**
   - **Purpose:** Displays a table of client violations with a breakdown of counts for different types of policy violations.

3. **CSS Modules**
   - **File:** [`Listing.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/AuditPage/Listing.module.css)
   - **Purpose:** Styles the `AuditAna` component and its child components.

---

## **Features**

### **1. Violation Overview**
- Lists all clients with:
  - Total violations committed.
  - Types of violations (e.g., clipboard, screenshot, USB, and executable monitoring).

### **2. Client Analysis**
- Includes a dedicated "Analyse" button for each client to view detailed violation data.

### **3. Firebase Integration**
- Retrieves and aggregates logs from Firebase:
  - `logs`: Clipboard and screenshot violations.
  - `usb_attempts`: USB-related violations.
  - `executable_monitoring`: Executable monitoring violations.

### **4. Dynamic Data Fetching**
- Fetches and displays data dynamically as the Firebase database is updated.

---

## **Component Details**

### **AuditPage**
- **Path:** [`./AuditPage/AuditAnalysis.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/AuditPage/AuditAnalysis.jsx)
- **Purpose:**
  - Fetches and processes client violations from Firebase.
  - Displays a table with the following columns:
    - **Sr No:** Serial number of the client.
    - **Username:** Name of the client.
    - **Total Violations:** Total number of violations committed.
    - **Analyse:** Button to view detailed data.

- **Firebase Data Nodes:**
  - `logs`
  - `usb_attempts`
  - `executable_monitoring`

### **Sidebar**
- **Path:** [`./AuditPage/Sidebar.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/AuditPage/Sidebar.jsx)
- **Purpose:** Provides navigation links to other application features, including:
  - Dashboard
  - USB Monitoring
  - Keyword Management
  - Reports and Analysis
  - Encryption

---

## **Firebase Integration**

### **Violation Sources**
The component integrates with Firebase to fetch violations from multiple nodes:

1. **Logs**
   - **Node:** `logs`
   - **Purpose:** Tracks clipboard and screenshot violations.

2. **USB Attempts**
   - **Node:** `usb_attempts`
   - **Purpose:** Logs unauthorized USB activities.

3. **Executable Monitoring**
   - **Node:** `executable_monitoring`
   - **Purpose:** Monitors violations related to unauthorized executable files.

### **Data Structure**
```json
{
  "logs": {
    "log1": {
      "username": "client1",
      "event_description": "Clipboard Violation",
      "timestamp": "2024-12-28T10:00:00Z"
    },
    ...
  },
  "usb_attempts": {
    "logxyz": {
      "user": "client1",
      "event_description": "USB Violation",
      "timestamp": "2024-12-28T11:00:00Z"
    },
    ...
  },
  "executable_monitoring": {
    "logxyzs": {
      "user": "client1",
      "event_description": "Executable Monitoring Violation",
      "timestamp": "2024-12-28T12:00:00Z"
    },
    ...
  }
}
