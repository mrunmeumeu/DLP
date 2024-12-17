import React, { useState, useEffect } from "react";
import styles from './Listing.module.css';
import Sidebar from './Sidebar';
import SafetyPercentage from "./SafetyPercentage";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserDataPage from "./Analysis";
import LogsTable from "./AuditTable";
const exampleData = [6, 12, 15, 15, 20, 22, 25];
function DataAna() {
  const usbData = {
    blocked: 70, // Example value for USBs Blocked
    notBlocked: 30, // Example value for USBs Not Blocked
  };
  const { ip } = useParams();  // Get the IP from the URL
  const [clientDetails, setClientDetails] = useState(null);  // State to store client details
  const [clients, setClients] = useState([]);
  // Fetch client details from the server (e.g., user_name, device_id, etc.)
 
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
          {/* Display the username in the title */}
          <h1 className={styles.logo}>Raksha 1</h1>
          <div className={styles.brandName}>AETHERIS</div>
        </header>
        <div className={styles.contentWrapper}>
          {/* <h1>This is testing</h1> */}
          <div className={styles.contentContainer}>
            <div className={styles.sidebarColumn}>
              <Sidebar />
            </div>
            <div className={styles.mainColumn}>
              <UserDataPage/>
              {/* <LogsTable/> */}

            </div>
            <div>
              
              {/* Safety Percentage Component */}
             
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DataAna;
