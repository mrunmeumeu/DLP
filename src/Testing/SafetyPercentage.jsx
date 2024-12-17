import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function SafetyPercentage({ totalClients, connectedClients }) {
  const data = {
    datasets: [
      {
        data: [connectedClients, totalClients - connectedClients],
        backgroundColor: ['#00c853', '#3a3f47'],
        borderWidth: 0,
      },
    ],
    labels: ['Connected', 'Disconnected'],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9095a0',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div style={{
      backgroundColor: '#262a33',
      padding: '20px',
      borderRadius: '12px',
      justifyContent: 'space-between',
      
      textAlign: 'center',
      width: '280px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      margin: '5px',
    }}>
      <h3 style={{ color: '#fff', marginBottom: '15px' }}>Safety Percentage</h3>
      <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
        <Doughnut data={data} options={options} />
      </div>
      <div style={{ marginTop: '15px', color: '#9095a0', fontSize: '14px' }}>
        <p>Devices Enabled: {connectedClients}</p>
        <p>Devices Disabled: {totalClients - connectedClients}</p>
        <p>Total Devices: {totalClients}</p>
      </div>
    </div>
  );
}

export default SafetyPercentage;
