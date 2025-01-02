#enabling of exes 
import os
import sys
import ctypes
import winreg
import uuid
from datetime import datetime
import subprocess

import time
# Constants for registry locations and log file
SAFER_CODE_IDENTIFIERS_PATH = r"SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers"
REGISTRY_PATH = r"SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers\262144\Paths"
LOG_FILE_PATH = r"C:\Program Files\DLP\Executable_Logs.txt"
DEFAULT_SECURITY_LEVEL = r"SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers"
FILE_TO_MONITOR = r"C:\Program Files\DLP\paths.txt"

# Redirect stdout and stderr to a log file
class Logger:
    def __init__(self, log_file):
        self.terminal = sys.stdout
        self.log_file = open(log_file, 'a', encoding='utf-8')

    def write(self, message):
        self.terminal.write(message)
        self.log_file.write(message)

    def flush(self):
        self.terminal.flush()
        self.log_file.flush()

sys.stdout = Logger(LOG_FILE_PATH)
sys.stderr = Logger(LOG_FILE_PATH)

# Request admin privileges
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def elevate():
    if not is_admin():
        python_exe = sys.executable
        ctypes.windll.shell32.ShellExecuteW(None, "runas", python_exe, " ".join(sys.argv), None, 1)
        sys.exit()

# Ensure Application Identity service is running
def ensure_application_identity_running():
    try:
        print("Ensuring Application Identity service is running...")
        status_result = subprocess.run(["sc", "query", "appidsvc"], capture_output=True, text=True)
        if "RUNNING" not in status_result.stdout:
            print("Application Identity service is not running. Starting it...")
            subprocess.run(["sc", "config", "appidsvc", "start=", "auto"], check=True)
            subprocess.run(["sc", "start", "appidsvc"], check=True)
            print("Application Identity service started.")
        else:
            print("Application Identity service is already running.")
    except Exception as e:
        print(f"Error ensuring Application Identity service is running: {e}")

# Set the default security level (Disallowed)
def set_security_level_disallowed():
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, DEFAULT_SECURITY_LEVEL, 0, winreg.KEY_SET_VALUE) as base_key:
            winreg.SetValueEx(base_key, "DefaultLevel", 0, winreg.REG_DWORD, 0x10000)
        print("Security level set to: Disallowed")
    except Exception as e:
        print(f"Error setting security level: {e}")

# Create registry key with a unique GUID for each allowed path
def create_registry_key(file_path):
    key_name = f"{{{uuid.uuid4()}}}"
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, REGISTRY_PATH, 0, winreg.KEY_SET_VALUE | winreg.KEY_CREATE_SUB_KEY) as base_key:
            with winreg.CreateKey(base_key, key_name) as new_key:
                winreg.SetValueEx(new_key, None, 0, winreg.REG_SZ, "")
                winreg.SetValueEx(new_key, "Description", 0, winreg.REG_SZ, "")
                if file_path.startswith('%'):
                    winreg.SetValueEx(new_key, "ItemData", 0, winreg.REG_EXPAND_SZ, file_path)
                else:
                    winreg.SetValueEx(new_key, "ItemData", 0, winreg.REG_SZ, file_path)
                winreg.SetValueEx(new_key, "SaferFlags", 0, winreg.REG_DWORD, 0)
            print(f"Key {key_name} created successfully for path: {file_path}")
    except Exception as e:
        print(f"Failed to create key for {file_path}: {e}")

# Delete all existing keys under the registry path
def delete_existing_keys():
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, REGISTRY_PATH, 0, winreg.KEY_ALL_ACCESS) as base_key:
            print(f"Deleting all keys under: {REGISTRY_PATH}")
            while True:
                try:
                    subkey_name = winreg.EnumKey(base_key, 0)
                    winreg.DeleteKey(base_key, subkey_name)
                    print(f"Deleted key: {subkey_name}")
                except OSError:
                    print("No more keys to delete.")
                    break
    except FileNotFoundError:
        print(f"Registry path {REGISTRY_PATH} does not exist yet.")
    except Exception as e:
        print(f"Error deleting existing keys: {e}")

#Sync the paths in the file with the registry
def sync_paths_with_registry():
    if not os.path.exists(FILE_TO_MONITOR):
        print(f"Error: The file '{FILE_TO_MONITOR}' does not exist.")
        return

    delete_existing_keys()  # Delete existing keys first

    with open(FILE_TO_MONITOR, 'r') as file:
        paths = [line.strip() for line in file if line.strip()]

    for file_path in paths:
        create_registry_key(file_path)

# # File monitoring class using watchdog
# class PathsFileEventHandler(FileSystemEventHandler):
#     def on_modified(self, event):
#         print(f"File modified: {event.src_path}")
#         if event.src_path.lower() == FILE_TO_MONITOR.lower():
#             print(f"Detected changes in {FILE_TO_MONITOR}. Syncing registry...")
#             sync_paths_with_registry()

# Main function to enforce restrictions and monitor the file
def main():
    
    elevate()
    ensure_application_identity_running()
    set_security_level_disallowed()
    sync_paths_with_registry()  # Initial sync
    print("Initial synchronization of paths completed. Exiting program.")

if __name__ == "__main__":
    main()
