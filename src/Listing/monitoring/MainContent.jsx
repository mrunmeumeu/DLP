import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './Maincontent.module.css';

function MainContent() {
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');
  const [selectedPath, setSelectedPath] = useState('');

  const { ip } = useParams();
  const baseURL = ip ? `http://${ip}:5001` : 'http://localhost:5000';

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await axios.get(`${baseURL}/paths`);
        setPaths(response.data.paths);
      } catch (error) {
        console.error('Error fetching paths:', error);
      }
    };
    fetchPaths();
  }, [baseURL]);

  const handleAddPath = async () => {
    if (!newPath.trim()) return;

    try {
      const response = await axios.post(`${baseURL}/paths`, { path: newPath });
      if (response.status === 200) {
        setPaths(response.data.paths);
        setNewPath('');

        console.log('Disabling executable monitoring...');
        await axios.post(`${baseURL}/disable-executable-monitoring`, {
          client_ids: [ip],
          authorized_by: 'React User',
        });

        console.log('Waiting before re-enabling executable monitoring...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('Enabling executable monitoring...');
        await axios.post(`${baseURL}/enable-executable-monitoring`, {
          client_ids: [ip],
          authorized_by: 'React User',
        });

        console.log('Executable monitoring restarted successfully.');
      }
    } catch (error) {
      console.error('Error adding path or managing executable monitoring:', error);
    }
  };

  const handleDeletePath = async () => {
    if (!selectedPath) return;

    try {
      const response = await axios.delete(`${baseURL}/paths/${encodeURIComponent(selectedPath)}`);
      if (response.status === 200) {
        setPaths(response.data.paths);
        setSelectedPath('');

        console.log('Disabling executable monitoring...');
        await axios.post(`${baseURL}/disable-executable-monitoring`, {
          client_ids: [ip],
          authorized_by: 'React User',
        });

        console.log('Waiting before re-enabling executable monitoring...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('Enabling executable monitoring...');
        await axios.post(`${baseURL}/enable-executable-monitoring`, {
          client_ids: [ip],
          authorized_by: 'React User',
        });

        console.log('Executable monitoring restarted successfully.');
      }
    } catch (error) {
      console.error('Error deleting path or managing executable monitoring:', error);
    }
  };

  return (
    <div className={styles.mainContent}>
  <div className={styles.boxContainer}>
    <div className={styles.inputSection}>
      <label htmlFor="pathInput" className={styles.inputLabel}>
        Add a Path
      </label>
      <input
        type="text"
        id="pathInput"
        value={newPath}
        onChange={(e) => setNewPath(e.target.value)}
        className={styles.pathInput}
        placeholder="Enter path here (e.g., C:\\Program Files\\App)"
      />
      <button onClick={handleAddPath} className={styles.addButton}>
        Add
      </button>
    </div>
    <div className={styles.selectedSection}>
      <label htmlFor="currentPaths" className={styles.inputLabel}>
        Current Paths
      </label>
      <select
        id="currentPaths"
        className={styles.selectDropdown}
        value={selectedPath}
        onChange={(e) => setSelectedPath(e.target.value)}
      >
        <option value="" disabled>
          Select a path
        </option>
        {paths.map((path, index) => (
          <option key={index} value={path}>
            {path}
          </option>
        ))}
      </select>
      <button
        onClick={handleDeletePath}
        className={styles.deleteButton}
        disabled={!selectedPath}
      >
        Delete Selected Path
      </button>
    </div>
  </div>
</div>

  );
}

export default MainContent;
