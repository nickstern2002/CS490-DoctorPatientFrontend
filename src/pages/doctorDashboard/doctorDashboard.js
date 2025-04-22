import React, { useEffect, useState } from 'react';
import './doctorDashboard.css';
import Logo from '../../Assets/Logo/logo.png';
import ChatWindow from '../../Components/ChatWindow';
import {useNavigate} from "react-router-dom";
import ChatHistory from "../../Components/ChatHistory";
import Footer from '../../Components/Footer/Footer';
import DashboardTopBar from '../../Components/DashboardTopBar/DashboardTopBar';

function DoctorDashboard() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const user_id = user ? user.user_id : null;
    const [appointments, setAppointments] = useState([]);
    const [payments, setPayments] = useState([]);
    const [acceptedAppointments, setAcceptedAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [completedAppointments, setCompletedAppointments] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "meal-plans", or "payments"
    const [updateMessage, setUpdateMessage] = useState('');
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);

    // Dark Mode
    const isDark = localStorage.getItem('dashboardDarkMode') === 'true';

    // inside DoctorDashboard()
    const [activeChatAppointment, setActiveChatAppointment] = useState(null);

    const navigate = useNavigate();

    // Function to fetch appointments
    const fetchAppointments = () => {
        fetch(`http://localhost:5000/api/doctor-dashboard/appointments?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching appointments:', error));
    };

    // Fetch appointments when activeTab changes to "dashboard"
    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/doctor-dashboard/appointments?user_id=${user_id}`)
                .then(response => response.json())
                .then(data => setAppointments(data)) // data is a JSON array of appointments
                .catch(error => console.error('Error fetching appointments:', error));
        }
    }, [user_id, activeTab]);

    // Fetch history appointments (accepted, canceled, completed) when activeTab is "appointments"
    useEffect(() => {
        if (activeTab === "appointments") {
            Promise.all([
                fetch(`http://localhost:5000/api/doctor-dashboard/appointments/accepted?user_id=${user_id}`)
                    .then(response => response.json()),
                fetch(`http://localhost:5000/api/doctor-dashboard/appointments/canceled?user_id=${user_id}`)
                    .then(response => response.json()),
                fetch(`http://localhost:5000/api/doctor-dashboard/appointments/completed?user_id=${user_id}`)
                    .then(response => response.json())
            ])
                .then(([acceptedData, canceledData, completedData]) => {
                    setAcceptedAppointments(acceptedData);
                    setCanceledAppointments(canceledData);
                    setCompletedAppointments(completedData);
                })
                .catch(error => console.error('Error fetching history appointments:', error));
        }
    }, [user_id, activeTab]);

    // Fetch payments when payments tab is active
    useEffect(() => {
        if (activeTab === "payments") {
            fetch(`http://localhost:5000/api/doctor-dashboard/payments?user_id=${user_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.payments) {
                        setPayments(data.payments);
                    } else {
                        setPayments([]);
                    }
                })
                .catch(error => console.error('Error fetching payments:', error));
        }
    }, [user_id, activeTab]);

    // Fetch doctor details for the top bar
    useEffect(() => {
        fetch(`http://localhost:5000/api/doctor-dashboard/details?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.doctor) {
                    setDoctorDetails(data.doctor);
                }
            })
            .catch(error => console.error('Error fetching doctor details:', error));
    }, [user_id]);

    const handleEndAppointment = async () => {
        const apptId = activeChatAppointment.appointment_id;
        try {
            // 1) Mark completed in DB
            await fetch('http://localhost:5000/api/doctor-dashboard/appointments/complete', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointment_id: apptId }),
            });

            // 2) Notify patient via chat
            await fetch('http://localhost:5000/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: doctorDetails.doctor_id,
                    patient_id: activeChatAppointment.patient_id,
                    appointment_id: apptId,
                    sender_type: 'doctor',
                    message: '__APPOINTMENT_ENDED__',
                }),
            });

            // 3) Redirect to post‑appointment placeholder
            navigate('/post-appointment', {
                state: {
                    appointment_id: apptId,
                    doctor_id:     doctorDetails.doctor_id,
                    patient_id:    activeChatAppointment.patient_id
                }
            });
        } catch (err) {
            console.error('❌ Error ending appointment:', err);
            alert('Could not end appointment. Please try again.');
        }
    };

    // Function to respond to an appointment
    const respondAppointment = (appointment_id, accepted) => {
        fetch('http://localhost:5000/api/doctor-dashboard/appointments/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user_id,
                appointment_id: appointment_id,
                accepted: accepted
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setUpdateMessage(data.message);
                    setShowUpdatePopup(true);
                } else if (data.error) {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error('Error responding to appointment:', error));
    };

    // Render content based on the active tab.
    const renderDashboardData = () => {
        if (activeTab === "dashboard") {
            return (
                <div>
                    <h3>Requested Appointments</h3>
                    <div className="appointments-container">
                        {appointments.map(app => (
                            <div key={app.appointment_id} className="appointment-card">
                                <h4>Appointment #{app.appointment_id}</h4>
                                <p><strong>Patient ID:</strong> {app.patient_id}</p>
                                <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                <p><strong>Status:</strong> {app.status}</p>
                                <div className="response-buttons">
                                    <button
                                        className="accept-btn"
                                        onClick={() => respondAppointment(app.appointment_id, true)}
                                    >
                                        &#10003;
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => respondAppointment(app.appointment_id, false)}
                                    >
                                        &#10005;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (activeTab === "appointments") {
            if (activeTab === "appointments" && activeChatAppointment) {
                return (
                    <div>
                        <button onClick={() => setActiveChatAppointment(null)}>
                            ← Back to Appointments
                        </button>
                        <button
                            className="end-appointment-button"
                            onClick={handleEndAppointment}
                        >
                            End Appointment
                        </button>

                        <ChatWindow
                            doctorId={doctorDetails.doctor_id}
                            patientId={activeChatAppointment.patient_id}
                            appointmentId={activeChatAppointment.appointment_id}
                            isDoctor={true}
                        />
                    </div>
                );
            }
            return (
                <div>
                    <h3>Appointment History</h3>

                    <div>
                        <h4>Accepted Appointments</h4>
                        <div className="appointments-container">
                            {acceptedAppointments.length > 0 ? (
                                acceptedAppointments.map(app => {
                                    const apptDate    = new Date(app.appointment_time);
                                    const now         = new Date();
                                    const diffMs      = apptDate - now;
                                    const isStartable = diffMs >= -30  * 60 * 1000 && diffMs <= 15 * 60 * 1000;

                                    return (
                                        <div key={app.appointment_id} className="appointment-card">
                                            <h5>Appointment #{app.appointment_id}</h5>
                                            <p><strong>Patient ID:</strong> {app.patient_id}</p>
                                            <p><strong>Date/Time:</strong> {apptDate.toLocaleString()}</p>
                                            <p><strong>Status:</strong> {app.status}</p>

                                            {isStartable && (
                                                <button
                                                    className="start-appointment-button"
                                                    onClick={() => setActiveChatAppointment(app)}
                                                >
                                                    Start Appointment
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No accepted appointments.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4>Canceled Appointments</h4>
                        <div className="appointments-container">
                            {canceledAppointments.length > 0 ? (
                                canceledAppointments.map(app => (
                                    <div key={app.appointment_id} className="appointment-card">
                                        <h5>Appointment #{app.appointment_id}</h5>
                                        <p><strong>Patient ID:</strong> {app.patient_id}</p>
                                        <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                        <p><strong>Status:</strong> {app.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No canceled appointments.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4>Completed Appointments</h4>
                        <div className="appointments-container">
                            {completedAppointments.length > 0 ? (
                                completedAppointments.map(app => (
                                    <div key={app.appointment_id} className="appointment-card">
                                        <h5>Appointment #{app.appointment_id}</h5>
                                        <p><strong>Patient ID:</strong> {app.patient_id}</p>
                                        <p><strong>Date/Time:</strong> {app.appointment_time}</p>
                                        <p><strong>Status:</strong> {app.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No completed appointments.</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === "meal-plans") {
            return (
                <div>
                    <h3>Official Meal Plans</h3>
                    <p>Meal plans content goes here...</p>
                </div>
            );
        } else if (activeTab === "payments") {
            return (
                <div>
                    <h3>Payments</h3>
                    <div className="payments-container">
                        {payments.map(payment => (
                            <div key={payment.payment_id} className="payment-card">
                                <h4>Payment #{payment.payment_id}</h4>
                                <p>
                                    <strong>Patient:</strong> {payment.first_name} {payment.last_name}
                                </p>
                                <p>
                                    <strong>Amount:</strong> ${payment.amount}
                                </p>
                                <p>
                                    <strong>Fulfilled:</strong> {payment.is_fulfilled ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Date:</strong> {payment.payment_date}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        else if (activeTab === "chat-history") {
            return (
                <div>
                    <h3>Chat History</h3>
                    {doctorDetails && (
                        <ChatHistory
                            doctorId={doctorDetails.doctor_id}
                            isDoctor={true}
                        />
                    )}
                </div>
            );
        }
    };

    return (
        <div className={`dashboard-root ${isDark ? 'dark-mode' : ''}`}>
            <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'white' }}>
            {/* Top Bar */}
            <DashboardTopBar />
        
            {/* Main container with sidebar and data */}
            <div className="flex-grow" style={{ display: 'flex' }}>
                {/* Sidebar */}
                <nav className="side-bar">
                <ul>
                    <li><button onClick={() => setActiveTab("dashboard")}>Dashboard</button></li>
                    <li><button onClick={() => setActiveTab("appointments")}>Appointments</button></li>
                    <li><button onClick={() => setActiveTab("meal-plans")}>Official Meal Plans</button></li>
                    <li><button onClick={() => setActiveTab("payments")}>Payments</button></li>
                    <li><button onClick={() => setActiveTab("chat-history")}>Chat History</button></li>
                </ul>
                </nav>
        
                {/* Data Plane */}
                <main style={{ flex: 1, padding: '1rem' }}>
                {renderDashboardData()}
                </main>
            </div>
        
            {/* Update Popup Modal */}
            {showUpdatePopup && (
                <div className="modal-overlay">
                <div className="modal">
                    <p>{updateMessage}</p>
                    <button onClick={() => {
                    setShowUpdatePopup(false);
                    fetchAppointments(); // refresh list
                    }}>
                    Confirm
                    </button>
                </div>
                </div>
            )}
        
            {/* ✅ Footer at bottom */}
            <Footer />
            </div>
        </div>
      );
}

export default DoctorDashboard;
