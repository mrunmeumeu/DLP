import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for extracting URL parameters
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Import dynamic Firebase initialization
import { ref, get } from 'firebase/database'; // Firebase functions
import { Line } from 'react-chartjs-2'; // Chart.js
import './DailyViolationsChart.css'; // CSS file for styling

const DailyViolationsChart = () => {
  const { username } = useParams(); // Extract username from the URL
  const [db, setDb] = useState(null); // State to store Firebase database instance
  const [lineChartData, setLineChartData] = useState(null); // Data for line chart

  // Initialize Firebase dynamically
  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = await initializeFirebase();
        setDb(database);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeDb();
  }, []);

  // Fetch and process data
  const fetchData = async () => {
    if (!username || !db) return;

    try {
      const logsRef = ref(db, 'logs');
      const usbAttemptsRef = ref(db, 'usb_attempts');
      const execMonitoringRef = ref(db, 'executable_violations');
      const mailViolationsRef = ref(db, 'mail_violations'); // Reference to mail_violations node

      const [logsSnapshot, usbAttemptsSnapshot, execMonitoringSnapshot, mailViolationsSnapshot] = await Promise.all([
        get(logsRef),
        get(usbAttemptsRef),
        get(execMonitoringRef),
        get(mailViolationsRef), // Fetch mail violations data
      ]);

      const timestamps = [];

      // Extract timestamps from 'logs'
      if (logsSnapshot.exists()) {
        const logs = logsSnapshot.val();
        Object.values(logs).forEach((log) => {
          if (log.username === username || log.device === username) {
            timestamps.push(log.timestamp);
          }
        });
      }

      // Extract timestamps from 'usb_attempts'
      if (usbAttemptsSnapshot.exists()) {
        const usbAttempts = usbAttemptsSnapshot.val();
        Object.values(usbAttempts).forEach((log) => {
          if (log.user === username) {
            timestamps.push(log.timestamp);
          }
        });
      }

      // Extract timestamps from 'executable_monitoring'
      if (execMonitoringSnapshot.exists()) {
        const execMonitoringLogs = execMonitoringSnapshot.val();
        Object.values(execMonitoringLogs).forEach((log) => {
          if (log.device_name === username) {
            timestamps.push(log.timestamp);
          }
        });
      }

      // Extract timestamps from 'mail_violations'
      if (mailViolationsSnapshot.exists()) {
        const mailViolations = mailViolationsSnapshot.val();
        Object.values(mailViolations).forEach((log) => {
          if (log.device_name === username) {
            timestamps.push(log.timestamp);
          }
        });
      }

      // Aggregate counts by date
      const dateCounts = {};
      timestamps.forEach((timestamp) => {
        const date = new Date(timestamp).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });

      // Prepare data for the chart
      const sortedDates = Object.keys(dateCounts).sort();
      const counts = sortedDates.map((date) => dateCounts[date]);

      setLineChartData({
        labels: sortedDates, // Dates as X-axis labels
        datasets: [
          {
            label: `Daily Violations for ${username}`,
            data: counts,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data for line chart:', error);
    }
  };

  // Fetch data when the component mounts or when `db` is ready
  useEffect(() => {
    fetchData();
  }, [db, username]);

  return (
    <div className="dailyViolationsChart">
      <h2>{`Daily Violations for ${username}`}</h2>
      {lineChartData ? (
        <Line data={lineChartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default DailyViolationsChart;
