import win32com.client
import os
from datetime import datetime
import ctypes

# Path to log file
LOG_FILE = "usb_log.txt"

# Function to log device details
def log_device(device_name, device_id):
    pass

# Function to eject a drive
def eject_drive(drive_letter):
    try:
        volume_path = f"{drive_letter}\\"
        ctypes.windll.kernel32.SetVolumeMountPointW(volume_path, None)
    except Exception as e:
        pass

# Function to disable a USB device
def disable_usb_device(device_id):
    try:
        # Escape backslashes and single quotes for WMIC
        escaped_device_id = device_id.replace("\\", "\\\\").replace("'", "\\'")
        command = f'wmic path Win32_PnPEntity where "PNPDeviceID LIKE \'%{escaped_device_id}%\'" call Disable > NUL 2>&1'
        os.system(command)
    except Exception as e:
        pass

# Function to monitor drives and USB devices
def monitor_devices():
    authorized_drives = ["C:"]  # Define allowed drives

    wmi = win32com.client.GetObject("winmgmts:")
    usb_watcher = wmi.ExecNotificationQuery(
        "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE TargetInstance ISA 'Win32_PnPEntity'"
    )

    while True:
        try:
            # Check for unauthorized logical drives
            drives = [d.strip() for d in os.popen("wmic logicaldisk get name").read().splitlines() if d.strip() and d.strip() != "Name"]
            unauthorized_drives = [drive for drive in drives if drive not in authorized_drives]

            for drive in unauthorized_drives:
                eject_drive(drive)

            # Check for unauthorized USB devices
            usb_event = usb_watcher.NextEvent()
            device = usb_event.TargetInstance
            device_name = device.Name
            device_id = device.PNPDeviceID

            disable_usb_device(device_id)

        except KeyboardInterrupt:
            break
        except Exception as e:
            pass

if __name__ == "__main__":
    monitor_devices()
