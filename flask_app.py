from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import requests
import subprocess
import psutil
from urllib.parse import urlparse
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})
NETWORK_RANGE = '192.168.68.100-250'


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response


# This is a dictionary where you can map clients to their IPs
IP_LIST = [
    # '172.20.10.3',
    # '172.20.10.5',
    '192.168.68.236',
    '192.168.68.108',

    
    # Add more IPs as needed
]
# Directory where the logs from clients will be saved on the admin machine

LOG_DIRECTORY = os.path.join("C:\\Program Files", "DLP", "ret_log")
#LOG_DIRECTORY = os.path.join("C:\\Users\\Mrunmai", "intern", "ret_log")
DEVICES_FILE = "C:\\Program Files\\DLP\\devices.txt"

#some file not named intern
if not os.path.exists(LOG_DIRECTORY):
    os.makedirs(LOG_DIRECTORY)
# A dictionary to store the IP addresses of the connected clients
# Load CLIENTS from devices file
def load_clients_from_file():
    if os.path.exists(DEVICES_FILE):
        with open(DEVICES_FILE, "r") as f:
            ips = [line.strip() for line in f if line.strip()]
            return {f"Client{index+1}": f"http://{ip}:5001" for index, ip in enumerate(ips)}
    return {}

# Save IPs to devices file
def save_ips_to_file(ips):
    with open(DEVICES_FILE, "w") as f:
        f.write("\n".join(ips))

# Reload CLIENTS dynamically
def reload_clients():
    global CLIENTS
    CLIENTS = load_clients_from_file()

# Initialize CLIENTS
reload_clients()

# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
#     return response





@app.route('/system-stats', methods=['GET'])
def system_stats():
    # Get CPU usage as a percentage
    cpu_usage = psutil.cpu_percent(interval=1)  # Wait for 1 second to get an accurate reading
    
    # Get RAM usage as a percentage
    ram_usage = psutil.virtual_memory().percent

    return jsonify({
        'cpu_usage': cpu_usage,
        'ram_usage': ram_usage
    })


@app.route('/scan-network', methods=['GET'])
def scan_network():
    connected_clients = []
    print("chsanged")
    print("scanning")

    for client_id, client_url in CLIENTS.items():
        print(f"Checking client: {client_id} at {client_url}")
        try:
            # Send an HTTP GET request to the client’s /ping endpoint
            response = requests.get(f'{client_url}/ping', timeout=3)  # 2-second timeout to avoid waiting too long
            if response.status_code == 200:
                client_data = response.json()  # Get the JSON response from the client
                client_status = {
                    'ip': client_url.split("//")[1].split(":")[0],  # Extract IP from the URL
                    'status': 'Connected',
                    'client_id': client_id,
                    'user_name': client_data.get('user_name', 'Unknown'),
                    'device_id': client_data.get('device_id', 'Unknown'),  # Add device ID from client
                    'windows_version': client_data.get('windows_version', 'Unknown') 
                }
            else:
                client_status = {
                    'ip': client_url.split("//")[1].split(":")[0],
                    'status': 'Disconnected',
                    'client_id': client_id
                }
        except requests.ConnectionError:
            # If the request fails, mark the client as disconnected
            client_status = {
                'ip': client_url.split("//")[1].split(":")[0],
                'status': 'Disconnected',
                'client_id': client_id
            }

        connected_clients.append(client_status)
        print("finished scan")

    return jsonify(connected_clients)


@app.route('/firebase-config', methods=['GET'])
def get_firebase_config():
    config_path = "C:/Program Files/DLP/firebaseConfig.json"  # Path to your config file
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as config_file:
                firebase_config = config_file.read()
            return jsonify({"config": firebase_config}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to load Firebase config: {str(e)}"}), 500
    else:
        return jsonify({"error": "Firebase config file not found"}), 404
    
@app.route('/add-client', methods=['POST'])
def add_client():
    data = request.get_json()
    ip = data.get('ip')

    if not ip:
        return jsonify({"message": "IP address is required"}), 400

    # Load existing IPs and check for duplicates
    current_ips = [urlparse(url).hostname for url in CLIENTS.values()]
    if ip in current_ips:
        return jsonify({"message": "Client IP already exists"}), 400

    # Add the new IP to the file and reload clients
    current_ips.append(ip)
    save_ips_to_file(current_ips)
    reload_clients()

    return jsonify({"message": f"Client with IP {ip} added successfully", "clients": CLIENTS}), 200




@app.route('/client/<ip>', methods=['GET'])
def client_page(ip):
    # Check if the IP belongs to any known client
    for client_id, client_url in CLIENTS.items():
        if ip in client_url:
            try:
                # Get client details using the ping endpoint
                response = requests.get(f'{client_url}/ping', timeout=2)
                if response.status_code == 200:
                    client_data = response.json()
                    return jsonify({
                        "client_id": client_id,
                        "ip": ip,
                        "user_name": client_data.get('user_name', 'Unknown'),
                        'device_id': client_data.get('device_id', 'Unknown'),  # Add device ID from client
                        'windows_version': client_data.get('windows_version', 'Unknown') ,
                        "status": "Connected"
                    })
            except requests.ConnectionError:
                pass
    return jsonify({"message": "Client not found or disconnected"}), 404
    

# This route can be used by clients to verify they are connected (add to client Flask app)
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Client is connected"}), 200

@app.route('/get-screenshot-log', methods=['POST'])
def get_screenshot_log():
    data = request.get_json()
    client_ips = data.get('client_ids', [])

    if not client_ips:
        return jsonify({"message": "No client IPs provided"}), 400

    responses = []
    for client_ip in client_ips:
        client_url = None
        for client_id, url in CLIENTS.items():
            if client_ip in url:
                client_url = url
                break

        if not client_url:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Request screenshot log from the client
            response = requests.get(f'{client_url}/get-screenshot-log')
            if response.status_code == 200:
                content = response.json().get('content', 'No content found.')
                responses.append({"client_id": client_ip, "content": content})
            else:
                responses.append({
                    "client_id": client_ip,
                    "message": "Error fetching screenshot log content",
                    "error": response.json().get('error')
                })
        except requests.RequestException as e:
            responses.append({"client_id": client_ip, "message": "Error communicating with client", "error": str(e)})

    return jsonify(responses)

@app.route('/screenshot-block', methods=['POST'])
def screenshot_block():
    data = request.get_json()
    toggle_state = data.get('toggleState', False)
    client_ips = data.get('client_ids', [])

    if not client_ips:
        return jsonify({"message": "No client IPs provided"}), 400

    responses = []
    for client_ip in client_ips:
        client_url = None
        for client_id, url in CLIENTS.items():
            if client_ip in url:
                client_url = url
                break

        if not client_url:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            response = requests.post(f'{client_url}/toggle-screenshot-block', json={"toggleState": toggle_state})
            if response.status_code == 200:
                responses.append({"client_id": client_ip, "message": f"Screenshot Blocking {'enabled' if toggle_state else 'disabled'}"})
            else:
                responses.append({"client_id": client_ip, "message": "Error toggling screenshot blocking", "error": response.text})
        except requests.exceptions.RequestException as e:
            responses.append({"client_id": client_ip, "message": "Error communicating with client", "error": str(e)})

    return jsonify(responses)



@app.route('/upload-log', methods=['POST'])
def upload_log():
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    try:
        # Save the file to the server's log directory
        file.save(os.path.join(LOG_DIRECTORY, file.filename))
        return jsonify({"message": f"Log file {file.filename} uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Failed to save the log file", "error": str(e)}), 500

@app.route('/list-logs', methods=['GET'])
def list_logs():
    try:
        log_files = [f for f in os.listdir(LOG_DIRECTORY) if f.endswith('.txt')]
        return jsonify({"logFiles": log_files}), 200
    except Exception as e:
        return jsonify({"message": "Error listing log files", "error": str(e)}), 500

@app.route('/view-logs', methods=['GET'])
def view_log():
    log_filename = request.args.get('filename')
    
    if not log_filename:
        return jsonify({"message": "No filename provided"}), 400
    
    log_path = os.path.join(LOG_DIRECTORY, log_filename)

    try:
        if os.path.exists(log_path):
            with open(log_path, 'r') as log_file:
                log_content = log_file.read()
            return jsonify({"logContent": log_content}), 200
        else:
            return jsonify({"message": "Log file not found"}), 404
    except Exception as e:
        return jsonify({"message": "Error reading log file", "error": str(e)}), 500
    


@app.route('/give-logs', methods=['POST'])
def give_logs():
    data = request.get_json()
    client_ips = data.get('client_ids', [])  # Assuming client_ids contains IP addresses

    if not client_ips:
        return jsonify({"message": "No client IPs provided"}), 400

    responses = []

    # Iterate over each client IP provided
    for client_ip in client_ips:
        client_url = None

        # Search for the client IP in the CLIENTS dictionary
        for client_id, url in CLIENTS.items():
            if client_ip in url:  # Check if IP is part of the URL
                client_url = url
                break

        if not client_url:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Send request to client's give-logs endpoint
            response = requests.post(f'{client_url}/give-logs')
            if response.status_code == 200:
                responses.append({"client_id": client_ip, "message": "Log files requested successfully"})
            else:
                responses.append({"client_id": client_ip, "message": "Error requesting log files", "error": response.json().get('message')})
        except requests.exceptions.RequestException as e:
            responses.append({"client_id": client_ip, "message": "Error communicating with client", "error": str(e)})

    return jsonify(responses)



@app.route('/run-vulnerability-scan', methods=['POST'])
def run_vulnerability_scan():
    data = request.get_json()
    client_ids = data.get('client_ids',[])  # Get a list of client IDs from the request
    print(f"rcd ids: {client_ids}")
    if not client_ids:
        return jsonify({"message": "No client IDs provided"}), 400

    responses = []  # To store responses from each client

    for client_id in client_ids:
        # Extract just the IP (ignore the port)
        stripped_client_ip = client_id.split(':')[0]
        matched_client = None
        for client_id, client_url in CLIENTS.items():
            stripped_client_url_ip = client_url.split('//')[1].split(':')[0]
            print(f"Checking client IP: {stripped_client_ip} == {stripped_client_url_ip}")
            if stripped_client_ip == stripped_client_url_ip:  # Match the IP without port
                matched_client = client_id
                break

        if not matched_client:
            responses.append({"client_id": client_id, "message": "Client not found"})
            continue

        try:
            # Send a request to the client to run the vulnerability scan
            response = requests.post(f'{CLIENTS[matched_client]}/run-vulnerability-scan')

            if response.status_code == 200:
                responses.append({"client_id": matched_client, "message": "Scan completed", "output": response.json().get('output')})
            else:
                responses.append({"client_id": matched_client, "message": f"Error on {matched_client}", "error": response.text})
        except requests.exceptions.RequestException as e:
            responses.append({"client_id": matched_client, "message": f"Error communicating with {matched_client}", "error": str(e)})

    return jsonify(responses)

# Endpoint to receive log files from clients

@app.route('/get-keyword-logs', methods=['POST'])
def get_keyword_logs():
    data = request.get_json()
    client_ips = data.get('client_ids', [])  # List of client IPs

    if not client_ips:
        return jsonify({"message": "No client IPs provided"}), 400

    responses = []

    # Iterate over each client IP provided
    for client_ip in client_ips:
        client_url = None

        # Search for the client IP in the CLIENTS dictionary
        for client_id, url in CLIENTS.items():
            if client_ip in url:  # Check if IP is part of the URL
                client_url = url
                break

        if not client_url:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Send request to client's get-keyword-content endpoint
            response = requests.get(f'{client_url}/get-keyword-content')
            if response.status_code == 200:
                content = response.json().get('content')
                responses.append({"client_id": client_ip, "content": content})
            else:
                responses.append({
                    "client_id": client_ip,
                    "message": "Error fetching keyword content",
                    "error": response.json().get('error')
                })
        except requests.RequestException as e:
            responses.append({"client_id": client_ip, "message": f"Error communicating with client", "error": str(e)})

    return jsonify(responses)



@app.route('/run-keyword-monitoring', methods=['POST'])
def run_keyword_monitoring_client():
    data = request.get_json()
    client_ids = data.get('client_ids', [])  # Get the client IDs list
    toggle_state = data.get('toggleState', False)

    if not client_ids:
        return jsonify({"message": "No client IDs provided"}), 400

    responses = []

    # Iterate through each client in the list
    for client_ip in client_ids:
        matched_client = None
        for client_id, client_url in CLIENTS.items():
            if client_ip in client_url:  # Match the client IP with the stored client URL
                matched_client = client_id
                break

        if not matched_client:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Forward the keyword monitoring request to the client
            response = requests.post(f'{CLIENTS[matched_client]}/run-keyword-monitoring', json={"toggleState": toggle_state})

            if response.status_code == 200:
                responses.append({"client_id": matched_client, "message": f"Keyword monitoring {'enabled' if toggle_state else 'disabled'} on {matched_client}"})
            else:
                responses.append({"client_id": matched_client, "message": f"Error on {matched_client}", "error": response.text})
        except requests.exceptions.RequestException as e:
            responses.append({"client_id": matched_client, "message": f"Error communicating with {matched_client}", "error": str(e)})

    return jsonify(responses)

@app.route('/delete-client/<ip>', methods=['DELETE'])
def delete_client(ip):
    # Load existing IPs
    current_ips = [urlparse(url).hostname for url in CLIENTS.values()]

    if ip not in current_ips:
        return jsonify({"message": "Client not found"}), 404

    # Remove the IP
    current_ips = [urlparse(url).hostname for url in CLIENTS.values() if urlparse(url).hostname != ip]
    save_ips_to_file(current_ips)
    reload_clients()

    return jsonify({"message": f"Client with IP {ip} deleted successfully", "clients": CLIENTS}), 200
reload_clients()

@app.route('/list-clients', methods=['GET'])
def list_clients():
    # Return the current list of clients
    return jsonify({"clients": CLIENTS}), 200


@app.route('/get-usb-log', methods=['POST'])
def get_usb_log():
    data = request.get_json()
    client_ips = data.get('client_ids', [])

    if not client_ips:
        return jsonify({"message": "No client IPs provided"}), 400

    responses = []

    # Iterate over each client IP provided
    for client_ip in client_ips:
        client_url = None

        # Search for the client IP in the CLIENTS dictionary
        for client_id, url in CLIENTS.items():
            if client_ip in url:
                client_url = url
                break

        if not client_url:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Send request to the client's get-usb-log endpoint
            response = requests.get(f'{client_url}/get-usb-log')
            if response.status_code == 200:
                content = response.json().get('content', 'No content found.')
                responses.append({"client_id": client_ip, "content": content})
            else:
                responses.append({
                    "client_id": client_ip,
                    "message": "Error fetching USB log content",
                    "error": response.json().get('error')
                })
        except requests.RequestException as e:
            responses.append({"client_id": client_ip, "message": f"Error communicating with client", "error": str(e)})

    return jsonify(responses)


@app.route('/toggle-usb-port-blocking', methods=['POST'])
def toggle_usb_port_blocking():
    data = request.get_json()
    print(data)
    toggle_state = data.get('toggleState', False)
    client_ids = data.get('client_ids', [])  # Get list of client IDs

    if not client_ids:
        return jsonify({"message": "No client IDs provided"}), 400

    responses = []

    for client_ip in client_ids:
        matched_client = None
        for client_id, client_url in CLIENTS.items():
            if client_ip in client_url:
                matched_client = client_id
                break

        if not matched_client:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Forward the USB blocking request to the client
            response = requests.post(f'{CLIENTS[matched_client]}/toggle-usb-port-blocking', json={"toggleState": toggle_state})
            if response.status_code == 200:
                responses.append({"client_id": matched_client, "message": f"USB/Port Blocking {'enabled' if toggle_state else 'disabled'} on {matched_client}"})
            else:
                responses.append({"client_id": matched_client, "message": f"Error on {matched_client}", "error": response.text})
        except requests.exceptions.RequestException as e:
            responses.append({"client_id": matched_client, "message": f"Error communicating with {matched_client}", "error": str(e)})

    return jsonify(responses)




KEYWORDS_FILE_PATH = r"C:\\Users\\Mrunmai\\intern\\keywords\\keywords.txt.txt"

# Load keywords from the file
def load_keywords():
    if os.path.exists(KEYWORDS_FILE_PATH):
        with open(KEYWORDS_FILE_PATH, "r") as f:
            keywords = [line.strip() for line in f if line.strip()]
        return keywords
    return []

# Save keywords to the file
def save_keywords(keywords):
    with open(KEYWORDS_FILE_PATH, "w") as f:
        for keyword in keywords:
            f.write(keyword + "\n")

# Get all keywords
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


@app.route('/enable-type-viewer', methods=['POST'])
def enable_type_viewer():
    data = request.get_json()
    client_ips = data.get('client_ids', [])  # List of client IPs
    toggle_state = data.get('toggleState', False)  # Boolean to enable/disable viewer
    viewer_type = data.get('viewerType', None) 
    print(toggle_state)
    print(viewer_type) 
    print(client_ips)  # The type of viewer to enable/disable
    print(data)

    if not client_ips:
        return jsonify({"message": "No client IPs provided"}), 400

    if viewer_type is None:
        return jsonify({"message": "No viewer type provided"}), 400

    responses = []  # To store responses from each client

    # Iterate over each client IP provided
    for client_ip in client_ips:
        client_url = None
        print(client_ip)

        # Search for the client IP in the CLIENTS dictionary
        for client_id, url in CLIENTS.items():
            print(url)
            # Extract the IP from the URL
            parsed_url = urlparse(url)
            client_ip_from_url = parsed_url.hostname  # This gets the IP part of the URL

            # Compare only the IP part of the URL
            if client_ip == client_ip_from_url:
                client_url = url
                break

        if not client_url:
            responses.append({"client_id": client_ip, "message": "Client not found"})
            continue

        try:
            # Forward the enable-type-viewer request to the client
            response = requests.post(f'{client_url}/enable-type-viewer', json={
                "toggleState": toggle_state,
                "viewerType": viewer_type
            })

            if response.status_code == 200:
                responses.append({"client_id": client_ip, "message": f"Type Viewer {'enabled' if toggle_state else 'disabled'} for {viewer_type} on {client_ip}"})
            else:
                responses.append({"client_id": client_ip, "message": f"Error on {client_ip}", "error": response.text})
        except requests.exceptions.RequestException as e:
            responses.append({"client_id": client_ip, "message": f"Error communicating with {client_ip}", "error": str(e)})

    print(responses)
    return jsonify(responses)



# Enable executable monitoring
@app.route('/enable-executable-monitoring', methods=['POST'])
def enable_executable_monitoring():
    """
    Endpoint to enable executable monitoring.
    """
    data = request.get_json()
    client_ids = data.get('client_ids', []) 
    authorized_by = data.get('authorized_by', None)  # Get a list of client IDs from the request
    print(f"Received client IDs: {client_ids}")
    print(f"Authorized by: {authorized_by}")
 
    if not client_ids:
        return jsonify({"message": "No client IDs provided"}), 400

    responses = []  # To store responses from each client

    for client_id in client_ids:
        # Extract just the IP (ignore the port)
        stripped_client_ip = client_id.split(':')[0]
        matched_client = None
        for client_key, client_url in CLIENTS.items():
            stripped_client_url_ip = client_url.split('//')[1].split(':')[0]
            print(f"Checking client IP: {stripped_client_ip} == {stripped_client_url_ip}")
            if stripped_client_ip == stripped_client_url_ip:  # Match the IP without port
                matched_client = client_key
                break

        if not matched_client:
            responses.append({"client_id": client_id, "message": "Client not found"})
            continue

        try:
            # Send a request to the client to enable executable monitoring
            response = requests.post(
                f'{CLIENTS[matched_client]}/enable-executable-monitoring',
                json={"authorized_by": authorized_by},  # Pass authorized_by to the client
                headers={"Content-Type": "application/json"}  # Explicitly set Content-Type
            )

            if response.status_code == 200:
                responses.append({
                    "client_id": matched_client,
                    "authorized_by": authorized_by,
                    "message": "Executable monitoring enabled",
                    "output": response.json().get('output', 'No output provided')
                })
            else:
                responses.append({
                    "client_id": matched_client,
                    "authorized_by": authorized_by,
                    "message": f"Error on {matched_client}",
                    "error": response.text
                })
        except requests.exceptions.RequestException as e:
            responses.append({
                "client_id": matched_client,
                "authorized_by": authorized_by,
                "message": f"Error communicating with {matched_client}",
                "error": str(e)
            })

    return jsonify(responses)


# Disable executable monitoring
@app.route('/disable-executable-monitoring', methods=['POST'])
def disable_executable_monitoring():
    """
    Endpoint to disable executable monitoring.
    """
    data = request.get_json()
    client_ids = data.get('client_ids', [])  # Get a list of client IDs from the request
    authorized_by = data.get('authorized_by', None)  # Get the authorized_by field
    print(f"Received client IDs: {client_ids}")
    print(f"Authorized by: {authorized_by}")

    if not client_ids:
        return jsonify({"message": "No client IDs provided"}), 400

    responses = []  # To store responses from each client

    for client_id in client_ids:
        # Extract just the IP (ignore the port)
        stripped_client_ip = client_id.split(':')[0]
        matched_client = None
        for client_key, client_url in CLIENTS.items():
            stripped_client_url_ip = client_url.split('//')[1].split(':')[0]
            print(f"Checking client IP: {stripped_client_ip} == {stripped_client_url_ip}")
            if stripped_client_ip == stripped_client_url_ip:  # Match the IP without port
                matched_client = client_key
                break

        if not matched_client:
            responses.append({"client_id": client_id, "message": "Client not found"})
            continue

        try:
            # Send a request to the client to disable executable monitoring
            response = requests.post(
                f'{CLIENTS[matched_client]}/disable-executable-monitoring',
                json={"authorized_by": authorized_by},  # Pass authorized_by to the client
                headers={"Content-Type": "application/json"}  # Explicitly set Content-Type
            )

            if response.status_code == 200:
                responses.append({
                    "client_id": matched_client,
                    "authorized_by": authorized_by,
                    "message": "Executable monitoring disabled",
                    "output": response.json().get('output', 'No output provided')
                })
            else:
                responses.append({
                    "client_id": matched_client,
                    "authorized_by": authorized_by,
                    "message": f"Error on {matched_client}",
                    "error": response.text
                })
        except requests.exceptions.RequestException as e:
            responses.append({
                "client_id": matched_client,
                "authorized_by": authorized_by,
                "message": f"Error communicating with {matched_client}",
                "error": str(e)
            })

    return jsonify(responses)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)  # Run the admin server on port 5000
