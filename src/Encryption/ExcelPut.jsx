import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './firebaseConfig'; // Import your Firebase configuration file
import './AddFilePassword.css'; // Import the CSS file for styling

const AddFilePassword = () => {
  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [fileType, setFileType] = useState('pdf'); // Default file type is PDF
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileName || !password) {
      setStatus('Please enter both file name and password.');
      return;
    }

    // Determine the node based on file type
    const node = fileType === 'pdf' ? 'pdfPasswords' : 'fp';

    try {
      // Reference to the respective node in Firebase
      const fileRef = ref(db, `${node}/${fileName}`);
      // Push data to Firebase
      await set(fileRef, password);
      setStatus(`Successfully added "${fileName}" to the ${node} node.`);
      setFileName('');
      setPassword('');
    } catch (error) {
      console.error('Error adding data to Firebase:', error);
      setStatus('Failed to add data to Firebase. Please try again.');
    }
  };

  return (
    <div className="addFilePasswordContainer">
      <h2 className="addFilePasswordTitle">Add File Password</h2>
      <form onSubmit={handleSubmit} className="addFilePasswordForm">
        <div className="inputGroup">
          <label>
            <strong>File Type:</strong>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="inputField"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </label>
        </div>
        <div className="inputGroup">
          <label>
            <strong>File Name:</strong>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value.replace(/\.pdf$/, ''))} // Remove .pdf extension
              placeholder="e.g., contentCheck"
              className="inputField"
            />
          </label>
        </div>
        <div className="inputGroup">
          <label>
            <strong>Password:</strong>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="inputField"
            />
          </label>
        </div>
        <button type="submit" className="submitButton">Add File</button>
      </form>
      {status && (
        <p
          className={`statusMessage ${
            status.startsWith('Successfully') ? 'successMessage' : 'errorMessage'
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default AddFilePassword;
