import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ClientDetails.module.css';  // Add your styles

function ClientDetails() {
  const { ip } = useParams();  // Get the IP from the URL
  const [clientData, setClientData] = useState(null);  // State to store client data

  // Fetch client details when the component loads
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/client/${ip}`);  // API call to get client details
        setClientData(response.data);  // Store client data in state
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    fetchClientData();
  }, [ip]);

  if (!clientData) {
    return <p>Loading client details...</p>;
  }

  return (
    <div className={styles.clientDetailsContainer}>
      <h2>Details for Client: {ip}</h2>
      <p>Username: {clientData.user_name}</p>
      <p>Windows version: {clientData.windows_version}</p>
      <p>device_id: {clientData.device_id}</p>
      <p>Status: {clientData.status}</p>
    </div>
  );
}

export default ClientDetails;
