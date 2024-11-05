// MainContent.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import ClientDetailsTable from './ClientDetailsTable';
import styles from './VulnerabilityAssessment.module.css';

function MainContent() {
  const { ip } = useParams();
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/client/${ip}`);
        setClientDetails(response.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };
    fetchClientDetails();
  }, [ip]);

  const handleRedirect = () => {
    window.location.href = "http://localhost:3000";
  };

  return (
    <section className={styles.mainContent}>
      <h2 className={styles.contentTitle}>Client Information</h2>
      <ClientDetailsTable clientDetails={clientDetails} />
      <button className={styles.redirectButton} onClick={handleRedirect}>
        Go to Dashboard
      </button>
    </section>
  );
}

export default MainContent;
