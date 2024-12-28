# Encrypt Component

**File Path:** [`./Encryption/Encrypt.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Encryption/Encrypt.jsx)

---

## **Purpose**
The `Encrypt` component enables the encryption of sensitive documents such as PDF and Excel files by assigning passwords. It includes:
- Adding file passwords to the Firebase database.
- Managing file encryption for secured access.

---

## **Imported Dependencies**
Below are the imported components and their purposes:

1. **[`Sidebar`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Encryption/Sidebar.jsx)**
   - **Purpose:** Displays the navigation menu for switching between pages.

2. **[`AddFilePassword`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Encryption/ExcelPut.jsx)**
   - **Purpose:** Provides the core functionality for adding passwords to files.

3. **CSS Modules**
   - **File:** [`Listing.module.css`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Encryption/Listing.module.css)
   - **Purpose:** Styles the `Encrypt` component and its child components.

---

## **Features**

### **1. File Encryption**
- Allows admins to assign passwords to files for security.

### **2. File Type Selection**
- Supports PDF and Excel file types with the ability to toggle between them.

### **3. Firebase Integration**
- Stores the password and file details in Firebase for centralized management.

### **4. Dynamic Feedback**
- Provides real-time feedback on the success or failure of adding file details.

---

## **Component Details**

### **AddFilePassword**
- **Path:** [`./Encryption/ExcelPut.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Encryption/ExcelPut.jsx)
- **Purpose:** 
  - Accepts file name and password inputs.
  - Stores file-password pairs in Firebase under designated nodes.

### **Sidebar**
- **Path:** [`./Encryption/Sidebar.jsx`](https://github.com/mrunmeumeu/DLP/blob/ADMIN_FRONTEND/Encryption/Sidebar.jsx)
- **Purpose:** 
  - Links to other application features, such as:
    - USB Monitoring
    - Keyword Management
    - Reports and Analysis
    - Screenshot Blocking
    - VA Scans

---

## **Firebase Integration**

### **File Password Storage**
- **Node:** `pdfPasswords` (for PDF files) or `fp` (for Excel files).
- **Structure:**
  ```json
  {
    "pdfPasswords": {
      "exampleFile": "password123"
    },
    "fp": {
      "exampleExcelFile": "password456"
    }
  }
