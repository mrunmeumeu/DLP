#Requires AutoHotkey v2.0

; Define the User Data Directory path using Local AppData environment variable
UserDataDir := EnvGet("LOCALAPPDATA") "\Google\Chrome\User Data"

; Check if the UserDataDir actually exists to avoid errors
If !FileExist(UserDataDir)
{
    ExitApp
}

; Loop through subdirectories in the User Data directory
Loop Files, UserDataDir "\*.*", "D"
{
    FolderName := A_LoopFileName  ; Get just the folder name

    ; Use RegEx to strictly match valid Chrome profile folder names (e.g., Default, Profile 1, Profile 2)
    If !RegExMatch(FolderName, "^(Default|Profile \d+)$")
        Continue

    ; Clean up the folder name to ensure no extra quotes or spaces are passed
    CleanedFolderName := Trim(StrReplace(FolderName, "'", ""))

    ; Build the command to launch Chrome with the profile directory, enclosing the profile name in quotes
    Command := "chrome.exe --profile-directory=`"" CleanedFolderName "`""
    
    ; Launch Chrome with the specific profile
    Run(Command)
    Sleep(5000)  ; Wait for Chrome to open

    ; Add the extension to the profile
    Send("^l")  ; Focus the address bar
    Sleep(500)
    Send("chrome://extensions`n")  ; Navigate to the extensions page
    Sleep(3000)  ; Wait for the page to load

    ; Navigate to Developer Mode toggle
    Send("{Tab}")  ; Tab to the Developer Mode toggle
    Sleep(500)
    Send("{Space}")  ; Enable Developer Mode
    Sleep(1000)

    ; Navigate to "Load unpacked"
    Send("{Tab 1}")  ; Tab to the "Load unpacked" button
    Sleep(500)
    Send("{Enter}")  ; Open the folder selection dialog
    Sleep(3000)  ; Wait for the dialog to appear

    ; Type the folder path and press Enter
    Send("C:\Program Files\DLP\extension")  ; Specify the extension folder
    Sleep(500)
    Send("{Enter}")  ; Confirm the folder selection
    Sleep(1000)

    ; Press Tab to focus "Select Folder" and press Enter
    Send("{Tab}")  ; Move to "Select Folder" button
    Sleep(500)
    Send("{Enter}")  ; Press Enter to click "Select Folder"
    Sleep(1000)

    ; Close Chrome to move to the next profile
    WinClose("ahk_exe chrome.exe")
    Sleep(1000)
}

; Show a completion message
MsgBox("Extension added to all profiles.")
