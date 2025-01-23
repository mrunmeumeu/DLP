import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordMonitoring from './keyword/KeywordMonitoring';
import AetherisHomepage from './USB/AetherisHomepage';
import VulnerabilityAssessment from './VA/VulnerabilityAssessment';
import ExecMon from './monitoring/Executable';
import Dashboard from './Listing/Dashboard/VulnerabilityAssessment';
import ClientDetails from './Listing/ClientDetails';
import ClientStatus from './Listing/ClientStatus';
import Screenshot from './SBlock/AetherisHomepage';
import Listing from './Listing/Listing';
import ReportPage from './Reports/ReportPage';
import VulnerabilityAssessmentP from './Listing/VA/VulnerabilityAssessment';
import AetherisHomepageP from './Listing/USB/AetherisHomepage';
import KeywordMonitoringP from './Listing/keyword/KeywordMonitoring';
import AetherisHomepageClient from './client/AetherisHomepage';
import Testing from './Testing/Testing';
import LogViewer from './Testing/LogViewer';
import PortStatusGraph from './Testing/VaLog';
import Viewers from './Viewers/VulnerabilityAssessment';
import UserDataPage from './Analysis/Analysis';
import Behave from './Behave/BehaveAna';
import DataAna from './Analysis/DataAnalyse';
import AuditAna from './AuditPage/DataAnalyse';
import Encrypt from './Encryption/Encrypt';
import Individual from './BehaveIndi/IndividualAna';
import LogPage from './VA_Logs/VA_Page';
import LastHourViolations from './Alert/Alert';
import ExecMonP from './Listing/monitoring/Executable';
function App() {
  return (
      
    <Router>
      <div className="App">
      
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/usb" element={<AetherisHomepage />} />
          <Route path="/" element={<Testing />} />
          <Route path="/va-scans" element={<VulnerabilityAssessment />} />
          <Route path="/keyword-management" element={<KeywordMonitoring/>} />
          {<Route path="/client/:ip/usb-monitoring" element={<AetherisHomepageP />} /> }
          <Route path="/client/:ip/keyword-management" element={<KeywordMonitoringP />} />
          <Route path="/executable-monitoring" element={<ExecMon/>} />
          <Route path="/client" element ={<AetherisHomepageClient/>}/>
          <Route path="/client/:ip/va-scans" element={<VulnerabilityAssessmentP />} />
          <Route path="/reports" element ={<ReportPage/>}/>
          <Route path="/ss-blocking" element ={<Screenshot/>}/>
          <Route path="/client/:ip" element={<Dashboard />} />
          <Route path="/client/:ip/executable-monitoring" element={<ExecMonP />} />
          <Route path="/dashboard" element={<Listing />} />
          <Route path="/logs" element={<LogViewer />} />
          <Route path="/valogs" element={<LogPage />} />
          <Route path="/viewers" element={<Viewers />} />

          <Route path="/encryption" element={<Encrypt />} />
          { <Route path="/analysis" element={<AuditAna/>} /> }
          <Route path="/analysis/:username" element={<DataAna />} />

          <Route path="/behaveAna" element={<Behave />} />
          <Route path="/behaveAna/:username" element={<Individual />} />
          <Route path="/alert" element={<LastHourViolations />} />

          

          
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
