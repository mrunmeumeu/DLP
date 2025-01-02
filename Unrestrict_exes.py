import os
import sys
import ctypes
import winreg
from datetime import datetime

# Constants for the registry location and log file
REGISTRY_PATH = r"SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers\262144\Paths"
DEFAULT_SECURITY_LEVEL = r"SOFTWARE\Policies\Microsoft\Windows\safer\CodeIdentifiers"
LOG_FILE_PATH = r"C:\\Program Files\\DLP\\Executable_Logs.txt"

# Request admin privileges
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def elevate():
    if not is_admin():
        python_exe = sys.executable
        print(f"Re-running the script with admin privileges using {python_exe}...")
        ctypes.windll.shell32.ShellExecuteW(None, "runas", python_exe, " ".join(sys.argv), None, 1)
        sys.exit()

# Function to write logs to the log file
def write_log(file_path, action):
    device_name = os.getenv('COMPUTERNAME', 'Unknown Device')
    current_time = datetime.now().strftime('%Y-%m-%d | %H:%M:%S')
    
    log_entry = f"{current_time} | {device_name} | {file_path} | {action}\n"
    
    try:
        with open(LOG_FILE_PATH, 'a') as log_file:
            log_file.write(log_entry)
        print(f"Logged: {log_entry.strip()}")
    except Exception as e:
        print(f"Failed to write to log file: {e}")

# Set the default security level (Unrestricted)
def set_security_level_unrestricted():
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, DEFAULT_SECURITY_LEVEL, 0, winreg.KEY_SET_VALUE) as base_key:
            winreg.SetValueEx(base_key, "DefaultLevel", 0, winreg.REG_DWORD, 0x40000)
        print("Security level set to: Unrestricted")
        write_log("Security Level", "Unrestricted")
    except Exception as e:
        print(f"Error setting security level: {e}")

# Function to delete all existing keys under the specified registry path
def delete_existing_keys():
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, REGISTRY_PATH, 0, winreg.KEY_ALL_ACCESS) as base_key:
            print(f"Deleting all keys under: {REGISTRY_PATH}")
            i = 0
            while True:
                try:
                    subkey_name = winreg.EnumKey(base_key, 0)
                    winreg.DeleteKey(base_key, subkey_name)
                    print(f"Deleted key: {subkey_name}")
                    write_log(subkey_name, "Deleted")
                except OSError:
                    print("No more keys to delete.")
                    break
    except FileNotFoundError:
        print(f"Registry path {REGISTRY_PATH} does not exist yet.")
    except Exception as e:
        print(f"Error deleting existing keys: {e}")

# Main function to unrestrict security and delete keys
def main():
    elevate()
    set_security_level_unrestricted()
    delete_existing_keys()

if __name__ == "__main__":
    main()
