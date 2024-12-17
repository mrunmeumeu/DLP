import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWq44RtI569PW15hcGJNR6mR4IKZ8v2t0",
    authDomain: "clipboard-81621.firebaseapp.com",
    databaseURL: "https://clipboard-81621-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "clipboard-81621",
    storageBucket: "clipboard-81621.firebasestorage.app",
    messagingSenderId: "618629702430",
    appId: "1:618629702430:web:d91bbca79bd97ecfd39f0f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const PortStatusGraph = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [data, setData] = useState({ open: 0, closed: 0 });
  const [openPorts, setOpenPorts] = useState([]); // To store open ports
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const snapshot = await get(ref(database, 'vulnerability_assessment'));
        if (snapshot.exists()) {
          const assessmentData = snapshot.val();
          const deviceList = Object.entries(assessmentData).map(([key, value]) => ({
            id: key,
            name: value.device_name,
            assessment: value.assessment || {},
          }));
          setDevices(deviceList);
          if (deviceList.length > 0) {
            setSelectedDevice(deviceList[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;

      setLoading(true);
      const selectedDeviceData = devices.find((device) => device.id === selectedDevice);
      console.log('Selected Device Data:', selectedDeviceData);

      if (selectedDeviceData && selectedDeviceData.assessment) {
        let openCount = 0;
        let closedCount = 0;
        const openPortsList = []; // To store the port numbers of open ports

        Object.entries(selectedDeviceData.assessment).forEach(([port, details]) => {
          if (details.Status === 'Open') {
            openCount++;
            openPortsList.push(details.Port); // Add open port to the list
          }
          if (details.Status === 'Closed') {
            closedCount++;
          }
        });

        console.log('Open Count:', openCount, 'Closed Count:', closedCount);
        setData({ open: openCount, closed: closedCount });
        setOpenPorts(openPortsList); // Update the open ports list
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedDevice, devices]);

  const handleDeviceChange = (event) => {
    console.log('New Selected Device ID:', event.target.value);
    setSelectedDevice(event.target.value);
  };

  const chartData = React.useMemo(() => ({
    labels: ['Open Ports', 'Closed Ports'],
    datasets: [
      {
        label: 'Port Status',
        data: [data.open, data.closed],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }), [data]);

  return (
    <div>
      <h2>Port Status Graph</h2>

      <label htmlFor="device-select">Select Device: </label>
      <select id="device-select" value={selectedDevice} onChange={handleDeviceChange}>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <Bar data={chartData} options={{ responsive: true }} />
          <div>
            <h3>Open Ports:</h3>
            {openPorts.length > 0 ? (
              <ul>
                {openPorts.map((port) => (
                  <li key={port}>Port: {port}</li>
                ))}
              </ul>
            ) : (
              <p>No open ports found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PortStatusGraph;
