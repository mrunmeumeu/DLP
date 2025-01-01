# Setting Up the Development Environment for the Admin Panel

To ensure a smooth development and testing process for your admin panel, follow the steps outlined below:

---

## 1. **Start the React Frontend**
   - Navigate to the React project directory in your terminal.
   - Run the following command to start the React frontend:
     ```bash
     npm start
     ```
   - Ensure you have all required dependencies installed. If not, run:
     ```bash
     npm install
     ```

---

## 2. **Start the Flask Backend**
   - You can start the backend in one of the following ways:
     - **Using Executable**:
       - Locate the executable file named `flask_app.exe`.
       - Double-click to start the backend server.
     - **Using Python File**:
       - Open a terminal or command prompt.
       - Run the backend Python script using the command:
         ```bash
         python flask_app.py
         ```
       

---

## 3. **Ensure Firebase Configuration**
   - Confirm the presence of the `firebaseConfig.json` file in the required directory.
   - This file is crucial for integrating Firebase services with the backend.

   - If you do not have the `firebaseConfig.json` file:
     - [Follow this guide](#) to create and download the configuration file for your Firebase project.
     - Place the file in the specified directory as instructed in the guide.

---

By completing the steps above, your development environment for the admin panel should be fully operational and ready for testing. For any issues or further assistance, refer to the project documentation or contact the support team.
