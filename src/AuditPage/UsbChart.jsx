import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js'; // Explicitly import Chart
import { Bar, Doughnut } from 'react-chartjs-2'; // Use Doughnut for ring charts
import 'chart.js/auto';
import { db, ref, get } from './firebaseConfig';
import './RowGraphs.css';

const Graphs = () => {
  const [blocked, setBlocked] = useState(0);
  const [notBlocked, setNotBlocked] = useState(0);
  const [keywordOn, setKeywordOn] = useState(0);
  const [keywordOff, setKeywordOff] = useState(0);
  const [ssOn, setSsOn] = useState(0);
  const [ssOff, setSsOff] = useState(0);

  useEffect(() => {
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
        console.error("Error fetching USB blocking data: ", error);
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
        console.error("Error fetching keyword monitoring data: ", error);
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
        console.error("Error fetching screenshot blocking data: ", error);
      }
    };

    fetchUSBData();
    fetchKeywordData();
    fetchSSData();
  }, []);

  const usbData = {
    labels: ['USBs Not Blocked', 'USBs Blocked'],
    datasets: [
      {
        label: 'USB Status',
        data: [notBlocked, blocked],
        backgroundColor: ['#007bff', '#f44336'],
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
        backgroundColor: ['#4caf50', '#f44336'],
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
        backgroundColor: ['#4caf50', '#f44336'],
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
      customCenterText: {
        beforeDraw(chart) {
          const { width } = chart;
          const ctx = chart.ctx;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;

          ctx.save();
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#4caf50';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${percentage}%`, width / 2, chart.height / 2);
          ctx.restore();
        },
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
