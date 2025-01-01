#The exe during testing has been called "check" or "comu" 
from flask import Flask, jsonify,request
import subprocess
import os
import uuid 
import platform
import socket
import requests
from flask_cors import CORS
import time
import psutil 
import pythoncom
from pathlib import Path
from datetime import datetime
import firebase_admin
import wmi
import threading
from firebase_admin import credentials, db, firestore,initialize_app
from apscheduler.schedulers.background import BackgroundScheduler
from waitress import serve
from apscheduler.executors.pool import ThreadPoolExecutor
import sys
import ctypes
import json


def is_admin():
    """Check if the script is running with administrative privileges."""
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

if not is_admin():
    # Relaunch the script with elevated privileges
    ctypes.windll.shell32.ShellExecuteW(
        None, "runas", sys.executable, " ".join(sys.argv), None, 1
    )
    sys.exit()  # Exit the original script
    
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

executors = {
    'default': ThreadPoolExecutor(6),  # Increase pool size
}

CONFIG_FILE_PATH = "C:\\Program Files\\DLP\\firebase_config.json"
CREDENTIALS_DIR = "C:\\Program Files\\DLP"
FIREBASE_URL_SUFFIX = "-default-rtdb.asia-southeast1.firebasedatabase.app"

# cred = credentials.Certificate("C:\\Program Files\\DLP\\clipboard-81621-firebase-adminsdk-rpim7-dd58d299af.json")

# # Initialize Firebase Admin SDK
# firebase_admin.initialize_app(cred, {
#     'databaseURL': "https://clipboard-81621-default-rtdb.asia-southeast1.firebasedatabase.app"  # Replace with your Firebase Database URL
# })

def find_firebase_credentials(directory):
    """
    Finds a valid Firebase Admin SDK JSON file in the specified directory.

    Parameters:
        directory (str): Directory to scan for Firebase credentials.

    Returns:
        str: Path to the credentials file if found, None otherwise.
    """
    try:
        for file in os.listdir(directory):
            if file.endswith(".json"):
                file_path = os.path.join(directory, file)
                if is_valid_firebase_credentials(file_path):
                    return file_path
        return None
    except FileNotFoundError:
        print(f"Directory not found: {directory}")
        return None

def is_valid_firebase_credentials(file_path):
    """
    Validates if the given JSON file is a Firebase Admin SDK credentials file.

    Parameters:
        file_path (str): Path to the JSON file.

    Returns:
        bool: True if the file is valid, False otherwise.
    """
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            required_keys = {"type", "project_id", "private_key_id", "client_email"}
            return required_keys.issubset(data.keys())
    except (json.JSONDecodeError, FileNotFoundError):
        return False

def create_config_file(credentials_path, database_url):
    """
    Creates a Firebase configuration file.

    Parameters:
        credentials_path (str): Path to the Firebase Admin SDK JSON file.
        database_url (str): Firebase Realtime Database URL.
    """
    config = {
        "serviceAccountPath": credentials_path,
        "databaseURL": database_url
    }
    try:
        with open(CONFIG_FILE_PATH, "w") as file:
            json.dump(config, file, indent=4)
        print(f"Configuration file created at {CONFIG_FILE_PATH}")
    except Exception as e:
        print(f"Error creating configuration file: {e}")

def initialize_firebase():
    """
    Initializes Firebase using the configuration file or by creating one if it doesn't exist.
    """
    # Check if the configuration file exists
    if not os.path.exists(CONFIG_FILE_PATH):
        print("Configuration file not found. Creating a new one...")
        credentials_path = find_firebase_credentials(CREDENTIALS_DIR)
        if not credentials_path:
            print(f"No valid Firebase credentials found in {CREDENTIALS_DIR}.")
            print("Please place a valid Firebase Admin SDK JSON file in the directory.")
            return False

        # Extract project-specific database URL from the credentials file
        try:
            with open(credentials_path, "r") as file:
                credentials_data = json.load(file)
                project_id = credentials_data.get("project_id")
                if not project_id:
                    print("Error: `project_id` not found in the credentials file.")
                    return False

                # Construct the database URL
                database_url = f"https://{project_id}{FIREBASE_URL_SUFFIX}"
        except Exception as e:
            print(f"Error reading credentials file: {e}")
            return False

        # Create the configuration file
        create_config_file(credentials_path, database_url)

    # Load the configuration file
    try:
        with open(CONFIG_FILE_PATH, "r") as file:
            config = json.load(file)
        cred = credentials.Certificate(config["serviceAccountPath"])
        initialize_app(cred, {"databaseURL": config["databaseURL"]})
        print("Firebase initialized successfully.")
        return True
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        return False
    




# Path to VBScript for vulnerability scan
 # Directory for storing logs
ADMIN_SERVER_URL = 'http://192.168.68.218:5000/upload-log'  # Admin server IP and endpoint to send logs
ADMIN_SERVER_REGISTER_URL = 'http://192.168.68.218:5000/register-client'
program_files_dir = "C:\\Program Files"
print(ADMIN_SERVER_URL)
#program_files_dir = "C:\\Users\\tl110\\Desktop"
VBSCRIPT_PATH = os.path.join(program_files_dir, "DLP", "VASCAN.exe")
LOG_DIRECTORY = os.path.join(program_files_dir, "DLP", "VA logs")
SCREENSHOT_BLOCK_EXE = os.path.join(program_files_dir, "DLP", "Start_SS_Monitoring.exe")
SCREENSHOT_UNBLOCK_EXE = os.path.join(program_files_dir, "DLP", "Stop_SS_Monitoring.exe")
CLIENT_PATHS_FILE = os.path.join(program_files_dir, "DLP", "paths.txt")
USB_LOG_FILE_PATH = os.path.join(program_files_dir, "DLP", "usb_log.txt")
KEYWORDS_FILE_PATH = os.path.join(program_files_dir, "DLP", "keywords.txt")
SCREENSHOT_LOG_FILE_PATH = os.path.join(program_files_dir, "DLP", "screenshot_log.txt")
KEYWORD_MONITORING_EXE = os.path.join(program_files_dir, "DLP", "test14.exe")

ENABLE_SCRIPT_PATH = "C:\\Program Files\\DLP\\Disallow_exes.exe"  # Replace with the actual path
DISABLE_SCRIPT_PATH = "C:\\Program Files\\DLP\\Unrestrict_exes.exe"

usb_blocking_status = False
keyword_monitoring_status = False
screenshot_status = False
last_va_scan_time = None 
executable_status = False


def log_executable_monitoring_to_firebase(action, authorized_by):
    """
    Logs executable monitoring event to Firebase.

    Parameters:
        action (str): The action performed (e.g., 'enabled' or 'disabled').
        authorized_by (str): The name of the person who authorized the action.
    """
    user_name = os.getlogin()  # Get the current user's name
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current timestamp

    log_data = {
        'timestamp': timestamp,
        'user': user_name,
        'authorized_by': authorized_by,
        'action': f"Executable monitoring {action}"
    }

    try:
        # Log the event to Firebase under the `executable_monitoring` node
        db.reference('executable_monitoring').push(log_data)
        print(f"Logged executable monitoring to Firebase: {log_data}")
    except Exception as e:
        print(f"Failed to log executable monitoring to Firebase: {e}")




def run_script(script_path):
    """
    Run a given script using subprocess.
    """
    try:
        subprocess.Popen([script_path], creationflags=subprocess.CREATE_NEW_CONSOLE)
        return f"Script {os.path.basename(script_path)} executed successfully."
    except Exception as e:
        return f"Error running script {os.path.basename(script_path)}: {e}"

@app.route('/enable-executable-monitoring', methods=['POST'])
def enable_executable_monitoring():
    """
    Endpoint to enable executable monitoring.
    """
    data = request.get_json()
    authorized_by = data.get('authorized_by', 'Unknown')  # Extract authorized_by or default to 'Unknown'

    # Log to console who enabled the monitoring
    print(f"Executable monitoring enabled by: {authorized_by}")

    # Run the enable script
    message = run_script(ENABLE_SCRIPT_PATH)

    # Log the action to Firebase
    try:
        log_executable_monitoring_to_firebase(action="enabled", authorized_by=authorized_by)
    except Exception as e:
        print(f"Failed to log executable monitoring to Firebase: {e}")

    return jsonify({"message": message, "status": "enabled"}), 200


@app.route('/disable-executable-monitoring', methods=['POST'])
def disable_executable_monitoring():
    """
    Endpoint to disable executable monitoring.
    """
    data = request.get_json()
    authorized_by = data.get('authorized_by', 'Unknown')  # Extract authorized_by or default to 'Unknown'

    # Log to console who disabled the monitoring
    print(f"Executable monitoring disabled by: {authorized_by}")

    # Run the disable script
    message = run_script(DISABLE_SCRIPT_PATH)

    # Log the action to Firebase
    try:
        log_executable_monitoring_to_firebase(action="disabled", authorized_by=authorized_by)
    except Exception as e:
        print(f"Failed to log executable monitoring to Firebase: {e}")

    return jsonify({"message": message, "status": "disabled"}), 200



def get_client_id():
    client_id_file = os.path.join(program_files_dir, "DLP", "client_id.txt")
    if os.path.exists(client_id_file):
        with open(client_id_file, "r") as file:
            client_id = file.read().strip()
    else:
        client_id = str(uuid.uuid4())
        with open(client_id_file, "w") as file:
            file.write(client_id)
    return client_id

client_id = get_client_id()  # Get the persistent unique ID for this client

def get_ip():
    return socket.gethostbyname(socket.gethostname())

# Register or update client information on the admin server
def register_with_server():
    try:
        response = requests.post(ADMIN_SERVER_REGISTER_URL, json={
            "client_id": client_id,
            "ip": get_ip(),
            "user_name": os.getlogin(),
            "device_id": platform.node(),
            "windows_version": platform.platform()
        })
        if response.status_code == 200:
            print("Client registered/updated successfully.")
        else:
            print("Failed to register client:", response.json())
    except requests.RequestException as e:
        print("Error registering client:", e)

# Call this function on startup to register/update the server
#register_with_server()

def is_exe_running(exe_name):
    """Checks if a process with the given executable name is running."""
    for process in psutil.process_iter(attrs=['pid', 'name']):
        try:
            if exe_name.lower() in process.info['name'].lower():
                return True
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return False



def update_status():
    start_time = time.time()
    try:
        user_name = os.getlogin()
        print("checking")
        exe_name = os.path.basename(KEYWORD_MONITORING_EXE)
        print(exe_name)
        running = is_exe_running(exe_name)
        status = 'ON' if running else 'OFF'
        log_data = {
            'status': status,
            'user': user_name,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        print("Log Data to be sent:", log_data)
        db.reference('keyword_monitoring').child(user_name).set(log_data)
        print(f"Keyword monitoring status updated to: {status}")
    finally:
        elapsed_time = time.time() - start_time
        print(f"update_status executed in {elapsed_time:.2f} seconds")


def update_screenshot_status():
    """Check if the Start_SS_Monitoring.exe is running and update its status."""
    global screenshot_status
    user_name = os.getlogin()
    exe_name = "Start_SS_Monitoring.exe"  # Executable to monitor

    # Check if the executable is running
    running = is_exe_running(exe_name)
    status = 'ON' if running else 'OFF'
    
    log_data = {
        'status': status,
        'user': user_name,
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Log timestamp
    }

    print("Screenshot Monitoring Log Data:", log_data)  # Debugging line
    screenshot_status = running  # Update the global status
    db.reference('sslogs').child(user_name).set(log_data)  # Update Firebase
    print(f"Screenshot monitoring status updated to: {status}")


DEFAULT_USB_FILE = "C:\\Program Files\\DLP\\default_usb_devices.txt"
detected_usb_devices = set()  # Global set to store currently detected USB devices
currently_connected_usb_devices = set()
COOLDOWN_PERIOD = 2  # Cooldown period in seconds to prevent duplicate logs
device_last_logged = {}

def log_usb_to_firebase(device_id):
    """Logs USB detection event to Firebase."""
    user_name = os.getlogin()  # Get the current user's name
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current timestamp

    log_data = {
        'timestamp': timestamp,
        'user': user_name,
        'action': 'USB attempt detected',
        'device_id': device_id
    }

    try:
        # Log the event to Firebase under the `usb_attempts` node
        db.reference('usb_attempts').push(log_data)
        print(f"Logged USB detection to Firebase: {log_data}")
    except Exception as e:
        print(f"Failed to log USB detection to Firebase: {e}")

def load_default_usb_devices():
    """
    Loads the default USB devices from the text file.
    """
    if not os.path.exists(DEFAULT_USB_FILE):
        return set()
    
    with open(DEFAULT_USB_FILE, "r") as file:
        return set(line.strip() for line in file if line.strip())


def save_default_usb_devices(devices):
    """
    Saves the default USB devices to the text file.
    """
    with open(DEFAULT_USB_FILE, "w") as file:
        for device in devices:
            file.write(f"{device}\n")

def monitor_usb_insertion():
    """
    Monitors USB insertion and alerts when a new USB device is added.
    """
    global detected_usb_devices, currently_connected_usb_devices, device_last_logged
    pythoncom.CoInitialize()  # Initialize COM for this thread
    try:
        c = wmi.WMI()  # Create WMI instance to interact with Windows Management Instrumentation
        usb_devices = c.query("SELECT * FROM Win32_USBHub")  # Query USB hubs

        # Get DeviceIDs of current USBs
        current_usb_devices = set(device.DeviceID for device in usb_devices)

        # Load the default USB devices from the file
        default_usb_devices = load_default_usb_devices()

        # Save current USB devices to file if no defaults exist
        if not default_usb_devices:
            print("No default USB devices found. Saving current devices as defaults.")
            save_default_usb_devices(current_usb_devices)
            default_usb_devices = current_usb_devices

        # Exclude default USB devices from detection
        current_usb_devices -= default_usb_devices

        # Find newly inserted devices (devices in current but not in previously connected)
        new_devices = current_usb_devices - currently_connected_usb_devices

        # Find removed devices (devices in previously connected but not in current)
        removed_devices = currently_connected_usb_devices - current_usb_devices

        # Update the global set of currently connected USBs
        currently_connected_usb_devices = current_usb_devices

        # Handle new devices
        for new_device in new_devices:
            current_time = datetime.now()

            # Check cooldown to prevent duplicate logging
            if new_device in device_last_logged:
                last_logged_time = device_last_logged[new_device]
                if (current_time - last_logged_time).total_seconds() < COOLDOWN_PERIOD:
                    print(f"Duplicate detection prevented for: {new_device}")
                    continue

            print(f"New USB Device Detected: {new_device}")
            log_usb_to_firebase(new_device)  # Alert admin about the new USB
            detected_usb_devices.add(new_device)  # Add to detected list
            device_last_logged[new_device] = current_time  # Update the last logged time

        # Handle removed devices
        for removed_device in removed_devices:
            print(f"USB Device Removed: {removed_device}")
            detected_usb_devices.discard(removed_device)  # Remove from detected list
            device_last_logged.pop(removed_device, None)  # Clear the last logged time

    except Exception as e:
        print(f"Error in USB monitoring: {e}")
    finally:
        pythoncom.CoUninitialize()

    
# Background task that monitors USB insertions
def run_usb_monitoring():
    while True:
        monitor_usb_insertion()  # Call the USB monitoring function
        time.sleep(5)

scheduler = BackgroundScheduler(executors=executors)
scheduler.add_job(func=update_status, trigger='interval', minutes=1, max_instances=2, coalesce=True)
scheduler.add_job(func=update_screenshot_status, trigger='interval', minutes=1, max_instances=2, coalesce=True)
def start_usb_monitoring_in_thread():
    usb_thread = threading.Thread(target=run_usb_monitoring)
    usb_thread.daemon = True  # Daemonize the thread so it doesn't block program exit
    usb_thread.start()

def log_usb_action(action):
    with open(USB_LOG_FILE_PATH, "a") as log_file:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_file.write(f"{timestamp} - {action}\n")

@app.route('/update-admin-url', methods=['POST'])
def update_admin_url():
    global ADMIN_SERVER_URL
    data = request.get_json()
    new_url = data.get('newUrl')
    
    if new_url:
        ADMIN_SERVER_URL = new_url
        return jsonify({"message": "Admin URL updated successfully", "new_url": ADMIN_SERVER_URL}), 200
    else:
        return jsonify({"message": "Invalid URL provided"}), 400

@app.route('/update-admin-ip', methods=['POST'])
def update_admin_ip():
    """
    Update ADMIN_SERVER_URL by constructing a URL from the given admin IP.
    """
    global ADMIN_SERVER_URL
    data = request.get_json()
    admin_ip = data.get('adminIp')
    endpoint = data.get('endpoint', '/upload-log')  # Default endpoint if not provided

    if admin_ip:
        try:
            # Construct the URL from the given IP
            new_url = f"http://{admin_ip}:5000/upload-log"
            ADMIN_SERVER_URL = new_url
            print(ADMIN_SERVER_URL)
            return jsonify({"message": "Admin URL updated successfully", "new_url": ADMIN_SERVER_URL}), 200
        except Exception as e:
            return jsonify({"message": f"Error constructing URL: {str(e)}"}), 500
    else:
        return jsonify({"message": "Admin IP not provided"}), 400


custom_viewer_path = "C:\\Program Files\\DLP\\PDF_Viewer.exe"

@app.route("/launch_viewer", methods=["POST"])
def launch_viewer():
    data = request.json
    pdf_name = data.get("pdfName")
    
    if not pdf_name:
        return jsonify({"status": "error", "message": "PDF name is required"}), 400

    try:
        # Launch the custom viewer executable with the PDF name as an argument
        subprocess.Popen([custom_viewer_path, pdf_name])
        return jsonify({"status": "success", "message": f"Launching viewer for {pdf_name}"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

# Example endpoint to return current admin URL for verification
@app.route('/get-admin-url', methods=['GET'])
def get_admin_url():
    """
    Get the current ADMIN_SERVER_URL.
    """
    return jsonify({"current_admin_url": ADMIN_SERVER_URL}), 200

@app.route('/get-pdf-passwords', methods=['GET'])
def get_pdf_passwords():
    try:
        # Retrieve passwords from Firebase
        pdf_passwords_ref = db.reference('pdfPasswords')
        pdf_passwords = pdf_passwords_ref.get()

        if pdf_passwords:
            # Modify keys to append ".pdf" when serving to the client
            formatted_passwords = {f"{key}.pdf": value for key, value in pdf_passwords.items()}
            return jsonify({"pdfPasswords": formatted_passwords}), 200
        else:
            return jsonify({"message": "No passwords found"}), 404
    except Exception as e:
        print(f"Error retrieving passwords: {e}")
        return jsonify({"error": str(e)}), 500
# Save keywords to the file
def save_keywords(keywords):
    with open(KEYWORDS_FILE_PATH, "w") as f:
        for keyword in keywords:
            f.write(keyword + "\n")


def run_executable(path):
    subprocess.Popen([path])

def log_screenshot_action(action):
    with open(SCREENSHOT_LOG_FILE_PATH, "a") as log_file:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_file.write(f"{timestamp} - {action}\n")

@app.route('/get-screenshot-log', methods=['GET'])
def get_screenshot_log():
    if os.path.exists(SCREENSHOT_LOG_FILE_PATH):
        try:
            with open(SCREENSHOT_LOG_FILE_PATH, 'r') as file:
                content = file.read()
            return jsonify({"content": content}), 200
        except Exception as e:
            return jsonify({"error": f"Error reading file: {str(e)}"}), 500
    else:
        return jsonify({"error": "Screenshot log file not found"}), 404
        
def log_screenshot_action_to_firebase(action, status):
    # Get the current user's username
    username = os.getlogin()

    # Get a reference to the "usblogs" node in your Realtime Database
    ref = db.reference('sslogs')

    # Create a log entry with a timestamp, action, status, and username
    log_entry = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),   
        'action': action,
        'status': status
    }

    # Update or set the log entry for this username
    ref.child(username).set(log_entry)
        
@app.route('/toggle-screenshot-block', methods=['POST'])
def toggle_screenshot_block():
    global screenshot_status
    data = request.get_json()
    toggle_state = data.get('toggleState', False)

    try:
        if toggle_state:
            # Run the executable for enabling screenshot blocking
            status = "on"
            action = "Screenshot blocking enabled"
            # log_screenshot_action_to_firebase(action, status)
            run_executable(SCREENSHOT_BLOCK_EXE)
            print("enabled")
            
            
            message = "Screenshot blocking enabled."
            screenshot_status = True
        else:
            # Run the executable for disabling screenshot blocking
            status = "off"
            action = "Screenshot blocking disabled"
            #log_screenshot_action_to_firebase(action, status)
            run_executable(SCREENSHOT_UNBLOCK_EXE)
            print("disabled")
            action = "Screenshot blocking disabled"
            
            message = "Screenshot blocking disabled."
            screenshot_status = False

        return jsonify({"message": message}), 200

    except Exception as e:
        print(f"Error toggling screenshot blocking: {str(e)}")
        return jsonify({"message": "Error toggling screenshot blocking", "error": str(e)}), 500

@app.route('/')
def index():
    return "Flask server is running."
# Get all keywords
@app.route('/get-keyword-content', methods=['GET'])
def get_keyword_logs():
    print("got it")
    if os.path.exists(KEYWORDS_FILE_PATH):
        try:
            with open(KEYWORDS_FILE_PATH, 'r') as file:
                content = file.read()
            return jsonify({"content": content}), 200
        except Exception as e:
            return jsonify({"error": f"Error reading file: {str(e)}"}), 500
    else:
        return jsonify({"error": "Keywords file not found"}), 404

def load_keywords():
    """
    Load keywords from a file. Each keyword is stored on a new line in the file.
    Returns a list of keywords.
    """
    if os.path.exists(KEYWORDS_FILE_PATH):
        with open(KEYWORDS_FILE_PATH, 'r', encoding='utf-8') as file:
            keywords = [line.strip() for line in file if line.strip()]
        return keywords
    return []

@app.route('/keywords', methods=['GET'])
def get_keywords():
    keywords = load_keywords()
    return jsonify({"keywords": keywords}), 200

# Add a new keyword
@app.route('/keywords', methods=['POST'])
def add_keyword():
    new_keyword = request.json.get('keyword', '').strip()
    if new_keyword:
        keywords = load_keywords()
        if new_keyword not in keywords:
            keywords.append(new_keyword)
            save_keywords(keywords)
            return jsonify({"message": "Keyword added successfully", "keywords": keywords}), 200
        return jsonify({"message": "Keyword already exists"}), 400
    return jsonify({"message": "Invalid keyword"}), 400

# Delete a specific keyword
@app.route('/keywords/<string:keyword>', methods=['DELETE'])
def delete_keyword(keyword):
    keywords = load_keywords()
    if keyword in keywords:
        keywords.remove(keyword)
        save_keywords(keywords)
        return jsonify({"message": "Keyword deleted successfully", "keywords": keywords}), 200
    return jsonify({"message": "Keyword not found"}), 404



def get_windows_version():
    return platform.platform()

def get_device_id():
    return str(uuid.uuid1())

@app.route('/user-info', methods=['GET'])
def user_info():
    user_name = os.getlogin()
    device_id = get_device_id()
    windows_version = get_windows_version()
    
    return jsonify({
        "user_name": user_name,
        "device_id": device_id,
        "windows_version": windows_version
    })
    
@app.route('/ping',methods=['GET'])
def ping():
    user_name = os.getlogin()  # Get the logged-in user's name
    serial_number = platform.node()  # Use the machine's hostname or another unique identifier
    device_id=get_device_id()
    windows_version = get_windows_version()
    
    return jsonify({
        "message": "Client is connected",
        "user_name": user_name,
        "device_id": device_id,
        "windows_version": windows_version
        }), 200

@app.route('/give-logs', methods=['POST'])
def give_logs():
    print("executing give logs")
    try:
        # List all log files in the directory
        log_files = [f for f in os.listdir(LOG_DIRECTORY) if f.endswith('.txt')]
        if not log_files:
            return jsonify({"message": "No log files available"}), 404

        # Send each log file to the admin server
        for log_file in log_files:
            log_path = os.path.join(LOG_DIRECTORY, log_file)
            with open(log_path, 'rb') as file:
                files = {'file': file}
                response = requests.post(ADMIN_SERVER_URL, files=files)

                if response.status_code == 200:
                    print(f"Log {log_file} sent successfully to the admin server.")
                else:
                    print(f"Failed to send log {log_file} to the admin server, status code: {response.status_code}")

        return jsonify({"message": "All log files sent successfully to the admin."}), 200
    
    except Exception as e:
        return jsonify({"message": "Error sending log files", "error": str(e)}), 500

@app.route('/run-vulnerability-scan', methods=['POST'])
def run_vulnerability_scan():
    global last_va_scan_time
    try:
        # Run the VBScript
        run_executable(VBSCRIPT_PATH)
        # print("STDOUT:", result.stdout)
        # print("STDERR:", result.stderr)
        last_va_scan_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        time.sleep(5)
        # Log output to a file
        log_files = [f for f in os.listdir(LOG_DIRECTORY) if f.endswith('.txt')]
        print(log_files)

        # Send the log file to the admin server
        for log_file in log_files:
            print("in for loop")
            log_path = os.path.join(LOG_DIRECTORY, log_file)
            print(log_path)
            with open(log_path, 'rb') as file:
                files = {'file': file}
                response = requests.post(ADMIN_SERVER_URL, files=files)
                
                if response.status_code == 200:
                    print(f"Log {log_file} sent successfully to the admin server .")
                else:
                    print(f"Failed to send log {log_file} to the admin server {response.status_code}.")
        
        return jsonify({"message": "Vulnerability scan completed and logs sent to admin.", "output": result.stdout})
    
    except subprocess.CalledProcessError as e:
        return jsonify({"message": "Error running VBScript", "error": e.stderr}), 500
    except Exception as e:
        return jsonify({"message": "Unexpected error occurred", "error": str(e)}), 500



@app.route('/run-keyword-monitoring', methods=['POST'])
def run_keyword_monitoring():
    global keyword_monitoring_status
    try:
        print("rcd cmd")
        if is_exe_running(KEYWORD_MONITORING_EXE.split('/')[-1]):
            return jsonify({"message": "Keyword monitoring is already running."})
        # Run the keyword monitoring executable on the client machine
        subprocess.Popen([KEYWORD_MONITORING_EXE]) 
        keyword_monitoring_status = True
         # Run in the background

        return jsonify({"message": "Keyword monitoring started successfully."})
    except Exception as e:
        return jsonify({"message": "Error running executable", "error": str(e)}), 500



@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "usbPortBlocking": usb_blocking_status,
        "keywordMonitoring": keyword_monitoring_status,
        "screenshotBlocking": screenshot_status,
        "lastVAScanTime": last_va_scan_time,
        "executableBlocking": executable_status,
    })



@app.route('/get-usb-log', methods=['GET'])
def get_usb_log():
    if os.path.exists(USB_LOG_FILE_PATH):
        try:
            with open(USB_LOG_FILE_PATH, 'r') as file:
                content = file.read()
            return jsonify({"content": content}), 200
        except Exception as e:
            return jsonify({"error": f"Error reading file: {str(e)}"}), 500
    else:
        return jsonify({"error": "USB log file not found"}), 404

def log_usb_action_to_firebase(action, status):
    # Get the current user's username
    username = os.getlogin()

    # Get a reference to the "usblogs" node in your Realtime Database
    ref = db.reference('usblogs')

    # Create a log entry with a timestamp, action, status, and username
    log_entry = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S") ,
        'action': action,
        'status': status
    }

    # Update or set the log entry for this username
    ref.child(username).set(log_entry)
        
usb_blocking_state = False
usb_blocking_process = None

@app.route('/toggle-usb-port-blocking', methods=['POST'])
def toggle_usb_port_blocking_client():
    global usb_blocking_process, usb_blocking_state
    
    data = request.get_json()
    toggle_state = data.get('toggleState', False)

    try:
        if toggle_state:
            # Enable USB/Port Blocking
            exe_path = Path('C:\\Program Files\\DLP\\USB_block.exe')
            status = "on"

            # Log the action
            log_usb_action_to_firebase("USB port blocking enabled", status)
            log_usb_action("USB port blocking enabled")
            
            # Start the executable
            usb_blocking_process = subprocess.Popen(
                [str(exe_path)],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            # Disable USB/Port Blocking
            status = "off"

            # Log the action
            log_usb_action_to_firebase("USB port blocking disabled", status)
            log_usb_action("USB port blocking disabled")
            
            # Kill the running USB_block.exe process
            if usb_blocking_process and usb_blocking_process.poll() is None:
                usb_blocking_process.terminate()
                usb_blocking_process.wait()
                usb_blocking_process = None
            else:
                # Use psutil to ensure the process is terminated
                for proc in psutil.process_iter(['pid', 'name']):
                    if proc.info['name'] == 'USB_block.exe':
                        proc.terminate()
                        proc.wait()

        usb_blocking_state = toggle_state
        return jsonify({"message": f"USB/Port Blocking {'enabled' if toggle_state else 'disabled'}"}), 200
    except Exception as e:
        print(f"Error toggling USB/Port Blocking: {str(e)}")
        return jsonify({"message": "Error toggling USB/Port Blocking", "error": str(e)}), 500


EXE_PATHS = {
    'excel': r"C:\Program Files\DLP\Excel_viewer.exe",
    'image': r"C:\Program Files\DLP\Image_Viewer.exe",
    'pdf': r"C:\Program Files\DLP\PDF_Viewer.exe",
    'adobe': r"C:\Program Files\Adobe\Acrobat Reader\AcroRd32.exe",  # Adobe Acrobat Reader path for replacement
}

# Path to the paths.txt file (assuming it's unique per client)
  # Adjust this path accordingly for the client

def update_paths_file(viewer_type):
    # Get the appropriate executable path based on viewer type
    exe_path = EXE_PATHS.get(viewer_type, None)

    if not exe_path:
        return False

    # Open paths.txt and append the correct path
    exe_path = exe_path.strip()  # Remove any leading/trailing spaces or newlines

    # Open paths.txt and append the correct path
    try:
        with open(CLIENT_PATHS_FILE, 'a') as f:  # Use 'a' to append
            f.write(exe_path + '\n')
    except Exception as e:
        print(f"Error writing to paths.txt: {str(e)}")
        return False


@app.route('/enable-type-viewer', methods=['POST'])
def enable_type_viewer():
    data = request.get_json()
    print(f"Received data: {data}")
    toggle_state = data.get('toggleState', False)
    viewer_type = data.get('viewerType', None)
    print(toggle_state)
    print(viewer_type)
    if not viewer_type:
        return jsonify({"message": "Viewer type not specified"}), 400

    if viewer_type not in EXE_PATHS:
        return jsonify({"message": "Invalid viewer type"}), 400

    # If toggle is enabled, update the paths.txt to the viewer type path
    if toggle_state:
        if update_paths_file(viewer_type):
            return jsonify({"message": f"{viewer_type} viewer enabled successfully."}), 200
        else:
            return jsonify({"message": f"Failed to enable {viewer_type} viewer."}), 500

    # If toggle is disabled, replace with Adobe path
    else:
        if update_paths_file('adobe'):
            return jsonify({"message": "Viewer disabled, replaced with Adobe Reader path."}), 200
        else:
            return jsonify({"message": "Failed to disable viewer and replace path."}), 500


def upload_logs_to_firebase():
    """Reads local log files and uploads them to Firebase under the user-specific nodes."""
    try:
        # Get the current user's username
        user_name = os.getlogin()

        # Read USB log file
        if os.path.exists(USB_LOG_FILE_PATH):
            with open(USB_LOG_FILE_PATH, 'r') as usb_file:
                usb_logs = usb_file.readlines()
                for log in usb_logs:
                    log_entry = {
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        'log': log.strip()
                    }
                    db.reference(f'usb_hist/{user_name}').push(log_entry)
            print(f"Uploaded USB logs to Firebase under user: {user_name}")

        # Read Screenshot log file
        if os.path.exists(SCREENSHOT_LOG_FILE_PATH):
            with open(SCREENSHOT_LOG_FILE_PATH, 'r') as ss_file:
                ss_logs = ss_file.readlines()
                for log in ss_logs:
                    log_entry = {
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        'log': log.strip()
                    }
                    db.reference(f'ss_hist/{user_name}').push(log_entry)
            print(f"Uploaded Screenshot logs to Firebase under user: {user_name}")

        # Read Keyword Monitoring log file
        if os.path.exists(KEYWORDS_FILE_PATH):
            with open(KEYWORDS_FILE_PATH, 'r') as keyword_file:
                keyword_logs = keyword_file.readlines()
                for log in keyword_logs:
                    log_entry = {
                        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        'log': log.strip()
                    }
                    db.reference(f'keyword_hist/{user_name}').push(log_entry)
            print(f"Uploaded Keyword logs to Firebase under user: {user_name}")

    except Exception as e:
        print(f"Error uploading logs to Firebase: {e}")


# Schedule the log upload task
scheduler.add_job(func=upload_logs_to_firebase, trigger='interval', minutes=1, max_instances=2, coalesce=True)


scheduler.start()



if __name__ == "__main__":
    if not initialize_firebase():
        print("Failed to initialize Firebase. Exiting.")
        exit(1)

    print("Proceeding with the rest of the application...")

    start_usb_monitoring_in_thread()  # Start USB monitoring as background thread
     
    serve(app, host='0.0.0.0', port=5001)
