import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios for HTTP requests
import UsageCounter from './SideContent';  // Import the UsageCounter component
import styles from './AetherisHomepage.module.css';

const MainContent = () => {
  const [clients, setClients] = useState([]);  // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]);  // Store selected clients
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [usbCount, setUsbCount] = useState(() => {
    // Load usage count from localStorage on initial render
    return Number(localStorage.getItem('usbMonitoringUsageCount') || 0);
  });

  // Fetch the list of clients from the server
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

  // Handle client checkbox toggle
  const handleClientSelection = (ip) => {
    if (selectedClients.includes(ip)) {
      setSelectedClients(selectedClients.filter(client => client !== ip));
    } else {
      setSelectedClients([...selectedClients, ip]);
    }
  };

  // Function to handle toggle change
  const handleToggleChange = async () => {
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);

    if (selectedClients.length === 0) {
      alert("Please select at least one client.");
      return;
    }

    try {
      // Send a POST request to the Flask backend to run the USB toggle on the selected clients
      const response = await axios.post('http://localhost:5000/toggle-usb-port-blocking', {
        toggleState: newToggleState,
        client_ids: selectedClients,  // Send selected clients' IPs
      });

      console.log(response.data.message);  // You can display this message in the UI if needed

      // Increment usage count only when the toggle is turned **on**
      if (newToggleState) {
        const newCount = usbCount + 1;
        setUsbCount(newCount);
        localStorage.setItem('usbMonitoringUsageCount', newCount); // Update localStorage
      }

    } catch (error) {
      console.error('Error toggling USB/Port Blocking:', error);
    }
  };

  // Function to handle expand/collapse
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);  // Toggle the expanded state
  };

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.contentTitle}>USB Monitoring - Group Implementation</h1>
      <div className={styles.contentFrame}>
        USB/Port Blocking
        {/* Toggle switch */}
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={isToggleOn}
            onChange={handleToggleChange}  // Trigger the function on toggle change
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Table to list clients with checkboxes */}
      <h3>Select Clients to Apply USB/Port Blocking</h3>
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
                      onChange={() => handleClientSelection(client.ip)}  // Toggle client selection
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

      {/* Render UsageCounter component */}
      <UsageCounter />

      <div className={styles.questionContainer}>
        <div className={styles.questionItem}>
          <div className={styles.questionContent}>
            <div className={styles.questionText}>
              <h2 className={styles.question}>How does USB/Port Blocking work?</h2>
              <p className={styles.answer}>
                The USB/Port Blocking feature restricts the use of USB sticks and other ports on your device, preventing potential data theft or malware infections. You can easily enable or disable this feature with a simple toggle switch, ensuring flexibility and control over your device's security.
              </p>
            </div>
          </div>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/77d55673cb91eb0d3ec16b090fbad2cc2e80dacd123ef28c7b8eb22bc8147a9c?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
            alt="Expand" 
            className={styles.expandIcon} 
            onClick={handleExpandClick}
            style={{ cursor: 'pointer', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}  // Add rotation for visual cue
          />
        </div>
        {isExpanded && (
          <div className={styles.additionalContent}>
            <p>
              USB/Port Blocking ensures that unauthorized USB devices cannot be used on your device, offering protection from data theft and potential security breaches.
            </p>
            <p>
              You can manually allow certain devices if they are trusted, making sure that only authorized peripherals are allowed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
