# KeywordMonitoring Component

**File Path:** [`src/keyword/KeywordMonitoring.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/keyword/KeywordMonitoring.jsx)

## **Purpose**
The `KeywordMonitoring` component provides an admin interface to manage clipboard monitoring across the network. It allows:
- Enabling or disabling clipboard monitoring.
- Adding or removing sensitive keywords to monitor.
- Selecting specific clients to apply the monitoring policies.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`SidebarMenu`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/keyword/SidebarMenu.jsx)**
   - **Purpose:** Provides a navigation menu to access other features of the application.

2. **[`KeywordForm`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/keyword/KeywordForm.jsx)**
   - **Purpose:** Allows admins to add, view, and delete sensitive keywords.

3. **[`InfoBox`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/keyword/InfoBox.jsx)**
   - **Purpose:** Explains the functionality of clipboard monitoring and keyword management to the admin.

4. **CSS Modules**
   - **File:** [`KeywordMonitoring.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/keyword/KeywordMonitoring.module.css)
   - **Purpose:** Provides styles for the `KeywordMonitoring` component.

---

## **Features**
1. **Clipboard Monitoring Toggle:**
   - A toggle switch to enable or disable clipboard monitoring for selected clients.

2. **Client Selection:**
   - Displays a table of connected clients with their IP addresses and usernames.
   - Allows selection of multiple clients to apply clipboard monitoring policies.

3. **Keyword Management:**
   - Add keywords to monitor for sensitive or restricted content.
   - View and delete existing keywords.

4. **Information Box:**
   - Provides an explanation of the clipboard monitoring feature.

---

## **Communication**

### **Server Communication**
The `KeywordMonitoring` component interacts with the backend server (Flask API) for:

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

2. **Running Clipboard Monitoring:**
   - **Endpoint:** [`http://localhost:5000/run-keyword-monitoring`](http://localhost:5000/run-keyword-monitoring)
   - **Method:** `POST`
   - **Payload Structure:**
     ```json
     {
       "client_ids": ["192.168.0.1", "192.168.0.2"],
       "toggleState": true
     }
     ```
   - **Purpose:** Enables or disables clipboard monitoring on the selected clients.

3. **Fetching Keywords:**
   - **Endpoint:** [`http://localhost:5000/keywords`](http://localhost:5000/keywords)
   - **Method:** `GET`
   - **Purpose:** Retrieves the list of existing sensitive keywords.
   - **Response Structure:**
     ```json
     {
       "keywords": ["password", "confidential", "secret"]
     }
     ```

4. **Adding a Keyword:**
   - **Endpoint:** [`http://localhost:5000/keywords`](http://localhost:5000/keywords)
   - **Method:** `POST`
   - **Payload Structure:**
     ```json
     {
       "keyword": "new_keyword"
     }
     ```
   - **Purpose:** Adds a new keyword to the list of sensitive keywords.

5. **Deleting a Keyword:**
   - **Endpoint:** [`http://localhost:5000/keywords/{keyword}`](http://localhost:5000/keywords/{keyword})
   - **Method:** `DELETE`
   - **Purpose:** Deletes a specified keyword from the list.

---

## **Component Features**

### **1. Keyword Form**
- Allows admins to:
  - Add a new keyword to monitor.
  - View and delete existing keywords.

### **2. Clipboard Monitoring Toggle**
- Enables or disables clipboard monitoring for selected clients.
- Sends the list of selected clients and toggle state to the backend API.

### **3. Client Table**
- Displays a list of connected clients.
- Allows admins to select multiple clients for clipboard monitoring.

### **4. InfoBox**
- Explains the clipboard monitoring feature to the admin.

---


This documentation provides a detailed guide to understanding the **KeywordMonitoring** component, including its features, structure, and backend communication.
