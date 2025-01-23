// server.js
const express = require('express');
const si = require('systeminformation'); // Import systeminformation
const cors = require('cors'); // Allow cross-origin requests

const app = express();
const port = 5000;

app.use(cors()); // Allow requests from the frontend

// Route to get system data
app.get('/system-status', async (req, res) => {
  try {
    // Fetch CPU and RAM data
    const cpu = await si.currentLoad();
    const memory = await si.mem();

    // Return the data to the frontend
    res.json({
      cpu: cpu.currentLoad, // CPU load in percentage
      totalMemory: memory.total, // Total memory in bytes
      usedMemory: memory.used, // Used memory in bytes
    });
  } catch (error) {
    console.error('Error fetching system data:', error);
    res.status(500).send('Error fetching system data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
