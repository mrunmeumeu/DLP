import os
import sys
import ctypes
import winreg
import socket
import psutil
import time  # Import time for sleep
from datetime import datetime

# Constants
CLIPBOARD_REG_PATH = r"Software\Microsoft\Clipboard"
ENABLE_CLIPBOARD_HISTORY_KEY = "EnableClipboardHistory"
LOG_FILE_PATH = r"C:\Program Files\DLP\SS_block_logs.txt"
PROCESS_NAME = "Start_SS_Monitoring.exe"  # Name of the monitoring process to terminate

# Ensure the DLP directory exists
log_dir = os.path.dirname(LOG_FILE_PATH)
if not os.path.exists(log_dir):
    try:
        os.makedirs(log_dir)
    except Exception as e:
        print(f"Error creating directory {log_dir}: {e}")
        sys.exit()

# Admin privilege check
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

# Elevate privileges if not already admin
def elevate():
    if not is_admin():
        print(f"Re-running the script with admin privileges...")
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
        sys.exit()

# Function to write logs to the log file
def write_log(action, message):
    device_name = socket.gethostname()
    current_time = datetime.now().strftime('%Y-%m-%d | %H:%M:%S')

    log_entry = f"{current_time} | {device_name} | {action} | {message}\n"

    try:
        with open(LOG_FILE_PATH, 'a') as log_file:
            log_file.write(log_entry)
        print(f"Logged: {log_entry.strip()}")
    except Exception as e:
        print(f"Failed to write to log file: {e}")

# Enable clipboard history
def enable_clipboard_history():
    try:
        registry_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, CLIPBOARD_REG_PATH, 0, winreg.KEY_SET_VALUE)
        winreg.SetValueEx(registry_key, ENABLE_CLIPBOARD_HISTORY_KEY, 0, winreg.REG_DWORD, 1)
        winreg.CloseKey(registry_key)
        write_log("Registry", "Clipboard history enabled.")
    except Exception as e:
        write_log("Error", f"Error enabling clipboard history: {e}")

# Terminate the monitoring process by executable name
def terminate_monitoring_process():
    for process in psutil.process_iter(['pid', 'name']):
        if process.info['name'] == PROCESS_NAME:
            try:
                psutil.Process(process.info['pid']).terminate()
                write_log("Process", "Clipboard monitoring process terminated.")
                time.sleep(2)  # Pause to ensure the process is terminated before proceeding
                return
            except Exception as e:
                write_log("Error", f"Error terminating monitoring process: {e}")
    
    write_log("Process", "No running clipboard monitoring process found.")
    time.sleep(2)  # Small delay even if no process is found

if __name__ == "__main__":
    elevate()  # Ensure the script runs with admin privileges

    # Terminate the monitoring process
    terminate_monitoring_process()

    # Enable clipboard history
    enable_clipboard_history()

    write_log("System", "Clipboard monitoring disabled.")

    time.sleep(2)  # Final delay to ensure all actions have completed
