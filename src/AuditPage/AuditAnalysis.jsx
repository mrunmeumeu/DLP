import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Dynamic Firebase initialization
import { ref, get } from 'firebase/database';
import './UserDataPage.css';

const AuditPage = () => {
  const { username } = useParams();
  const [usersData, setUsersData] = useState([]);
  const [db, setDb] = useState(null); // State to store Firebase database instance

  // Fetch Firebase Database Instance
  useEffect(() => {
    const fetchFirebaseDb = async () => {
      try {
        const database = await initializeFirebase();
        setDb(database);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    fetchFirebaseDb();
  }, []);

  const fetchUserViolations = async () => {
    if (!db) return; // Wait for Firebase to initialize

    try {
      const logsRef = ref(db, 'logs');
      const usbAttemptsRef = ref(db, 'usb_attempts');
      const execMonitoringRef = ref(db, 'executable_violations');
      const mailViolationsRef = ref(db, 'mail_violations');
      const outlookViolationsRef = ref(db, 'outlook_violations'); // Added outlook_violations node

      const [
        logsSnapshot,
        usbAttemptsSnapshot,
        execMonitoringSnapshot,
        mailViolationsSnapshot,
        outlookViolationsSnapshot,
      ] = await Promise.all([
        get(logsRef),
        get(usbAttemptsRef),
        get(execMonitoringRef),
        get(mailViolationsRef),
        get(outlookViolationsRef), // Fetch data from outlook_violations
      ]);

      const users = {};

      // Process logs for clipboard and screenshot violations
      if (logsSnapshot.exists()) {
        const logs = logsSnapshot.val();
        Object.values(logs).forEach((log) => {
          const user = log.username || log.device;
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };

          if (log.username === user) users[user].clipboardCount += 1;
          if (log.device === user) users[user].ssCount += 1;
        });
      }

      // Process USB violations
      if (usbAttemptsSnapshot.exists()) {
        const usbAttempts = usbAttemptsSnapshot.val();
        Object.values(usbAttempts).forEach((log) => {
          const user = log.user;
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].usbLogsCount += 1;
        });
      }

      // Process executable monitoring violations
      if (execMonitoringSnapshot.exists()) {
        const execMonitoringLogs = execMonitoringSnapshot.val();
        Object.values(execMonitoringLogs).forEach((log) => {
          const user = log.device_name || log.device || 'Unknown';
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].execMonitoringCount += 1;
        });
      }

      // Process mail violations
      if (mailViolationsSnapshot.exists()) {
        const mailViolations = mailViolationsSnapshot.val();
        Object.values(mailViolations).forEach((log) => {
          const user = log.device_name; // Assuming mail_violations has a device_name field
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].mailViolationsCount += 1;
        });
      }

      // Process outlook violations
      if (outlookViolationsSnapshot.exists()) {
        const outlookViolations = outlookViolationsSnapshot.val();
        Object.values(outlookViolations).forEach((log) => {
          const user = log.device_name; // Assuming outlook_violations has a device_name field
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].mailViolationsCount += 1; // Add outlook violations to mailViolationsCount
        });
      }

      // Combine and calculate totals for all users
      const usersList = Object.keys(users).map((user, index) => ({
        srNo: index + 1,
        username: user,
        totalViolations:
          users[user].clipboardCount +
          users[user].ssCount +
          users[user].usbLogsCount +
          users[user].execMonitoringCount +
          users[user].mailViolationsCount, // Include mail violations in the total count
      }));

      setUsersData(usersList);
    } catch (error) {
      console.error('Error fetching user violations:', error);
    }
  };

  useEffect(() => {
    fetchUserViolations();
  }, [db]); // Fetch data only after Firebase is initialized

  return (
    <div className="userDataPage">
      <div className="auditTitleBox">
        <h1 className="auditTitle"> Policy Violations Audit</h1>
      </div>

      <div className="usersTableContainer">
        <table className="usersTable">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Username</th>
              <th>Total Violations</th>
              <th>Analyse</th>
            </tr>
          </thead>
          <tbody>
            {usersData.length > 0 ? (
              usersData.map((user, index) => (
                <tr key={index}>
                  <td>{user.srNo}</td>
                  <td>{user.username}</td>
                  <td className="violationCount">{user.totalViolations}</td>
                  <td>
                    <Link to={`/analysis/${user.username}`}>
                      <button className="analyseButton">Analyse</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="noData">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditPage;
