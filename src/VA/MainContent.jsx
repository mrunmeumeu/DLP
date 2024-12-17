import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios for HTTP requests
import styles from './VulnerabilityAssessment.module.css';

function MainContent() {
  const [clients, setClients] = useState([]); // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]); // Store selected clients
  const [logFiles, setLogFiles] = useState([]); // State to store the list of log files
  const [showLogFiles, setShowLogFiles] = useState(false); // State to toggle log files view

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
      setSelectedClients(selectedClients.filter(client => client !== ip));
    } else {
      setSelectedClients([...selectedClients, ip]);
    }
  };

  // Function to run vulnerability scan on selected clients
  const runVulnerabilityScan = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/run-vulnerability-scan', {
        client_ids: selectedClients // Send selected clients' IPs
      });
      console.log('Scan results:', response.data);
      alert("Vulnerability scan initiated for selected clients.");
    } catch (error) {
      alert("An error occurred while running the scan.");
      console.error(error);
    }
  };

  // Function to fetch log files from the admin server
  const fetchLogFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/list-logs');
      setLogFiles(response.data.logFiles);
      setShowLogFiles(true);
    } catch (error) {
      alert("An error occurred while fetching log files.");
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

        <button className={styles.actionButton} onClick={fetchLogFiles}>
          <span className={styles.actionButtonText}>
            {showLogFiles ? "Hide Logs" : "View Logs"}
          </span>
        </button>
      </div>

      {/* If log files are available, display them */}
      {showLogFiles && logFiles.length > 0 && (
        <div className={styles.logFilesContainer}>
          <h3 className={styles.logTitle}>Available Log Files:</h3>
          <ul className={styles.logList}>
            {logFiles.map((file, index) => (
              <li key={index} className={styles.logItem}>
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default MainContent;
