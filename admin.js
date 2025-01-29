// Base URL for the Flask server
const BASE_URL = 'http://localhost:5001/keywords';

// Function to load sensitive words from Flask server
function loadSensitiveWords() {
    fetch(BASE_URL) // Fetch keywords from the Flask server
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const words = data.keywords || [];
            const wordList = document.getElementById('word-list');
            wordList.innerHTML = ''; // Clear the current list

            if (words.length === 0) {
                // If no words exist, display a message
                const listItem = document.createElement('li');
                listItem.textContent = 'No sensitive words defined.';
                wordList.appendChild(listItem);
            } else {
                // Display each word with a remove button
                words.forEach((word) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = word;

                    // Create a remove button
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.style.marginLeft = '10px';
                    removeButton.addEventListener('click', function () {
                        removeSensitiveWord(word);
                    });

                    listItem.appendChild(removeButton);
                    wordList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching sensitive words:', error);
        });
}

// Function to add a new sensitive word via Flask server
document.getElementById('add-word').addEventListener('click', function () {
    const newWord = document.getElementById('new-word').value.trim();
    const errorMessage = document.getElementById('error-message');

    if (newWord) {
        errorMessage.textContent = ''; // Clear any previous error

        // Post new word to Flask server
        fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword: newWord }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                loadSensitiveWords(); // Reload the word list
                document.getElementById('new-word').value = ''; // Clear the input
            })
            .catch(error => {
                console.error('Error adding sensitive word:', error);
            });
    } else {
        errorMessage.textContent = 'Please enter a valid word.';
    }
});

// Function to remove a sensitive word via Flask server
function removeSensitiveWord(keyword) {
    fetch(`${BASE_URL}/${keyword}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            loadSensitiveWords(); // Reload the word list
        })
        .catch(error => {
            console.error('Error removing sensitive word:', error);
        });
}

// Load the words when the page loads
document.addEventListener('DOMContentLoaded', loadSensitiveWords);
