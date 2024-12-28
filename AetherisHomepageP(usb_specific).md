# AetherisHomepageP Component

**File Path:** [`src/Listing/USB/AetherisHomepage.js`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/USB/AetherisHomepage.jsx )

## **Purpose**
The `AetherisHomepageP` component is a client-specific page for managing USB monitoring features. It allows the admin to enable or disable USB/Port Blocking for a particular client identified by their IP address.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/USB/Sidebar.jsx)**
   - **Purpose:** Displays a dynamic navigation menu for the selected client, with links tailored to their specific features (e.g., USB Monitoring, Keyword Management).

2. **[`MainContent`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/USB/MainContent.jsx)**
   - **Purpose:** Handles the main USB monitoring functionality, including toggling USB blocking and displaying additional information.

3. **CSS Modules**
   - **File:** [`AetherisHomepage.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/USB/AetherisHomepage.module.css)
   - **Purpose:** Provides styles for the `AetherisHomepageP` component and its child components.

---

## **Features**
1. **Dynamic Sidebar Navigation:**
   - Links are dynamically generated based on the client’s IP address.
   - Includes links to:
     - Dashboard
     - USB Monitoring
     - Keyword Management
     - Executable Monitoring
     - Vulnerability Assessments

2. **USB/Port Blocking Toggle:**
   - Allows the admin to enable or disable USB/Port Blocking for the selected client.
   - Updates the toggle state dynamically and logs usage counts.

3. **Expandable FAQ Section:**
   - Explains how USB/Port Blocking works.
   - Provides additional security-related insights in an expandable format.

4. **Usage Counter:**
   - Tracks and displays the number of times USB monitoring has been enabled.

---

## **Communication**

### **Server Communication**
The `MainContent` component interacts with the Flask backend to perform the following actions:

1. **Toggle USB/Port Blocking:**
   - **Endpoint:** [`http://localhost:5000/toggle-usb-port-blocking`](http://localhost:5000/toggle-usb-port-blocking)
   - **Payload:** 
     ```json
     {
       "toggleState": true, 
       "client_ids": ["<client_ip>"]
     }
     ```
   - **Purpose:** Enables or disables USB/Port Blocking for the client.

2. **Logs Usage Count:**
   - Usage count for USB monitoring is stored in `localStorage`.

---

## **Component Features**

### **1. Sidebar**
- Provides navigation options specific to the selected client.
- Links include:
  - Dashboard
  - USB Monitoring
  - Keyword Management
  - Executable Monitoring
  - Vulnerability Assessments

### **2. USB Monitoring Toggle**
- Enables the admin to toggle USB/Port Blocking on or off for the selected client.
- Displays the current state of the feature.

### **3. FAQ Section**
- Explains how USB/Port Blocking works.
- Provides additional content about the feature in an expandable section.

### **4. Usage Counter**
- Tracks the number of times USB/Port Blocking has been enabled.
- Updates and displays the count in real-time.

---

## **Future Enhancements**
1. Add real-time status monitoring for USB devices connected to the client’s system.
2. Include detailed logs for each toggle action, including timestamps and admin details.
3. Integrate a feature to whitelist trusted devices for USB access.

---

This documentation provides a comprehensive overview of the **AetherisHomepageP** component, including its features, structure, and communication mechanisms.
