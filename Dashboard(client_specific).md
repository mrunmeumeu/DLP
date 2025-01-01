# Dashboard Component

**File Path:** [`src/Listing/Dashboard/VulnerabilityAssessment.js`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Dashboard/VulnerabilityAssessment.js)

## **Purpose**
The `Dashboard` component provides detailed information about a specific client, such as:
- Device name
- Windows version
- IP address
- Other client-specific details

This component is dynamically generated based on the client's IP address, making it a versatile tool for client-specific monitoring and management.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Dashboard/Sidebar.jsx)**
   - **Purpose:** Displays a dynamic navigation menu with links tailored to the selected client's IP address.

2. **[`MainContent`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Dashboard/MainContent.jsx)**
   - **Purpose:** Retrieves and displays detailed information about the client, such as system stats and configuration.

3. **CSS Modules**
   - **File:** [`VulnerabilityAssessment.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Dashboard/VulnerabilityAssessment.module.css)
   - **Purpose:** Provides styles for the `Dashboard` component and its child components.

---

## **Features**
1. **Dynamic Sidebar Navigation:**
   - Menu links adapt based on the client's IP address.
   - Links to features like USB Monitoring, Keyword Management, Executable Monitoring, and Vulnerability Assessments for the selected client.

2. **Client Information Display:**
   - Fetches client-specific details from the backend.
   - Displays the data in an organized table format.

3. **Go to Dashboard Button:**
   - Redirects the admin to the main dashboard view.

---

## **Communication**

### **Server Communication**
The `MainContent` component interacts with the backend server (Flask API) to fetch data for the selected client:

1. **Fetching Client Details:**
   - **Endpoint:** [`http://localhost:5000/client/:ip`](http://localhost:5000/client/:ip)
   - **Purpose:** Retrieves detailed information about the client, including:
     - Device name
     - Windows version
     - Security configurations
   - **Response Structure:**
     ```json
     {
       "device_name": "Device001",
       "windows_version": "Windows 10",
       "ip": "192.168.0.1",
       "status": "Connected",
       ...
     }
     ```

2. **Redirect Functionality:**
   - **Purpose:** Provides a button for navigating back to the main admin dashboard.

---

## **Component Features**

### **1. Sidebar**
- Provides navigation options based on the selected client's IP.
- Links to:
  - Dashboard
  - USB Monitoring
  - Keyword Management
  - Executable Monitoring
  - Vulnerability Scans

### **2. Client Information Table**
- Displays detailed information about the client in a clean table format.

### **3. Go to Dashboard Button**
- Redirects the admin to the main dashboard for an overview of all clients.

---



This documentation provides a comprehensive overview of the **Dashboard** component, including its features, structure, and communication with the backend.

