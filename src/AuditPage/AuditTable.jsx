import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Import Firebase config
import { ref, get } from "firebase/database"; // Import necessary Firebase functions
import "./AuditTable.css"; // Import the CSS file for styling

const LogsTable = ({ username }) => {
  const [logs, setLogs] = useState([]);

  // Fetch logs from Firebase
  const fetchLogs = async () => {
    try {
      const [usbSnapshot, ssSnapshot, clipboardSnapshot, execMonitoringSnapshot] = await Promise.all([
        get(ref(db, `usb_attempts`)),
        get(ref(db, `logs`)),
        get(ref(db, `logs`)),
        get(ref(db, `executable_monitoring`)) // Fetch from the `executable_monitoring` node
      ]);
  
      let combinedLogs = [];
  
      // Process USB attempts
      if (usbSnapshot.exists()) {
        const usbData = usbSnapshot.val();
        const userUsbLogs = Object.values(usbData).filter(
          (log) => log.user === username
        );
  
        combinedLogs = combinedLogs.concat(
          userUsbLogs.map((log) => ({
            type: "USB Attempt",
            timestamp: log.timestamp || "N/A",
            additionalInfo: log.device_id || "N/A",
          }))
        );
      }
  
      // Process SS logs
      if (ssSnapshot.exists()) {
        const ssData = ssSnapshot.val();
        const userSsLogs = Object.values(ssData).filter(
          (log) => log.device === username
        );
  
        combinedLogs = combinedLogs.concat(
          userSsLogs.map((log) => ({
            type: "SS Attempt",
            timestamp: log.timestamp || "N/A",
            additionalInfo: log.screenshot_filename || "N/A",
          }))
        );
      }
  
      // Process Clipboard data
      if (clipboardSnapshot.exists()) {
        const clipboardData = clipboardSnapshot.val();
        const userClipboardLogs = Object.values(clipboardData).filter(
          (log) => log.username === username
        );
  
        combinedLogs = combinedLogs.concat(
          userClipboardLogs.map((log) => ({
            type: "Clipboard Attempt",
            timestamp: log.timestamp || "N/A",
            additionalInfo: "N/A", // No additional info for clipboard
          }))
        );
      }
  
      // Process Executable Monitoring logs
      if (execMonitoringSnapshot.exists()) {
        const execMonitoringData = execMonitoringSnapshot.val();
        const userExecMonitoringLogs = Object.values(execMonitoringData).filter(
          (log) => log.user === username
        );
  
        combinedLogs = combinedLogs.concat(
          userExecMonitoringLogs.map((log) => ({
            type: "Executable Monitoring",
            timestamp: log.timestamp || "N/A",
            additionalInfo: `${log.action || "N/A"} by ${log.authorized_by || "Unknown"}`,
          }))
        );
      }
  
      // Sort logs by timestamp (latest to oldest)
      combinedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
      // Add serial numbers after sorting
      combinedLogs = combinedLogs.map((log, index) => ({
        ...log,
        srNo: index + 1,
      }));
  
      setLogs(combinedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };
  

  // Fetch logs when the component mounts
  useEffect(() => {
    fetchLogs();
  }, [username]);

  return (
    <div className="logsTableContainer">
      <h1>{`Logs for ${username}`}</h1>
      <table className="logsTable">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Type</th>
            <th>Timestamp</th>
            <th>Additional Info</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.srNo}>
                <td>{log.srNo}</td>
                <td>{log.type}</td>
                <td>{log.timestamp}</td>
                <td>{log.additionalInfo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="noData">
                No logs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;
