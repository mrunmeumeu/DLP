import React, { useState } from 'react';
import axios from 'axios';  // Import axios for HTTP requests
import UsageCounter from './SideContent';  // Import the UsageCounter component
import { useParams } from 'react-router-dom';  // To extract the client IP or ID from the URL
import styles from './AetherisHomepage.module.css';

const MainContent = () => {
  const { ip } = useParams();  // Extract the IP or ID from the URL
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [usbCount, setUsbCount] = useState(() => {
    // Load usage count from localStorage on initial render
    return Number(localStorage.getItem('usbMonitoringUsageCount') || 0);
  });

  // Function to handle toggle change
  const handleToggleChange = async () => {
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);

    try {
      // Send a POST request to the Flask backend to run the appropriate executable
      const response = await axios.post('http://localhost:5000/toggle-usb-port-blocking', {
        toggleState: newToggleState,
        client_ids: [ip],  // Use the dynamically extracted client IP or ID
      });

      console.log(response.data.message);  // You can display this message in the UI if needed

      // Increment usage count only when the toggle is turned **on**
      if (newToggleState) {
        const newCount = usbCount + 1;
        setUsbCount(newCount);
        console.log("USB/Port Blocking enabled on", ip);
        localStorage.setItem('usbMonitoringUsageCount', newCount); // Update localStorage
      } else {
        console.log("USB/Port Blocking disabled on", ip);
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
      <h1 className={styles.contentTitle}>USB Monitoring</h1>
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
        {/* Show/hide additional content based on isExpanded */}
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
