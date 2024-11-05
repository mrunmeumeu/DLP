import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // To extract the IP from the URL
import axios from 'axios';  // Import axios for HTTP requests
import styles from './VulnerabilityAssessment.module.css';

function MainContent() {
  const { ip } = useParams();  // Extract the IP from the URL
  const [logs, setLogs] = useState('');  // State to store the selected log's content
  const [logFiles, setLogFiles] = useState([]);  // State to store the list of log files
  const [showLogFiles, setShowLogFiles] = useState(false);  // State to toggle log files view
  const [selectedLog, setSelectedLog] = useState('');  // State to store the currently selected log file
  const [clientDetails, setClientDetails] = useState(null);  // Store client details

  // Function to fetch log files from the admin server
  const fetchLogFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/list-logs');  // Admin server endpoint to list log files
      setLogFiles(response.data.logFiles);  // Store the list of log files
      setShowLogFiles(true);  // Show log files
    } catch (error) {
      alert("An error occurred while fetching log files.");
      console.error(error);
    }
  };

  // Function to fetch the content of a log file
  const viewLogContent = async (filename) => {
    try {
      const response = await axios.get('http://localhost:5000/view-logs', {
        params: { filename }  // Send the selected filename to the admin server
      });
      setLogs(response.data.logContent);  // Store log content in state
      setSelectedLog(filename);  // Set this log file as selected
    } catch (error) {
      alert("An error occurred while fetching logs.");
      console.error(error);
    }
  };

  // Function to run vulnerability scan for the client IP extracted from URL
  const runVulnerabilityScan = async () => {
    const clientPort = '5001';
    try {
      const response = await axios.post('http://localhost:5000/run-vulnerability-scan', {
        client_ids: [`${ip}:${clientPort}`]  // Send the extracted IP to Flask
      });
      console.log('Scan results:', response.data);
      alert("Vulnerability scan initiated for this client.");
    } catch (error) {
      alert("An error occurred while running the scan.");
      console.error(error);
    }
  };

  // Fetch client details from the server (e.g., user_name, device_id, etc.)
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/client/${ip}`);  // Send IP to Flask to get client details
        setClientDetails(response.data);  // Store client details in state
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    fetchClientDetails();  // Call the function when component mounts
  }, [ip]);

  return (
    <section className={styles.mainContent}>
      <h2 className={styles.contentTitle}>Vulnerability Assessment Scan</h2>

      {/* Display client details in a table format */}
      {clientDetails && (
        <table className={styles.detailsTable}>
          <tbody>
          <tr>
              <th>Client IP:</th>
              <td>{clientDetails.ip}</td>
            </tr>
            <tr>
              <th>Client ID:</th>
              <td>{clientDetails.client_id}</td>
            </tr>
            <tr>
              <th>Username:</th>
              <td>{clientDetails.user_name}</td>
            </tr>
            <tr>
              <th>Device ID:</th>
              <td>{clientDetails.device_id}</td>
            </tr>
            <tr>
              <th>Windows Version:</th>
              <td>{clientDetails.windows_version}</td>
            </tr>
            <tr>
              <th>Status:</th>
              <td>{clientDetails.status}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Button to run vulnerability scan */}
      <button className={styles.actionButton} onClick={runVulnerabilityScan}>
        <span className={styles.actionButtonText}>
          Run Vulnerability Assessment Scan
        </span>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d627d89056afc0eaeb2461e7db3372695655ea09432e1edfe1f2962a945510c3?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
          alt="" 
          className={styles.actionButtonIcon} 
        />
      </button>
      
      {/* Button to toggle viewing log files */}
      <button className={styles.actionButton} onClick={fetchLogFiles}>
        <span className={styles.actionButtonText}>
          {showLogFiles ? "Hide Logs" : "View Logs"}
        </span>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f4c651baed9641fe62c04b173c0481dda7ec45da964fc7c563dfc10ecdd64516?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
          alt="" 
          className={styles.actionButtonIcon} 
        />
      </button>

      {/* If log files are available, display them */}
      {showLogFiles && logFiles.length > 0 && (
        <div className={styles.logFilesContainer}>
          <h3 className={styles.logTitle}>Available Log Files:</h3>
          <ul className={styles.logList}>
            {logFiles.map((file, index) => (
              <li 
                key={index} 
                className={styles.logItem} 
                onClick={() => viewLogContent(file)}  // Fetch log content when clicked
              >
                {file}
                {selectedLog === file && logs && (
                  <div className={styles.logOutput}>
                    <pre>{logs}</pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default MainContent;
