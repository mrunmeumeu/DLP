# Testing Component

**File Path:** [`src/Testing/Testing.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/Testing.jsx)

## **Purpose**
The `Testing` component serves as the main dashboard for the admin to monitor and analyze the security posture of the connected devices. It provides:
- A comprehensive view of security stats (e.g., USB blocking, clipboard monitoring, etc.).
- Real-time system performance metrics (CPU, RAM usage).
- Graphs for tracking policy violations and client connections.

---

## **Imported Dependencies**
Below are the imported components and their purposes, all located within the `Testing` directory:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/Sidebar.jsx)**
   - **Purpose:** Displays the navigation menu for switching between pages.

2. **[`LineGraph`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/LineGraph.jsx)**
   - **Purpose:** Visualizes cumulative policy violations over time using Firebase logs.

3. **[`BarChart`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/UsbChart.jsx)**
   - **Purpose:** Displays the proportion of USBs blocked and not blocked.

4. **[`SafetyPercentage`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/SafetyPercentage.jsx)**
   - **Purpose:** Visualizes the percentage of connected clients.

5. **[`SystemStatus`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/Stats.jsx)**
   - **Purpose:** Shows real-time system performance metrics (CPU and RAM usage).

6. **[`Firebase`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/firebase.js)**
   - **Purpose:** Initializes Firebase and provides database access.

7. **CSS Modules**
   - **File:** [`Testing.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/Testing.module.css)
   - **Purpose:** Provides styles for the `Testing` component.

---

## **Features**
- Displays key security metrics, including:
  - USB blocking status.
  - Clipboard monitoring status.
  - Screenshot blocking status.
- Provides visual insights through:
  - Line graph of cumulative policy violations.
  - Bar chart of USB blocking statistics.
  - Safety percentage doughnut chart.
- Real-time CPU and RAM usage monitoring.
- Fetches client connection statuses dynamically.

---

## **Communication**
### **Firebase**
The `Testing` component interacts with Firebase to fetch and display the following data:
- **Logs:**
  - **Node:** `logs`
  - **Purpose:** Retrieves logs for policy violations.
- **USB Attempts:**
  - **Node:** `usb_attempts`
  - **Purpose:** Retrieves the status of USB blocking for connected devices.

### **Server (Flask)**
The component makes an API call to the Flask server:
- **Endpoint:** [`http://localhost:5000/scan-network`](http://localhost:5000/scan-network)
- **Purpose:** Fetches the list of connected clients and their statuses.
- **Response Structure:**
  ```json
  [
    {
      "device_id": "Device001",
      "ip": "192.168.0.1",
      "status": "Connected"
    },
    ...
  ]
