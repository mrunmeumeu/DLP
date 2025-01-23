import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ref, get } from 'firebase/database';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js';
import styles from './AetherisHomepage.module.css';

const MainContent = () => {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientStatuses, setClientStatuses] = useState({});
  const [db, setDb] = useState(null);
  const [usbCount, setUsbCount] = useState(() => {
    return Number(localStorage.getItem('usbMonitoringUsageCount') || 0);
  });
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
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
        const usblogsRef = ref(db, 'usblogs');
        const usblogsSnapshot = await get(usblogsRef);

        if (usblogsSnapshot.exists()) {
          const usblogs = usblogsSnapshot.val();
          clients.forEach((client) => {
            const clientName = client.user_name;
            if (usblogs[clientName]) {
              statuses[client.ip] = usblogs[clientName].status || 'Unknown';
            } else {
              statuses[client.ip] = 'Not Found';
            }
          });
        } else {
          console.warn('No usblogs found in Firebase.');
        }
      } catch (error) {
        console.error('Error fetching statuses from Firebase:', error);
      }
      setClientStatuses(statuses);
    };

    fetchStatuses();
  }, [db, clients]);

  // Synchronize "Select All" checkbox with individual checkboxes
  useEffect(() => {
    setSelectAll(selectedClients.length === clients.length && clients.length > 0);
  }, [selectedClients, clients]);

  const handleClientSelection = (ip) => {
    if (selectedClients.includes(ip)) {
      setSelectedClients(selectedClients.filter((client) => client !== ip));
    } else {
      setSelectedClients([...selectedClients, ip]);
    }
  };

  const handleEnableUSBBlock = async () => {
    if (selectedClients.length === 0) {
      alert('Please select at least one client.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/toggle-usb-port-blocking', {
        toggleState: true,
        client_ids: selectedClients,
      });

      console.log(response.data.message);

      const newCount = usbCount + 1;
      setUsbCount(newCount);
      localStorage.setItem('usbMonitoringUsageCount', newCount);
    } catch (error) {
      console.error('Error enabling USB/Port Blocking:', error);
    }
  };

  const handleDisableUSBBlock = async () => {
    if (selectedClients.length === 0) {
      alert('Please select at least one client.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/toggle-usb-port-blocking', {
        toggleState: false,
        client_ids: selectedClients,
      });

      console.log(response.data.message);
    } catch (error) {
      console.error('Error disabling USB/Port Blocking:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((client) => client.ip));
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (a.user_name && !b.user_name) return -1;
    if (!a.user_name && b.user_name) return 1;
    return 0;
  });

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.contentTitle}>USB Monitoring - Group Implementation</h1>

      <div className={styles.contentFrame}>
        <button
          className={styles.enableButton}
          onClick={handleEnableUSBBlock}
        >
          Enable USB Block
        </button>
        <button
          className={styles.disableButton}
          onClick={handleDisableUSBBlock}
        >
          Disable USB Block
        </button>
      </div>

      <h3>Select Clients to Apply USB/Port Blocking</h3>
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
                  <span className={styles.circularCheckbox}></span>
                </label>
                <br />
                <span className={styles.selectAllLabel}>Select All</span>
              </th>
              <th>IP Address</th>
              <th>Client Name</th>
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
                    <span className={styles.circularCheckbox}></span>
                  </label>
                </td>
                <td className={styles.ipColumn}>{client.ip}</td>
                <td className={styles.nameColumn}>{client.user_name || 'Unknown'}</td>
                <td
                  className={`${styles.statusColumn} ${
                    clientStatuses[client.ip] === 'On' ? styles.statusOn : styles.statusOff
                  }`}
                >
                  {clientStatuses[client.ip] || 'Loading...'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
