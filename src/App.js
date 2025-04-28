import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DoctorDashboard from "./pages/doctorDashboard/doctorDashboard";
import PatientDashboard from "./pages/patientDashboard/patientDashboard";

function App() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    return (
        <Router>
            <div className={`global-root ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="App">
                    <header className="App-header">
                        <Routes>
                            <Route path="/doctor-dashboard/:user_id" element={<DoctorDashboard />} /> {/* Dynamic route */}
                            <Route path="/patient-dashboard/:user_id" element={<PatientDashboard />} /> {/* Dynamic route */}
                        </Routes>
                    </header>
                </div>
            </div>
        </Router>
    );
}

export default App;
