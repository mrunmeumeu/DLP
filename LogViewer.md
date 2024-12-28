THIS IS A TESTING PAGE

# LogViewer Component

**File Path:** [`src/Testing/LogViewer.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/LogViewer.jsx)

## **Purpose**
The `LogViewer` component is a debugging tool that retrieves logs from the `logs` node in Firebase. It is used for testing and troubleshooting issues across different nodes by displaying event logs in a structured table format.

---

## **Imported Dependencies**
Below are the imported dependencies and their purposes:

1. **[`firebaseConfig.js`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/firebaseConfig.js)**
   - **Purpose:** Provides Firebase configuration and initialization for database access.

2. **CSS File**
   - **File:** [`LogViewer.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/Testing/LogViewer.css)
   - **Purpose:** Styles the `LogViewer` component for a user-friendly interface.

3. **Firebase Database Functions**
   - **`ref` and `get`** from `firebase/database`
   - **Purpose:** Access and retrieve data from the Firebase Realtime Database.

---

## **Features**

### **1. Fetch Logs**
- Retrieves event logs from the `logs` node in Firebase.
- Converts Firebase logs into a structured array for easier rendering.

### **2. Sort Logs**
- Automatically sorts logs from the latest to the oldest based on the `timestamp` field.

### **3. Display Event Details**
- Displays details for each log entry:
  - **ID:** Unique identifier for each log.
  - **Timestamp:** Date and time of the logged event.
  - **Event Description:** Details of the logged event.
  - **Detected Word:** Highlights specific words detected during the event (if applicable).
  - **Username:** Displays the username associated with the event (if available).

### **4. Fallback for Missing Data**
- If certain fields (e.g., `detected_word` or `username`) are missing, displays "N/A" as a placeholder.

---

## **Usage**

### **Table Columns**
The logs are displayed in a table with the following columns:
- **ID:** Displays the unique ID of the log.
- **Timestamp:** Shows when the event occurred.
- **Event Description:** Provides a description of the event.
- **Detected Word:** Highlights the word detected during the event (if applicable).
- **Username:** Shows the username associated with the event.

---

## **Firebase Communication**
### **Node:** `logs`
The component interacts with the Firebase Realtime Database to fetch logs from the `logs` node.

### **Fetch Logs**

- **Firebase Reference:** `ref(db, 'logs')`
- **Purpose:** Retrieves all logs under the `logs` node.

---

## **Component Features**

### **Log Sorting**

- Logs are sorted by `timestamp` in descending order to ensure the most recent logs are displayed first.

### **Dynamic Table Rendering**

- Logs are dynamically rendered in a table format, ensuring real-time updates upon fetching data.

### **Error Handling**

- Handles errors gracefully and logs a console error if fetching logs from Firebase fails.

---

## **Future Enhancements**

1. Add filtering options for logs based on:
   - Timestamp range
   - Username
   - Event type
2. Implement pagination for displaying large datasets.
3. Allow exporting logs as CSV or JSON for further analysis.
4. Add real-time updates using Firebase listeners.

---


This documentation provides a comprehensive overview of the **LogViewer** component, including its features, usage, and interaction with Firebase.


#### **Sample Firebase Structure**
```json
{
  "logs": {
    "log1": {
      "timestamp": "2024-12-27T10:00:00Z",
      "event_description": "Keyword detected",
      "detected_word": "password",
      "username": "user123"
    },
    "log2": {
      "timestamp": "2024-12-26T15:30:00Z",
      "event_description": "USB monitoring event",
      "detected_word": null,
      "username": "admin"
    }
  }
}


