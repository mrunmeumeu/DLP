// Function to fetch PDF passwords from the Flask server
// Function to fetch PDF passwords from the Flask server
async function fetchPasswordsFromServer() {
  try {
      console.log("Fetching passwords from the Flask server...");
      const response = await fetch("http://localhost:5001/get-pdf-passwords"); // Flask endpoint
      if (response.ok) {
          const data = await response.json();
          console.log("Passwords fetched:", data.pdfPasswords);
          return data.pdfPasswords; // The server sends keys with ".pdf"
      } else {
          console.error("Failed to fetch passwords from server:", response.statusText);
          return null;
      }
  } catch (error) {
      console.error("Error fetching passwords from server:", error);
      return null;
  }
}


// Listen for when a PDF tab is loaded
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("Tab updated:", { tabId, changeInfo, tab });

  if (changeInfo.status === "complete" && tab.url && tab.url.endsWith(".pdf")) {
    console.log("Detected a PDF tab:", tab.url);
    const url = new URL(tab.url);
    const pdfName = url.pathname.split("/").pop().split("?")[0].split("#")[0]; // Extract clean PDF name
    console.log("Extracted PDF Name:", pdfName);

    try {
      const pdfPasswords = await fetchPasswordsFromServer(); // Fetch passwords from the server

      if (pdfPasswords && pdfPasswords[pdfName]) {
        console.log("Password found for PDF:", pdfName);
        // Inject the content script to enforce the password
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: enforcePassword,
          args: [pdfName, pdfPasswords[pdfName]], // Pass the PDF name and correct password
        }).catch((error) => {
          console.error("Error injecting content script:", error);
        });
      } else {
        console.log("No password found for PDF:", pdfName);
      }
    } catch (error) {
      console.error("Error processing PDF passwords:", error);
    }
  }
});

// Function to enforce password (to be executed in the content script context)
function enforcePassword(pdfName, correctPassword) {
  console.log("Enforcing password for:", pdfName);

  const createModal = (pdfName, correctPassword) => {
    const modalOverlay = document.createElement("div");
    modalOverlay.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      WebkitBackdropFilter: blur(5px);
    `;
    modalOverlay.id = "passwordModal";

    const modalContent = document.createElement("div");
    modalContent.style = `
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      text-align: center;
      max-width: 400px;
      width: 90%;
    `;
    modalContent.innerHTML = `
      <h2>Enter Password</h2>
      <p>Password required for "${pdfName}"</p>
      <input type="password" id="pdfPassword" placeholder="Enter password" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px;">
      <button id="submitPassword" style="padding: 10px 20px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
      <button id="cancelModal" style="padding: 10px 20px; background-color: #DC3545; color: white; border: none; border-radius: 4px; margin-left: 10px; cursor: pointer;">Cancel</button>
    `;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Handle modal actions
    document.getElementById("submitPassword").addEventListener("click", () => {
      const userPassword = document.getElementById("pdfPassword").value;
      if (userPassword === correctPassword) {
        alert("Password correct. Enjoy your PDF!");
        document.body.removeChild(modalOverlay);
      } else {
        fetch("http://localhost:5001/launch_viewer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pdfName }),
        })
          .then(() => {
            alert("Incorrect password. Closing tab.");
            window.close();
          })
          .catch(() => {
            alert("An error occurred. Closing tab.");
            window.close();
          });
      }
    });

    document.getElementById("cancelModal").addEventListener("click", () => {
      alert("Closing tab.");
      window.close();
    });
  };

  createModal(pdfName, correctPassword);
}
