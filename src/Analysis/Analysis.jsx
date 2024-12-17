import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebaseConfig'; // Import Firebase config
import { ref, get } from 'firebase/database'; // Import necessary Firebase functions
import './UserDataPage.css'; // Import the CSS file

const UserDataPage = () => {
  const { username } = useParams(); // Extract username from route
  const [totalViolations, setTotalViolations] = useState(0); // Total violations for the user
  const [clipboardCount, setClipboardCount] = useState(0); // Violations from logs with username
  const [ssCount, setSsCount] = useState(0); // Violations from logs with device
  const [usbLogsCount, setUsbLogsCount] = useState(0); // Violations from usb_attempts
  const [execMonitoringCount, setExecMonitoringCount] = useState(0); // Violations from executable_monitoring
  const [logs, setLogs] = useState([]); // Combined logs for the table
  const [selectedHistory, setSelectedHistory] = useState(''); // Track selected history type
  const [historyData, setHistoryData] = useState([]); // Store history data

  // Fetch violations count and logs from Firebase
  const fetchData = async () => {
    if (!username) return;

    try {
      const logsRef = ref(db, 'logs'); // Reference to 'logs' node
      const usbAttemptsRef = ref(db, 'usb_attempts'); // Reference to 'usb_attempts' node
      const execMonitoringRef = ref(db, 'executable_monitoring'); // Reference to 'executable_monitoring' node

      const [logsSnapshot, usbAttemptsSnapshot, execMonitoringSnapshot] = await Promise.all([
        get(logsRef),
        get(usbAttemptsRef),
        get(execMonitoringRef),
      ]);

      let clipboardCount = 0;
      let ssCount = 0;
      let usbLogsCount = 0;
      let execMonitoringCount = 0;
      let combinedLogs = [];

      // Process logs for the user
      if (logsSnapshot.exists()) {
        const logs = logsSnapshot.val();

        // Filter logs by type
        const clipboardLogs = Object.values(logs).filter((log) => log.username === username);
        const ssLogs = Object.values(logs).filter((log) => log.device === username);

        // Update counts
        clipboardCount = clipboardLogs.length;
        ssCount = ssLogs.length;

        // Add logs to the combined list
        combinedLogs = combinedLogs.concat(
          clipboardLogs.map((log) => ({
            type: 'Clipboard Attempt',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.detected_word || 'N/A',
          })),
          ssLogs.map((log) => ({
            type: 'SS Attempt',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.screenshot_filename || 'N/A',
          }))
        );
      }

      // Process USB attempts for the user
      if (usbAttemptsSnapshot.exists()) {
        const usbAttempts = usbAttemptsSnapshot.val();
        const userUsbLogs = Object.values(usbAttempts).filter((attempt) => attempt.user === username);

        usbLogsCount = userUsbLogs.length;

        combinedLogs = combinedLogs.concat(
          userUsbLogs.map((log) => ({
            type: 'USB Attempt',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.device_id || 'N/A',
          }))
        );
      }

      // Process Executable Monitoring logs for the user
      if (execMonitoringSnapshot.exists()) {
        const execMonitoringLogs = execMonitoringSnapshot.val();
        const userExecLogs = Object.values(execMonitoringLogs).filter((log) => log.user === username);

        execMonitoringCount = userExecLogs.length;

        combinedLogs = combinedLogs.concat(
          userExecLogs.map((log) => ({
            type: 'Executable Monitoring',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: `${log.action || 'N/A'} by ${log.authorized_by || 'Unknown'}`,
          }))
        );
      }

      // Sort logs by timestamp (latest first)
      combinedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Set counts and logs
      setClipboardCount(clipboardCount);
      setSsCount(ssCount);
      setUsbLogsCount(usbLogsCount);
      setExecMonitoringCount(execMonitoringCount);
      setTotalViolations(clipboardCount + ssCount + usbLogsCount + execMonitoringCount);
      setLogs(combinedLogs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch history data
  const fetchHistory = async () => {
    if (!selectedHistory || !username) return;

    let historyRef;
    switch (selectedHistory) {
      case 'Clipboard History':
        historyRef = ref(db, `keyword_hist/${username}`);
        break;
      case 'SS History':
        historyRef = ref(db, `ss_hist/${username}`);
        break;
      case 'USB History':
        historyRef = ref(db, `usb_hist/${username}`);
        break;
      default:
        return;
    }

    try {
      const snapshot = await get(historyRef);
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setHistoryData(data);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, [username]);

  // Fetch history data when history type changes
  useEffect(() => {
    fetchHistory();
  }, [selectedHistory]);

  return (
    <div className="userDataPage">
      <h1>{`Audits for ${username}`}</h1>

      {/* Total Violations Box */}
      {!selectedHistory && (
        <div className="violationsBox">
          <div className="violationsRow">
            <div className="violationColumn">
              <div className="violationLabel">Total Violations</div>
              <div className="violationValue">{totalViolations}</div>
            </div>
            <div className="violationColumn">
              <div className="violationLabel">Clipboard Count</div>
              <div className="violationValue">{clipboardCount}</div>
            </div>
            <div className="violationColumn">
              <div className="violationLabel">SS Count</div>
              <div className="violationValue">{ssCount}</div>
            </div>
            <div className="violationColumn">
              <div className="violationLabel">USB Logs</div>
              <div className="violationValue">{usbLogsCount}</div>
            </div>
            <div className="violationColumn">
              <div className="violationLabel">Exec Monitoring Count</div>
              <div className="violationValue">{execMonitoringCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* History Dropdown */}
      <div className="historyDropdown">
        <label htmlFor="historySelect">Select History:</label>
        <select
          id="historySelect"
          value={selectedHistory}
          onChange={(e) => setSelectedHistory(e.target.value)}
        >
          <option value="">Choose History</option>
          <option value="Clipboard History">Clipboard History</option>
          <option value="SS History">SS History</option>
          <option value="USB History">USB History</option>
        </select>
      </div>

      {/* History Table */}
      {selectedHistory && (
        <div className="historyTableContainer">
          <h2>{selectedHistory}</h2>
          <table className="historyTable">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Timestamp</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.timestamp || 'N/A'}</td>
                    <td>{JSON.stringify(item)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="noData">
                    No history data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Logs Table */}
      {!selectedHistory && (
        <div className="logsTableContainer">
          <h2>Detailed Logs</h2>
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
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
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
      )}
    </div>
  );
};

export default UserDataPage;
