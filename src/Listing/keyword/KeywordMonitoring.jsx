import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';  // To get the client IP from the URL
import styles from './KeywordMonitoring.module.css';
import SidebarMenu from './SidebarMenu';
import UserProfile from './UserProfile';
import KeywordForm from './KeywordForm';
import InfoBox from './InfoBox';

function KeywordMonitoringP() {
  const { ip } = useParams();  // Get IP from URL parameters
  const [isMonitoring, setIsMonitoring] = useState(() => {
    const savedState = localStorage.getItem(`isMonitoring_${ip}`);
    return savedState ? JSON.parse(savedState) : false;
  });

  // Function to handle the toggle switch
  const handleToggle = async () => {
    const newToggleState = !isMonitoring;
    setIsMonitoring(newToggleState);
    localStorage.setItem(`isMonitoring_${ip}`, JSON.stringify(newToggleState));  // Save state by IP

    try {
      const response = await axios.post('http://localhost:5000/run-keyword-monitoring', {
        client_ids: [ip],  // Send the IP as a list to match Flask API structure
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
            <UserProfile />
          </aside>
          <section className={styles.mainSection}>
            <h2 className={styles.sectionTitle}>Keyword Monitoring for {ip}</h2>

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

export default KeywordMonitoringP;
