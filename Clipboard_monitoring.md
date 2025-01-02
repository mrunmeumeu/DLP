# Clipboard Monitoring System

This project provides a Python-based clipboard monitoring tool designed to detect and manage sensitive content in clipboard data. The application integrates with Firebase for logging and uses an administrative interface for keyword management.

---

## Features

1. **Clipboard Monitoring**:
   - Monitors clipboard content for sensitive keywords.
   - Clears clipboard content if sensitive keywords are detected.
   - Logs events to Firebase.

2. **File Scanning**:
   - Scans clipboard files (e.g., PDFs, Word documents, Excel sheets) for sensitive content.
   - Extracts and scans content from compressed files (e.g., ZIP, TAR).

3. **Keyword Management**:
   - Dynamically updates sensitive keywords from a monitored file.
   - Provides an admin GUI for managing keywords.

4. **Firebase Integration**:
   - Logs events, including detected sensitive keywords, to Firebase Realtime Database.

5. **System Tray Icon**:
   - Includes a tray icon for quick access to the admin panel and application controls.

---

## Code Breakdown

### Firebase Integration

- **Configuration**: Loads Firebase credentials from `firebase_config.json` stored in `C:\Program Files\DLP`.
- **Initialization**:
  ```python
  def initialize_firebase():
      config = load_firebase_config()
      cred = credentials.Certificate(config["serviceAccountPath"])
      firebase_admin.initialize_app(cred, {'databaseURL': config["databaseURL"]})
### Firebase Logging
  ```python
def log_event(event_description, detected_word=None):
    ref = db.reference('logs')
    log_data = {
        'timestamp': timestamp,
        'event_description': event_description,
        'username': username 
    }
    if detected_word:
        log_data['detected_word'] = detected_word
    ref.push(log_data)
```

### Clipboard Monitoring

#### Clipboard Content Access
- Uses `pyperclip` to access clipboard text and `win32clipboard` for file paths.
- Implements retries to handle clipboard access errors.

#### Keyword Detection
- Reads sensitive keywords from the file: `C:\Program Files\DLP\keywords.txt`.
- Uses regular expressions to detect keywords in clipboard content or file names:

```python
def contains_sensitive_keywords(text):
    for keyword in SENSITIVE_KEYWORDS:
        if re.search(rf'\b{keyword}\b', text, re.IGNORECASE):
            log_event("Sensitive content detected and clipboard cleared.", detected_word=keyword)
            return True
    return False
```
### Clipboard clearing
- The clipboard is automatically cleared if sensitive keywords are detected during clipboard monitoring.

```python
def clear_clipboard():
    pyperclip.copy('')  # Replaces clipboard content with an empty string
    print("Clipboard cleared.")  # Logs the action
```
File Scanning
-------------

### Supported File Types

*   Text files (.txt)
    
*   PDFs (.pdf)
    
*   Word documents (.docx)
    
*   Excel spreadsheets (.xlsx)
    
*   Compressed files (.zip, .tar, .tar.gz)
    

### Scanning Process

*   Extracts and scans supported file types for sensitive keywords.
    
*   Handles nested compressed files by extracting their content and performing recursive scanning.
    

### Example: Scanning PDF Files
```python
def scan_pdf_file(file_path):
    reader = PdfReader(file_path)
    text = "".join([page.extract_text() or "" for page in reader.pages])
    return contains_sensitive_keywords(text)
```
Admin Features
--------------

### Keyword Management

Admins can manage sensitive keywords dynamically through a secure GUI interface.

**Admin Capabilities**:

*   Add new keywords.
    
*   Remove existing keywords.
    
*   Clear all keywords.
    

### GUI and Tray Icon

*   Provides a tray icon for quick access to the admin GUI and application controls.
    
*   The admin GUI is password-protected to ensure secure access.
    

### Admin GUI

```python
def admin_gui():
    # Create a Listbox to display current keywords
    keyword_listbox = Listbox(admin_window, height=10, width=50)
    keyword_listbox.pack(pady=10)
    # Add buttons for keyword management
    tk.Button(admin_window, text="Add Keyword", command=add_keyword).pack(pady=5)
```

     

