# Windows Security Level Reset Script

This script modifies Windows security policies to set the default security level to **Unrestricted** and deletes all existing registry keys under a specified path. It ensures these changes are logged for auditing purposes.

---

## **Prerequisite**
Before running this script, ensure your system has proper software restriction policies set up:
1. Open `secpol.msc` (Local Security Policy).
2. Navigate to **Software Restriction Policies**.
3. Ensure policies are active and appropriately configured.

---

## **Overview**
The script performs the following:
1. Requests administrative privileges for execution.
2. Sets the software restriction policies' default level to **Unrestricted**.
3. Deletes all registry keys under the specified path.
4. Logs all actions for transparency and auditing.

---

## **Core Functionality**

### Admin Privileges
The script checks and ensures it runs with administrative privileges:
- **`is_admin()`**: Verifies if the script is already running as an administrator.
- **`elevate()`**: Re-runs the script with elevated privileges if necessary.

### Logging
Logs all actions to a file for tracking changes:
- **Log Location**: `C:\\Program Files\\DLP\\Executable_Logs.txt`
- **Log Format**: `YYYY-MM-DD | HH:MM:SS | Device Name | File Path | Action`

### Setting Security Level
Sets the security level to **Unrestricted** by modifying the `DefaultLevel` key in the registry.

### Deleting Registry Keys
Deletes all subkeys under a specific registry path to ensure the reset is clean:
- Iterates through subkeys and deletes them one by one.
- Logs each deletion.

---

## **Constants**
- **REGISTRY_PATH**:  
The registry path for allowed paths in software restriction policies:  `SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers\262144\Paths`

- **DEFAULT_SECURITY_LEVEL**:  
Registry path controlling the default security level:  `SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers`

---

## **Execution Flow**

1. **Elevate Privileges**: Ensures the script has admin rights.
2. **Set Security Level**: Configures the system for unrestricted software execution.
3. **Delete Registry Keys**: Removes all existing keys for a clean reset.
4. **Log Changes**: Records each operation in the log file.

---

## **Usage Instructions**

1. **Prepare Environment**:
 - Place the script in a secure directory.
 - Ensure the log file path exists and is writable.

2. **Run the Script**:
 - Execute the script using Python:
   ```
   python script_name.py
   ```
 - The script will prompt for admin privileges if necessary.

3. **Verify Logs**:
 - Open `Executable_Logs.txt` to view a record of actions performed.

---

## **Security Considerations**

- **Critical System Settings**: This script modifies sensitive system settings. Use it responsibly.
- **Access Control**: Restrict access to the script and log file to trusted personnel.
- **Auditing**: Regularly review logs to ensure changes are as expected.

---


