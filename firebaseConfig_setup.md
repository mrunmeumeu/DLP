# Step-by-Step Guide to Creating a Firebase Web App and Setting Up Realtime Database

This guide will walk you through creating a Firebase web app, retrieving its SDK setup, and configuring a Realtime Database.

---

## 1. **Sign in to Firebase**
   - Go to the [Firebase Console](https://console.firebase.google.com).
   - Log in using your Google account.

---

## 2. **Create a New Firebase Project**
   - On the Firebase Console homepage, click **"Add project"**.
   - Enter a name for your project and click **"Continue"**.
   - (Optional) Enable Google Analytics for your project by toggling the option.
   - Click **"Create project"** and wait for the process to complete.

---

## 3. **Add a Web App to Your Project**
   - In your Firebase project dashboard, locate the **"Project Overview"** section.
   - Click on the **web icon** (`</>`), labeled as **"Add App"**.
   - Enter a name for your web app (e.g., "My Web App").
   - (Optional) Check the box to set up Firebase Hosting if you plan to host your app on Firebase.
   - Click **"Register app"**.

---

## 4. **Retrieve Your Firebase SDK Configuration**
   - After registering your app, you will be directed to the SDK setup page.
   - Copy the **Firebase SDK configuration object**. It will look something like this:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
     };
     ```
   - **Create a file named `firebaseConfig.json` at the location `C:\Program Files\DLP` and input the following contents**:
     ```json
     {
       "apiKey": "YOUR_API_KEY",
       "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
       "projectId": "YOUR_PROJECT_ID",
       "storageBucket": "YOUR_PROJECT_ID.appspot.com",
       "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
       "appId": "YOUR_APP_ID",
       "databaseURL": "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com"
     }
     ```
   - Replace the placeholders (`YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc.) with the values from your Firebase Console setup.
   - Save the file as `firebaseConfig.json`.

---

## 5. **Set Up Realtime Database**
   - In the Firebase Console, go to the **Build** section in the left-hand menu and select **"Realtime Database"**.
   - Click **"Create Database"**.
   - Choose the desired location for your database and click **"Next"**.
   - Set the database rules to either:
     - **Locked mode** (recommended for production) or
     - **Test mode** (open access for development purposes).
   - Click **"Enable"** to create the database.

---

## 6. **Configure Database Rules (Compulsary)**
   - In the Realtime Database settings, go to the **Rules** tab.
   - Modify the rules as below:
       ```json
     {
       "rules": {
         "fp": {
           ".read": true,
           ".write": true
         },
         "pdfPasswords": {
           ".read": true,
           ".write": true
         },
         ".read": true,
         ".write": false
       }
     }
     ```
   - Click **"Publish"** to save the rules.

---



## 7. **Access Your Realtime Database**
   - In your Firebase Console, navigate to **Realtime Database** to view and manage data in real time.

---

## Additional Tips
   - Use Firebase Authentication to secure your database access.
   - Refer to the [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database) for advanced use cases and optimizations.

By following these steps, you will have successfully created a Firebase web app, set up Realtime Database, and integrated it into your web application.
