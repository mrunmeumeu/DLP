import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import styles from './AetherisHomepage.module.css';

const MainContent = () => {
  const [clients, setClients] = useState([]); // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]); // Store selected clients
  const [isToggleOn, setIsToggleOn] = useState(false);

  // Fetch the list of clients from the server
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scan-network');
        setClients(response.data); // Set the clients list in state
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };
    fetchClients();
  }, []);

  // Handle client checkbox toggle
  const handleClientSelection = (ip) => {
    if (selectedClients.includes(ip)) {
      setSelectedClients(selectedClients.filter((client) => client !== ip));
    } else {
      setSelectedClients([...selectedClients, ip]);
    }
  };

  // Function to handle toggle change
  const handleToggleChange = async () => {
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);

    if (selectedClients.length === 0) {
      alert('Please select at least one client.');
      return;
    }

    try {
      // Send a POST request to the backend to toggle screenshot blocking
      const response = await axios.post('http://localhost:5000/screenshot-block', {
        toggleState: newToggleState,
        client_ids: selectedClients, // Send selected clients' IPs
      });

      console.log(response.data.message); // Log the backend response
    } catch (error) {
      console.error('Error toggling Screenshot Blocking:', error);
    }
  };

  return (
    <div className={styles.mainContent}>
      {/* Header Box for Screenshot Blocking */}
      <div className={styles.headerBox}>
        <h1 className={styles.contentTitle}>Screenshot Blocking</h1>
        <div className={styles.toggleContainer}>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={isToggleOn}
              onChange={handleToggleChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      {/* Header Box for Select Clients */}
      <div className={styles.clientHeaderBox}>
        <h3 className={styles.clientTitle}>Select Clients to Apply Screenshot Blocking</h3>
      </div>

      {/* Table to list clients with checkboxes */}
      <div className={styles.tableContainer}>
        <table className={styles.clientsTable}>
          <thead>
            <tr>
              <th>Select</th>
              <th>IP Address</th>
              <th>Client Name</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index}>
                <td>
                  <label className={styles.circularCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.ip)}
                      onChange={() => handleClientSelection(client.ip)}
                    />
                    <span className={styles.circularCheckbox}></span>
                  </label>
                </td>
                <td className={styles.ipColumn}>{client.ip}</td>
                <td className={styles.nameColumn}>{client.user_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
