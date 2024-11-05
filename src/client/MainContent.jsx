import React, { useState } from 'react';
import styles from './AetherisHomepage.module.css';

const MainContent = () => {
  // Define initial toggle states for each feature
  const [toggles, setToggles] = useState({
    usbPortBlocking: false,
    keywordManagement: false,
    executableManagement: false,
    vaScan: false,
    screenshotBlocking: false,
    documentSafety: false,
    fullProtection: false,
  });

  // Function to handle toggle changes
  const handleToggleChange = (feature) => {
    setToggles((prevState) => ({
      ...prevState,
      [feature]: !prevState[feature],
    }));
  };

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.contentTitle}>LAPTOP NAME*</h1>
      <div className={styles.toggleList}>
        <div className={styles.toggleItem}>
          <span>USB/Port Blocking</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.usbPortBlocking}
              onChange={() => handleToggleChange('usbPortBlocking')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleItem}>
          <span>Keyword Management</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.keywordManagement}
              onChange={() => handleToggleChange('keywordManagement')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleItem}>
          <span>Executable Management</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.executableManagement}
              onChange={() => handleToggleChange('executableManagement')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleItem}>
          <span>VA Scan</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.vaScan}
              onChange={() => handleToggleChange('vaScan')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleItem}>
          <span>ScreenShot Blocking</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.screenshotBlocking}
              onChange={() => handleToggleChange('screenshotBlocking')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleItem}>
          <span>Document Safety</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.documentSafety}
              onChange={() => handleToggleChange('documentSafety')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.toggleItem}>
          <span>Full Protection</span>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={toggles.fullProtection}
              onChange={() => handleToggleChange('fullProtection')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
