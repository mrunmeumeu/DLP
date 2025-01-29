import time
import pygetwindow as gw
import requests
import ctypes
import subprocess
import os

# Define paths
ps_script_path = r"C:\\Program Files\\DLP\\EnableAuditing.ps1"

def run_powershell_script(script_path):
    """
    Executes a PowerShell script to enable auditing.
    """
    try:
        if not os.path.exists(script_path):
            print(f"PowerShell script not found: {script_path}")
            return False

        process = subprocess.run(
            ["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", script_path],
            capture_output=True,
            text=True
        )

        print(f"PowerShell Output:\n{process.stdout}")
        if process.stderr:
            print(f"PowerShell Errors:\n{process.stderr}")

        return process.returncode == 0
    except Exception as e:
        print(f"Error running PowerShell script: {e}")
        return False

def get_popup_window_titles():
    """
    Detects popups with specific titles like 'Application Error' or 'Blocked by Administrator'.
    """
    titles = []
    for window in gw.getAllTitles():
        if "Application Error" in window or "blocked by your system administrator" in window:
            titles.append(window)
    return titles

def extract_exe_name_from_title(title):
    """
    Extracts executable name from 'Application Error' window title.
    Example: 'msedge.exe - Application Error' -> 'msedge.exe'
    """
    if " - Application Error" in title:
        return title.split(" - Application Error")[0]
    return None

def retrieve_event_log():
    """
    Retrieves the latest 5 logs with Event ID 4688 (Process Creation) and saves them to exec.txt.
    """
    try:
        command = [
            "powershell.exe",
            "-Command",
            """
            Get-WinEvent -LogName Security |
            Where-Object { $_.Id -eq 4688 } |
            Select-Object -First 5 -Property TimeCreated, Message |
            Format-List
            """
        ]
        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode == 0 and result.stdout.strip():
            logs = result.stdout.strip()
            print("Event Logs Retrieved:\n", logs)

            # Save logs to exec.txt
            with open("exec.txt", "w", encoding="utf-8") as file:
                file.write(logs)

            return logs
        else:
            print(f"Failed to retrieve event logs: {result.stderr}")
            return None
    except Exception as e:
        print(f"Error retrieving event logs: {e}")
        return None
def parse_event_logs_from_file():
    """
    Reads and parses the event logs from exec.txt.
    Finds 'Creator Process Name' and checks if the next 30 characters include 'c:\windows\explorer.exe'.
    Extracts the 'New Process Name' if the condition is met.
    """
    try:
        filtered_process_names = []
        
        # Ensure the file exists
        if not os.path.exists("exec.txt"):
            print("Log file 'exec.txt' does not exist. Cannot parse logs.")
            return []

        with open("exec.txt", "r", encoding="utf-8") as file:
            logs = file.read()

        # Split logs into individual entries
        log_entries = logs.split("TimeCreated")
        if not log_entries:
            print("No logs found in 'exec.txt'.")
            return []

        for log in log_entries:
            log = log.strip()  # Remove surrounding spaces
            if not log:
                continue  # Skip empty entries

            # Normalize and split log lines
            log_lines = [line.strip() for line in log.splitlines() if line.strip()]
            
            # Find 'Creator Process Name' line
            for i, line in enumerate(log_lines):
                if line.lower().startswith("creator process name:"):
                    # Check if the next 30 characters contain 'c:\windows\explorer.exe'
                    creator_process_value = line[20:50].strip().lower() 
                    print("checkin")
                    print(creator_process_value) # Extract 30 characters after "Creator Process Name:"
                    if "c:\\windows\\explorer.exe" in creator_process_value:
                        print(f"Matched Creator Process Name: {line}")

                        # Look for 'New Process Name' in the same log
                        for l in log_lines:
                            if l.lower().startswith("new process name:"):
                                new_process_name = l.split(":", 1)[1].strip()
                                filtered_process_names.append(new_process_name)
                                print(f"Extracted New Process Name: {new_process_name}")
                        break  # Stop processing this log

        if not filtered_process_names:
            print("No matching entries found for 'Creator Process Name: C:\\Windows\\explorer.exe'.")

        return filtered_process_names
    except Exception as e:
        print(f"Error parsing event logs: {e}")
        return []


def log_to_firebase(payload):
    """
    Logs extracted information to Firebase via REST API.
    """
    try:
        url = "http://localhost:5001/exec-violation"
        print(f"Sending payload to Firebase: {payload}")
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"Logged violation successfully: {payload}")
        else:
            print(f"Failed to log violation. Status code: {response.status_code}")
            print(f"Response Text: {response.text}")
    except Exception as e:
        print(f"Error logging to Firebase: {e}")

def main():
    print("Running PowerShell script to enable auditing...")
    if not run_powershell_script(ps_script_path):
        print("Failed to run PowerShell script. Exiting.")
        return

    print("PowerShell script executed successfully.")
    print("Monitoring for 'Application Error' and 'Blocked by Administrator' popups...")

    while True:
        try:
            # Detect popups
            popups = get_popup_window_titles()

            for popup_title in popups:
                if "Application Error" in popup_title:
                    exe_name = extract_exe_name_from_title(popup_title)
                    if exe_name:
                        print(f"Detected Type 1 violation for {exe_name}. Logging...")
                        payload = {
                            "exe_name": exe_name,
                            "type": "Application Error",
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        log_to_firebase(payload)

                elif "blocked by your system administrator" in popup_title.lower():
                    print("Type 2 popup detected, now retrieving logs...")
                    retrieve_event_log()

                    # Parse and filter logs
                    process_names = parse_event_logs_from_file()
                    log_filtered_process_names(process_names)

            time.sleep(2)

        except KeyboardInterrupt:
            print("Exiting monitoring script.")
            break
def log_filtered_process_names(process_names):
    """
    Logs the filtered process names to Firebase via REST API.
    """
    try:
        url = "http://localhost:5001/exec-violation"
        for process_name in process_names:
            payload = {
                "exe_name": process_name,
                "type": "Blocked by Administrator",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            }
            print(f"Sending payload to Firebase: {payload}")
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print(f"Logged violation successfully: {payload}")
            else:
                print(f"Failed to log violation. Status code: {response.status_code}")
                print(f"Response Text: {response.text}")
    except Exception as e:
        print(f"Error logging to Firebase: {e}")



if __name__ == "__main__":
    if not ctypes.windll.shell32.IsUserAnAdmin():
        print("This script must be run as Administrator.")
    else:
        main()
