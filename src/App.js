import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordMonitoring from './keyword/KeywordMonitoring';
import AetherisHomepage from './USB/AetherisHomepage';
import VulnerabilityAssessment from './VA/VulnerabilityAssessment';
import ExecutableMonitoring from './monitoring/ExecutableMonitoring';
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
function App() {
  return (
    <Router>
      <div className="App">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/usb" element={<AetherisHomepage />} />
          <Route path="/" element={<Listing />} />
          <Route path="/va-scans" element={<VulnerabilityAssessment />} />
          <Route path="/keyword-management" element={<KeywordMonitoring/>} />
          {<Route path="/client/:ip/usb-monitoring" element={<AetherisHomepageP />} /> }
          <Route path="/client/:ip/keyword-management" element={<KeywordMonitoringP />} />
          <Route path="/executable-monitoring" element={<ExecutableMonitoring/>} />
          <Route path="/client" element ={<AetherisHomepageClient/>}/>
          <Route path="/client/:ip/va-scans" element={<VulnerabilityAssessmentP />} />
          <Route path="/reports" element ={<ReportPage/>}/>
          <Route path="/ss-blocking" element ={<Screenshot/>}/>
          <Route path="/client/:ip" element={<Dashboard />} />
          

          
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
