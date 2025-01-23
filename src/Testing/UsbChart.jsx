import React, { useEffect, useState } from 'react';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Import dynamic Firebase initialization
import { ref, get } from 'firebase/database'; // Import necessary Firebase functions
import { Bar, Doughnut } from 'react-chartjs-2'; // Import chart components
import 'chart.js/auto'; // Required for Chart.js auto-setup
import './RowGraphs.css'; // Add your CSS file here

const Graphs = () => {
  const [db, setDb] = useState(null); // State for Firebase database instance
  const [blocked, setBlocked] = useState(0);
  const [notBlocked, setNotBlocked] = useState(0);
  const [keywordOn, setKeywordOn] = useState(0);
  const [keywordOff, setKeywordOff] = useState(0);
  const [ssOn, setSsOn] = useState(0);
  const [ssOff, setSsOff] = useState(0);

  useEffect(() => {
    // Fetch Firebase Database Instance
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

  useEffect(() => {
    if (!db) return; // Wait for Firebase to initialize

    const fetchUSBData = async () => {
      try {
        const usbRef = ref(db, 'usblogs');
        const snapshot = await get(usbRef);

        if (snapshot.exists()) {
          let blockedCount = 0;
          let notBlockedCount = 0;

          snapshot.forEach((childSnapshot) => {
            const status = childSnapshot.val().status;
            if (status === 'on') {
              blockedCount++;
            } else {
              notBlockedCount++;
            }
          });

          setBlocked(blockedCount);
          setNotBlocked(notBlockedCount);
        }
      } catch (error) {
        console.error('Error fetching USB blocking data:', error);
      }
    };

    const fetchKeywordData = async () => {
      try {
        const keywordRef = ref(db, 'keyword_monitoring');
        const snapshot = await get(keywordRef);

        if (snapshot.exists()) {
          let onCount = 0;
          let offCount = 0;

          snapshot.forEach((childSnapshot) => {
            const status = childSnapshot.val().status;
            if (status === 'ON') {
              onCount++;
            } else {
              offCount++;
            }
          });

          setKeywordOn(onCount);
          setKeywordOff(offCount);
        }
      } catch (error) {
        console.error('Error fetching keyword monitoring data:', error);
      }
    };

    const fetchSSData = async () => {
      try {
        const ssRef = ref(db, 'sslogs');
        const snapshot = await get(ssRef);

        if (snapshot.exists()) {
          let onCount = 0;
          let offCount = 0;

          snapshot.forEach((childSnapshot) => {
            const status = childSnapshot.val().status;
            if (status === 'on') {
              onCount++;
            } else {
              offCount++;
            }
          });

          setSsOn(onCount);
          setSsOff(offCount);
        }
      } catch (error) {
        console.error('Error fetching screenshot blocking data:', error);
      }
    };

    fetchUSBData();
    fetchKeywordData();
    fetchSSData();
  }, [db]);

  const usbData = {
    labels: ['USBs Not Blocked', 'USBs Blocked'],
    datasets: [
      {
        label: 'USB Status',
        data: [notBlocked, blocked],
        backgroundColor: ['#007bff', '#d10202'],
        borderRadius: 8,
      },
    ],
  };

  const usbOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
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
    barThickness: 20,
    categoryPercentage: 0.3,
    barPercentage: 0.5,
  };

  const keywordData = {
    labels: ['Keyword Monitoring ON', 'Keyword Monitoring OFF'],
    datasets: [
      {
        label: 'Status',
        data: [keywordOn, keywordOff],
        backgroundColor: ['#05ff3b', '#d10202'],
        borderWidth: 0,
      },
    ],
  };

  const ssData = {
    labels: ['Screenshot Blocking ON', 'Screenshot Blocking OFF'],
    datasets: [
      {
        label: 'Status',
        data: [ssOn, ssOff],
        backgroundColor: ['#05ff3b', '#d10202'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = (value, total) => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '75%',
    rotation: 0,
    circumference: 360,
    maintainAspectRatio: false,
  });

  return (
    <div className="graphsContainer">
      <div className="chartContainer">
        <div className="barChartTitle">USB Blocking Overview</div>
        <Bar data={usbData} options={usbOptions} />
      </div>

      <div className="chartContainer">
        <div className="pieChartTitle">Keyword Monitoring Overview</div>
        <Doughnut
          data={keywordData}
          options={doughnutOptions(keywordOn, keywordOn + keywordOff)}
        />
      </div>

      <div className="chartContainer">
        <div className="pieChartTitle">Screenshot Blocking Overview</div>
        <Doughnut
          data={ssData}
          options={doughnutOptions(ssOn, ssOn + ssOff)}
        />
      </div>
    </div>
  );
};

export default Graphs;
