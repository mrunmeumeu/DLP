# AetherisHomepage Component(usb blocking)

**File Path:** [`src/USB/AetherisHomepage.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/USB/AetherisHomepage.jsx)

## **Purpose**
The `AetherisHomepage` component provides an admin interface for managing USB blocking functionality. It allows administrators to:
- Enable or disable USB/port blocking for connected devices.
- Select multiple clients to apply the policies.
- View an expandable FAQ section explaining USB blocking.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/USB/Sidebar.jsx)**
   - **Purpose:** Provides a navigation menu for accessing other features of the application.

2. **[`MainContent`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/USB/MainContent.jsx)**
   - **Purpose:** Handles the main functionality for USB monitoring, including client selection and USB policy toggling.

3. **[`SideContent`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/USB/SideContent.jsx)** (Commented out)
   - **Purpose:** Placeholder for additional side panel content (not currently implemented).

4. **CSS Modules**
   - **File:** [`AetherisHomepage.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/USB/AetherisHomepage.module.css)
   - **Purpose:** Provides styling for the `AetherisHomepage` component.

---

## **Features**
- **USB Policy Toggle:**
  - Enables or disables USB blocking for selected clients.
  - Sends the updated toggle state to the backend for processing.
  
- **Client Selection:**
  - Displays a list of connected clients with checkboxes for multi-selection.
  - Ensures at least one client is selected before toggling policies.

- **Usage Statistics:**
  - Tracks the number of times USB monitoring has been enabled.
  - Saves usage data in `localStorage` for persistence.

- **Expandable FAQ:**
  - Explains the purpose and functionality of USB/port blocking.
  - Includes a collapsible UI for additional descriptions.

- **Sidebar Navigation:**
  - Provides quick navigation to other features of the application.

---

## **Communication**

### **Server Communication**
The `AetherisHomepage` component interacts with the backend server (Flask API) for:

1. **Fetching Connected Clients:**
   - **Endpoint:** [`http://localhost:5000/scan-network`](http://localhost:5000/scan-network)
   - **Purpose:** Retrieves a list of clients on the network with details such as IP address and username.
   - **Response Structure:**
     ```json
     [
       {
         "ip": "192.168.0.1",
         "user_name": "Device001"
       },
       ...
     ]
     ```

2. **USB Policy Toggle:**
   - **Endpoint:** [`http://localhost:5000/toggle-usb-port-blocking`](http://localhost:5000/toggle-usb-port-blocking)
   - **Method:** `POST`
   - **Payload Structure:**
     ```json
     {
       "toggleState": true, // true for enable, false for disable
       "client_ids": ["192.168.0.1", "192.168.0.2"] // List of selected client IPs
     }
     ```
   - **Purpose:** Updates the USB/port blocking policy for selected clients.

---

## **Component Features**
### **1. USB Policy Toggle**
- Displays a toggle switch to enable or disable USB blocking.
- Sends the toggle state and selected clients to the backend.

### **2. Client Table**
- Displays a list of connected clients.
- Allows administrators to select clients for applying USB blocking policies.

### **3. Expandable FAQ**
- Explains how USB/port blocking works.
- Provides additional information in a collapsible UI.

### **4. Usage Tracking**
- Tracks the number of times USB monitoring has been enabled.
- Saves the count in `localStorage` for persistence.

---

## **Future Enhancements**
1. Implement the `SideContent` component for additional insights or controls.
2. Add real-time feedback for toggle actions, such as success or error messages.
3. Improve the FAQ section with interactive visuals or videos explaining USB blocking.

---

This documentation provides a detailed guide to understanding the **AetherisHomepage** component, including its features, structure, and backend communication.
