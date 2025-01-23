import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './KeywordForm.module.css';

function KeywordForm() {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  // Fetch the keywords from the server on component load
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/keywords');
        setKeywords(response.data.keywords);
      } catch (error) {
        console.error("Error fetching keywords:", error);
      }
    };
    fetchKeywords();
  }, []);

  // Add a new keyword
  const handleEnableKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/keywords', { keyword: newKeyword });
      if (response.status === 200) {
        setKeywords(response.data.keywords); // Update with the new keyword list from the server
        setNewKeyword('');
      }
    } catch (error) {
      console.error("Error enabling keyword:", error);
    }
  };

  // Disable the keyword
  const handleDisableKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const response = await axios.delete(`http://localhost:5000/keywords/${newKeyword}`);
      if (response.status === 200) {
        setKeywords(response.data.keywords); // Update with the new keyword list from the server
        setNewKeyword('');
      }
    } catch (error) {
      console.error("Error disabling keyword:", error);
    }
  };

  return (
    <div className={styles.keywordForm}>
      <div className={styles.inputSection}>
        <label htmlFor="keywordInput" className={styles.inputLabel}>
          Manage Keywords
        </label>
        <input
          type="text"
          id="keywordInput"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className={styles.keywordInput}
          placeholder="Enter keyword here"
        />
        <div className={styles.buttonGroup}>
          <button onClick={handleEnableKeyword} className={styles.enableButton}>
            Enable Keyword
          </button>
          <button onClick={handleDisableKeyword} className={styles.disableButton}>
            Disable Keyword
          </button>
        </div>
      </div>
      <div className={styles.keywordList}>
        <label htmlFor="currentKeywords" className={styles.inputLabel}>
          Current Keywords
        </label>
        <ul className={styles.keywordListItems}>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default KeywordForm;
