import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Adjust the path to your dynamically loading firebase.js
import { ref, get } from 'firebase/database';
import './TopUsersChart.css';

const TopUsersChart = () => {
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

  // Fetch User Violations from Firebase Database
  const fetchUserViolations = async () => {
    if (!db) return; // Wait for Firebase to initialize

    try {
      const logsRef = ref(db, 'logs');
      const usbAttemptsRef = ref(db, 'usb_attempts');
      const execMonitoringRef = ref(db, 'executable_violations');
      const mailViolationsRef = ref(db, 'mail_violations'); // Reference to mail_violations node
      const outlookViolationsRef = ref(db, 'outlook_violations'); // Reference to outlook_violations node

      const [logsSnapshot, usbAttemptsSnapshot, execMonitoringSnapshot, mailViolationsSnapshot,outlookViolationsSnapshot] = await Promise.all([
        get(logsRef),
        get(usbAttemptsRef),
        get(execMonitoringRef),
        get(mailViolationsRef),
        get(outlookViolationsRef), // Fetch outlook violations data
       
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
          const user = log.device_name;
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].execMonitoringCount += 1;
        });
      }

      // Process mail violations
      if (mailViolationsSnapshot.exists()) {
        const mailViolations = mailViolationsSnapshot.val();
        Object.values(mailViolations).forEach((log) => {
          const user = log.device_name; // Assuming `device_name` is used as the identifier
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].mailViolationsCount += 1;
        });
      }
      if (outlookViolationsSnapshot.exists()) {
        const outlookViolations = outlookViolationsSnapshot.val();
        Object.values(outlookViolations).forEach((log) => {
          const user = log.device_name; // Assuming `device_name` is used as the identifier
          if (!users[user]) users[user] = { clipboardCount: 0, ssCount: 0, usbLogsCount: 0, execMonitoringCount: 0, mailViolationsCount: 0 };
          users[user].mailViolationsCount += 1; // Add to mail violations count
        });
      }

      // Combine and calculate totals for all users
      const usersList = Object.keys(users).map((user) => ({
        username: user,
        totalViolations:
          users[user].clipboardCount +
          users[user].ssCount +
          users[user].usbLogsCount +
          users[user].execMonitoringCount +
          users[user].mailViolationsCount,
      }));

      // Sort by total violations and take the top 10
      const topUsers = usersList.sort((a, b) => b.totalViolations - a.totalViolations).slice(0, 10);

      setUsersData(topUsers);
    } catch (error) {
      console.error('Error fetching user violations:', error);
    }
  };

  // Fetch data after Firebase is initialized
  useEffect(() => {
    fetchUserViolations();
  }, [db]);

  // Prepare chart data
  const labels = usersData.map((user) => user.username);
  const dataValues = usersData.map((user) => user.totalViolations);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Top 10 Users Violations',
        data: dataValues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#F7464A',
          '#46BFBD',
          '#FDB45C',
          '#949FB1',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#F7464A',
          '#46BFBD',
          '#FDB45C',
          '#949FB1',
        ],
      },
    ],
  };

  return (
    <div className="topUsersChart">
      <div className="topUsersTableContainer">
        <h1 className="topOffendersTitle">Top Offenders</h1>
        <table className="topUsersTable">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Violations</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/behaveAna/${user.username}`} className="usernameLink">
                    {user.username}
                  </Link>
                </td>
                <td className="violationCount">{user.totalViolations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="doughnutChartContainer">
        <h3 className="chartTitle">Violation Contributions</h3>
        <Doughnut data={chartData} />
      </div>
    </div>
  );
};

export default TopUsersChart;
