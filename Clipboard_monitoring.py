import win32clipboard
import os
from pathlib import Path
import re
import pyperclip
import time
import zipfile
import tarfile
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import tempfile
from PyPDF2 import PdfReader
from docx import Document
from openpyxl import load_workbook
import pystray
from PIL import Image, ImageDraw
import threading
import tkinter as tk
from tkinter import simpledialog, messagebox, Listbox, END
import firebase_admin
from firebase_admin import credentials, db
import json
import sys
import socket
import uuid
import hashlib
from datetime import datetime, timedelta

SCRIPT_ID = str(uuid.uuid4())  # Generate a unique identifier for this script instance
processed_content_hashes = set()
REPROCESS_THRESHOLD = timedelta(seconds=10)

# Define sensitive keywords
# cred = credentials.Certificate("C:\\Program Files\\DLP\\clipboard-81621-firebase-adminsdk-rpim7-dd58d299af.json")

# # Initialize Firebase Admin SDK
# firebase_admin.initialize_app(cred, {
#     'databaseURL': "https://clipboard-81621-default-rtdb.asia-southeast1.firebasedatabase.app"  # Replace with your Firebase Database URL
# })

FIREBASE_CONFIG_PATH = r"C:\\Program Files\\DLP\\firebase_config.json"

program_files_dir = "C:\\Program Files"  # Adjust the base directory if needed
KEYWORDS_FILE_PATH = os.path.join(program_files_dir, "DLP", "keywords.txt")

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

initialize_firebase()

def load_sensitive_keywords():
    if os.path.exists(KEYWORDS_FILE_PATH):
        with open(KEYWORDS_FILE_PATH, 'r', encoding='utf-8') as file:
            print(f"Loaded sensitive keywords")

            return [line.strip() for line in file if line.strip()] 
 # Read non-empty lines
    return []

# Function to save sensitive keywords to a file
def save_sensitive_keywords(keywords):
    try:
        with open(KEYWORDS_FILE_PATH, 'w', encoding='utf-8') as file:
            for keyword in keywords:
                file.write(f"{keyword}\n")
    except Exception as e:
        print(f"Error saving keywords to file: {e}")

# Ensure the keywords file exists
if not os.path.exists(KEYWORDS_FILE_PATH):
    os.makedirs(os.path.dirname(KEYWORDS_FILE_PATH), exist_ok=True)
    with open(KEYWORDS_FILE_PATH, 'w', encoding='utf-8') as file:
        file.write("")  # Create an empty file

# Initialize sensitive keywords
SENSITIVE_KEYWORDS = load_sensitive_keywords()
keywords_file_last_modified = os.path.getmtime(KEYWORDS_FILE_PATH)

def check_for_keywords_update():
    global SENSITIVE_KEYWORDS, keywords_file_last_modified
    try:
        current_modified_time = os.path.getmtime(KEYWORDS_FILE_PATH)
        if current_modified_time != keywords_file_last_modified:
            print("Keywords file updated. Reloading keywords...")
            SENSITIVE_KEYWORDS = load_sensitive_keywords()
            keywords_file_last_modified = current_modified_time
            print(f"Updated sensitive keywords: {SENSITIVE_KEYWORDS}")
    except Exception as e:
        print(f"Error checking for keywords update: {e}")


class KeywordsFileEventHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == KEYWORDS_FILE_PATH:
            print("Keywords file updated by admin. Reloading keywords...")
            check_for_keywords_update()  # Reload the keywords list

def start_keywords_file_watcher():
    """
    Starts a file watcher on the keywords file to detect modifications.
    """
    event_handler = KeywordsFileEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path=os.path.dirname(KEYWORDS_FILE_PATH), recursive=False)
    observer.start()
    return observer


def get_device_username():
    try:
        return os.getlogin()  # This returns the currently logged-in user
    except Exception as e:
        print(f"Error getting username: {e}")
        return "Unknown"
# Function to check if a string contains sensitive keywords
def contains_sensitive_keywords(text):
    print(f"Checking content for keywords: {text}")
    for keyword in SENSITIVE_KEYWORDS:
        if re.search(rf'\b{keyword}\b', text, re.IGNORECASE):
            print(f"Keyword detected: {keyword}")
            clear_clipboard()
            return True
    return False


# Function to get clipboard content as a file path if files are copied
def get_clipboard_files():
    try:
        win32clipboard.OpenClipboard()
        if win32clipboard.IsClipboardFormatAvailable(win32clipboard.CF_HDROP):
            file_paths = win32clipboard.GetClipboardData(win32clipboard.CF_HDROP)
            win32clipboard.CloseClipboard()
            return list(file_paths)  # Return the list of file paths
        win32clipboard.CloseClipboard()
    except Exception as e:
        print(f"Error accessing clipboard for file paths: {e}")
    return None



# Function to extract zip files
def extract_zip(file_path, extract_to):
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
    except Exception as e:
        print(f"Error extracting zip file {file_path}: {e}")

# Function to extract tar or tar.gz files
def extract_tar(file_path, extract_to):
    try:
        with tarfile.open(file_path, 'r:*') as tar_ref:
            tar_ref.extractall(extract_to)
    except Exception as e:
        print(f"Error extracting tar file {file_path}: {e}")

# Function to read the content of a text file
def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
    return None

# Function to clear the clipboard using pyperclip
def log_event(event_description, detected_word=None):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    username = os.getlogin()
    # Create a reference to your logs in the database
    ref = db.reference('logs')

    # Prepare the data to log
    log_data = {
        'timestamp': timestamp,
        'event_description': event_description,
        'username': username 
    }

    # Include the detected word if provided
    if detected_word:
        log_data['detected_word'] = detected_word

    # Push the new log to Firebase
    new_log = ref.push(log_data)

    print(f"Log added: {new_log.key} - {event_description}")
    if detected_word:
        print(f"Detected word: {detected_word}")

def log_local_clear(file_name):
    """
    Log the event of clearing the clipboard locally in clears.txt.
    """
    log_file_path = "clears.txt"  # Path to the log file
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_entry = f"{timestamp} - Cleared clipboard for file: {file_name}\n"
    
    try:
        with open(log_file_path, "a", encoding="utf-8") as log_file:
            log_file.write(log_entry)
        print(f"Logged clear event: {log_entry.strip()}")
    except Exception as e:
        print(f"Error logging clear event: {e}")


def clear_clipboard(file_name=None, detected_keyword=None):
    """
    Clears the clipboard and logs the event to both Firebase and a local file.
    """
    attempts = 0
    while attempts < 5:
        try:
            pyperclip.copy('')  # Clear the clipboard content
            print("Clipboard cleared.")

            # Log locally
            if file_name:
                log_local_clear(file_name)

            # Log to Firebase using the existing log_event function
            log_description = f"Cleared clipboard for {file_name or 'Clipboard text'}"
            log_event(event_description=log_description, detected_word=detected_keyword)

            return
        except Exception as e:
            print(f"Error clearing clipboard (attempt {attempts + 1}): {e}")
            attempts += 1
            time.sleep(1)  # Wait before retrying



# Function to scan the contents of extracted files (recursive)
def scan_extracted_files(extracted_dir):
    for root, _, files in os.walk(extracted_dir):
        for file in files:
            file_path = os.path.join(root, file)
            file_name = Path(file_path).name

            # Check if the file name contains sensitive keywords
            if contains_sensitive_keywords(file_name):
                print(f"Sensitive file name detected: {file_name}")
                return True

            # Check if the file is a supported file type
            if scan_regular_file(file_path):
                return True

    return False

# Function to scan regular files, including PDFs, Word, and Excel files
def scan_regular_file(file_path):
    file_name = Path(file_path).name

    # Check if the file name contains sensitive keywords
    if contains_sensitive_keywords(file_name):
        print(f"Sensitive file name detected: {file_name}")
        clear_clipboard() 
        return True

    # Check content based on file extension
    if file_path.endswith('.txt'):
        file_content = read_file_content(file_path)
        if file_content and contains_sensitive_keywords(file_content):
            print(f"Sensitive content detected in {file_name}")
            clear_clipboard() 
            return True

    # Check for PDF files
    elif file_path.endswith('.pdf'):
        if scan_pdf_file(file_path):
            print(f"Sensitive content detected in {file_name}")
            clear_clipboard() 
            return True

    # Check for Word files (.docx)
    elif file_path.endswith('.docx'):
        if scan_word_file(file_path):
            print(f"Sensitive content detected in {file_name}")
            clear_clipboard() 
            return True

    # Check for Excel files (.xlsx)
    elif file_path.endswith('.xlsx'):
        if scan_excel_file(file_path):
            print(f"Sensitive content detected in {file_name}")
            clear_clipboard() 
            return True

    # Handle nested compressed files (zip or tar)
    elif file_path.endswith('.zip') or file_path.endswith('.tar.gz') or file_path.endswith('.tar'):
        # Create a temporary directory to extract the compressed file
        with tempfile.TemporaryDirectory() as temp_dir:
            if file_path.endswith('.zip'):
                extract_zip(file_path, temp_dir)
            elif file_path.endswith('.tar') or file_path.endswith('.tar.gz'):
                extract_tar(file_path, temp_dir)
            # Recursively scan the extracted files
            if scan_extracted_files(temp_dir):
                clear_clipboard() 
                return True

    return False

# Function to scan a PDF file for sensitive content
def scan_pdf_file(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return contains_sensitive_keywords(text)
    except Exception as e:
        print(f"Error reading PDF file {file_path}: {e}")
    return False

# Function to scan a Word file for sensitive content (only for .docx)
def scan_word_file(file_path):
    try:
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return contains_sensitive_keywords(text)
    except Exception as e:
        print(f"Error reading Word file {file_path}: {e}")
    return False

# Function to scan an Excel file for sensitive content
def scan_excel_file(file_path):
    try:
        workbook = load_workbook(file_path, data_only=True)
        text = ""

        # Iterate through all sheets and cells to collect the content
        for sheet in workbook.worksheets:
            for row in sheet.iter_rows(values_only=True):
                row_data = " ".join([str(cell) for cell in row if cell is not None])
                text += row_data + " "

        # Check for sensitive keywords in the collected content
        return contains_sensitive_keywords(text)
    except Exception as e:
        print(f"Error reading Excel file {file_path}: {e}")
    return False


def update_clipboard_in_firebase(content, source):
    username = os.getlogin()
    ref = db.reference(f"/clipboard/{username}")  # Reference the user's clipboard node
    
    # Prepare the data
    data = {
        "content": content,
        "last_updated": time.strftime('%Y-%m-%d %H:%M:%S'),
        "source": source
    }
    
    ref.set(data)  # Replace the existing log
    print(f"Clipboard updated in Firebase under {username}: {content}")




# Get clipboard data from Firebase
def get_clipboard_from_firebase():
    ref = db.reference("/clipboard")
    return ref.get()


def scan_zip_file(file_path):
    """
    Scans a zip file by extracting its contents and checking each file for sensitive keywords.
    """
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
                print(f"Extracted contents of {file_path} to {temp_dir}")
            
            # Scan all extracted files
            for root, _, files in os.walk(temp_dir):
                for file in files:
                    extracted_file_path = os.path.join(root, file)
                    if scan_regular_file(extracted_file_path):
                        return True  # Stop scanning as soon as sensitive content is found
    except Exception as e:
        print(f"Error scanning zip file {file_path}: {e}")
    return False

processed_content = {}


def hash_content(content):
    """
    Create a hash of the given content for efficient tracking.
    """
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def should_reprocess(file_hash, last_clipboard_time):
    """
    Determines whether the file should be reprocessed based on the time elapsed
    since it was last processed and the clipboard content refresh time.
    """
    now = datetime.now()

    # If the file hash is new or it's been re-copied recently, reprocess it
    if file_hash not in processed_content:
        return True

    last_processed_time = processed_content[file_hash]
    
    # If the clipboard content has been updated since the last processing
    if last_clipboard_time and last_clipboard_time > last_processed_time:
        return True

    # If enough time has passed, reprocess the file
    if now - last_processed_time > REPROCESS_THRESHOLD:
        return True

    return False


def update_processed_content(file_hash):
    """
    Updates the timestamp for a processed file hash.
    """
    processed_content[file_hash] = datetime.now()


file_last_copied = {}  # Store the last copied time for each file
REPROCESS_DELAY = 1  # Minimum time (in seconds) between reprocessing the same file

def monitor_clipboard(source):
    """
    Monitors clipboard and checks file contents for sensitive keywords.
    """
    global file_last_copied

    last_clipboard_content = None  # Track the last content sent to Firebase

    while True:
        clipboard_files = get_clipboard_files()
        new_content = None
        current_time = datetime.now()

        # Process files in the clipboard
        if clipboard_files:
            for file_path in clipboard_files:
                file_name = Path(file_path).name

                # Check if the file was recently copied
                if file_name in file_last_copied:
                    last_copied_time = file_last_copied[file_name]
                    if (current_time - last_copied_time).total_seconds() < REPROCESS_DELAY:
                        continue  # Skip if the file was copied too recently

                # Update the last copied time for the file
                file_last_copied[file_name] = current_time

                # Process the file
                if file_path.endswith(".txt"):
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                        if contains_sensitive_keywords(content):
                            clear_clipboard(file_name)
                            new_content = f"Sensitive content detected in {file_name}"
                    except Exception as e:
                        print(f"Error reading file {file_path}: {e}")
                elif file_path.endswith(".pdf"):
                    if scan_pdf_file(file_path):
                        clear_clipboard(file_name)
                        new_content = f"Sensitive content detected in PDF: {file_name}"
                elif file_path.endswith(".docx"):
                    if scan_word_file(file_path):
                        clear_clipboard(file_name)
                        new_content = f"Sensitive content detected in Word file: {file_name}"
                elif file_path.endswith(".xlsx"):
                    if scan_excel_file(file_path):
                        clear_clipboard(file_name)
                        new_content = f"Sensitive content detected in Excel file: {file_name}"
                elif file_path.endswith(".zip"):
                    if scan_zip_file(file_path):
                        clear_clipboard(file_name)
                        new_content = f"Sensitive content detected in zip: {file_name}"

                # Break if sensitive content is detected
                if new_content:
                    break

        # Check for plain text in the clipboard if no file is processed
        if not new_content:
            clipboard_content = pyperclip.paste()

            if clipboard_content and clipboard_content != last_clipboard_content:
                if contains_sensitive_keywords(clipboard_content):
                    clear_clipboard("Clipboard text")
                    new_content = "Sensitive content detected in clipboard text"
                    last_clipboard_content = clipboard_content

        # Update Firebase only if new content is detected
        if new_content:
            print(f"Updating Firebase with new content: {new_content[:50]}...")
            update_clipboard_in_firebase(new_content, source)

        time.sleep(1)  # Avoid excessive CPU usage
  # Avoid excessive CPU usage



def clipboard_listener(event):
    # Get the current username
    username = os.getlogin()

    # Print the full event to understand its structure
    print(f"Received Firebase event: {event}")
    
    # Fetch the data from the event
    data = event.data  # This contains the actual data of the event
    
    # Check if the event data is valid and contains clipboard content
    if data and "content" in data:
        content = data["content"]
        print(f"Log from {username}: {content}")

        # Check content for sensitive keywords
        for keyword in SENSITIVE_KEYWORDS:
            if re.search(rf'\b{keyword}\b', content, re.IGNORECASE):
                log_event(f"Sensitive content detected: {keyword}")
                print(f"Sensitive keyword found: {keyword}")
                
                # Log the detected sensitive keyword to Firebase
                ref = db.reference(f"/clipboard/{username}")
                ref.set({"sensitive_keyword": keyword})  # Store only the sensitive keyword
                print(f"Log updated with sensitive keyword for {username}.")
                clear_clipboard()
                # Clear the log after storing the keyword
                time.sleep(1)  # Optional: Small delay for visibility before clearing
                ref.delete()  # Deletes the log entry for the user
                print(f"Log cleared for {username} due to sensitive keyword.")
                break
    else:
        print("No relevant content in this event.")







def start_firebase_listener():
    username = os.getlogin()  # Get the username of the current user
    computer_name = socket.gethostname()  # Use computer name as the node

    # Reference the user's clipboard logs in Firebase
    ref = db.reference(f"/clipboard/{username}")
    ref.listen(clipboard_listener)  # Listen for updates


# Function to create a tray icon
def create_tray_icon():
    # Create an icon for the system tray
    image = Image.new('RGB', (64, 64), color=(73, 109, 137))
    draw = ImageDraw.Draw(image)
    draw.text((10, 10), "CM", fill=(255, 255, 255))  # "CM" for Clipboard Monitor

    def on_quit(icon, item):
        icon.stop()

    # Function to show the admin GUI
    def show_gui(icon, item):
        create_gui()

    icon = pystray.Icon("clipboard_monitor", image, "Clipboard Monitor", menu=pystray.Menu(
        pystray.MenuItem("Show Admin", show_gui),
        pystray.MenuItem("Quit", on_quit)
    ))

    icon.run()

# Function to create a simple Tkinter window with admin access button
def create_gui():
    root = tk.Tk()
    root.title("Clipboard Monitor")

    # Admin button to modify sensitive keywords
    admin_button = tk.Button(root, text="Admin Access (Edit Keywords)", command=admin_access)
    admin_button.pack(pady=20)

    root.mainloop()

# Function to handle admin access and keyword management
def admin_access():
    password = "tinker@tl"  # Hardcoded password for simplicity (you can change this)

    # Get password from the user using a prompt
    entered_password = simpledialog.askstring("Admin Access", "Enter Admin Password:", show='*')

    if entered_password == password:
        # Admin authenticated
        admin_gui()
    else:
        messagebox.showerror("Access Denied", "Incorrect password.")

# Function to open the admin GUI to manage keywords
def admin_gui():
    global SENSITIVE_KEYWORDS

    # Create a new window
    admin_window = tk.Toplevel()
    admin_window.title("Manage Sensitive Keywords")

    # Create a Listbox to display current keywords
    keyword_listbox = Listbox(admin_window, height=10, width=50)
    keyword_listbox.pack(pady=10)

    # Add current keywords to the Listbox
    for keyword in SENSITIVE_KEYWORDS:
        keyword_listbox.insert(END, keyword)

    # Function to add a new keyword
    def add_keyword():
        new_keyword = simpledialog.askstring("Add Keyword", "Enter a new keyword:")
        if new_keyword and new_keyword.strip():
            new_keyword = new_keyword.strip()
            if new_keyword not in SENSITIVE_KEYWORDS:
                SENSITIVE_KEYWORDS.append(new_keyword)
                keyword_listbox.insert(END, new_keyword)
            else:
                messagebox.showwarning("Warning", "Keyword already exists!")

    # Function to remove the selected keyword
    def remove_keyword():
        selected_keyword = keyword_listbox.curselection()
        if selected_keyword:
            keyword = keyword_listbox.get(selected_keyword)
            SENSITIVE_KEYWORDS.remove(keyword)
            keyword_listbox.delete(selected_keyword)
        else:
            messagebox.showwarning("Warning", "Please select a keyword to remove.")

    # Function to clear all keywords
    def clear_keywords():
        confirm = messagebox.askyesno("Confirm", "Are you sure you want to clear all keywords?")
        if confirm:
            SENSITIVE_KEYWORDS.clear()
            keyword_listbox.delete(0, END)

    # Function to apply changes and close the window
    def apply_changes():
        admin_window.destroy()
        messagebox.showinfo("Success", "Changes have been applied successfully!")

    # Add buttons to add, remove, clear, and apply changes
    tk.Button(admin_window, text="Add Keyword", command=add_keyword).pack(pady=5)
    tk.Button(admin_window, text="Remove Keyword", command=remove_keyword).pack(pady=5)
    tk.Button(admin_window, text="Clear All Keywords", command=clear_keywords).pack(pady=5)
    tk.Button(admin_window, text="Apply and Close", command=apply_changes).pack(pady=10)

def main():
    observer = start_keywords_file_watcher()

    # Start clipboard monitor in a background thread
    monitor_thread = threading.Thread(target=monitor_clipboard, args=("script1",), daemon=True)
    monitor_thread.start()
    listener_thread = threading.Thread(target=start_firebase_listener, daemon=True)
    listener_thread.start()
    # Start tray icon in a separate thread
    tray_thread = threading.Thread(target=create_tray_icon, daemon=True)
    tray_thread.start()

    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    # Start the keywords file watcher
    main()
