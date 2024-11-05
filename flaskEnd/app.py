from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
SENSITIVE_KEYWORDS = ["tl", "commission", "confidential", "kickback"]
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
LOG_DIRECTORY = r'C:\\Users\\Mrunmai\\OneDrive\\Desktop\\DLP\\DLP\\DLP\\VA logs'
# Windows-specific flag to open in a new console window
CREATE_NEW_CONSOLE = 0x00000010

@app.route('/toggle-usb-port-blocking', methods=['POST'])
def toggle_usb_port_blocking():
    data = request.get_json()
    toggle_state = data.get('toggleState', False)

    try:
        if toggle_state:
            # Run the VBScript for enabling USB/Port Blocking in a new console window
            process = subprocess.Popen(
                ['cscript.exe', '//B', r"C:\\Users\\Mrunmai\\OneDrive\\Desktop\\DLP\\DLP\\DLP\\Admin usb block.vbs"],
                creationflags=CREATE_NEW_CONSOLE
            )
        else:
            # Run the VBScript for disabling USB/Port Blocking in a new console window
            process = subprocess.Popen(
                ['cscript.exe', '//B', r"C:\\Users\\Mrunmai\\OneDrive\\Desktop\\DLP\\DLP\\DLP\\Admin usb not block.vbs"],
                creationflags=CREATE_NEW_CONSOLE
            )

        return jsonify({"message": f"USB/Port Blocking {'enabled' if toggle_state else 'disabled'}"})
    except Exception as e:
        print(f"Error running the VBScript: {str(e)}")
        return jsonify({"message": "Error running the VBScript", "error": str(e)}), 500


@app.route('/run-vulnerability-scan', methods=['POST'])
def run_vulnerability_scan():
    try:
        # Run the VBScript file using cscript
        result = subprocess.run(
            ['cscript.exe', '//B', r"C:\Users\\Mrunmai\\OneDrive\\Desktop\\DLP\\DLP\\DLP\\VulAssess.vbs"],
            capture_output=True, text=True, check=True
        )

        # Log stdout and stderr for debugging purposes
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)

        # Return the output to the React frontend
        return jsonify({"message": "Vulnerability scan completed", "output": result.stdout})
    except subprocess.CalledProcessError as e:
        # Handle the error in case the script fails
        print(f"Error running VBScript: {e.stderr}")
        return jsonify({"message": "Error running VBScript", "error": e.stderr}), 500
    except Exception as e:
        # General error handling
        print(f"Unexpected error: {str(e)}")
        return jsonify({"message": "Unexpected error occurred", "error": str(e)}), 500

@app.route('/list-logs', methods=['GET'])
def list_logs():
    try:
        # List all files in the log directory
        log_files = [f for f in os.listdir(LOG_DIRECTORY) if f.endswith('.txt')]
        return jsonify({"logFiles": log_files})
    except Exception as e:
        return jsonify({"message": "Error listing log files", "error": str(e)}), 500

# Endpoint to view a specific log file by filename
@app.route('/view-logs', methods=['GET'])
def view_logs():
    log_filename = request.args.get('filename')
    
    if not log_filename:
        return jsonify({"message": "No filename provided"}), 400
    
    log_path = os.path.join(LOG_DIRECTORY, log_filename)

    try:
        if os.path.exists(log_path):
            with open(log_path, 'r') as log_file:
                log_content = log_file.read()
            return jsonify({"logContent": log_content})
        else:
            return jsonify({"message": "Log file not found"}), 404
    except Exception as e:
        return jsonify({"message": "Error reading log file", "error": str(e)}), 500





@app.route('/toggle-clipboard-monitoring', methods=['POST'])
def toggle_clipboard_monitoring():
    data = request.get_json()
    toggle_state = data.get('toggleState', False)

    try:
        if toggle_state:
            # Use Popen to start the script in the background
            process = subprocess.Popen(['python', r'C:\\Users\\Mrunmai\\NewImplementation\\test12.py'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            message = "Clipboard Monitoring started"
        else:
            # Use Popen to stop the script in the background (if applicable)
            process = subprocess.Popen(['python', r'C:\\Users\\Mrunmai\\NewImplementation\\test12.py'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            message = "Clipboard Monitoring stopped"

        return jsonify({"message": message})
    except Exception as e:
        print("Exception:", str(e))
        return jsonify({"message": "Error running the clipboard monitoring script", "error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
