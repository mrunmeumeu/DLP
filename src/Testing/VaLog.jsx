import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Import dynamic Firebase initialization
import { ref, get } from 'firebase/database';

const PortStatusGraph = () => {
  const [db, setDb] = useState(null); // State to store Firebase database instance
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [data, setData] = useState({ open: 0, closed: 0 });
  const [openPorts, setOpenPorts] = useState([]); // To store open ports
  const [loading, setLoading] = useState(true);

  // Initialize Firebase and set database instance
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

  // Fetch devices data
  useEffect(() => {
    const fetchDevices = async () => {
      if (!db) return;

      try {
        const snapshot = await get(ref(db, 'vulnerability_assessment'));
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
  }, [db]);

  // Fetch port status data for the selected device
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice || !devices.length) return;

      setLoading(true);
      const selectedDeviceData = devices.find((device) => device.id === selectedDevice);

      if (selectedDeviceData && selectedDeviceData.assessment) {
        let openCount = 0;
        let closedCount = 0;
        const openPortsList = [];

        Object.entries(selectedDeviceData.assessment).forEach(([port, details]) => {
          if (details.Status === 'Open') {
            openCount++;
            openPortsList.push(details.Port); // Add open port to the list
          }
          if (details.Status === 'Closed') {
            closedCount++;
          }
        });

        setData({ open: openCount, closed: closedCount });
        setOpenPorts(openPortsList); // Update the open ports list
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedDevice, devices]);

  const handleDeviceChange = (event) => {
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
