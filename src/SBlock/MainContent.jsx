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
        const sslogsRef = ref(db, 'sslogs');
        const sslogsSnapshot = await get(sslogsRef);

        if (sslogsSnapshot.exists()) {
          const sslogs = sslogsSnapshot.val();
          clients.forEach((client) => {
            const clientName = client.user_name;
            if (sslogs[clientName]) {
              statuses[client.ip] = sslogs[clientName].status || 'Unknown';
            } else {
              statuses[client.ip] = 'Not Found';
            }
          });
        } else {
          console.warn('No sslogs found in Firebase.');
        }
      } catch (error) {
        console.error('Error fetching statuses from Firebase:', error);
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
        ? prevSelectedClients.filter((client) => client !== ip)
        : [...prevSelectedClients, ip]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((client) => client.ip));
    }
    setSelectAll(!selectAll);
  };

  const handleEnableBlocking = async () => {
    if (selectedClients.length === 0) {
      alert('Please select at least one client.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/screenshot-block', {
        toggleState: true,
        client_ids: selectedClients,
      });

      alert('Screenshot Blocking enabled successfully.');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error enabling Screenshot Blocking:', error);
    }
  };

  const handleDisableBlocking = async () => {
    if (selectedClients.length === 0) {
      alert('Please select at least one client.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/screenshot-block', {
        toggleState: false,
        client_ids: selectedClients,
      });

      alert('Screenshot Blocking disabled successfully.');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error disabling Screenshot Blocking:', error);
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const statusA = clientStatuses[a.ip] || 'Not Found';
    const statusB = clientStatuses[b.ip] || 'Not Found';
    if (statusA === 'Not Found' && statusB !== 'Not Found') return 1;
    if (statusB === 'Not Found' && statusA !== 'Not Found') return -1;
    return 0;
  });

  return (
    <div className={styles.mainContent}>
      <div className={styles.headerBox}>
        <h1 className={styles.contentTitle}>Screenshot Blocking</h1>
        <div className={styles.buttonContainer}>
          <button
            className={styles.enableButton}
            onClick={handleEnableBlocking}
          >
            Enable Screenshot Blocking
          </button>
          <button
            className={styles.disableButton}
            onClick={handleDisableBlocking}
          >
            Disable Screenshot Blocking
          </button>
        </div>
      </div>

      <div className={styles.clientHeaderBox}>
        <h3 className={styles.clientTitle}>Select Clients to Apply Screenshot Blocking</h3>
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
                <td className={styles.nameColumn}>{client.user_name}</td>
                <td
                  className={styles.statusColumn}
                  style={{
                    color:
                      clientStatuses[client.ip] === 'ON'
                        ? 'green'
                        : clientStatuses[client.ip] === 'OFF'
                        ? 'red'
                        : 'black',
                  }}
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
