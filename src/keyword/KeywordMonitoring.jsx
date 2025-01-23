import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ref, get } from 'firebase/database';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js';
import styles from './KeywordMonitoring.module.css';
import SidebarMenu from './SidebarMenu';
import InfoBox from './InfoBox';

function KeywordMonitoring() {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientStatuses, setClientStatuses] = useState({});
  const [db, setDb] = useState(null);
  const [selectAll, setSelectAll] = useState(false); // State for Select All

  useEffect(() => {
    const fetchFirebaseDb = async () => {
      try {
        const database = await initializeFirebase();
        setDb(database);
      } catch (error) {
        console.error("Error initializing Firebase:", error);
      }
    };
    fetchFirebaseDb();
  }, []);

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

  useEffect(() => {
    if (!db || clients.length === 0) return;

    const fetchStatuses = async () => {
      const statuses = {};
      try {
        const monitoringRef = ref(db, 'keyword_monitoring');
        const monitoringSnapshot = await get(monitoringRef);

        if (monitoringSnapshot.exists()) {
          const monitoringData = monitoringSnapshot.val();
          clients.forEach((client) => {
            const clientName = client.user_name;
            if (monitoringData[clientName]) {
              statuses[client.ip] = monitoringData[clientName].status || "Unknown";
            } else {
              statuses[client.ip] = "Not Found";
            }
          });
        } else {
          console.warn("No keyword_monitoring data found in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching statuses from Firebase:", error);
      }
      setClientStatuses(statuses);
    };

    fetchStatuses();
  }, [db, clients]);

  useEffect(() => {
    setSelectAll(selectedClients.length === clients.length && clients.length > 0);
  }, [selectedClients, clients]);

  const handleClientSelection = (ip) => {
    setSelectedClients((prevSelectedClients) =>
      prevSelectedClients.includes(ip)
        ? prevSelectedClients.filter(client => client !== ip)
        : [...prevSelectedClients, ip]
    );
  };

  const handleStartMonitoring = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/run-keyword-monitoring', {
        client_ids: selectedClients,
        toggleState: true,
      });

      alert(response.data.message || "Monitoring started successfully.");
    } catch (error) {
      alert("An error occurred while starting monitoring.");
      console.error(error);
    }
  };

  const handleStopMonitoring = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/run-keyword-monitoring', {
        client_ids: selectedClients,
        toggleState: false,
      });

      alert(response.data.message || "Monitoring stopped successfully.");
    } catch (error) {
      alert("An error occurred while stopping monitoring.");
      console.error(error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(client => client.ip));
    }
    setSelectAll(!selectAll);
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (a.user_name && !b.user_name) return -1;
    if (!a.user_name && b.user_name) return 1;
    return 0;
  });

  return (
    <div className={styles.homepage}>
      <main className={styles.mainContent}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8935b75327cad0c706c17a676d42793ba2dd0b097d93e7a69ed5d903793b020?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1"
          alt=""
          className={styles.backgroundImage}
        />
        <header className={styles.header}>
          <h1 className={styles.title}>Raksha 1</h1>
          <span className={styles.brandName}>AETHERIS</span>
        </header>
        <div className={styles.contentWrapper}>
          <aside className={styles.sidebar}>
            <SidebarMenu />
          </aside>
          <section className={styles.mainSection}>
            <h2 className={styles.sectionTitle}>Keyword Monitoring</h2>

            {/* List of clients with checkboxes */}
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
                    <th>Username</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClients.map((client, index) => (
                    <tr key={index}>
                      <td>
                        <label className={styles.circularCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.ip)}
                            onChange={() => handleClientSelection(client.ip)}
                          />
                          <span
                            className={`${styles.checkboxCustom} ${
                              selectedClients.includes(client.ip) ? styles.selected : ''
                            }`}
                          ></span>
                        </label>
                      </td>
                      <td className={styles.ipColumn}>{client.ip}</td>
                      <td className={styles.nameColumn}>{client.user_name || "Disconnected"}</td>
                      <td
                        className={`${styles.statusColumn} ${
                          clientStatuses[client.ip] === "On" ? styles.green : styles.red
                        }`}
                      >
                        {clientStatuses[client.ip] || "Loading..."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Start/Stop Monitoring Buttons */}
            <div className={styles.buttonWrapper}>
              <button
                className={styles.startButton}
                onClick={handleStartMonitoring}
              >
                Start Monitoring
              </button>
              <button
                className={styles.stopButton}
                onClick={handleStopMonitoring}
              >
                Stop Monitoring
              </button>
            </div>

            <InfoBox />
          </section>
        </div>
      </main>
    </div>
  );
}

export default KeywordMonitoring;
