Raksha 1 - React Frontend Documentation
Overview
This document provides an overview of the routes defined in the App.js file, the corresponding components they lead to, and their functionality.

Routes and Components
1. /
Component: Testing
Description: The default route for the application. Displays the main dashboard with stats such as:
Total company violations.
Percentage of connected company devices with USB blocking, clipboard monitoring, and screenshot blocking enabled.
Safety percentage showing the percentage of connected clients adhering to security protocols.
2. /usb
Component: AetherisHomepage
Description: Handles USB blocking functionality for the admin. Allows toggling of USB policies across the network.
3. /va-scans
Component: VulnerabilityAssessment
Description: Admin view for initiating and managing vulnerability scans on connected clients. Allows multiple clients to be selected for simultaneous scans.
4. /keyword-management
Component: KeywordMonitoring
Description: Admin page for managing clipboard monitoring. Enables or disables clipboard monitoring across the network.
5. /client/:ip
Component: Dashboard
Description: Displays detailed information about a specific client, including:
Device name.
Windows version.
IP address.
Other client-specific information.
6. /client/:ip/usb-monitoring
Component: AetherisHomepageP
Description: Client-specific page for managing USB monitoring features.
7. /client/:ip/va-scans
Component: VulnerabilityAssessmentP
Description: Client-specific page for managing and viewing the results of vulnerability assessments.
8. /client/:ip/keyword-management
Component: KeywordMonitoringP
Description: Client-specific page for managing clipboard monitoring policies.
9. /executable-monitoring
Component: ExecMon
Description: Monitors and controls the execution of unauthorized or suspicious applications on client devices.
10. /ss-blocking
Component: Screenshot
Description: Manages screenshot blocking functionality. Enables or disables the ability to take screenshots on client devices.
11. /reports
Component: ReportPage
Description: Displays logs for selected IPs, including timestamps of when specific features were turned on or off.
12. /dashboard
Component: Listing
Description: Admin dashboard showing an overview of the system's status and all connected clients.
13. /logs
Component: LogViewer
Description: Testing page to retrieve logs from the "logs" node in Firebase. Used for debugging issues across different nodes.
14. /valogs
Component: PortStatusGraph
Description: (To Be Implemented) Displays bar graphs showing the status of open and closed ports for selected clients. Also lists open ports for detailed analysis.
15. /viewers
Component: Viewers
Description: (Scrapped) This route and component are no longer in use.
16. /encryption
Component: Encrypt
Description: Manages file encryption for sensitive documents such as Excel files and PDFs.
17. /analysis
Component: AuditAna
Description: Displays a list of clients along with the number of violations they have committed. Allows further analysis of these violations.
18. /analysis/:username
Component: DataAna
Description: Provides a detailed audit analysis for a specific user identified by their username.
19. /behaveAna
Component: Behave
Description: Displays the top 10 violators among the clients. Useful for identifying problematic devices.
20. /behaveAna/:username
Component: Individual
Description: Provides a detailed behavioral analysis for a specific client identified by their device name.
Folder Structure
Here’s a high-level view of the folder structure based on the components used in App.js:

/keyword: Contains components related to keyword monitoring.
/USB: Components for handling USB blocking functionalities.
/VA: Components for vulnerability assessments.
/Listing: Admin dashboard components and client-specific views.
/SBlock: Components for managing screenshot blocking functionality.
/Reports: Components for generating and displaying detailed reports.
/client: Pages and functionalities specific to individual client devices.
/Testing: Components used for testing application features or debugging.
/Viewers: Components for viewing detailed vulnerability assessment logs (Scrapped).
/Analysis: Contains components for audit and behavioral analysis.
/Encryption: Components for managing file encryption features.
/Behave: Behavioral analysis-related components for clients.
Usage
This document should be used as a reference for understanding the routing structure of the application, its components, and their respective functionalities. Future updates or changes to the application should also include modifications to this documentation.
