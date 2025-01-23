import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Dynamic Firebase initialization
import { ref, get } from 'firebase/database'; // Firebase functions
import { Doughnut } from 'react-chartjs-2'; // Chart.js
import './CategoryDoughnutCharts.css'; // CSS file for styling

const CategoryDoughnutCharts = () => {
  const { username } = useParams(); // Extract username from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const [db, setDb] = useState(null); // State to store Firebase database instance
  const [chartData, setChartData] = useState({
    clipboardCount: 0,
    ssCount: 0,
    usbLogsCount: 0,
    execMonitoringCount: 0,
    totalViolations: 0,
  });

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
      const execMonitoringRef = ref(db, 'executable_monitoring');

      const [logsSnapshot, usbAttemptsSnapshot, execMonitoringSnapshot] = await Promise.all([
        get(logsRef),
        get(usbAttemptsRef),
        get(execMonitoringRef),
      ]);

      let clipboardCount = 0;
      let ssCount = 0;
      let usbLogsCount = 0;
      let execMonitoringCount = 0;

      // Process 'logs'
      if (logsSnapshot.exists()) {
        const logs = logsSnapshot.val();
        Object.values(logs).forEach((log) => {
          if (log.username === username) clipboardCount += 1;
          if (log.device === username) ssCount += 1;
        });
      }

      // Process 'usb_attempts'
      if (usbAttemptsSnapshot.exists()) {
        const usbAttempts = usbAttemptsSnapshot.val();
        Object.values(usbAttempts).forEach((log) => {
          if (log.user === username) usbLogsCount += 1;
        });
      }

      // Process 'executable_monitoring'
      if (execMonitoringSnapshot.exists()) {
        const execMonitoringLogs = execMonitoringSnapshot.val();
        Object.values(execMonitoringLogs).forEach((log) => {
          if (log.user === username) execMonitoringCount += 1;
        });
      }

      const totalViolations = clipboardCount + ssCount + usbLogsCount + execMonitoringCount;

      setChartData({
        clipboardCount,
        ssCount,
        usbLogsCount,
        execMonitoringCount,
        totalViolations,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data after Firebase is initialized
  useEffect(() => {
    fetchData();
  }, [db, username]);

  const { clipboardCount, ssCount, usbLogsCount, execMonitoringCount, totalViolations } = chartData;

  const createDoughnutData = (count, label) => ({
    labels: [label, 'Others'],
    datasets: [
      {
        data: [count, totalViolations - count],
        backgroundColor: ['#3498db', '#ecf0f1'],
        hoverBackgroundColor: ['#2980b9', '#bdc3c7'],
      },
    ],
  });

  const doughnutOptions = {
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
      title: {
        display: false, // Disable the chart title
      },
    },
    maintainAspectRatio: false, // Allow resizing
  };

  // Function to handle row clicks
  const handleRowClick = (category) => {
    navigate(`/analysis/${username}`, { state: { category } }); // Pass the category as state
  };

  return (
    <div className="categoryDoughnutCharts">
      <h2>{`Violation Breakdown for ${username}`}</h2>
      <div className="chartsGrid">
        <div className="chartContainer">
          <h3 className="chartTitle">Clipboard Attempts</h3>
          <Doughnut data={createDoughnutData(clipboardCount, 'Clipboard')} options={doughnutOptions} width={100} height={100} />
        </div>
        <div className="chartContainer">
          <h3 className="chartTitle">Screenshot Attempts</h3>
          <Doughnut data={createDoughnutData(ssCount, 'Screenshots')} options={doughnutOptions} width={100} height={100} />
        </div>
        <div className="chartContainer">
          <h3 className="chartTitle">USB Attempts</h3>
          <Doughnut data={createDoughnutData(usbLogsCount, 'USB')} options={doughnutOptions} width={100} height={100} />
        </div>
        <div className="chartContainer">
          <h3 className="chartTitle">Executable Monitoring</h3>
          <Doughnut data={createDoughnutData(execMonitoringCount, 'Executable')} options={doughnutOptions} width={100} height={100} />
        </div>
      </div>
      <div className="violationsTableContainer">
        <h3>Total Violations Summary</h3>
        <table className="violationsTable">
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
              <th>Percentage of Total</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => handleRowClick('Clipboard')} className="clickableRow">
              <td>Clipboard Attempts</td>
              <td>{clipboardCount}</td>
              <td>{((clipboardCount / totalViolations) * 100).toFixed(2)}%</td>
            </tr>
            <tr onClick={() => handleRowClick('Screenshot')} className="clickableRow">
              <td>Screenshot Attempts</td>
              <td>{ssCount}</td>
              <td>{((ssCount / totalViolations) * 100).toFixed(2)}%</td>
            </tr>
            <tr onClick={() => handleRowClick('USB')} className="clickableRow">
              <td>USB Attempts</td>
              <td>{usbLogsCount}</td>
              <td>{((usbLogsCount / totalViolations) * 100).toFixed(2)}%</td>
            </tr>
            <tr onClick={() => handleRowClick('Executable')} className="clickableRow">
              <td>Executable Monitoring</td>
              <td>{execMonitoringCount}</td>
              <td>{((execMonitoringCount / totalViolations) * 100).toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDoughnutCharts;
