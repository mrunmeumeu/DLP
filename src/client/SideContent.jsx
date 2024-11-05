import React, { useState, useEffect } from 'react';
import styles from './UsageCounter.module.css';  // Assuming you have some basic styles

const UsageCounter = () => {
  const [usbCount, setUsbCount] = useState(0);  // State to track USB Monitoring usage count

  useEffect(() => {
    // Load the USB Monitoring count from localStorage when the component mounts
    const storedCount = Number(localStorage.getItem('usbMonitoringUsageCount') || 0);
    setUsbCount(storedCount);
  }, []);

  return (
    <div className={styles.usageCounterCard}>
      <h2 className={styles.usageTitle}>USB Monitoring Usage</h2>
      <div className={styles.usageCountBox}>
        <span className={styles.usageCount}>{usbCount}</span>
        <span className={styles.usageLabel}>Toggles Activated</span>
      </div>
    </div>
  );
};

export default UsageCounter;
