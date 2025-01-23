import React, { useState, useEffect } from 'react';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Dynamic Firebase initialization
import { ref, get } from 'firebase/database'; // Import necessary Firebase functions
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js auto-setup
import './Graph.css'; // Add your CSS file here

const LineGraph = () => {
  const [db, setDb] = useState(null); // State for Firebase database instance
  const [logsData, setLogsData] = useState({ days: [], data: [] });

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

  // Fetch logs, usb_attempts, executable_violations, and mail_violations from Firebase
  const fetchData = async () => {
    if (!db) return;
  
    try {
      const nodes = [
        { name: 'logs', refPath: 'logs' },
        { name: 'usb_attempts', refPath: 'usb_attempts' },
        { name: 'executable_violations', refPath: 'executable_violations' },
        { name: 'mail_violations', refPath: 'mail_violations' },
      ];
  
      const nodePromises = nodes.map((node) =>
        get(ref(db, node.refPath)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
          }
          return [];
        })
      );
  
      const [logsArray, usbAttemptsArray, execViolationsArray, mailViolationsArray] = await Promise.all(nodePromises);
  
      const combinedArray = [
        ...logsArray,
        ...usbAttemptsArray,
        ...execViolationsArray,
        ...mailViolationsArray,
      ];
  
      const logsByDate = combinedArray.reduce((acc, log) => {
        const date = new Date(log.timestamp).toLocaleDateString('en-US', {
          year: 'numeric', // Include year to handle cross-year sorting
          month: 'short',
          day: 'numeric',
        });
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
      }, {});
  
      // Sort dates based on their actual chronological order
      const days = Object.keys(logsByDate).sort((a, b) => new Date(a) - new Date(b));
      const data = days.map((day) => logsByDate[day]);
  
      let cumulativeTotal = 0;
      const cumulativeData = data.map((flagCount) => {
        cumulativeTotal += flagCount;
        return cumulativeTotal;
      });
  
      setLogsData({ days, data: cumulativeData });
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [db]);

  const chartData = {
    labels: logsData.days || [],
    datasets: [
      {
        label: 'Growth in policy violations',
        data: logsData.data || [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  };

  return (
    <div className="clientStatusContainer">
      <div className="title">Total Policy Violations</div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;
