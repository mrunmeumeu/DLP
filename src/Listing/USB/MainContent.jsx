import React, { useState } from 'react';
import axios from 'axios';
import UsageCounter from './SideContent';
import { useParams } from 'react-router-dom';
import styles from './AetherisHomepage.module.css';

const MainContent = () => {
  const { ip } = useParams();
  const [usbCount, setUsbCount] = useState(() => {
    return Number(localStorage.getItem('usbMonitoringUsageCount') || 0);
  });

  const handleEnableBlocking = async () => {
    try {
      const response = await axios.post('http://localhost:5000/toggle-usb-port-blocking', {
        toggleState: true,
        client_ids: [ip],
      });
      console.log(response.data.message);
      const newCount = usbCount + 1;
      setUsbCount(newCount);
      localStorage.setItem('usbMonitoringUsageCount', newCount);
      console.log("USB/Port Blocking enabled on", ip);
    } catch (error) {
      console.error('Error enabling USB/Port Blocking:', error);
    }
  };

  const handleDisableBlocking = async () => {
    try {
      const response = await axios.post('http://localhost:5000/toggle-usb-port-blocking', {
        toggleState: false,
        client_ids: [ip],
      });
      console.log(response.data.message);
      console.log("USB/Port Blocking disabled on", ip);
    } catch (error) {
      console.error('Error disabling USB/Port Blocking:', error);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.contentTitle}>USB Monitoring</h1>
      <div className={styles.contentFrame}>
        <div className={styles.buttonContainer}>
          <button className={styles.enableButton} onClick={handleEnableBlocking}>
            Enable USB/Port Blocking
          </button>
          <button className={styles.disableButton} onClick={handleDisableBlocking}>
            Disable USB/Port Blocking
          </button>
        </div>
      </div>

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
            style={{ cursor: 'pointer', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
