import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig.js';
import { ref, get } from 'firebase/database';
import './LogViewer.css';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);

  // Fetch logs from Firebase
  const fetchLogs = async () => {
    try {
      const logsRef = ref(db, 'logs');  // Reference to the 'logs' node in Firebase
      const snapshot = await get(logsRef);
      
      if (snapshot.exists()) {
        const logsData = snapshot.val();
        console.log("Logs Data:", logsData);  // Debugging step: Log the data fetched

        // Convert Firebase logs to an array and include 'username'
        const logsArray = Object.keys(logsData).map(key => ({
          id: key,
          ...logsData[key]
        }));

        // Sort logs from latest to oldest (by timestamp)
        logsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setLogs(logsArray);
      } else {
        console.log("No logs found!");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();  // Fetch logs when component mounts
  }, []);

  return (
    <div>
      <h2>Event Logs</h2>
      {logs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Event Description</th>
              <th>Detected Word</th>
              <th>Username</th> {/* Added column for Username */}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.timestamp}</td>
                <td>{log.event_description}</td>
                <td>{log.detected_word || "N/A"}</td>
                <td>{log.username || "N/A"}</td> {/* Display username */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No logs available.</p>
      )}
    </div>
  );
};

export default LogViewer;
