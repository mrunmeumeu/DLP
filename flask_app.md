# Detailed Description of the Code

The code is a **Flask-based server** designed for monitoring and managing a distributed network of clients (devices). It includes functionality for managing logs, monitoring system resources, toggling security features (like USB blocking, screenshot blocking, and executable monitoring), and conducting vulnerability scans. Below is a detailed breakdown of its components:

---

## 1. Initialization and Configuration

### Flask App Setup

- `Flask` is initialized for the server.
- `CORS` (Cross-Origin Resource Sharing) is configured to allow requests from all origins for flexibility in cross-domain communication.

### Global Variables

- `NETWORK_RANGE`: Placeholder for the IP range that could be used for network scanning.
- `IP_LIST`: A static list of IP addresses for clients. This can be replaced by dynamically loading IPs.
- `LOG_DIRECTORY`: Directory on the admin machine where logs from clients are saved.
- `DEVICES_FILE`: File containing a list of connected device IPs.

### Dynamic Client Management

- `load_clients_from_file()`: Loads the list of client IPs from `DEVICES_FILE` and creates a dictionary of client IDs and URLs.
- `save_ips_to_file()`: Saves the IPs of clients to `DEVICES_FILE`.
- `reload_clients()`: Reloads the client list dynamically whenever changes are made.

---

## 2. System Monitoring

### `/system-stats`

- **Method**: `GET`
- **Functionality**: Fetches system-level statistics from the admin machine.
  - **CPU Usage**: Obtained via `psutil.cpu_percent`.
  - **RAM Usage**: Obtained via `psutil.virtual_memory().percent`.

---

## 3. Network Scanning and Client Interaction

### `/scan-network`

- **Method**: `GET`
- **Functionality**: Checks the status of all clients in the `CLIENTS` dictionary.
  - Sends an HTTP `GET` request to the `/ping` endpoint of each client.
  - Returns the connection status (`Connected` or `Disconnected`), along with additional details like username, device ID, and Windows version.

---

## 4. Client Management

### `/add-client`

- **Method**: `POST`
- **Functionality**:
  - Adds a new client IP to the `DEVICES_FILE`.
  - Prevents duplicate entries by checking existing IPs.
  - Reloads the client list after the addition.

### `/delete-client/<ip>`

- **Method**: `DELETE`
- **Functionality**:
  - Removes a client by its IP from the `DEVICES_FILE`.
  - Reloads the client list after deletion.

### `/list-clients`

- **Method**: `GET`
- **Functionality**: Returns the current list of clients.

---

## 5. Log Management

### `/upload-log`

- **Method**: `POST`
- **Functionality**:
  - Allows clients to upload log files to the server.
  - Saves logs in the `LOG_DIRECTORY`.

### `/list-logs`

- **Method**: `GET`
- **Functionality**: Lists all `.txt` log files in the `LOG_DIRECTORY`.

### `/view-logs`

- **Method**: `GET`
- **Functionality**:
  - Fetches the content of a specified log file from `LOG_DIRECTORY`.

### `/give-logs`

- **Method**: `POST`
- **Functionality**:
  - Requests logs from specified client IPs.
  - Interacts with the `/give-logs` endpoint of each client.

---

## 6. Security Features

### Screenshot Blocking

- **`/screenshot-block`**:
  - **Method**: `POST`
  - **Functionality**: Enables or disables screenshot blocking on specified clients.
- **`/get-screenshot-log`**:
  - **Method**: `POST`
  - **Functionality**: Fetches screenshot logs from specified clients.

---

### USB Port Blocking

- **`/toggle-usb-port-blocking`**:
  - **Method**: `POST`
  - **Functionality**: Toggles USB blocking for specified clients.
- **`/get-usb-log`**:
  - **Method**: `POST`
  - **Functionality**: Fetches USB logs from specified clients.

---

### Keyword Monitoring

- **`/run-keyword-monitoring`**:
  - **Method**: `POST`
  - **Functionality**: Enables or disables keyword monitoring on specified clients.
- **`/get-keyword-logs`**:
  - **Method**: `POST`
  - **Functionality**: Fetches keyword monitoring logs from specified clients.
- **Keyword Management**:
  - **`/keywords` (GET)**: Fetches all keywords.
  - **`/keywords` (POST)**: Adds a new keyword.
  - **`/keywords/<keyword>` (DELETE)**: Deletes a specified keyword.

---

## 7. Vulnerability Scanning

### `/run-vulnerability-scan`

- **Method**: `POST`
- **Functionality**:
  - Initiates vulnerability scans on specified clients.
  - Interacts with the `/run-vulnerability-scan` endpoint of each client.

---

## 8. Executable Monitoring

### `/enable-executable-monitoring`

- **Method**: `POST`
- **Functionality**:
  - Enables executable monitoring for specified clients.
  - Sends the `authorized_by` information to the clients.

### `/disable-executable-monitoring`

- **Method**: `POST`
- **Functionality**:
  - Disables executable monitoring for specified clients.

---

## 9. Miscellaneous

### `/firebase-config`

- **Method**: `GET`
- **Functionality**: Fetches Firebase configuration details from a predefined file path.

### `/enable-type-viewer`

- **Method**: `POST`
- **Functionality**:
  - Enables or disables a specific type of viewer on specified clients.
  - Used for additional monitoring functionalities.

---

## 10. Dynamic Client Interaction

- **`/client/<ip>`**:
  - **Method**: `GET`
  - **Functionality**:
    - Fetches detailed information about a specific client.
    - Queries the client’s `/ping` endpoint for status and details.
- **`/ping`**:
  - **Method**: `GET`
  - **Functionality**: A simple endpoint for clients to indicate their active status.

---

## Data Sources

1. **Clients**:
   - Managed dynamically using `DEVICES_FILE`.
   - Interacted via HTTP requests.
2. **Logs**:
   - Saved in `LOG_DIRECTORY`.
   - Collected from clients through specific endpoints.
3. **System Metrics**:
   - Collected using `psutil` for monitoring CPU and RAM usage.

---

## Use Case Summary

This server provides centralized control over multiple clients in a network, allowing an administrator to:

1. Monitor system performance.
2. Manage security policies like USB blocking and screenshot monitoring.
3. Collect and view logs for auditing purposes.
4. Initiate vulnerability scans and keyword monitoring.
5. Dynamically add/remove clients from the network.
