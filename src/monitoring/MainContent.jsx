import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios for HTTP requests
import styles from './VulnerabilityAssessment.module.css';

function MainContent() {
  const [clients, setClients] = useState([]); // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]); // Store selected clients
  const [authorizedBy, setAuthorizedBy] = useState(""); // Store the selected name from the dropdown
  const [selectAll, setSelectAll] = useState(false); // Track the "Select All" state

  const authorizedNames = ["Admin1", "Admin2", "Admin3"]; // Sample names for authorization

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

  // Function to enable executable monitoring for selected clients
  const enableExecutableMonitoring = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }
    if (!authorizedBy) {
      alert("Please select who authorized this action.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/enable-executable-monitoring',
        {
          client_ids: selectedClients,
          authorized_by: authorizedBy,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Executable monitoring enabled:', response.data);
      alert("Executable monitoring enabled for selected clients.");
    } catch (error) {
      alert("An error occurred while enabling executable monitoring.");
      console.error(error);
    }
  };

  // Function to disable executable monitoring for selected clients
  const disableExecutableMonitoring = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }
    if (!authorizedBy) {
      alert("Please select who authorized this action.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/disable-executable-monitoring', {
        client_ids: selectedClients,
        authorized_by: authorizedBy,
      });
      console.log('Executable monitoring disabled:', response.data);
      alert("Executable monitoring disabled for selected clients.");
    } catch (error) {
      alert("An error occurred while disabling executable monitoring.");
      console.error(error);
    }
  };

  return (
    <section className={styles.mainContent}>
      {/* Title Box */}
      <div className={styles.titleBox}>
        <h2 className={styles.contentTitle}>Executable Monitoring</h2>
      </div>

      {/* Authorization Dropdown */}
      <div className={styles.authorizationBox}>
        <label htmlFor="authorizedBy" className={styles.authorizationLabel}>
          Authorized By:
        </label>
        <select
          id="authorizedBy"
          className={styles.authorizationDropdown}
          value={authorizedBy}
          onChange={(e) => setAuthorizedBy(e.target.value)}
        >
          <option value="">-- Select Authorizer --</option>
          {authorizedNames.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* List of clients displayed in a table */}
      <div className={styles.clientHeaderBox}>
        <h3 className={styles.clientTitle}>Select Clients to Manage Monitoring</h3>
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

      {/* Buttons to enable or disable executable monitoring */}
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton} onClick={enableExecutableMonitoring}>
          <span className={styles.actionButtonText}>
            Enable Executable Monitoring
          </span>
        </button>
        <button className={styles.actionButton} onClick={disableExecutableMonitoring}>
          <span className={styles.actionButtonText}>
            Disable Executable Monitoring
          </span>
        </button>
      </div>
    </section>
  );
}

export default MainContent;
