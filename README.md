Raksha 1 - React Frontend Documentation
Overview
This document provides an overview of the routes defined in the App.js file, the corresponding components they lead to, their functionality, and the full file paths for each component.

Routes and Components
1. /
Component: Testing
Full Path: ./Testing/Testing.js
Description:
Displays the main dashboard with:
Total company violations.
Percentage of connected company devices with USB blocking, clipboard monitoring, and screenshot blocking enabled.
Safety percentage showing the percentage of connected clients adhering to security protocols.
2. /usb
Component: AetherisHomepage
Full Path: ./USB/AetherisHomepage.js
Description:
Admin page for USB blocking functionality. Allows toggling of USB policies across the network.
3. /va-scans
Component: VulnerabilityAssessment
Full Path: ./VA/VulnerabilityAssessment.js
Description:
Admin view for initiating and managing vulnerability scans on connected clients. Allows multiple clients to be selected for simultaneous scans.
4. /keyword-management
Component: KeywordMonitoring
Full Path: ./keyword/KeywordMonitoring.js
Description:
Admin page for managing clipboard monitoring. Enables or disables clipboard monitoring across the network.
5. /client/:ip
Component: Dashboard
Full Path: ./Listing/Dashboard/VulnerabilityAssessment.js
Description:
Displays detailed information about a specific client, including:
Device name.
Windows version.
IP address.
Other client-specific details.
6. /client/:ip/usb-monitoring
Component: AetherisHomepageP
Full Path: ./Listing/USB/AetherisHomepage.js
Description:
Client-specific page for managing USB monitoring features.
7. /client/:ip/va-scans
Component: VulnerabilityAssessmentP
Full Path: ./Listing/VA/VulnerabilityAssessment.js
Description:
Client-specific page for managing and viewing the results of vulnerability assessments.
8. /client/:ip/keyword-management
Component: KeywordMonitoringP
Full Path: ./Listing/keyword/KeywordMonitoring.js
Description:
Client-specific page for managing clipboard monitoring policies.
9. /executable-monitoring
Component: ExecMon
Full Path: ./monitoring/Executable.js
Description:
Monitors and controls the execution of unauthorized or suspicious applications on client devices.
10. /ss-blocking
Component: Screenshot
Full Path: ./SBlock/AetherisHomepage.js
Description:
Manages screenshot blocking functionality. Enables or disables the ability to take screenshots on client devices.
11. /reports
Component: ReportPage
Full Path: ./Reports/ReportPage.js
Description:
Displays logs for selected IPs, including timestamps of when specific features were turned on or off.
12. /dashboard
Component: Listing
Full Path: ./Listing/Listing.js
Description:
The admin dashboard showing an overview of the system's status and all connected clients.
13. /logs
Component: LogViewer
Full Path: ./Testing/LogViewer.js
Description:
Testing page to retrieve logs from the "logs" node in Firebase. Used for debugging issues across different nodes.
14. /valogs
Component: PortStatusGraph
Full Path: ./Testing/VaLog.js
Description:
(To Be Implemented) Displays bar graphs showing the status of open and closed ports for selected clients. Also lists open ports for detailed analysis.
15. /viewers
Component: Viewers
Full Path: ./Viewers/VulnerabilityAssessment.js
Description:
(Scrapped) This route and component are no longer in use.
16. /encryption
Component: Encrypt
Full Path: ./Encryption/Encrypt.js
Description:
Manages file encryption for sensitive documents such as Excel files and PDFs.
17. /analysis
Component: AuditAna
Full Path: ./AuditPage/DataAnalyse.js
Description:
Displays a list of clients along with the number of violations they have committed. Allows further analysis of these violations.
18. /analysis/:username
Component: DataAna
Full Path: ./Analysis/DataAnalyse.js
Description:
Provides a detailed audit analysis for a specific user identified by their username.
19. /behaveAna
Component: Behave
Full Path: ./Behave/BehaveAna.js
Description:
Displays the top 10 violators among the clients. Useful for identifying problematic devices.
20. /behaveAna/:username
Component: Individual
Full Path: ./BehaveIndi/IndividualAna.js
Description:
Provides a detailed behavioral analysis for a specific client identified by their device name.
