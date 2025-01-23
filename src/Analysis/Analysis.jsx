import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Dynamic Firebase initialization
import { ref, get } from 'firebase/database';
import './UserDataPage.css';

const UserDataPage = () => {
  const { username } = useParams();
  const [db, setDb] = useState(null); // State to store Firebase database instance
  const [totalViolations, setTotalViolations] = useState(0);
  const [clipboardCount, setClipboardCount] = useState(0);
  const [ssCount, setSsCount] = useState(0);
  const [usbLogsCount, setUsbLogsCount] = useState(0);
  const [execMonitoringCount, setExecMonitoringCount] = useState(0);
  const [mailViolationsCount, setMailViolationsCount] = useState(0);

  const [logs, setLogs] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedHistory, setSelectedHistory] = useState('');
  const [historyData, setHistoryData] = useState([]);

  // Fetch Firebase Database Instance
  useEffect(() => {
    const fetchFirebaseDb = async () => {
      try {
        const database = await initializeFirebase();
        setDb(database);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    fetchFirebaseDb();
  }, []);

  const fetchData = async () => {
    if (!username || !db) return;

    try {
      const logsRef = ref(db, 'logs');
      const usbAttemptsRef = ref(db, 'usb_attempts');
      const execMonitoringRef = ref(db, 'executable_violations');
      const mailViolationsRef = ref(db, 'mail_violations'); // Reference to mail_violations node
      const outlookViolationsRef = ref(db, 'outlook_violations'); // Reference to outlook_violations node

      const [logsSnapshot, usbAttemptsSnapshot, execMonitoringSnapshot,mailViolationsSnapshot,outlookViolationsSnapshot] = await Promise.all([
        get(logsRef),
        get(usbAttemptsRef),
        get(execMonitoringRef),
        get(mailViolationsRef), // Fetch mail violations data
        get(outlookViolationsRef),

      ]);

      let clipboardCount = 0;
      let ssCount = 0;
      let usbLogsCount = 0;
      let execMonitoringCount = 0;
      let mailViolationsCount = 0;

      let combinedLogs = [];

      if (logsSnapshot.exists()) {
        const logs = logsSnapshot.val();
        const clipboardLogs = Object.values(logs).filter((log) => log.username === username);
        const ssLogs = Object.values(logs).filter((log) => log.device === username);

        clipboardCount = clipboardLogs.length;
        ssCount = ssLogs.length;

        combinedLogs = combinedLogs.concat(
          clipboardLogs.map((log) => ({
            type: 'Clipboard Attempt',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.detected_word || log.event_description ||'N/A',
          })),
          ssLogs.map((log) => ({
            type: 'SS Attempt',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.screenshot_filename || 'N/A',
          }))
        );
      }

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

      if (execMonitoringSnapshot.exists()) {
        const execMonitoringLogs = execMonitoringSnapshot.val();
        const userExecLogs = Object.values(execMonitoringLogs).filter((log) => log.device_name === username);

        execMonitoringCount = userExecLogs.length;

        combinedLogs = combinedLogs.concat(
          userExecLogs.map((log) => ({
            type: 'Executable Monitoring',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: `${log.action || 'N/A'} by ${log.exe_name || 'Unknown'}`,
          }))
        );
      }
      if (mailViolationsSnapshot.exists()) {
        const mailViolations = mailViolationsSnapshot.val();
        const userMailLogs = Object.values(mailViolations).filter((log) => log.device_name === username);

        mailViolationsCount = userMailLogs.length;

        combinedLogs = combinedLogs.concat(
          userMailLogs.map((log) => ({
            type: 'Mail Violation',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.word_detected || 'N/A',
          }))
        );
      }


      if (outlookViolationsSnapshot.exists()) {
        const outlookViolations = outlookViolationsSnapshot.val();
        const userOutlookLogs = Object.values(outlookViolations).filter((log) => log.device_name === username);
  
        mailViolationsCount += userOutlookLogs.length;
  
        combinedLogs = combinedLogs.concat(
          userOutlookLogs.map((log) => ({
            type: 'Outlook Violation',
            timestamp: log.timestamp || 'N/A',
            additionalInfo: log.keywords ? log.keywords.join(', ') : 'N/A',
          }))
        );
      }
      
      combinedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setClipboardCount(clipboardCount);
      setSsCount(ssCount);
      setUsbLogsCount(usbLogsCount);
      setExecMonitoringCount(execMonitoringCount);
      setMailViolationsCount(mailViolationsCount);

      setTotalViolations(clipboardCount + ssCount + usbLogsCount + execMonitoringCount + mailViolationsCount);
      setLogs(combinedLogs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchHistory = async () => {
    if (!selectedHistory || !username || !db) return;

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
        setHistoryData(Object.values(snapshot.val()));
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username, db]);

  useEffect(() => {
    fetchHistory();
  }, [selectedHistory, db]);

  const filteredLogs = selectedFilter === 'All' ? logs : logs.filter((log) => log.type === selectedFilter);

  return (
    <div className="userDataPage">
      <h1>{`Audits for ${username}`}</h1>
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
            <div className="violationColumn">
            <div className="violationLabel">Mail Violations</div>
            <div className="violationValue">{mailViolationsCount}</div>
          </div>
          </div>
        </div>
      )}

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

      {selectedHistory ? (
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
                  <td colSpan="3">No history data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
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
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{log.type}</td>
                    <td>{log.timestamp}</td>
                    <td>{log.additionalInfo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No logs available</td>
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
