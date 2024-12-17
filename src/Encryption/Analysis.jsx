import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebaseConfig'; // Import Firebase config
import { ref, get } from 'firebase/database'; // Import necessary Firebase functions
import './UserDataPage.css'; // Import the CSS file

const UserDataPage = () => {
  const { username } = useParams(); // Extract username from route
  const [categories, setCategories] = useState(['USB data', 'Clipboard data', 'SS logs']); // Available categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Currently selected category
  const [userData, setUserData] = useState(null); // Data fetched based on user and category

  // Fetch user-specific data from Firebase
  const fetchUserData = async () => {
    if (!username || !selectedCategory) return;

    try {
      let dataRef;
      switch (selectedCategory) {
        case 'USB data':
          dataRef = ref(db, `usblogs/${username}`);
          break;
        case 'Clipboard data':
          dataRef = ref(db, `keyword_monitoring/${username}`);
          break;
        case 'SS logs':
          dataRef = ref(db, `sslogs/${username}`);
          break;
        default:
          return;
      }

      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user data when category changes
  useEffect(() => {
    if (username && selectedCategory) {
      fetchUserData();
    }
  }, [username, selectedCategory]);

  return (
    <div className="userDataPage">
      <h1>{`Logs Viewer for ${username}`}</h1>

      {/* Category Selection Dropdown */}
      <div className="dropdownContainer">
        <label htmlFor="categorySelect">Select Category:</label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* User Data Display */}
      <div className="userDataContainer">
        {selectedCategory && userData ? (
          <>
            <h2>{`${selectedCategory} for ${username}`}</h2>
            <ul>
              {Object.entries(userData).map(([key, value], index) => (
                <li key={index}>
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </>
        ) : selectedCategory ? (
          <p>No data available for the selected category.</p>
        ) : (
          <p>Please select a category to view the data.</p>
        )}
      </div>
    </div>
  );
};

export default UserDataPage;
