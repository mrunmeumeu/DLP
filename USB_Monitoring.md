# USB Monitoring Script and Toggle Functionality

This repository provides a solution for monitoring USB device activity on a system, with an admin panel feature for toggling the monitoring functionality.

---

## Script Overview

The `monitor_devices.py` script ensures data security by monitoring and managing USB devices and logical drives. Unauthorized activities are logged, and preventive actions are taken.

### Key Features

1. **Monitor Logical Drives**:
   - Continuously scans for unauthorized logical drives.
   - Ejects drives not listed as authorized.

2. **Monitor USB Devices**:
   - Detects newly connected USB devices using Windows Management Instrumentation (WMI).
   - Logs details of unauthorized devices to `usb_log.txt`.
   - Disables unauthorized USB devices using system commands.

3. **Device Actions**:
   - **Eject Drives**: Uses Windows API to safely eject unauthorized drives.
   - **Disable USB Devices**: Utilizes the `wmic` command to disable devices based on their `PNPDeviceID`.

---

## How It Works

### Code Breakdown

1. **Log Device Details**:
   - The `log_device` function (currently a placeholder) logs details of unauthorized devices for further analysis.

2. **Eject Drives**:
   - The `eject_drive` function interacts with the Windows API to eject drives.

3. **Disable USB Devices**:
   - The `disable_usb_device` function issues a `wmic` command to disable USB devices identified as unauthorized.

4. **Monitoring Devices**:
   - The `monitor_devices` function:
     - Monitors logical drives and USB devices in real-time using WMI.
     - Ejects unauthorized logical drives and disables unauthorized USB devices.

---

## Admin Toggle Functionality

The admin panel allows enabling or disabling the USB monitoring feature. This is achieved by controlling the execution of the monitoring script through an executable file (`USB_block.exe`).

### How the Toggle Works

1. **Toggle ON**:
   - The admin enables USB monitoring.
   - The system starts the `USB_block.exe` process, which activates the monitoring script.

2. **Toggle OFF**:
   - The admin disables USB monitoring.
   - The system terminates the `USB_block.exe` process, halting all monitoring activities.

---

## Usage

### Prerequisites

- **Operating System**: Windows
- **Python**: Ensure Python is installed on your system.
- **Install `pywin32`**: Required for WMI functionality.
  ```bash
  pip install pywin32

###Ensure that the exe runs on adminstrator privelages(Can be done using main.js of the electron app)
