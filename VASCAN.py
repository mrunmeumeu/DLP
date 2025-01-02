import socket
from concurrent.futures import ThreadPoolExecutor
import firebase_admin
from firebase_admin import credentials, db
import os
import json

# Constants
FIREBASE_CONFIG_PATH = r"C:\\Program Files\\DLP\\firebase_config.json"

# Function to load Firebase configuration
def load_firebase_config():
    try:
        with open(FIREBASE_CONFIG_PATH, 'r') as config_file:
            config = json.load(config_file)
            return config
    except Exception as e:
        print(f"Failed to load Firebase configuration: {e}")
        sys.exit()

# Initialize Firebase
def initialize_firebase():
    config = load_firebase_config()
    if not firebase_admin._apps:  # Avoid re-initializing
        try:
            cred = credentials.Certificate(config["serviceAccountPath"])
            firebase_admin.initialize_app(cred, {'databaseURL': config["databaseURL"]})
            print("Firebase initialized successfully.")
        except Exception as e:
            print(f"Failed to initialize Firebase: {e}")
            sys.exit()

# Initialize Firebase
initialize_firebase()

# Get device and username
def get_device_name():
    return os.getenv('COMPUTERNAME') or os.getenv('HOSTNAME') or "UnknownDevice"

def get_username():
    return os.getlogin()

# Vulnerability Database (Sample, can be expanded with online sources)
vulnerability_db = [
    {"Port": 22, "Service": "SSH", "Risk": "High", "Synopsis": "Unsecured SSH service detected.", 
     "Description": "The SSH service may allow brute-force attacks or be using outdated encryption methods.", 
     "Solution": "Use key-based authentication and disable weak ciphers.", "References": ["https://cve.mitre.org"]},
    {"Port": 80, "Service": "HTTP", "Risk": "Medium", "Synopsis": "HTTP service running without encryption.", 
     "Description": "Unencrypted HTTP connections can expose sensitive information.", 
     "Solution": "Redirect to HTTPS and ensure TLS is properly configured.", "References": ["https://owasp.org"]},
    {"Port": 443, "Service": "HTTPS", "Risk": "Low", "Synopsis": "Ensure HTTPS is secure.", 
     "Description": "HTTPS is running. Check for vulnerabilities like outdated TLS versions or weak ciphers.", 
     "Solution": "Use strong TLS configurations and regularly update SSL certificates.", "References": ["https://sslconfig.org"]},
    {"Port": 3389, "Service": "RDP", "Risk": "Critical", "Synopsis": "Remote Desktop Protocol exposed.", 
     "Description": "Exposed RDP ports are commonly targeted by attackers for brute-force attacks.", 
     "Solution": "Restrict RDP access to internal IPs or use a VPN.", "References": ["https://nvd.nist.gov"]},
    {"Port": 5357, "Service": "WSDAPI", "Risk": "High", "Synopsis": "WSDAPI potentially vulnerable.", 
     "Description": "Web Services for Devices may expose vulnerabilities due to improper configurations.", 
     "Solution": "Disable the service if not required or use secure configurations.", "References": ["https://cve.mitre.org"]},
    {"Port": 8009, "Service": "Apache JServ", "Risk": "High", "Synopsis": "Potentially exposed Apache JServ Protocol (AJP).", 
     "Description": "Exposed AJP ports can lead to unauthorized access to internal server functionality.", 
     "Solution": "Disable AJP if not required or restrict access to trusted IPs.", "References": ["https://cve.mitre.org"]},
    {"Port": 8080, "Service": "HTTP Proxy", "Risk": "Medium", "Synopsis": "HTTP Proxy or alternative HTTP service exposed.", 
     "Description": "Exposed HTTP proxy ports can be misused for unauthorized access or data leakage.", 
     "Solution": "Restrict access to internal IPs and enforce strong authentication.", "References": ["https://owasp.org"]},
]

# Function to scan a single port
def scan_port(ip, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(0.5)
            result = sock.connect_ex((ip, port))
            return "Open" if result == 0 else "Closed"
    except Exception:
        return "Error"

# Function to match port with vulnerabilities
def match_vulnerability(port, status):
    if status != "Open":
        return []
    return [vuln for vuln in vulnerability_db if vuln["Port"] == port]

# Function to scan multiple ports and match vulnerabilities
def scan_ports_with_vulnerabilities(ip, ports):
    results = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(scan_port, ip, port): port for port in ports}
        for future in futures:
            port = futures[future]
            try:
                status = future.result()
                vulnerabilities = match_vulnerability(port, status)
                results.append({"IP": ip, "Port": port, "Status": status, "Vulnerabilities": vulnerabilities})
            except Exception:
                results.append({"IP": ip, "Port": port, "Status": "Error", "Vulnerabilities": []})
    return results

# Function to save results to Firebase
def save_results_to_firebase(results, device_name):
    ref = db.reference('vulnerability_assessment')  # Node in Firebase for saving results
    
    log_data = {
        "device_name": device_name,
        "assessment": []
    }

    for result in results:
        entry = {
            "IP": result["IP"],
            "Port": result["Port"],
            "Status": result["Status"],
            "Vulnerabilities": []
        }
        for vuln in result["Vulnerabilities"]:
            entry["Vulnerabilities"].append({
                "Service": vuln["Service"],
                "Risk": vuln["Risk"],
                "Synopsis": vuln["Synopsis"],
                "Description": vuln["Description"],
                "Solution": vuln["Solution"],
                "References": vuln["References"]
            })
        log_data["assessment"].append(entry)

    user_ref = ref.child(device_name)
    new_log = ref.push(log_data)
    print(f"Results saved to Firebase with log ID: {new_log.key}")

# Main Execution
if __name__ == "__main__":
    target_ip = "127.0.0.1"  # Replace with your target IP
    ports_to_scan = [vuln["Port"] for vuln in vulnerability_db] + list(range(1, 1024))
    unique_ports = sorted(set(ports_to_scan))
    device_name = get_username()
    print("Starting vulnerability assessment...")
    scan_results = scan_ports_with_vulnerabilities(target_ip, unique_ports)
    save_results_to_firebase(scan_results, device_name)
    print("Assessment complete. Results saved to Firebase.")
