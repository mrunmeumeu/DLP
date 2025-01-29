import os
import subprocess
import time
import firebase_admin
from firebase_admin import credentials, db
from tkinter import Tk, simpledialog, messagebox
import json
import sys

# Paths
CONFIG_FILE = r"C:\Program Files\DLP\firebase_config.json"
ALTERNATE_EXE = r"C:\Program Files\DLP\Excel_viewer.exe"
LOG_FILE = r"monitor.txt"
COMMON_EXCEL_PATHS = [
    r"C:\Program Files\Microsoft Office\root\Office16\EXCEL.exe",
    r"C:\Program Files (x86)\Microsoft Office\root\Office16\EXCEL.exe",
]

def log_message(message):
    """Log a message to the monitor.txt file with a timestamp."""
    try:
        with open(LOG_FILE, "a") as log_file:
            log_file.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")
    except Exception as e:
        print(f"Error logging to file: {e}")
    print(message)  # Also print to console

def find_excel_executable():
    """Search the common paths to find the original Excel executable."""
    log_message("Searching for the original Excel executable...")
    for path in COMMON_EXCEL_PATHS:
        if os.path.exists(path):
            excel_dir = os.path.dirname(path)
            excel_original = os.path.join(excel_dir, "EXCEL_ORIGINAL.exe")
            if os.path.exists(excel_original):
                log_message(f"Found EXCEL_ORIGINAL.exe at {excel_original}")
                return excel_original
            else:
                log_message(f"EXCEL_ORIGINAL.exe not found in {excel_dir}")
                raise FileNotFoundError("EXCEL_ORIGINAL.exe not found.")
    log_message("Excel executable not found in common locations.")
    raise FileNotFoundError("Excel executable not found.")

def load_firebase_config():
    """Load Firebase configuration from the JSON file."""
    log_message("Loading Firebase configuration...")
    if not os.path.exists(CONFIG_FILE):
        log_message(f"Configuration file not found: {CONFIG_FILE}")
        raise FileNotFoundError(f"Configuration file not found: {CONFIG_FILE}")
    with open(CONFIG_FILE, "r") as file:
        return json.load(file)

def initialize_firebase():
    """Initialize Firebase connection."""
    log_message("Initializing Firebase...")
    try:
        config = load_firebase_config()
        service_account_path = config["serviceAccountPath"]
        database_url = config["databaseURL"]

        if not os.path.exists(service_account_path):
            log_message(f"Service account file not found: {service_account_path}")
            raise FileNotFoundError(f"Service account file not found: {service_account_path}")

        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred, {"databaseURL": database_url})
        log_message("Firebase initialized successfully.")
    except Exception as e:
        log_message(f"Failed to initialize Firebase: {e}")
        raise

def fetch_file_passwords():
    """Fetch the file-password mapping from Firebase."""
    log_message("Fetching file-password mappings from Firebase...")
    ref = db.reference("fp")
    passwords = ref.get() or {}
    log_message(f"Fetched passwords: {passwords}")
    return passwords

def prompt_password(file_name, file_passwords):
    """Prompt the user for a password and validate it."""
    root = Tk()
    root.withdraw()
    password = simpledialog.askstring("Password Required", f"Enter the password to access {file_name}:", show="*")

    if password == file_passwords.get(file_name):
        log_message(f"Correct password entered for {file_name}.")
        return True
    else:
        log_message(f"Incorrect password entered for {file_name}.")
        return False

def launch_alternate_exe():
    """Launch the alternate application."""
    log_message("Launching alternate application...")
    try:
        subprocess.Popen([ALTERNATE_EXE])
        log_message("Alternate application launched successfully.")
    except FileNotFoundError:
        log_message("Alternate application not found.")
    except Exception as e:
        log_message(f"Error launching alternate application: {e}")

def launch_excel_with_file(excel_path, file_path=None):
    """Launch the original Excel executable with or without a file."""
    if file_path:
        log_message(f"Launching EXCEL_ORIGINAL.exe with file: {file_path}")
    else:
        log_message("Launching EXCEL_ORIGINAL.exe without any file.")
    try:
        command = [excel_path, file_path] if file_path else [excel_path]
        log_message(f"Running command: {command}")  # Log the exact command being run
        subprocess.Popen(command)
        log_message("EXCEL_ORIGINAL.exe launched successfully.")
    except Exception as e:
        log_message(f"Error launching EXCEL_ORIGINAL.exe: {e}")


def main():
    log_message("Starting monitoring script...")

    # Initialize Firebase and fetch the file-password mappings
    try:
        initialize_firebase()
        file_passwords = fetch_file_passwords()
    except Exception as e:
        log_message(f"Failed to initialize or fetch Firebase data: {e}")
        return

    # Find the original Excel executable dynamically
    try:
        original_excel = find_excel_executable()
    except FileNotFoundError:
        return

    # Handle command-line arguments
    if len(sys.argv) < 2:
        log_message("No file specified in command-line arguments. Launching original Excel.")
        launch_excel_with_file(original_excel)
        return

    # Log the command-line arguments
    log_message(f"Command-line arguments: {sys.argv}")

    file_path = sys.argv[1]

    # Handle /dde issue explicitly
    if file_path.lower() == "/dde":
        log_message("Invalid argument '/dde' received. No file specified. Launching original Excel.")
        launch_excel_with_file(original_excel)
        return

    log_message(f"File path received: {file_path}")

    if not os.path.exists(file_path):
        log_message(f"File does not exist: {file_path}")
        return

    file_name = os.path.splitext(os.path.basename(file_path))[0]
    log_message(f"Extracted file name: {file_name}")

    # Check if the file requires a password
    if file_name in file_passwords:
        log_message(f"{file_name} is an encrypted file. Launching alternate viewer.")
        # Launch the alternate Excel viewer for encrypted files
        launch_alternate_exe()
        return 

    # Launch the original Excel process with the file
    launch_excel_with_file(original_excel, file_path)

if __name__ == "__main__":
    main()
