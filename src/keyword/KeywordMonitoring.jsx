import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from './KeywordMonitoring.module.css';
import SidebarMenu from './SidebarMenu';
import UserProfile from './UserProfile';
import KeywordForm from './KeywordForm';
import InfoBox from './InfoBox';

function KeywordMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(() => {
    const savedState = localStorage.getItem('isMonitoring');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [clients, setClients] = useState([]);  // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]);  // Track selected clients

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

  // Handle client selection toggle
  const handleClientSelection = (ip) => {
    setSelectedClients(prevSelectedClients =>
      prevSelectedClients.includes(ip)
        ? prevSelectedClients.filter(client => client !== ip)
        : [...prevSelectedClients, ip]
    );
  };

  // Function to handle the toggle switch
  const handleToggle = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }
    const newToggleState = !isMonitoring;
    setIsMonitoring(newToggleState);
    localStorage.setItem('isMonitoring', JSON.stringify(newToggleState));

    try {
      const response = await axios.post('http://localhost:5000/run-keyword-monitoring', {
        client_ids: selectedClients,
        toggleState: newToggleState,
      });
      alert(response.data.message);
    } catch (error) {
      alert("An error occurred while toggling keyword monitoring.");
      console.error(error);
    }
  };

  return (
    <div className={styles.homepage}>
      <main className={styles.mainContent}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8935b75327cad0c706c17a676d42793ba2dd0b097d93e7a69ed5d903793b020?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.backgroundImage} />
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
          <th>Select</th>
          <th>IP Address</th>
          <th>Username</th>
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
                <span className={styles.checkboxCustom}></span>
              </label>
            </td>
            <td className={styles.ipColumn}>{client.ip}</td>
            <td className={styles.nameColumn}>{client.user_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

            {/* Toggle switch for Keyword Monitoring */}
            <div className={styles.toggleWrapper}>
              <span className={styles.toggleLabel}>Clipboard Monitoring and Content Detection</span>
              <div className={styles.toggle} onClick={handleToggle}>
                <div className={`${styles.toggleKnob} ${isMonitoring ? styles.active : ''}`} />
              </div>
            </div>

            <KeywordForm />
            <InfoBox />
          </section>
        </div>
      </main>
    </div>
  );
}

export default KeywordMonitoring;
