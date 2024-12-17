import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './SystemStatus.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SystemStatus = () => {
  const [cpuLoad, setCpuLoad] = useState(null);
  const [ramUsage, setRamUsage] = useState(null);
  const [cpuData, setCpuData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/system-stats')
        .then((response) => response.json())
        .then((data) => {
          setCpuLoad(data.cpu_usage); 
          setRamUsage(data.ram_usage); 

          // Add new data points to the graphs
          setCpuData((prevData) => [...prevData, data.cpu_usage].slice(-20));  // Keep the last 20 data points
          setRamData((prevData) => [...prevData, data.ram_usage].slice(-20));  // Keep the last 20 data points
          setTimeData((prevData) => [...prevData, new Date().toLocaleTimeString()].slice(-20));  // Time labels for the X axis
        })
        .catch((error) => {
          console.error('Error fetching system data:', error);
        });
    }, 1000); // Fetch data every second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  if (cpuLoad === null || ramUsage === null) {
    return <div>Loading system data...</div>;
  }

  const cpuChartData = {
    plugins: {
      datalabels: {
        display: false, // Disable data labels globally for this chart
      },
    },
    labels: timeData,
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: cpuData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ramChartData = {
    plugins: {
      datalabels: {
        display: false, // Disable data labels globally for this chart
      },
    },
    labels: timeData,
    datasets: [
      {
        label: 'RAM Usage (%)',
        data: ramData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="systemStatusContainer">
      <div className="statusCard">
        <div className="statusTitle">CPU Usage</div>
        <Line data={cpuChartData} options={{ responsive: true }} />
      </div>
      <div className="statusCard">
        <div className="statusTitle">RAM Usage</div>
        <Line data={ramChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default SystemStatus;
