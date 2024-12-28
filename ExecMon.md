# ExecMon Component

**File Path:** [`src/monitoring/Executable.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/monitoring/Executable.jsx)

## **Purpose**
The `ExecMon` component is designed to monitor and control the execution of unauthorized or suspicious applications on client devices. This component allows admins to:
- Enable executable monitoring for specific clients.
- Disable executable monitoring for specific clients.
- Record the authorization details of the action.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/monitoring/Sidebar.jsx)**
   - **Purpose:** Provides navigation options for various monitoring and administrative features.

2. **[`MainContent`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/monitoring/MainContent.jsx)**
   - **Purpose:** Contains the core functionality for managing executable monitoring, including:
     - Client selection.
     - Enabling/disabling monitoring.
     - Authorization input.

3. **CSS Modules**
   - **File:** [`VulnerabilityAssessment.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/monitoring/VulnerabilityAssessment.module.css)
   - **Purpose:** Provides styles for the `ExecMon` component and its child components.

---

## **Features**

### **1. Executable Monitoring**
- Enables monitoring for unauthorized applications on selected clients.
- Disables monitoring for clients when necessary.

### **2. Authorization Control**
- Allows admins to record the name of the person authorizing the action.

### **3. Client Selection**
- Admins can select multiple clients from a dynamically loaded list.

---

## **Communication**

### **Server Communication**
The component communicates with the Flask backend to perform the following actions:

1. **Fetch Clients:**
   - **Endpoint:** [`http://localhost:5000/scan-network`](http://localhost:5000/scan-network)
   - **Purpose:** Retrieves the list of connected clients.
   - **Response Structure:**
     ```json
     [
       {
         "ip": "192.168.0.1",
         "user_name": "Client1"
       },
       ...
     ]
     ```

2. **Enable Executable Monitoring:**
   - **Endpoint:** [`http://localhost:5000/enable-executable-monitoring`](http://localhost:5000/enable-executable-monitoring)
   - **Payload:**
     ```json
     {
       "client_ids": ["192.168.0.1"],
       "authorized_by": "AdminName"
     }
     ```
   - **Purpose:** Enables executable monitoring for the specified clients.

3. **Disable Executable Monitoring:**
   - **Endpoint:** [`http://localhost:5000/disable-executable-monitoring`](http://localhost:5000/disable-executable-monitoring)
   - **Payload:**
     ```json
     {
       "client_ids": ["192.168.0.1"],
       "authorized_by": "AdminName"
     }
     ```
   - **Purpose:** Disables executable monitoring for the specified clients.

---

## **Component Features**

### **MainContent**
- Provides:
  - A dropdown for selecting the authorizer.
  - A list of clients with checkboxes for selection.
  - Buttons to enable/disable monitoring.

### **Sidebar**
- Links to other monitoring features, including:
  - USB Monitoring
  - Keyword Management
  - Vulnerability Assessments

---

## **Future Enhancements**
1. Add real-time notifications for unauthorized application execution.
2. Include a dashboard for viewing logs of executable monitoring activities.
3. Implement role-based access control for managing executable monitoring.

---

This documentation provides a detailed overview of the **ExecMon** component, its features, dependencies, and communication mechanisms.
