import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios for HTTP requests
import styles from './VulnerabilityAssessment.module.css';

function MainContent() {
  const [clients, setClients] = useState([]); // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]); // Store selected clients
  const [selectAll, setSelectAll] = useState(false); // Track the "Select All" state

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
    setSelectedClients((prevSelectedClients) =>
      prevSelectedClients.includes(ip)
        ? prevSelectedClients.filter(client => client !== ip)
        : [...prevSelectedClients, ip]
    );
  };

  // Handle "Select All" checkbox toggle
  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all clients
      setSelectedClients([]);
    } else {
      // Select all clients
      setSelectedClients(clients.map(client => client.ip));
    }
    setSelectAll(!selectAll);
  };

  // Sync the "Select All" checkbox with individual selections
  useEffect(() => {
    setSelectAll(selectedClients.length === clients.length && clients.length > 0);
  }, [selectedClients, clients]);

  // Function to run vulnerability scan on selected clients
  const runVulnerabilityScan = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/run-vulnerability-scan', {
        client_ids: selectedClients, // Send selected clients' IPs
      });
      console.log('Scan results:', response.data);
      alert("Vulnerability scan initiated for selected clients.");
    } catch (error) {
      alert("An error occurred while running the scan.");
      console.error(error);
    }
  };

  return (
    <section className={styles.mainContent}>
      {/* Title Box */}
      <div className={styles.titleBox}>
        <h2 className={styles.contentTitle}>Vulnerability Assessment Scan</h2>
      </div>

      {/* List of clients displayed in a table */}
      <div className={styles.clientHeaderBox}>
        <h3 className={styles.clientTitle}>Select Clients to Run Scan</h3>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.clientsTable}>
          <thead>
            <tr>
              <th>
                <label className={styles.circularCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span>Select All</span>
                </label>
              </th>
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
                      onChange={() => handleClientSelection(client.ip)} // Toggle client selection
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

      {/* Buttons */}
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton} onClick={runVulnerabilityScan}>
          <span className={styles.actionButtonText}>
            Run Vulnerability Assessment Scan
          </span>
        </button>
      </div>
    </section>
  );
}

export default MainContent;
