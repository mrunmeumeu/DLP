import os
import shutil
import winreg
import logging

# Set up logging
log_file = "C:\\Program Files\\DLP\\auto.txt"
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

def get_excel_path():
    """
    Dynamically find the Excel executable path by querying the Windows Registry.
    Returns:
        str: Path to the Excel executable, or None if not found.
    """
    try:
        # Registry key path for Office installation
        reg_key_path = r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\excel.exe"

        # Open the registry key
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, reg_key_path) as reg_key:
            # Query the default value for the executable path
            excel_path, _ = winreg.QueryValueEx(reg_key, "")
            logging.info(f"Found Excel executable path: {excel_path}")
            return excel_path
    except FileNotFoundError:
        logging.error("Excel executable path not found in the registry.")
        return None
    except Exception as e:
        logging.error(f"An error occurred while retrieving the Excel path: {e}")
        return None

def update_registry_for_custom_excel(custom_exe_path):
    """
    Modify the Windows Registry to associate .xlsx files with the custom EXCEL.EXE
    and disable DDE.
    """
    try:
        # Determine the .xlsx file association
        with winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, r".xlsx") as xlsx_key:
            associated_class, _ = winreg.QueryValueEx(xlsx_key, "")
        
        logging.info(f"Associated class for .xlsx: {associated_class}")

        # Navigate to the open command for the associated class
        open_command_key = f"{associated_class}\\shell\\Open\\command"
        with winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, open_command_key, 0, winreg.KEY_SET_VALUE) as command_key:
            # Update the command to use the custom EXCEL.EXE
            command = f'"{custom_exe_path}" "%1"'
            winreg.SetValueEx(command_key, "", 0, winreg.REG_SZ, command)
            logging.info(f"Updated command key: {command}")

        # Remove the ddeexec key if it exists
        ddeexec_key_path = f"{associated_class}\\shell\\Open\\ddeexec"
        try:
            winreg.DeleteKey(winreg.HKEY_CLASSES_ROOT, ddeexec_key_path)
            logging.info(f"Deleted ddeexec key: {ddeexec_key_path}")
        except FileNotFoundError:
            logging.info(f"No ddeexec key found for {associated_class}. Skipping deletion.")

    except Exception as e:
        logging.error(f"An error occurred while updating the registry: {e}")

def replace_excel_with_custom(original_path, custom_exe_path):
    """
    Replace the Excel executable with a custom executable.
    Parameters:
        original_path (str): Path to the original Excel executable.
        custom_exe_path (str): Path to the custom executable.
    """
    try:
        # Check if the original Excel executable exists
        if not os.path.exists(original_path):
            logging.error(f"Original Excel executable not found at {original_path}")
            return

        # Generate the backup path for the original executable
        backup_path = os.path.join(os.path.dirname(original_path), "EXCEL_ORIGINAL.exe")

        # Rename the original executable to EXCEL_ORIGINAL.exe
        os.rename(original_path, backup_path)
        logging.info(f"Renamed {original_path} to {backup_path}")

        # Copy the custom executable to replace the original
        shutil.copy(custom_exe_path, original_path)
        logging.info(f"Replaced original executable with custom executable from {custom_exe_path}")

    except Exception as e:
        logging.error(f"An error occurred: {e}")

if __name__ == "__main__":
    logging.info("Script started.")

    # Get the path to the Excel executable dynamically
    original_excel_path = get_excel_path()
    custom_excel_path = r"C:\\Program Files\\DLP\\EXCEL.exe"

    if original_excel_path:
        replace_excel_with_custom(original_excel_path, custom_excel_path)
        update_registry_for_custom_excel(custom_excel_path)
    else:
        logging.error("Unable to locate the Excel executable. Please ensure Excel is installed.")

    logging.info("Script completed.")
