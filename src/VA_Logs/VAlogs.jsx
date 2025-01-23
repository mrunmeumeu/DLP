import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js';
import { ref, get } from 'firebase/database';
import './ClientLogs.css';

const ClientLogViewer = () => {
  const [db, setDb] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [openPorts, setOpenPorts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize Firebase
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

  // Fetch unique client names
  useEffect(() => {
    if (!db) return;

    const fetchClients = async () => {
      setLoading(true);
      try {
        const snapshot = await get(ref(db, 'vulnerability_assessment'));
        if (snapshot.exists()) {
          const assessmentData = snapshot.val();
          const clientNames = new Set(
            Object.values(assessmentData).map((entry) => entry.device_name)
          );
          setClients(Array.from(clientNames));
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [db]);

  // Fetch logs for the selected client
  useEffect(() => {
    if (!selectedClient || !db) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const snapshot = await get(ref(db, 'vulnerability_assessment'));
        if (snapshot.exists()) {
          const assessmentData = snapshot.val();
          const filteredLogs = Object.entries(assessmentData)
            .filter(([, entry]) => entry.device_name === selectedClient)
            .map(([key, entry], index) => {
              let openPortsCount = 0;
              if (entry.assessment) {
                openPortsCount = Object.values(entry.assessment).filter(
                  (details) => details.Status === 'Open'
                ).length;
              }
              return {
                id: key,
                index: index + 1,
                openPortsCount,
                timestamp: entry.timestamp || 'N/A', // Add timestamp
                ...entry,
              };
            })
            .sort((a, b) => {
              // Sort by valid timestamps first, then by descending order of timestamps
              const timeA = a.timestamp === 'N/A' ? 0 : new Date(a.timestamp).getTime();
              const timeB = b.timestamp === 'N/A' ? 0 : new Date(b.timestamp).getTime();
              return timeB - timeA; // Push 'N/A' to the bottom
            });// Sort by timestamp descending

          setLogs(filteredLogs);
          setSelectedLog(null);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedClient, db]);

  // Generate chart data for the selected log
  const chartData = useMemo(() => {
    if (!selectedLog || !selectedLog.assessment) {
      return { labels: [], datasets: [] };
    }

    let openCount = 0;
    let closedCount = 0;
    const openPortsList = [];

    Object.entries(selectedLog.assessment).forEach(([port, details]) => {
      if (details.Status === 'Open') {
        openCount++;
        openPortsList.push(details.Port);
      } else if (details.Status === 'Closed') {
        closedCount++;
      }
    });

    setOpenPorts(openPortsList);

    return {
      labels: ['Open Ports', 'Closed Ports'],
      datasets: [
        {
          label: 'Port Status',
          data: [openCount, closedCount],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    };
  }, [selectedLog]);

  return (
    <div className="clientLogViewer">
      <h2>Client Log Viewer</h2>

      <label htmlFor="client-select">Select Client: </label>
      <select
        id="client-select"
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
      >
        <option value="">-- Select a Client --</option>
        {clients.map((client, index) => (
          <option key={index} value={client}>
            {client}
          </option>
        ))}
      </select>

      {/* Display graph at the top */}
      {selectedLog && (
        <div className="graphContainer">
          <h3>Log Details (Assessment {selectedLog.index}):</h3>
          <Bar data={chartData} options={{ responsive: true }} />
          <div className="openPorts">
            <h3>Open Ports:</h3>
            {openPorts.length > 0 ? (
              <ul>
                {openPorts.map((port, index) => (
                  <li key={index}>Port: {port}</li>
                ))}
              </ul>
            ) : (
              <p>No open ports found.</p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading logs...</p>
      ) : logs.length > 0 ? (
        <table className="logTable">
          <thead>
            <tr>
              <th>Assessment No.</th>
              <th>Timestamp</th> {/* New column header */}
              <th>View Assessment</th>
              <th>Open Ports</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.index}</td>
                <td>{log.timestamp}</td> {/* Display timestamp */}
                <td>
                  <button
                    className="logButton"
                    onClick={() => setSelectedLog(log)}
                  >
                    View Assessment
                  </button>
                </td>
                <td>{log.openPortsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedClient && <p className="loading">No logs found for {selectedClient}.</p>
      )}
    </div>
  );
};

export default ClientLogViewer;
