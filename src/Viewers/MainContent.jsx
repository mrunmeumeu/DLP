import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for HTTP requests
import styles from "./VulnerabilityAssessment.module.css";

function MainContent() {
  const [clients, setClients] = useState([]); // Store the list of clients
  const [selectedClients, setSelectedClients] = useState([]); // Store selected clients
  const [viewers, setViewers] = useState({
    excel: false,
    image: false,
    pdf: false,
  }); // Manage the state of all viewers

  // Fetch the list of clients from the server
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/scan-network");
        setClients(response.data); // Set the clients list in state
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClients();
  }, []);

  // Handle client checkbox toggle
  const handleClientSelection = (ip) => {
    setSelectedClients((prev) =>
      prev.includes(ip)
        ? prev.filter((client) => client !== ip)
        : [...prev, ip]
    );
  };

  // Function to toggle viewer state and make API call
  const toggleViewer = async (viewerType) => {
    const toggleState = !viewers[viewerType];
    setViewers((prev) => ({
      ...prev,
      [viewerType]: toggleState, // Update the state optimistically
    }));
   // Determine the new state
    try {
      const response = await axios.post(
        "http://localhost:5000/enable-type-viewer",
        {
          viewerType: viewerType,
          toggleState: toggleState, 
          client_ids: selectedClients, // Send only the toggle state (true/false)
        }
      );

      if (response.data.success) {
        setViewers((prev) => ({
          ...prev,
          [viewerType]: toggleState,
        })); // Update the state for the specific viewer
      } else {
        alert("Failed to toggle viewer. Please try again.");
      }
    } catch (error) {
      console.error("Error while toggling viewer:", error);
      alert("An error occurred while toggling the viewer.");
    }
  };

  return (
    <section className={styles.mainContent}>
      <h2 className={styles.contentTitle}>Vulnerability Assessment Scan</h2>

      {/* List of clients displayed in a table */}
      <h3>Select Clients</h3>
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
                      checked={selectedClients.includes(client.ip)}
                      onChange={() => handleClientSelection(client.ip)} // Toggle client selection
                    />
                    <span className={styles.checkmark}></span>
                  </label>
                </td>
                <td className={styles.ipColumn}>{client.ip}</td>
                <td className={styles.nameColumn}>{client.user_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toggle buttons for enabling/disabling viewers */}
      <div className={styles.toggleButtons}>
        {["excel", "image", "pdf"].map((viewerType) => (
          <label key={viewerType} className={styles.switch}>
            <input
              type="checkbox"
              checked={viewers[viewerType]}
              onChange={() => toggleViewer(viewerType)}
            />
            <span className={styles.slider}></span>
            <span className={styles.toggleText}>
              {viewers[viewerType]
                ? `Disable ${viewerType.charAt(0).toUpperCase() + viewerType.slice(1)} Viewer`
                : `Enable ${viewerType.charAt(0).toUpperCase() + viewerType.slice(1)} Viewer`}
            </span>
          </label>
        ))}
      </div>

      {/* Conditional rendering for viewers based on toggle state */}
     
     
    </section>
  );
}

export default MainContent;
