import React, { useEffect, useState } from 'react';
import './PharmacyDashboard.css';

function PharmacyDashboard() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const user_id = user ? user.user_id : null;
    const [payments, setPayments] = useState([]);
    /*
    const [patients, setPatients] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    */
    const [requests, setRequests] = useState([]);

    const [inventory, setInventory] = useState([]);
    const [changeInventory, setChangeInventory] = useState({});

    const [logs, setLogs] = useState([]);
    const [pharmacyDetails, setPharmacyDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "meal-plans", or "payments"
    const [updateMessage, setUpdateMessage] = useState("");
    /*
    const [drugResults, setDrugResults] = useState([]);
    */
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/api/pharmacy-dashboard/details?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.pharmacy) {
                    setPharmacyDetails(data.pharmacy);
                }
            })
            .catch(error => console.error('Error fetching pharmacy details:', error));
    }, [user_id]);
    
    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/pharmacy/logs`)
                .then(response => response.json())
                .then(data => {
                    if (data.pharmacy_logs) {
                        setLogs(data.pharmacy_logs);
                    } else {
                        setLogs([]);
                    }
                })
                .catch(error => console.error('Error fetching pharmacy logs:', error));
        }
    }, [user_id, activeTab]);

    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/pharmacy/inventory`)
                .then(response => response.json())
                .then(data => {
                    if (data.pharmacy_inventory) {
                        setInventory(data.pharmacy_inventory);
                    } else {
                        setInventory([]);
                    }
                })
                .catch(error => console.error('Error fetching pharmacy inventory:', error));
        }
    })
    /*
    { for payments page }
    useEffect(() => {
        if (activeTab === "payments") {
            fetch(`http://localhost:5000/api/pharmacy-dashboard/payments?user_id=${user_id}`)
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
    */
    /*
    { unused }
    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/pharmacy/patients`)
                .then(response => response.json())
                .then(data => {
                    if (data.prescriptions) {
                        setPatients(data.prescriptions);
                    } else {
                        setPatients([]);
                    }
                })
                .catch(error => console.error('Error fetching patients data:', error));
        }
    }, [user_id, activeTab]);
    */
    /*
    { unused }
    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/pharmacy/prescriptions`)
                .then(response => response.json())
                .then(data => {
                    if(data.prescriptions) {
                        setPrescriptions(data.prescriptions);
                    } else {
                        setPrescriptions([]);
                    }
                })
                .catch(error => console.error('Error fetching prescriptions:', error));
        }
    }, [user_id, activeTab]);
    */

    useEffect(() => {
        if (activeTab === "dashboard") {
            fetch(`http://localhost:5000/api/pharmacy/requests`)
                .then(response => response.json())
                .then(data => {
                    if(data.prescriptions) {
                        setRequests(data.prescriptionID);
                    } else {
                        setRequests([]);
                    }
                })
                .catch(error => console.error("Error fetching requests:", error));
        }
    }, [user_id, activeTab]);
    /*
    const getPrescriptionByID = () => {
        const query = `${prescriptionID}`.trim();
        fetch(`http://localhost:5000/api/pharmacy/prescriptions/${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => setPatient(data))
            .catch(error => console.error("Error getting patient prescription:", error));
    };
    */
    /*
    const performDrugSearch = () => {
        const query =  `${drugName}`.trim();
        fetch(`http://localhost:5000/api/pharmacy-dashboard/search-pharmacy?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => setDrugResults(data))
            .catch(error => console.error("Error searching drug:", error));
    };
    */
    const respondRequest = (prescription_id) => {
        fetch(`http://localhost:5000/api/pharmacy/prescriptions/${prescription_id}/fulfill`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            .catch(error => console.error('Error responding to prescription:', error));
    };
    const handleInputChange = (drugName, value) => {
        setChangeInventory((prev) => ({
          ...prev,
          [drugName]: value,
        }));
      };

    const addInventory = (drug_name, add_quantity) => {
        fetch(`http://localhost:5000/api/pharmacy/inventory/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user_id,
                drug_name: drug_name,
                stock_quantity: add_quantity
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                } else if (data.error) {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error("Error booking appointment:", error));
    };
    const renderDashboardData = () => {
        if (activeTab === "dashboard") {
            return (
                <div>
                    <h3>Patients Billing List</h3>
                    <div className="patients-billing-container">
                        {logs.map(app => (
                            <div key={app.prescription_id} className="patients-billing-card">
                                <h4>Prescription #{app.prescription_id}</h4>
                                <p><strong>Patient Name:</strong> {app.first_name} {app.last_name}</p>
                                <p><strong>Prescription Name:</strong> {app.medication_name}</p>
                                <p><strong>Date of Billing:</strong> {app.timestamp}</p>
                                <p><strong>Payment Fulfillment Status:</strong> {app.status}</p>
                            </div>
                        ))}
                    </div>
                    <h3>Drug Refill Requests</h3>
                    <div className="drug-refill-requests">
                        {requests.map(app => (
                            <div key={app.prescription_id} className='drug-refill-requests'>
                                <h4>{app.prescription_id}</h4>
                                <p><strong>Patient Name:</strong> {app.first_name} {app.last_name}</p>
                                <p><strong>Medication Name:</strong> {app.medication_name}</p>
                                <p><strong>Dosage:</strong> {app.dosage}</p>
                                <p><strong>Billed Amount:</strong> {app.amount_billed}</p>
                                <p><strong>Date of Refill Request:</strong> {app.timestamp}</p>
                                <p><strong>Pharmacy Quantity:</strong> {app.stock_quantity}</p>
                                <div className="request-buttons">
                                    <button
                                        className="respond-request-btn"
                                        onClick={() => respondRequest(app.prescription_id)}
                                    >
                                        &#10003;
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                    {/* Only displays inventory for now*/}
                    <h3>Drug Search</h3>
                    <div className="drug-inventory">
                        {inventory.map(app => (
                            <div key={app.drug_name} className='drug-inventory-list'>
                                <p>{app.drug_name}</p>
                                <p><strong>Inventory Amount:</strong> {app.stock_quantity}</p>

                                <input
                                    type="number"
                                    placeholder="Add quantity"
                                    value={changeInventory[app.drug_name] || ''}
                                    onChange={(e) => handleInputChange(app.drug_name, e.target.value)}
                                />
                                <div className='inventory-add-button'>
                                    <button 
                                    className='add-inventory'
                                    onClick={() => addInventory(app.drug_name, Number(changeInventory[app.drug_name]))}>
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/*
                    <div className="search-form">
                        <input
                        type="text"
                        placeholder="Name of Drug"
                        value={drugName}
                        onChange={(e) =>setDrugName(e.target.value)}/>
                        <button onClick={performDrugSearch}>Search</button>
                    </div>
                    <div className="search-results">
                        {drugResults.length > 0 ? (
                            drugResults.map(drug => (
                                <div key={drug.pharmacy_id} className="drug-card">
                                    <h4>{drug.drug_name}</h4>
                                    <p><strong>Inventory Amount {drug.stock_quantity}</strong></p>
                                </div>
                            ))
                        ) : (
                            <p>No drugs by that name.</p>
                        )}
                    </div>
                    */}
                </div>
            );
        } else if (activeTab === "payments") {
            return (
                <div>
                    <h3>Payments</h3>
                    <div className="payments-section">
                        <h4>Payments</h4>
                        <div className="payments-container">
                            {payments.length > 0 ? (
                                payments.map(payment => (
                                    <div key={payment.payment_id} className="payment-card">
                                        <h5>Payment #{payment.payment_id}</h5>
                                        <p><strong>{payment.first_name} {payment.last_name}</strong></p>
                                        <p><strong>Amount:</strong> ${payment.amount}</p>
                                        <p><strong>Fulfilled:</strong> {payment.is_fulfilled ? "Yes" : "No"}</p>
                                        <p><strong>Date:</strong> {payment.payment_date}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No payments found</p>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
    };
    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            {/* Top Bar */}
            <header className="top-bar">
                <h1>Smart Eatz</h1>
                <h2>Pharmacy Dashboard</h2>
                <div className="pharmacy-details">
                    {pharmacyDetails ? (
                        <p style={{ margin: 0 }}>
                            {pharmacyDetails.name}<br />
                            PharmacyID: {pharmacyDetails.pharmacy_id}
                        </p>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </header>

            {/* Main container with sidebar and data plane */}
            <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <nav className="side-bar">
                    <ul>
                        <li>
                            <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab("payments")}>Payments</button>
                        </li>
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
                            // Refresh the appointments so the updated one is removed from scheduled list.
                        }}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyDashboard;