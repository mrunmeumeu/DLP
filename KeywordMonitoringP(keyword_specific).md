# KeywordMonitoringP Component

**File Path:** [`src/Listing/keyword/KeywordMonitoring.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/keyword/KeywordMonitoring.jsx)

## **Purpose**
The `KeywordMonitoringP` component is a client-specific page for managing clipboard monitoring policies for a specific client identified by their IP address. This component allows admins to:
- Enable or disable clipboard monitoring for a client.
- Add or remove keywords for monitoring.
- View information on how the feature works.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`SidebarMenu`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/keyword/SidebarMenu.jsx)**
   - **Purpose:** Provides a dynamic navigation menu based on the client's IP, linking to various client-specific features.

2. **[`UserProfile`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/keyword/UserProfile.jsx)**
   - **Purpose:** Displays user information and provides options to view and manage the user profile.

3. **[`KeywordForm`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/keyword/KeywordForm.jsx)**
   - **Purpose:** Allows admins to manage keywords for clipboard monitoring by adding or removing keywords dynamically.

4. **[`InfoBox`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/keyword/InfoBox.jsx)**
   - **Purpose:** Provides detailed information about how clipboard and keyword monitoring works.

5. **CSS Modules**
   - **File:** [`KeywordMonitoring.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Listing/keyword/KeywordMonitoring.module.css)
   - **Purpose:** Provides styles for the `KeywordMonitoringP` component and its child components.

---

## **Features**

### **1. Clipboard Monitoring**
- Enables or disables clipboard monitoring for a specific client.
- Saves the monitoring state locally using `localStorage` for persistence.

### **2. Keyword Management**
- Admins can:
  - Add new keywords to monitor clipboard content.
  - Remove existing keywords from the monitoring list.

### **3. Dynamic Navigation**
- Navigation options dynamically update based on the client's IP address.
- Links include:
  - Dashboard
  - USB Monitoring
  - Keyword Management
  - Executable Monitoring
  - Vulnerability Assessments

### **4. Informational Section**
- Provides details about how clipboard monitoring and keyword restrictions enhance system security.

---

## **Communication**

### **Server Communication**
The component communicates with the Flask backend to perform the following actions:

1. **Toggle Clipboard Monitoring:**
   - **Endpoint:** [`http://localhost:5000/run-keyword-monitoring`](http://localhost:5000/run-keyword-monitoring)
   - **Payload:**
     ```json
     {
       "client_ids": ["<client_ip>"],
       "toggleState": true
     }
     ```
   - **Purpose:** Enables or disables clipboard monitoring for the client.

2. **Fetch Keywords:**
   - **Endpoint:** [`http://<client_ip>:5001/keywords`](http://<client_ip>:5001/keywords)
   - **Purpose:** Retrieves the list of keywords for monitoring from the client's server.
   - **Response Structure:**
     ```json
     {
       "keywords": ["password", "confidential", "secure"]
     }
     ```

3. **Add Keyword:**
   - **Endpoint:** [`http://<client_ip>:5001/keywords`](http://<client_ip>:5001/keywords)
   - **Payload:**
     ```json
     {
       "keyword": "new_keyword"
     }
     ```
   - **Purpose:** Adds a new keyword to the monitoring list.

4. **Delete Keyword:**
   - **Endpoint:** [`http://<client_ip>:5001/keywords/<keyword>`](http://<client_ip>:5001/keywords/<keyword>)
   - **Purpose:** Removes the specified keyword from the monitoring list.

---

## **Component Features**

### **SidebarMenu**
- Dynamically generates links based on the client's IP address for:
  - Dashboard
  - USB Monitoring
  - Keyword Management
  - Executable Monitoring
  - Vulnerability Assessments

### **KeywordForm**
- Provides an interface for:
  - Adding new keywords to the monitoring list.
  - Removing existing keywords.

### **InfoBox**
- Explains how keyword monitoring works and its security benefits.

---

## **Future Enhancements**
1. Add a search functionality for filtering keywords.
2. Provide real-time monitoring insights through graphs or charts.
3. Include an option to export or import keyword lists.

---

This documentation provides a comprehensive overview of the **KeywordMonitoringP** component, including its features, imported dependencies, and communication mechanisms.
