import React, { useState, useEffect } from 'react';
import initializeFirebase from 'C:\\Users\\Mrunmai\\intern\\attempt\\pg1\\src\\firebase.js'; // Firebase initialization
import { ref, get } from 'firebase/database'; // Firebase functions
import './LastHourViolations.css'; // CSS file for styling

const LastHourViolations = ({ onViolationCountChange }) => {
  const [db, setDb] = useState(null); // Firebase database instance
  const [violations, setViolations] = useState({
    logs: 0,
    usb_attempts: 0,
    executable_violations: 0,
    mail_violations: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false); // Toggle for showing breakdown

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

  // Fetch violations from Firebase
  useEffect(() => {
    if (!db) return;

    const fetchViolations = async () => {
      try {
        const nodes = [
          { name: 'logs', refPath: 'logs' },
          { name: 'usb_attempts', refPath: 'usb_attempts' },
          { name: 'executable_violations', refPath: 'executable_violations' },
          { name: 'mail_violations', refPath: 'mail_violations' },
        ];

        const currentTime = Date.now();
        const oneHourAgo = currentTime - 60 * 60 * 1000; // Timestamp for one hour ago

        const counts = {
          logs: 0,
          usb_attempts: 0,
          executable_violations: 0,
          mail_violations: 0,
        };

        const nodePromises = nodes.map((node) =>
          get(ref(db, node.refPath)).then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              Object.values(data).forEach((log) => {
                const logTime = new Date(log.timestamp).getTime();
                if (logTime >= oneHourAgo) {
                  counts[node.name]++;
                }
              });
            }
          })
        );

        await Promise.all(nodePromises);
        setViolations(counts);

        // Notify the parent component of the total violations
        const total = counts.logs + counts.usb_attempts + counts.executable_violations + counts.mail_violations;
        if (onViolationCountChange) {
          onViolationCountChange(total);
        }
      } catch (error) {
        console.error('Error fetching violations:', error);
      }
    };

    fetchViolations();
  }, [db, onViolationCountChange]);

  const totalViolations =
    violations.logs +
    violations.usb_attempts +
    violations.executable_violations +
    violations.mail_violations;

  return (
    <div className="violationsContainer">
      {/* Main Box for Total Violations */}
      <div className="violationsBox" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>Total Violations in the Last Hour</h2>
        <div className="totalViolations">{totalViolations}</div>
        <p className="clickText">
          {isExpanded ? 'Click to collapse' : 'Click for breakdown'}
        </p>
      </div>

      {/* Breakdown Box */}
      {isExpanded && (
        <div className="breakdownBox">
          <h3>Breakdown of Violations:</h3>
          <ul>
            <li>
              <span className="violationType">Logs:</span> {violations.logs}
            </li>
            <li>
              <span className="violationType">USB Attempts:</span>{' '}
              {violations.usb_attempts}
            </li>
            <li>
              <span className="violationType">Executable Violations:</span>{' '}
              {violations.executable_violations}
            </li>
            <li>
              <span className="violationType">Mail Violations:</span>{' '}
              {violations.mail_violations}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LastHourViolations;
