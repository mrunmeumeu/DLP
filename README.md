# Raksha 1 - React Frontend Documentation

## Overview
This document provides an overview of the routes defined in the `App.js` file, the corresponding components they lead to, their functionality, and the full file paths for each component.

---

## Routes and Components

1. **/**  
   **Component:** [Testing](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Testing.md)  
   **Full Path:** `./Testing/Testing.jsx`  
   **Description:**  
   Displays the main dashboard with:
   - Total company violations.
   - Percentage of connected company devices with USB blocking, clipboard monitoring, and screenshot blocking enabled.
   - Safety percentage showing the percentage of connected clients adhering to security protocols.

2. **/usb**  
   **Component:** [AetherisHomepage](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/AetherisHomepage.md)  
   **Full Path:** `./USB/AetherisHomepage.jsx`  
   **Description:**  
   Admin page for USB blocking functionality. Allows toggling of USB policies across the network.

3. **/va-scans**  
   **Component:** [VulnerabilityAssessment](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/VulnerabilityAssessment.md)  
   **Full Path:** `./VA/VulnerabilityAssessment.jsx`  
   **Description:**  
   Admin view for initiating and managing vulnerability scans on connected clients. Allows multiple clients to be selected for simultaneous scans.

4. **/keyword-management**  
   **Component:** [KeywordMonitoring](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/KeywordMonitoring.md)  
   **Full Path:** `./keyword/KeywordMonitoring.jsx`  
   **Description:**  
   Admin page for managing clipboard monitoring. Enables or disables clipboard monitoring across the network.

5. **/client/:ip**  
   **Component:** [Dashboard](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Dashboard.md)  
   **Full Path:** `./Listing/Dashboard/VulnerabilityAssessment.jsx`  
   **Description:**  
   Displays detailed information about a specific client, including:
   - Device name.
   - Windows version.
   - IP address.
   - Other client-specific details.

6. **/client/:ip/usb-monitoring**  
   **Component:** [AetherisHomepageP](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/AetherisHomepageP.md)  
   **Full Path:** `./Listing/USB/AetherisHomepage.jsx`  
   **Description:**  
   Client-specific page for managing USB monitoring features.

7. **/client/:ip/va-scans**  
   **Component:** [VulnerabilityAssessmentP](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/VulnerabilityAssessmentP.md)  
   **Full Path:** `./Listing/VA/VulnerabilityAssessment.jsx`  
   **Description:**  
   Client-specific page for managing and viewing the results of vulnerability assessments.

8. **/client/:ip/keyword-management**  
   **Component:** [KeywordMonitoringP](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/KeywordMonitoringP.md)  
   **Full Path:** `./Listing/keyword/KeywordMonitoring.jsx`  
   **Description:**  
   Client-specific page for managing clipboard monitoring policies.

9. **/executable-monitoring**  
   **Component:** [ExecMon](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/ExecMon.md)  
   **Full Path:** `./monitoring/Executable.jsx`  
   **Description:**  
   Monitors and controls the execution of unauthorized or suspicious applications on client devices.

10. **/ss-blocking**  
    **Component:** [Screenshot](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Screenshot.md)  
    **Full Path:** `./SBlock/AetherisHomepage.jsx`  
    **Description:**  
    Manages screenshot blocking functionality. Enables or disables the ability to take screenshots on client devices.

11. **/reports**  
    **Component:** [ReportPage](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/ReportPage.md)  
    **Full Path:** `./Reports/ReportPage.jsx`  
    **Description:**  
    Displays logs for selected IPs, including timestamps of when specific features were turned on or off.

12. **/dashboard**  
    **Component:** [Listing](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Listing.md)  
    **Full Path:** `./Listing/Listing.jsx`  
    **Description:**  
    The admin dashboard showing an overview of the system's status and all connected clients.

13. **/logs**  
    **Component:** [LogViewer](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/LogViewer.md)  
    **Full Path:** `./Testing/LogViewer.jsx`  
    **Description:**  
    Testing page to retrieve logs from the "logs" node in Firebase. Used for debugging issues across different nodes.

14. **/valogs**  
    **Component:** [PortStatusGraph](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/PortStatusGraph.md)  
    **Full Path:** `./Testing/VaLog.jsx`  
    **Description:**  
    (To Be Implemented) Displays bar graphs showing the status of open and closed ports for selected clients. Also lists open ports for detailed analysis.

15. **/viewers**  
    **Component:** [Viewers](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Viewers.md)  
    **Full Path:** `./Viewers/VulnerabilityAssessment.jsx`  
    **Description:**  
    (Scrapped) This route and component are no longer in use.

16. **/encryption**  
    **Component:** [Encrypt](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Encrypt.md)  
    **Full Path:** `./Encryption/Encrypt.jsx`  
    **Description:**  
    Manages file encryption for sensitive documents such as Excel files and PDFs.

17. **/analysis**  
    **Component:** [AuditAna](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/AuditAna.md)  
    **Full Path:** `./AuditPage/DataAnalyse.jsx`  
    **Description:**  
    Displays a list of clients along with the number of violations they have committed. Allows further analysis of these violations.

18. **/analysis/:username**  
    **Component:** [DataAna](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/DataAna.md)  
    **Full Path:** `./Analysis/DataAnalyse.jsx`  
    **Description:**  
    Provides a detailed audit analysis for a specific user identified by their username.

19. **/behaveAna**  
    **Component:** [Behave](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Behave.md)  
    **Full Path:** `./Behave/BehaveAna.jsx`  
    **Description:**  
    Displays the top 10 violators among the clients. Useful for identifying problematic devices.

20. **/behaveAna/:username**  
    **Component:** [Individual](https://github.com/mrunmeumeu/DLP/blob/indepth-documentation/Individual.md)  
    **Full Path:** `./BehaveIndi/IndividualAna.jsx`  
    **Description:**  
    Provides a detailed behavioral analysis for a specific client identified by their device name.
