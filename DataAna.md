# Data Analysis Component

**File Path:** [`./Analysis/DataAnalyse.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Analysis/DataAnalyse.jsx)

---

## **Purpose**
The `DataAna` component provides detailed audit analysis for a specific user identified by their username. It allows administrators to:
- View the total number of policy violations committed by the user.
- Analyze the breakdown of violations by type.
- Access historical logs for further insights.

---

## **Imported Dependencies**

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Analysis/Sidebar.jsx)**
   - **Purpose:** Provides navigation for the application.

2. **[`UserDataPage`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Analysis/UserDataPage.jsx)**
   - **Purpose:** Displays detailed violation counts and history for the selected user.

3. **CSS Modules**
   - **File:** [`Listing.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Analysis/Listing.module.css)
   - **Purpose:** Provides styles for the `DataAna` component and its child components.

---

## **Features**

### **1. Detailed Audit Analysis**
- Displays the following violation counts for a specific user:
  - Clipboard violations
  - Screenshot violations
  - USB activity violations
  - Executable monitoring violations
- Provides a total count of all violations.

### **2. Historical Log Retrieval**
- Allows retrieval of specific violation history:
  - Clipboard history
  - Screenshot history
  - USB history

### **3. Firebase Integration**
- Fetches violation data from Firebase database nodes:
  - `logs`
  - `usb_attempts`
  - `executable_monitoring`
- Provides real-time updates for violations.

---

## **Component Details**

### **UserDataPage**
- **Path:** [`./Analysis/UserDataPage.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Analysis/UserDataPage.jsx)
- **Purpose:**
  - Aggregates violation data for a specific user.
  - Displays a detailed breakdown of violations.
  - Fetches and displays historical logs based on selected categories (Clipboard, Screenshot, USB).

### **Sidebar**
- **Path:** [`./Analysis/Sidebar.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Analysis/Sidebar.jsx)
- **Purpose:** Navigation menu for the application with links to:
  - Dashboard
  - USB Monitoring
  - Reports and Analysis
  - Encryption
  - Screenshot Blocking

---

## **Firebase Integration**

### **Violation Sources**
The component integrates with Firebase to fetch violations from the following nodes:

1. **Logs**
   - **Node:** `logs`
   - **Purpose:** Tracks clipboard and screenshot violations.
   - **Structure:**
     ```json
     {
       "log1": {
         "username": "user1",
         "event_description": "Clipboard Violation",
         "timestamp": "2024-12-28T10:00:00Z"
       }
     }
     ```

2. **USB Attempts**
   - **Node:** `usb_attempts`
   - **Purpose:** Logs unauthorized USB activities.
   - **Structure:**
     ```json
     {
       "log1": {
         "user": "user1",
         "event_description": "USB Violation",
         "timestamp": "2024-12-28T11:00:00Z"
       }
     }
     ```

3. **Executable Monitoring**
   - **Node:** `executable_monitoring`
   - **Purpose:** Logs violations related to unauthorized executable files.
   - **Structure:**
     ```json
     {
       "log1": {
         "user": "user1",
         "action": "Executed Restricted File",
         "timestamp": "2024-12-28T12:00:00Z",
         "authorized_by": "Admin"
       }
     }
     ```

---

## **Usage**

### **Component Integration**
```jsx
import DataAna from './Analysis/DataAnalyse';

function App() {
  return (
    <div>
      <DataAna />
    </div>
  );
}

export default App;
