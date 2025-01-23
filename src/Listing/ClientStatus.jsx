import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ClientStatus.module.css';

function ClientStatus() {
  const [clients, setClients] = useState([]);
  const [clientIps, setClientIps] = useState('');

  // Fetch the list of clients from the server
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scan-network');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClients();
  }, []);

  // Function to add new clients
  const addClients = async () => {
    const ips = clientIps.split(',').map(ip => ip.trim()).filter(ip => ip);
    const newClients = [];

    for (let ip of ips) {
      const clientId = `Client${clients.length + newClients.length + 1}`;
      try {
        const response = await axios.post('http://localhost:5000/add-client', {
          client_id: clientId,
          ip: ip,
        });
        if (response.status === 200) {
          newClients.push(response.data);
        }
      } catch (error) {
        console.error(`Error adding client with IP ${ip}:`, error);
      }
    }

    setClients([...clients, ...newClients]);
    setClientIps('');
  };

  // Function to delete a client by IP
  const deleteClient = async (ip) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-client/${ip}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        // Remove the client from the list after successful deletion
        setClients(clients.filter(client => client.ip !== ip));
      }
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.error(`Server error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received from server:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    }
  };
  const sortedClients = [...clients].sort((a, b) => {
    if (a.status === 'Disconnected' && b.status !== 'Disconnected') {
      return 1;
    }
    if (a.status !== 'Disconnected' && b.status === 'Disconnected') {
      return -1;
    }
    return 0;
  });


  return (
    <div className={styles.clientStatusContainer}>
  <h2 className={styles.title}>Connected Clients</h2>
  
  {/* Scrollable table container */}
  <div className={styles.tableContainer}>
    <table className={styles.clientTable}>
      <thead>
        <tr>
          <th>Device</th>
          <th>IP Address</th>
          <th>Device Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedClients.map((client, index) => (
          <tr key={index} className={styles.clientRow}>
            <td>{`Device ${index + 1}`}</td>
            <td>
              <Link to={`/client/${client.ip}`} className={styles.clientIp}>
                {client.ip}
              </Link>
            </td>
            <td>{client.user_name || 'N/A'}</td>
            <td className={client.status === 'Connected' ? styles.connected : styles.disconnected}>
              {client.status}
            </td>
            <td>
              <button onClick={() => deleteClient(client.ip)} className={styles.deleteButton}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Form to add new clients */}
  <div className={styles.addClientForm}>
    <input
      type="text"
      placeholder="Enter IP addresses (comma-separated)"
      value={clientIps}
      onChange={(e) => setClientIps(e.target.value)}
      className={styles.inputField}
    />
    <button onClick={addClients} className={styles.addButton}>Add Clients</button>
  </div>
</div>

  );
}

export default ClientStatus;
