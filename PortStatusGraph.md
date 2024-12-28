# PortStatusGraph Component

**File Path:** [`./Testing/VaLog.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Testing/VaLog.jsx)

---

## **Purpose**
The `PortStatusGraph` component provides a graphical representation of open and closed ports for selected devices. It is designed to support detailed analysis by displaying:
- A bar graph showing the number of open and closed ports.
- A list of open ports for the selected device.

---

## **Imported Dependencies**
Below are the imported libraries and their purposes:

1. **React** 
   - **Purpose:** Enables component-based architecture for building the UI.

2. **Chart.js / React-Chartjs-2**
   - **Purpose:** Renders the bar graph visualizing open and closed port data.

3. **Firebase**
   - **Purpose:** Fetches device data and port statuses from the Firebase Realtime Database.

---

## **Features**

### **1. Device Selection**
- A dropdown menu allows users to select a device from the list fetched from Firebase.

### **2. Port Status Bar Graph**
- Displays a bar graph of open and closed ports for the selected device.
- Uses `Chart.js` to ensure responsiveness and interactivity.

### **3. Open Ports Listing**
- Lists all open ports for the selected device, offering detailed insight.

### **4. Dynamic Data Fetching**
- Fetches data from Firebase and dynamically updates the graph and open ports list based on the selected device.

---

## **Communication**

### **Firebase Integration**
The component interacts with Firebase to:
1. **Fetch Devices:**
   - **Firebase Node:** `vulnerability_assessment`
   - **Structure:**
     ```json
     {
       "device_id": {
         "device_name": "Device1",
         "assessment": {
           "port1": { "Port": 22, "Status": "Open" },
           "port2": { "Port": 80, "Status": "Closed" }
         }
       }
     }
     ```

2. **Fetch Port Status:**
   - Uses the `assessment` field of the selected device to count open and closed ports and list open ports.

---

## **Component Features**

### **Device Dropdown**
- Allows users to select a device from the available list in Firebase.

### **Bar Graph**
- Displays the number of open and closed ports for the selected device.

### **Open Ports List**
- Dynamically lists all open ports for the selected device for in-depth analysis.

### **Error Handling**
- Handles initialization errors for Firebase and displays fallback messages if no data is available.

---

## **Usage**

### **Initialization**
1. Ensure Firebase is correctly configured in the [`firebase.js`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/src/firebase.js) file.
2. Add the `PortStatusGraph` component to the desired route in your application.
