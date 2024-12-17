import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from './VulnerabilityAssessment.module.css';

function ClientLogs() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [logFiles, setLogFiles] = useState([]);
  const [keywordContent, setKeywordContent] = useState("");
  const [usbLogContent, setUsbLogContent] = useState("");
  const [screenshotLogContent, setScreenshotLogContent] = useState("");
  const [showLogFiles, setShowLogFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scan-network');
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClients();
  }, []);

  const handleClientSelection = (ip) => {
    setSelectedClient(ip === selectedClient ? "" : ip);
  };

  const clearLogs = () => {
    setLogFiles([]);
    setKeywordContent("");
    setUsbLogContent("");
    setScreenshotLogContent("");
    setShowLogFiles(false);
  };

  const requestLogs = async () => {
    if (!selectedClient) {
      alert("Please select a client.");
      return;
    }

    clearLogs();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/give-logs', {
        client_ids: [selectedClient]
      });

      console.log("Log request response:", response.data);
      alert("Log request sent to selected client.");
      await fetchLogs();
    } catch (error) {
      setError("Error requesting logs.");
      console.error("Error requesting logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/list-logs');
      setLogFiles(response.data.logFiles || []);
      setShowLogFiles(true);
    } catch (error) {
      setError("Error fetching logs.");
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestKeywordLogs = async () => {
    if (!selectedClient) {
      alert("Please select a client.");
      return;
    }

    clearLogs();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/get-keyword-logs', {
        client_ids: [selectedClient]
      });

      const keywordData = response.data[0]?.content || "No content found.";
      setKeywordContent(keywordData);
    } catch (error) {
      setError("Error requesting keyword logs.");
      console.error("Error requesting keyword logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestUsbLogs = async () => {
    if (!selectedClient) {
      alert("Please select a client.");
      return;
    }

    clearLogs();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/get-usb-log', {
        client_ids: [selectedClient]
      });

      const usbData = response.data[0]?.content || "No content found.";
      setUsbLogContent(usbData);
    } catch (error) {
      setError("Error fetching USB logs.");
      console.error("Error fetching USB logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestScreenshotLogs = async () => {
    if (!selectedClient) {
      alert("Please select a client.");
      return;
    }

    clearLogs();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/get-screenshot-log', {
        client_ids: [selectedClient]
      });

      const screenshotData = response.data[0]?.content || "No content found.";
      setScreenshotLogContent(screenshotData);
    } catch (error) {
      setError("Error fetching screenshot logs.");
      console.error("Error fetching screenshot logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.mainContent}>
      <h2 className={styles.contentTitle}>Client Logs</h2>

      {/* Centered Background Box for "Select Client" */}
      <div className={styles.selectClientHeader}>
  <h3 className={styles.selectClientHeaderText}>Select a Client to Request Logs</h3>
</div>


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
                      checked={selectedClient === client.ip}
                      onChange={() => handleClientSelection(client.ip)}
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

      <button className={styles.actionButton} onClick={requestLogs}>
        <span className={styles.actionButtonText}>Request Logs</span>
      </button>

      <button className={styles.actionButton} onClick={requestKeywordLogs}>
        <span className={styles.actionButtonText}>Get Keyword Logs</span>
      </button>

      <button className={styles.actionButton} onClick={requestUsbLogs}>
        <span className={styles.actionButtonText}>Get USB Logs</span>
      </button>

      <button className={styles.actionButton} onClick={requestScreenshotLogs}>
        <span className={styles.actionButtonText}>Get Screenshot Logs</span>
      </button>

      {showLogFiles && logFiles.length > 0 && (
        <div className={styles.logFilesContainer}>
          <h3 className={styles.logTitle}>Available Log Files:</h3>
          <ul className={styles.logList}>
            {logFiles.map((file, index) => (
              <li key={index} className={styles.logItem}>{file}</li>
            ))}
          </ul>
        </div>
      )}

      {keywordContent && (
        <div className={styles.keywordContentContainer}>
          <h3 className={styles.keywordTitle}>Keyword Content:</h3>
          <div className={styles.keywordBox}>
            <pre>{keywordContent}</pre>
          </div>
        </div>
      )}

      {usbLogContent && (
        <div className={styles.usbLogContentContainer}>
          <h3 className={styles.usbLogTitle}>USB Log Content:</h3>
          <div className={styles.usbLogBox}>
            <pre>{usbLogContent}</pre>
          </div>
        </div>
      )}

      {screenshotLogContent && (
        <div className={styles.screenshotLogContentContainer}>
          <h3 className={styles.screenshotLogTitle}>Screenshot Log Content:</h3>
          <div className={styles.screenshotLogBox}>
            <pre>{screenshotLogContent}</pre>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}

export default ClientLogs;
