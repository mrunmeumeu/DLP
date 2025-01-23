import React, { useState, useEffect } from "react";
import styles from './Listing.module.css';
import Sidebar from './Sidebar';
import SafetyPercentage from "./SafetyPercentage";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LineGraph from './LineGraph'; // Update the path as necessary
import BarChart from "./UsbChart";
import SystemStatus from './Stats';
import LastHourViolations from "../Alert/Alert"; // Import the LastHourViolations component
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Firebase initialization
import { ref, get } from 'firebase/database';

function Testing() {
  const usbData = {
    blocked: 70, // Example value for USBs Blocked
    notBlocked: 30, // Example value for USBs Not Blocked
  };
  const { ip } = useParams(); // Get the IP from the URL
  const [clients, setClients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [violationCount, setViolationCount] = useState(0); // Track total violations in the last hour
  const [db, setDb] = useState(null); // Firebase database instance

  // Fetch Firebase Database Instance
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

  // Fetch violations from Firebase
  const fetchViolations = async () => {
    if (!db) return;

    try {
      const nodes = [
        { name: 'logs', refPath: 'logs' },
        { name: 'usb_attempts', refPath: 'usb_attempts' },
        { name: 'executable_violations', refPath: 'executable_violations' },
        { name: 'mail_violations', refPath: 'mail_violations' },
      ];

      const currentTime = Date.now();
      const oneHourAgo = currentTime - 60 * 60 * 1000; // Timestamp for one hour ago

      let totalViolations = 0;

      const nodePromises = nodes.map((node) =>
        get(ref(db, node.refPath)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            Object.values(data).forEach((log) => {
              const logTime = new Date(log.timestamp).getTime();
              if (logTime >= oneHourAgo) {
                totalViolations++;
              }
            });
          }
        })
      );

      await Promise.all(nodePromises);
      setViolationCount(totalViolations);
    } catch (error) {
      console.error('Error fetching violations:', error);
    }
  };

  // Fetch violations on component mount and every minute
  useEffect(() => {
    fetchViolations();
    const interval = setInterval(fetchViolations, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, [db]);

  // Fetch client details
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

  const connectedClients = clients.filter(client => client.status === 'Connected').length;
  const totalClients = clients.length;

  return (
    <main className={styles.homepage}>
      <div className={styles.mainContainer}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8935b75327cad0c706c17a676d42793ba2dd0b097d93e7a69ed5d903793b020?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
          alt="" 
          className={styles.backgroundImage} 
        />
        <header className={styles.header}>
          <h1 className={styles.logo}>Raksha 1</h1>
          <div className={styles.brandName}>AETHERIS</div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.sidebarColumn}>
              <Sidebar />
            </div>
            <div className={styles.mainColumn}>
              <LineGraph />
              <BarChart blocked={usbData.blocked} notBlocked={usbData.notBlocked} />
            </div>
            <div>
              <SafetyPercentage totalClients={totalClients} connectedClients={connectedClients} />
              <SystemStatus />
            </div>
          </div>
        </div>
        {/* Bell Icon */}
        <div
          className={`${styles.bellIcon} ${violationCount > 0 ? styles.alert : ''}`}
          onClick={() => setIsModalVisible(true)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1827/1827272.png" // Example bell icon
            alt="Bell Icon"
          />
        </div>
        {/* Modal */}
        {isModalVisible && (
          <div className={styles.modalOverlay} onClick={() => setIsModalVisible(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setIsModalVisible(false)}>
                &times;
              </button>
              <LastHourViolations />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Testing;
