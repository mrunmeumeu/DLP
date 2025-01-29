// List of sensitive words to check in .txt, .xlsx, .docx, .pdf, and zipped files

async function fetchSensitiveWords() {
    try {
        const response = await fetch('http://localhost:5001/keywords'); // Replace with your Flask server URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.keywords || [];
    } catch (error) {
        console.error("Error fetching sensitive words:", error);
        return []; // Return an empty array if there's an error
    }
}


async function logViolation(deviceName, wordDetected, timestamp) {
    try {
        const response = await fetch('http://localhost:5001/log-violation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_name: deviceName,
                word_detected: wordDetected,
                timestamp: timestamp,
            }),
        });
        console.log("Raw response:", response);

        const data = await response.json();
        if (!response.ok) {
            console.error("Error logging violation:", data);
        } else {
            console.log("Violation logged successfully:", data);
        }
    } catch (error) {
        console.error("Error logging violation:", error);
    }
}



async function containsSensitiveWords(content) {
    console.log("Checking for sensitive words in the content...");

    // Fetch updated keywords from the Flask API
    const sensitiveWords = await fetchSensitiveWords();

    const contentLower = content.toLowerCase();
    const detectedWord = sensitiveWords.find((word) => contentLower.includes(word.toLowerCase()));

    if (detectedWord) {
        console.log("Sensitive content detected:", detectedWord);

        // Log the violation
        const deviceName = navigator.userAgent; // Use userAgent as a simple device identifier
        const timestamp = new Date().toISOString();
        await logViolation(deviceName, detectedWord, timestamp);

        return true;
    }

    return false;
}

// Function to validate .txt files based on content
async function validateTxtFile(file) {
    try {
        if (file.type === 'text/plain') {
            const fileContent = await readTextFile(file);
            if (await containsSensitiveWords(fileContent)) {
                return false; // Invalid if it contains sensitive words
            }
        }
    } catch (error) {
        console.error("Error in validateTxtFile: ", error);
    }
    return true; // Valid if no sensitive words or not a .txt file
}

// Function to validate .xlsx files based on content
async function validateExcelFile(file) {
    try {
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const fileContent = await readExcelFile(file);
            if (await containsSensitiveWords(fileContent)) {
                return false; // Invalid if it contains sensitive words
            }
        }
    } catch (error) {
        console.error("Error in validateExcelFile: ", error);
    }
    return true; // Valid if no sensitive words or not an Excel file
}

// Function to validate .docx files based on content using Mammoth.js
async function validateDocxFile(file) {
    try {
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const fileContent = await readDocxFile(file);
            if (await containsSensitiveWords(fileContent)) {
                return false; // Invalid if it contains sensitive words
            }
        }
    } catch (error) {
        console.error("Error in validateDocxFile: ", error);
    }
    return true; // Valid if no sensitive words or not a .docx file
}

// Function to validate .pdf files using PDF.js
async function validatePdfFile(file) {
    try {
        if (file.type === 'application/pdf') {
            const fileContent = await readPdfFile(file);
            if (await containsSensitiveWords(fileContent)) {
                return false; // Invalid if it contains sensitive words
            }
        }
    } catch (error) {
        console.error("Error in validatePdfFile: ", error);
    }
    return true; // Valid if no sensitive words or not a PDF file
}

// Function to validate .zip files by extracting contents and validating each file
async function validateZipFile(file) {
    try {
        if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
            const fileContent = await readZipFile(file);
            for (let fileName in fileContent) {
                const extractedFile = fileContent[fileName];
                if (fileName.endsWith('.txt') && !await validateTxtFile(extractedFile)) return false;
                if (fileName.endsWith('.xlsx') && !await validateExcelFile(extractedFile)) return false;
                if (fileName.endsWith('.docx') && !await validateDocxFile(extractedFile)) return false;
                if (fileName.endsWith('.pdf') && !await validatePdfFile(extractedFile)) return false;
            }
        }
    } catch (error) {
        console.error("Error in validateZipFile: ", error);
    }
    return true; // Return true if the ZIP doesn't contain any sensitive files
}

// Function to read .txt file and extract its text content
function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file); // Read file as text
    });
}

// Function to read .xlsx files using SheetJS
async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            let result = '';
            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                result += XLSX.utils.sheet_to_csv(sheet); // Convert sheet to CSV
            });
            resolve(result); // Return the content as a string (CSV format)
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file); // Read file as binary
    });
}

// Function to read .docx files using Mammoth.js
async function readDocxFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value); // Extracted text
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file); // Read the file as an array buffer
    });
}

// Function to read .pdf files using PDF.js
async function readPdfFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const typedArray = new Uint8Array(event.target.result);
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                let text = '';

                // Extract text from all pages
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    text += textContent.items.map(item => item.str).join(' ');
                }
                resolve(text); // Return the extracted text
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file); // Read the file as an array buffer
    });
}

// Function to read ZIP files using JSZip
async function readZipFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const zip = await JSZip.loadAsync(event.target.result);
                const extractedFiles = {};
                for (let fileName in zip.files) {
                    if (!zip.files[fileName].dir) {
                        const fileData = await zip.files[fileName].async('string'); // Read as text
                        extractedFiles[fileName] = fileData;
                    }
                }
                resolve(extractedFiles); // Return the extracted files as key-value pairs
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file); // Read the ZIP file as an array buffer
    });
}
function closeCurrentTab() {
    chrome.runtime.sendMessage({ action: 'closeTab' });
}
// Function to check if the content contains sensitive words


// Retry mechanism with setTimeout to click the "Delete draft" button
function clickDeleteDraftButton(attempts = 0) {
    const deleteButton = document.querySelector('div.og.T-I-J3'); // Using the class name

    if (deleteButton) {
        console.log("Delete draft button found, clicking now...");
        deleteButton.click(); // Simulate click on the delete draft button
    } else if (attempts < 5) { // Retry up to 5 times
        console.log("Delete draft button not found, retrying...");
        setTimeout(() => clickDeleteDraftButton(attempts + 1), 1000); // Retry after 1 second
    } else {
        console.log("Delete draft button not found after several attempts.");
    }
}
let typingTimeout;

// Function to monitor Gmail content changes
function monitorGmailContent() {
    // MutationObserver to watch changes in the Gmail content
    const observer = new MutationObserver((mutationsList, observer) => {
        // Look through all mutations that just occurred
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                // Find the contenteditable element with aria-label="Message Body"
                const emailBody = document.querySelector('[aria-label="Message Body"][contenteditable="true"]');
                
                if (emailBody) {
                    const content = emailBody.innerText || emailBody.textContent;
                    
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(async () => {                        // Check if the content contains sensitive words
                        if (await containsSensitiveWords(content)) {
                            alert("Sensitive content detected in your email.");
                            console.log("Sensitive content detected. Deleting the draft...");
                            // Delete the draft after showing the warning
                            clickDeleteDraftButton();
                        }
                    }, 500);  // Wait for 500ms after the last keystroke before checking
                }
            }
        }
    });

    // Observe the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
}
// Call the function to start monitoring the Gmail content
monitorGmailContent();


// Monitor for file input elements on the page
document.addEventListener('change', async function(event) {
    if (event.target.type === 'file') {
        const fileInput = event.target;
        const file = fileInput.files[0];

        // Prevent file upload if it's a sensitive file
        let isValid = true;

        // Check .txt files
        if (file.type === 'text/plain') {
            isValid = await validateTxtFile(file);
        }

        // Check Excel files
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            isValid = await validateExcelFile(file);
        }

        // Check Word files
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            isValid = await validateDocxFile(file);
        }

        // Check PDF files
        if (file.type === 'application/pdf') {
            isValid = await validatePdfFile(file);
        }

        // Check ZIP files
        if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
            isValid = await validateZipFile(file);
        }

        // Block file upload if the file is not valid (contains sensitive content)
        if (!isValid) {
            alert("Sensitive content detected. Taking action...");

            // Check if the current URL is Gmail or Google Drive
            if (window.location.href.includes("mail.google.com")) {
                // If Gmail, delete the draft
                alert("Sensitive content detected in Gmail. Deleting the draft.");
                clickDeleteDraftButton(); // Call the function to delete the draft
            } else if (window.location.href.includes("drive.google.com")) {
                // If Google Drive, close the tab
                alert("Sensitive content detected in Google Drive. Closing the tab.");
                closeCurrentTab(); // Send a message to close the current tab
            }

            // Clear the input value to prevent uploading
            fileInput.value = '';  // Clear the file input

            // Prevent default upload behavior
            event.preventDefault();
        } else {
            alert("File is valid and ready for upload.");
        }
    }
}, true);