# Listing Component

**File Path:** [`src/Listing/Listing.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Listing.jsx)

## **Purpose**
The `Listing` component serves as the admin dashboard, providing an overview of the system's status and all connected clients. It includes:
- Displaying a list of connected and disconnected clients.
- Visualizing the safety percentage using a doughnut chart.
- Adding and removing clients dynamically.
- Navigating to client-specific pages.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Sidebar.jsx)**
   - **Purpose:** Provides navigation between dashboard features like USB Monitoring, VA Scans, and more.

2. **[`SafetyPercentage`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/SafetyPercentage.jsx)**
   - **Purpose:** Displays the percentage of connected vs. disconnected devices using a doughnut chart.

3. **[`ClientStatus`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/ClientStatus.jsx)**
   - **Purpose:** Displays a table of all clients with options to:
     - View client details.
     - Add new clients.
     - Remove existing clients.

4. **[`QuoteBox`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/QuoteBox.jsx)**
   - **Purpose:** Displays motivational quotes related to data security.

5. **CSS Modules**
   - **File:** [`Listing.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/Listing.module.css)
   - **Purpose:** Provides styles for the `Listing` component and its child components.

---

## **Features**

### **1. Client Management**
- **Client List:** Displays all connected and disconnected clients with their details.
- **Add Clients:** Allows admins to add new clients by entering their IP addresses.
- **Remove Clients:** Provides an option to delete clients from the network.

### **2. Safety Visualization**
- Displays a doughnut chart showing the percentage of connected vs. disconnected clients.

### **3. Quick Navigation**
- Sidebar navigation links to all major monitoring features.

### **4. Quotes**
- Motivational and security-related quotes are displayed in the `QuoteBox` component.

---

## **Communication**

### **Server Communication**
The component communicates with the Flask backend for the following actions:

1. **Fetch Clients:**
   - **Endpoint:** [`http://localhost:5000/scan-network`](http://localhost:5000/scan-network)
   - **Purpose:** Retrieves the list of all connected clients.
   - **Response Structure:**
     ```json
     [
       {
         "ip": "192.168.0.1",
         "user_name": "Client1",
         "status": "Connected"
       },
       ...
     ]
     ```

2. **Add Clients:**
   - **Endpoint:** [`http://localhost:5000/add-client`](http://localhost:5000/add-client)
   - **Payload:**
     ```json
     {
       "client_id": "ClientX",
       "ip": "192.168.0.2"
     }
     ```
   - **Purpose:** Adds a new client to the network.

3. **Delete Clients:**
   - **Endpoint:** [`http://localhost:5000/delete-client/{ip}`](http://localhost:5000/delete-client/{ip})
   - **Purpose:** Deletes a client by its IP address.

---

## **Component Features**

### **ClientStatus**
- **Core Features:**
  - Displays a list of all clients.
  - Options to add or remove clients dynamically.
  - Provides links to view client-specific pages.

### **SafetyPercentage**
- **Core Features:**
  - Visualizes the safety percentage of connected vs. disconnected clients using a doughnut chart.

### **QuoteBox**
- **Core Features:**
  - Displays motivational quotes to promote data security awareness.

### **Sidebar**
- **Core Features:**
  - Navigation links to all monitoring and management features.

---

## **Future Enhancements**
1. Add real-time updates for client connections and disconnections.
2. Implement search and filter functionality for the client list.
3. Enhance the doughnut chart with more granular details, such as device types.
4. Include a history of client connection statuses.

---

This documentation provides a comprehensive overview of the **Listing** component, its features, dependencies, and communication mechanisms.
