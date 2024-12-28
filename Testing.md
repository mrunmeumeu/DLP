# Testing Component

**File Path:** `src/Listing/Testing.js`

## **Purpose**
The `Testing` component serves as the main dashboard for the admin to monitor and analyze the security posture of the connected devices. It provides:
- A comprehensive view of security stats (e.g., USB blocking, clipboard monitoring, etc.).
- Real-time system performance metrics (CPU, RAM usage).
- Graphs for tracking policy violations and client connections.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **`Sidebar`**
   - **Path:** `src/Listing/Sidebar.js`
   - **Purpose:** Displays the navigation menu for switching between pages.

2. **`LineGraph`**
   - **Path:** `src/Listing/LineGraph.js`
   - **Purpose:** Visualizes cumulative policy violations over time using Firebase logs.

3. **`BarChart`**
   - **Path:** `src/Listing/UsbChart.js`
   - **Purpose:** Displays the proportion of USBs blocked and not blocked.

4. **`SafetyPercentage`**
   - **Path:** `src/Listing/SafetyPercentage.js`
   - **Purpose:** Visualizes the percentage of connected clients.

5. **`SystemStatus`**
   - **Path:** `src/Listing/Stats.js`
   - **Purpose:** Shows real-time system performance metrics (CPU and RAM usage).

6. **Firebase**
   - **Path:** `src/firebase.js`
   - **Purpose:** Initializes Firebase and provides database access.

7. **CSS Modules**
   - **File:** `Listing.module.css`
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
  - Node: `logs`
  - Purpose: Retrieves logs for policy violations.
- **USB Attempts:**
  - Node: `usb_attempts`
  - Purpose: Retrieves the status of USB blocking for connected devices.

### **Server (Flask)**
The component makes an API call to the Flask server:
- **Endpoint:** `http://localhost:5000/scan-network`
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
