# Code Explanation: Windows Application Whitelisting Script

**Prerequisite**:  
Before using this script, ensure that security policies are configured on your system.  
1. Open `secpol.msc` (Local Security Policy).  
2. Navigate to **Software Restriction Policies** and set them up as needed.  
   - Create a new policy if one does not already exist.  
   - Ensure the **Default Security Level** is configured (e.g., "Disallowed").  

Without these policies in place, the script will not function as intended.

---

## **Overview**
The script enforces application execution restrictions by:
1. Modifying Windows registry keys.
2. Ensuring the Application Identity service is running.
3. Syncing allowed paths from a file (`paths.txt`) with the Windows registry.
4. Running the script with elevated (admin) privileges.

---

## **Dependencies and Imports**
The script imports several libraries:
- **os** and **sys**: For file and system operations.
- **ctypes**: For admin privilege elevation.
- **winreg**: For interacting with the Windows registry.
- **uuid**: To generate unique keys for registry entries.
- **datetime**: To log timestamped information.
- **subprocess**: For managing Windows services.
- **time**: For optional delays or future use.

---

## **Key Constants**
1. **SAFER_CODE_IDENTIFIERS_PATH**: Registry path for security policies.
2. **REGISTRY_PATH**: Path under `SAFER_CODE_IDENTIFIERS_PATH` where whitelisted executable paths are stored.
3. **LOG_FILE_PATH**: Path to store log outputs.
4. **DEFAULT_SECURITY_LEVEL**: Key controlling default security level (disallowed by default).
5. **FILE_TO_MONITOR**: Path to the file containing executable paths to whitelist.

---

## **Core Functionality**

### 1. **Logger Class**
Redirects `stdout` and `stderr` to a log file (`Executable_Logs.txt`), ensuring all outputs are logged for debugging or auditing purposes.

### 2. **Admin Privilege Handling**
- **`is_admin()`**: Checks if the script is running with admin privileges.
- **`elevate()`**: Restarts the script with elevated privileges if not already running as admin.

### 3. **Application Identity Service**
- **`ensure_application_identity_running()`**: 
  - Verifies if the **Application Identity service** is running.
  - Starts the service if it's not running and configures it to auto-start.

### 4. **Default Security Level**
- **`set_security_level_disallowed()`**:
  - Sets the default application execution policy to "Disallowed" using the `DefaultLevel` registry key.
  - This ensures only explicitly whitelisted executables can run.

### 5. **Registry Management**
#### (a) **Creating Registry Keys**
- **`create_registry_key(file_path)`**:
  - Creates a unique registry entry for each allowed executable path.
  - Assigns an auto-generated UUID to each key.
  - Supports environment variable paths (e.g., `%SystemRoot%\system32`).

#### (b) **Deleting Existing Keys**
- **`delete_existing_keys()`**:
  - Deletes all existing keys under the specified `REGISTRY_PATH`.
  - Ensures the registry is clean before syncing new paths.

#### (c) **Syncing Paths**
- **`sync_paths_with_registry()`**:
  - Reads executable paths from `paths.txt`.
  - Deletes existing registry keys.
  - Creates new keys for all paths in the file.

### 6. **File Monitoring** *(Optional, commented out)* 
- The script includes commented-out logic for monitoring `paths.txt` in real-time using the `watchdog` library. If enabled, any changes to `paths.txt` would trigger automatic registry updates.

---

## **Execution Flow**

1. **Elevate Privileges**: The script restarts itself with admin privileges if necessary.
2. **Start Application Identity Service**: Ensures this service is running, as it's required for the registry rules to take effect.
3. **Set Default Security Level**: Configures the system to block all applications by default.
4. **Sync Registry**:
   - Deletes existing registry keys under `REGISTRY_PATH`.
   - Reads paths from `paths.txt` and creates corresponding registry entries.
5. **Log Outputs**: All operations are logged in `Executable_Logs.txt`.

---

## **Usage Instructions**
1. **Prepare the Environment**:
   - Place the script in a secure location.
   - Create a `paths.txt` file containing allowed executable paths, one per line.

2. **Run the Script**:
   - Execute the script as an administrator.
   - The script automatically sets up the environment and syncs the registry.

3. **Verify Logs**:
   - Check `Executable_Logs.txt` for operation details and errors.

---

## **Security Considerations**
- The script modifies sensitive registry keys, so handle it with care.
- Only trusted users should have access to the `paths.txt` file and the script.
- Logs may contain sensitive information; restrict access to `Executable_Logs.txt`.

---

## **Limitations and Future Enhancements**
1. **File Monitoring**:
   - Real-time monitoring of `paths.txt` is commented out.
   - Uncomment the watchdog code to enable dynamic updates.

2. **Error Handling**:
   - Extend error handling to manage edge cases (e.g., file path syntax errors).

3. **Testing**:
   - Ensure compatibility with different Windows versions.
