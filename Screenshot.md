# Screenshot Component

**File Path:** [`src/SBlock/AetherisHomepage.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/SBlock/AetherisHomepage.jsx)

## **Purpose**
The `Screenshot` component provides functionality to manage screenshot blocking on client devices. This includes:
- Enabling or disabling screenshot capabilities across selected client devices.
- Offering a clear user interface to manage client selections and apply policies.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/SBlock/Sidebar.jsx)**
   - **Purpose:** Displays the navigation menu for switching between pages.

2. **[`MainContent`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/SBlock/MainContent.jsx)**
   - **Purpose:** Contains the core functionality for managing screenshot blocking, including:
     - Selecting clients.
     - Toggling screenshot blocking for the selected clients.

3. **CSS Modules**
   - **File:** [`AetherisHomepage.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/SBlock/AetherisHomepage.module.css)
   - **Purpose:** Provides styles for the `Screenshot` component and its child components.

---

## **Features**

### **1. Screenshot Blocking**
- Allows admins to enable or disable screenshot-taking capabilities for selected clients.

### **2. Client Selection**
- Displays a list of clients with IP addresses and names.
- Allows admins to select multiple clients for applying the screenshot blocking policy.

### **3. Toggle Functionality**
- Provides a toggle switch to enable or disable screenshot blocking.

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

2. **Toggle Screenshot Blocking:**
   - **Endpoint:** [`http://localhost:5000/screenshot-block`](http://localhost:5000/screenshot-block)
   - **Payload:**
     ```json
     {
       "toggleState": true,
       "client_ids": ["192.168.0.1", "192.168.0.2"]
     }
     ```
   - **Purpose:** Toggles the screenshot blocking functionality for the specified clients.

---

## **Component Features**

### **MainContent**
- Provides:
  - A list of clients with checkboxes for selection.
  - A toggle switch to enable/disable screenshot blocking.
  - Server communication for applying changes.

### **Sidebar**
- Links to other monitoring features, including:
  - USB Monitoring
  - Keyword Management
  - Vulnerability Assessments
  - Executable Monitoring

---

## **Future Enhancements**
1. Add real-time feedback for the toggle switch state (e.g., success/failure messages).
2. Include logging to track changes in screenshot blocking policies.
3. Implement role-based access control for managing screenshot blocking.

---

This documentation provides a detailed overview of the **Screenshot** component, its features, dependencies, and communication mechanisms.
