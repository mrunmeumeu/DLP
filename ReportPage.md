# ReportPage Component

**File Path:** [`src/Reports/ReportPage.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Reports/ReportPage.jsx)

## **Purpose**
The `ReportPage` component is designed to display detailed logs for selected client devices, including timestamps of when specific features were toggled on or off. It provides a user-friendly interface for admins to manage and retrieve logs for different monitoring activities.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Reports/Sidebar.jsx)**
   - **Purpose:** Displays the navigation menu for switching between different pages.

2. **[`ClientLogs`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Reports/ClientLogs.jsx)**
   - **Purpose:** Manages the fetching, rendering, and clearing of logs for selected clients. Key features include:
     - Selecting clients for log retrieval.
     - Requesting logs for keyword monitoring, USB activities, and screenshot blocking.
     - Displaying the content of logs retrieved from the server.

3. **CSS Modules**
   - **File:** [`AetherisHomepage.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Reports/AetherisHomepage.module.css)
   - **Purpose:** Provides styles for the `ReportPage` component and its child components.

---

## **Features**

### **1. Client Selection**
- Displays a table of all connected clients with their IP addresses and names.
- Allows admins to select one client at a time for retrieving logs.

### **2. Log Requests**
- Provides buttons to request specific logs for the selected client:
  - **Keyword Logs**
  - **USB Activity Logs**
  - **Screenshot Blocking Logs**

### **3. Log Display**
- Fetches and displays logs in real time based on admin requests.
- Supports toggling between different log types.

### **4. Clear Logs**
- Clears previously fetched logs when a new request is initiated.

### **5. Error Handling**
- Displays error messages for issues like network failures or invalid client selection.

---

## **Communication**

### **Server Communication**
The component communicates with the Flask backend for the following actions:

1. **Fetch Clients:**
   - **Endpoint:** [`http://localhost:5000/scan-network`](http://localhost:5000/scan-network)
   - **Purpose:** Retrieves a list of all connected clients.
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

2. **Request Logs:**
   - **Endpoint:** [`http://localhost:5000/list-logs`](http://localhost:5000/list-logs)
   - **Purpose:** Retrieves a list of available logs for the selected client.
   - **Response Structure:**
     ```json
     {
       "logFiles": ["log1.txt", "log2.txt", ...]
     }
     ```

3. **Fetch Keyword Logs:**
   - **Endpoint:** [`http://localhost:5000/get-keyword-logs`](http://localhost:5000/get-keyword-logs)
   - **Payload:**
     ```json
     {
       "client_ids": ["192.168.0.1"]
     }
     ```
   - **Purpose:** Retrieves keyword monitoring logs for the selected client.

4. **Fetch USB Logs:**
   - **Endpoint:** [`http://localhost:5000/get-usb-log`](http://localhost:5000/get-usb-log)
   - **Payload:**
     ```json
     {
       "client_ids": ["192.168.0.1"]
     }
     ```
   - **Purpose:** Retrieves USB activity logs for the selected client.

5. **Fetch Screenshot Logs:**
   - **Endpoint:** [`http://localhost:5000/get-screenshot-log`](http://localhost:5000/get-screenshot-log)
   - **Payload:**
     ```json
     {
       "client_ids": ["192.168.0.1"]
     }
     ```
   - **Purpose:** Retrieves screenshot blocking logs for the selected client.

---

## **Component Features**

### **ClientLogs**
- **Core Features:**
  - Displays a table of clients with checkboxes for selection.
  - Provides buttons to request specific logs.
  - Displays the content of logs dynamically.
  - Implements error handling for failed requests.

### **Sidebar**
- **Purpose:** Provides navigation to other components, such as:
  - USB Monitoring
  - Keyword Management
  - Screenshot Blocking
  - Vulnerability Assessments

---

## **Future Enhancements**
1. Add real-time feedback for log fetching requests.
2. Enhance log visualization using charts or graphs.
3. Integrate role-based access control for retrieving and viewing logs.
4. Implement a search and filter feature for log files.

---

This documentation provides a comprehensive overview of the **ReportPage** component, its features, dependencies, and communication mechanisms.
