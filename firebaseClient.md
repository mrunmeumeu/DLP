# Setting Up Firebase Admin SDK Configuration for Client Application

To enable the client backend to start updating data to Firebase, you need to configure the Firebase Admin SDK. This step assumes you have already set up the **admin end** (i.e., created the Firebase project, set up the Realtime Database, and completed the initial configuration).

---

## Step 1: Download the Firebase Admin SDK JSON File

1. **Navigate to Firebase Console**:
   - Visit [Firebase Console](https://console.firebase.google.com/).
   - Select the Firebase project you created during the admin setup.

2. **Access Service Accounts**:
   - Click on the **Settings** icon (gear) in the left-hand menu.
   - Select **"Project Settings"**.
   - Navigate to the **Service Accounts** tab.

3. **Generate and Download the Configuration File**:
   - Click on **"Generate New Private Key"**.
   - Confirm the download. A JSON file with a name similar to the following will be saved:
     ```
     "firebaseName"-"12345678"-firebase-adminsdk-rpim7-dd58d299af.json
     ```

   **⚠️ Do not rename this file.**

---

## Step 2: Place the Configuration File in the Correct Location

1. **Locate or Create the Required Directory**:
   - The file must be placed in the following directory:
     ```
     C:\Program Files\DLP
     ```
   - If the directory does not exist, create it manually.

2. **Move the File**:
   - Move the downloaded JSON file into the directory:
     ```
     C:\Program Files\DLP
     ```

   **⚠️ Important**: Ensure the file name remains unchanged as downloaded.

---

## Step 3: Verify the Configuration

1. **Check the File Placement**:
   - Navigate to `C:\Program Files\DLP`.
   - Confirm the presence of the JSON file with the exact name it had when downloaded, e.g.:
     ```
     "firebaseName"-"12345678"-firebase-adminsdk-rpim7-dd58d299af.json
     ```

2. **Test the Application**:
   - Run the client backend application and ensure it starts without errors related to Firebase configuration.

---

## Security Notice

- The Firebase Admin SDK JSON file contains sensitive credentials for your Firebase project.
- **Do not share this file** or upload it to any version control systems (e.g., GitHub, GitLab).
- Restrict access to the directory (`C:\Program Files\DLP`) to ensure the security of your Firebase project.

---

By completing these steps, your client application will be able to communicate with Firebase successfully.
