# Behavioral Analysis Component

**File Path:** [`./Behave/BehaveAna.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Behave/BehaveAna.jsx)

---

## **Purpose**
The `Behave` component provides an overview of the top 10 violators among connected clients. This is useful for identifying problematic devices and taking necessary actions to mitigate risks.

---

## **Imported Dependencies**

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Behave/Sidebar.jsx)**
   - **Purpose:** Provides navigation for switching between different features of the application.

2. **[`TopUsersChart`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Behave/TopUsersChart.jsx)**
   - **Purpose:** Displays a doughnut chart visualization of the top 10 violators along with a table summarizing their violation counts.

3. **CSS Modules**
   - **File:** [`Listing.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Behave/Listing.module.css)
   - **Purpose:** Provides styles for the `Behave` component and its child components.

---

## **Features**

### **1. Top 10 Violators**
- Displays the top 10 violators based on the total number of policy violations.
- Violation categories include:
  - Clipboard violations
  - Screenshot violations
  - USB activity violations
  - Executable monitoring violations

### **2. Visualization**
- Provides a doughnut chart showing the contribution of each user to the total violations.

### **3. User Navigation**
- Links each user's name in the table to a detailed behavioral analysis page for further inspection.

### **4. Firebase Integration**
- Fetches user violation data from Firebase database nodes:
  - `logs`
  - `usb_attempts`
  - `executable_monitoring`

---

## **Component Details**

### **TopUsersChart**
- **Path:** [`./Behave/TopUsersChart.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Behave/TopUsersChart.jsx)
- **Purpose:**
  - Fetches and processes violation data for the top 10 violators.
  - Displays the data in a table and a doughnut chart for better visualization.
- **Visualization Features:**
  - Violation counts represented using distinct colors for clarity.
  - Hover effects to highlight specific users.

### **Sidebar**
- **Path:** [`./Behave/Sidebar.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Behave/Sidebar.jsx)
- **Purpose:** Provides a navigation menu to access other sections, such as:
  - Dashboard
  - USB Monitoring
  - Reports and Analysis
  - Behavioral Analysis

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
       "attempt1": {
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
       "exec1": {
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
import Behave from './Behave/BehaveAna';

function App() {
  return (
    <div>
      <Behave />
    </div>
  );
}

export default App;
