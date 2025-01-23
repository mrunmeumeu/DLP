import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Import Firebase config
import { ref, get } from 'firebase/database'; // Import necessary Firebase functions
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js auto-setup
import './Graph.css'; // Add your CSS file here

const LineGraph = () => {
  const [logsData, setLogsData] = useState({ days: [], data: [] });

  // Fetch logs and usb_attempts from Firebase
  const fetchLogsAndUsbAttempts = async () => {
    try {
      // Fetch logs
      const logsRef = ref(db, 'logs');
      const logsSnapshot = await get(logsRef);

      let logsArray = [];
      if (logsSnapshot.exists()) {
        const logs = logsSnapshot.val();
        logsArray = Object.keys(logs).map(key => ({
          id: key,
          ...logs[key],
        }));
      }

      // Fetch usb_attempts
      const usbAttemptsRef = ref(db, 'usb_attempts');
      const usbAttemptsSnapshot = await get(usbAttemptsRef);

      let usbAttemptsArray = [];
      if (usbAttemptsSnapshot.exists()) {
        const usbAttempts = usbAttemptsSnapshot.val();
        usbAttemptsArray = Object.keys(usbAttempts).map(key => ({
          id: key,
          ...usbAttempts[key],
        }));
      }

      // Combine logs and usb_attempts into one array
      const combinedArray = [...logsArray, ...usbAttemptsArray];

      // Group logs by date and count the number of logs per day
      const logsByDate = combinedArray.reduce((acc, log) => {
        const date = new Date(log.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
      }, {});

      // Convert logsByDate object into arrays for chart data
      const days = Object.keys(logsByDate).sort((a, b) => new Date(a) - new Date(b)); // Sort from Dec 2 to Dec 3
      const data = days.map(day => logsByDate[day]);

      // Create a cumulative sum of the data for the y-values
      let cumulativeTotal = 0;
      const cumulativeData = data.map(flagCount => {
        cumulativeTotal += flagCount;
        return cumulativeTotal;
      });

      setLogsData({ days, data: cumulativeData });
    } catch (error) {
      console.error('Error fetching logs and usb_attempts:', error);
    }
  };

  // Fetch logs and usb_attempts when the component mounts
  useEffect(() => {
    fetchLogsAndUsbAttempts();
  }, []);

  // Chart.js data configuration
  const chartData = {
    labels: logsData.days || [],
    datasets: [
      {
        label: 'Cumulative Positive Flags (Logs + USB Attempts)',
        data: logsData.data || [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart.js options configuration
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
      <div className="title">Cumulative Positive Flags Overview</div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;
