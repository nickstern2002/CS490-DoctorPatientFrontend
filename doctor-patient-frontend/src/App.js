import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DoctorDashboard from "./pages/doctorDashboard/doctorDashboard";
import PatientDashboard from "./pages/patientDashboard/patientDashboard";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route path="/doctor-dashboard/:user_id" element={<DoctorDashboard />} /> {/* Dynamic route */}
                        <Route path="/patient-dashboard/:user_id" element={<PatientDashboard />} /> {/* Dynamic route */}
                    </Routes>
                </header>
            </div>
        </Router>
    );
}

export default App;
