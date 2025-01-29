import os
import sys
import ctypes
import winreg
import pyperclip
import win32clipboard
import socket
import time
import threading
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db




# cred = credentials.Certificate("C:\\Program Files\\DLP\\clipboard-81621-firebase-adminsdk-rpim7-dd58d299af.json")
# firebase_admin.initialize_app(cred, {
#     'databaseURL': "https://clipboard-81621-default-rtdb.asia-southeast1.firebasedatabase.app"
# })


# Constants
FIREBASE_CONFIG_PATH = r"C:\\Program Files\\DLP\\firebase_config.json"

CLIPBOARD_REG_PATH = r"Software\\Microsoft\\Clipboard"
ENABLE_CLIPBOARD_HISTORY_KEY = "EnableClipboardHistory"
LOG_FILE_PATH = r"C:\\Program Files\\DLP\\SS_block_logs.txt"
# SCREENSHOT_FOLDER = os.path.join(os.path.expanduser("~"), "Pictures", "Screenshots")
RECENT_FOLDER = os.path.join(os.path.expanduser("~"), "AppData", "Roaming", "Microsoft", "Windows", "Recent")




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

def load_firebase_config():
    try:
        with open(FIREBASE_CONFIG_PATH, 'r') as config_file:
            config = json.load(config_file)
            return config
    except Exception as e:
        write_log("Error", f"Failed to load Firebase configuration: {e}")
        sys.exit()

# Initialize Firebase
def initialize_firebase():
    config = load_firebase_config()
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(config["serviceAccountPath"])
            firebase_admin.initialize_app(cred, {
                'databaseURL': config["databaseURL"]
            })
            write_log("System", "Firebase initialized successfully.")
        except Exception as e:
            write_log("Error", f"Failed to initialize Firebase: {e}")
            sys.exit()



# Function to determine the correct Screenshots folder
def get_screenshot_folder():
    # Default local path
    local_screenshot_folder = os.path.join(os.path.expanduser("~"), "Pictures", "Screenshots")
    # OneDrive path
    onedrive_screenshot_folder = os.path.join(os.path.expanduser("~"), "OneDrive", "Pictures", "Screenshots")

    # Check which folder exists
    if os.path.exists(local_screenshot_folder):
        return local_screenshot_folder
    elif os.path.exists(onedrive_screenshot_folder):
        return onedrive_screenshot_folder
    else:
        # If neither exists, return the default local path and create it
        os.makedirs(local_screenshot_folder, exist_ok=True)
        return local_screenshot_folder

# Get the correct Screenshots folder
SCREENSHOT_FOLDER = get_screenshot_folder()

# Log which folder is being used
write_log("System", f"Using screenshot folder: {SCREENSHOT_FOLDER}")


# Disable clipboard history
def disable_clipboard_history():
    try:
        registry_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, CLIPBOARD_REG_PATH, 0, winreg.KEY_SET_VALUE)
        winreg.SetValueEx(registry_key, ENABLE_CLIPBOARD_HISTORY_KEY, 0, winreg.REG_DWORD, 0)
        winreg.CloseKey(registry_key)
        write_log("Registry", "Clipboard history disabled.")
    except Exception as e:
        write_log("Error", f"Error disabling clipboard history: {e}")

clipboard_lock = threading.Lock()
# Check if an image is in the clipboard
def is_image_in_clipboard():
    max_retries = 5  # Number of retries
    retry_delay = 0.5  # Delay in seconds between retries

    for attempt in range(max_retries):
        try:
            with clipboard_lock:
                win32clipboard.OpenClipboard()
                if win32clipboard.IsClipboardFormatAvailable(win32clipboard.CF_DIB):
                    return True
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                write_log("Error", f"Error accessing clipboard after {max_retries} attempts: {e}")
        finally:
            try:
                win32clipboard.CloseClipboard()
            except:
                pass  # Ignore errors during closing
    return False





def clear_clipboard():
    try:
        with clipboard_lock:
            pyperclip.copy('')  # Clear the clipboard
            write_log("Clipboard", "Clipboard cleared.")
    except Exception as e:
        write_log("Error", f"Error clearing clipboard: {e}")


# Delete screenshot from Screenshots and Recent folders
def delete_screenshot_from_locations(filename):
    # Determine the full path of the screenshot in the Screenshots folder
    screenshot_path = os.path.join(SCREENSHOT_FOLDER, filename)

    # Attempt to delete from Screenshots folder
    if os.path.exists(screenshot_path):
        try:
            os.remove(screenshot_path)
            write_log("File Deletion", f"Deleted screenshot from: {screenshot_path}")
        except Exception as e:
            write_log("Error", f"Error deleting screenshot from {screenshot_path}: {e}")

    # Delay to allow Recent folder to update
    time.sleep(1)  # Adjust the delay if necessary

    # Attempt to find and delete the corresponding .lnk file in the Recent folder
    base_filename = os.path.splitext(filename)[0]  # Remove .png or .jpg extension for matching
    found_in_recent = False

    # First, try to find an exact match
    for recent_file in os.listdir(RECENT_FOLDER):
        recent_file_path = os.path.join(RECENT_FOLDER, recent_file)
        
        if recent_file == f"{base_filename}.lnk":  # Exact match
            try:
                os.remove(recent_file_path)
                write_log("File Deletion", f"Deleted recent shortcut from: {recent_file_path}")
                found_in_recent = True
                break
            except Exception as e:
                write_log("Error", f"Error deleting recent shortcut from {recent_file_path}: {e}")

    # If no exact match found, try a partial match
    if not found_in_recent:
        for recent_file in os.listdir(RECENT_FOLDER):
            recent_file_path = os.path.join(RECENT_FOLDER, recent_file)
            
            if recent_file.endswith(".lnk") and base_filename in recent_file:  # Partial match
                try:
                    os.remove(recent_file_path)
                    write_log("File Deletion", f"Deleted recent shortcut from: {recent_file_path}")
                    found_in_recent = True
                    break
                except Exception as e:
                    write_log("Error", f"Error deleting recent shortcut from {recent_file_path}: {e}")

    if not found_in_recent:
        write_log("File Deletion", f"No recent shortcut found for: {filename}")


def log_to_firebase(filename):
    try:
        ref = db.reference("/logs")
        ref.push({
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "screenshot_filename": filename,
            "device": os.getlogin()
        })
        write_log("Firebase", f"Logged screenshot event to Firebase: {filename}")
    except Exception as e:
        write_log("Error", f"Error logging to Firebase: {e}")


# Monitor screenshots folder for new .png or .jpg files
class ScreenshotHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and (event.src_path.endswith(".png") or event.src_path.endswith(".jpg")):
            filename = os.path.basename(event.src_path)
            write_log("File Detected", f"New screenshot detected: {filename}")
            log_to_firebase(filename)
            delete_screenshot_from_locations(filename)

def start_screenshot_monitoring():
    if not os.path.exists(SCREENSHOT_FOLDER):
        write_log("Error", f"Screenshot folder does not exist: {SCREENSHOT_FOLDER}")
        return

    event_handler = ScreenshotHandler()
    observer = Observer()
    try:
        observer.schedule(event_handler, SCREENSHOT_FOLDER, recursive=False)
        observer.start()
        write_log("System", "Started monitoring screenshot folder.")
        while True:
            time.sleep(1)
    except FileNotFoundError as e:
        write_log("Error", f"Error monitoring screenshot folder: {e}")
    except Exception as e:
        write_log("Error", f"Unexpected error: {e}")
    finally:
        observer.stop()
        observer.join()

# Monitor clipboard and registry
def monitor_clipboard_and_registry():
    # disable_clipboard_history()
    while True:
        if is_image_in_clipboard():
            write_log("Clipboard", "Image detected in clipboard. Clearing clipboard.")
            filename="image"
            log_to_firebase(filename)
            clear_clipboard()
        try:
            registry_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, CLIPBOARD_REG_PATH, 0, winreg.KEY_READ)
            current_value, _ = winreg.QueryValueEx(registry_key, ENABLE_CLIPBOARD_HISTORY_KEY)
            winreg.CloseKey(registry_key)
            if current_value == 1:
                write_log("Registry", "Clipboard history was re-enabled. Disabling again.")
                # disable_clipboard_history()
        except Exception as e:
            write_log("Error", f"Error monitoring registry key: {e}")
        time.sleep(2)

# Main function to initiate monitoring
def main():
    elevate() 
    initialize_firebase() 
     # Ensure the script runs with admin privileges
    write_log("System", "Clipboard and screenshot monitoring enabled.")
    
    # Start clipboard monitoring in a separate thread
    clipboard_thread = threading.Thread(target=monitor_clipboard_and_registry, daemon=True)
    clipboard_thread.start()
    
    # Start screenshot folder monitoring in the main thread
    start_screenshot_monitoring()

if __name__ == "__main__":
    main()
