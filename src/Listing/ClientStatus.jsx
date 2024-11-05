import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom for navigation
import axios from 'axios';
import styles from './ClientStatus.module.css';  // Import your styles

function ClientStatus() {
  const [clients, setClients] = useState([]);  // Store the list of clients

  // Fetch the list of clients from the server
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scan-network');
        setClients(response.data);  // Set the clients list in state
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className={styles.clientStatusContainer}>
      <h2 className={styles.title}>Connected Clients</h2>

      {/* Table to display client details */}
      <table className={styles.clientTable}>
        <thead>
          <tr>
            <th>Device</th>
            <th>IP Address</th>
            <th>Device Name</th>
            
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index} className={styles.clientRow}>
              {/* Clickable IP Address */}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientStatus;
