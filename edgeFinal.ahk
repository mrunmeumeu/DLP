#Requires AutoHotkey v2.0

; Open Edge and navigate to the extensions page
Run("msedge")
Sleep(5000)  ; Wait for Edge to open
Send("^l")  ; Focus the address bar
Sleep(500)
Send("edge://extensions`n")  ; Type URL and press Enter
Sleep(3000)  ; Wait for the page to load

; Navigate to Developer Mode toggle
Send("{Tab 3}")  ; Press Tab 3 times to focus Developer Mode
Sleep(500)

; Toggle Developer Mode
Send("{Space}")  ; Press Space to toggle Developer Mode
Sleep(1000)

; Navigate to "Load unpacked"
Send("{Tab 5}")  ; Press Tab 5 more times to focus "Load unpacked"
Sleep(500)

; Click "Load unpacked"
Send("{Enter}")  ; Press Enter to click "Load unpacked"
Sleep(3000)  ; Wait for the folder selection dialog to appear

; Type the folder path and press Enter
Send("C:\Program Files\DLP\edgeextension")  ; Type the folder path
Sleep(500)
Send("{Enter}")  ; Press Enter to confirm the path
Sleep(1000)

; Press Tab to focus "Select Folder" and press Enter
Send("{Tab}")  ; Move to "Select Folder" button
Sleep(500)
Send("{Enter}")  ; Press Enter to click "Select Folder"
Sleep(1000)


    
