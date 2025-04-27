import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import "./PharmacyDashboard.css";
import DashboardTopBar from "../../Components/DashboardTopBar/DashboardTopBar";
import Footer from "../../Components/Footer/Footer";

function PharmacyDashboard() {
  // pull user_id from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const user_id = user?.user_id;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [queue, setQueue] = useState([]);

  // Inventory States
  const [inventory, setInventory] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  // list of drugs offered
  const [drugs, setDrugs] = useState([]);

  const fetchDrugs = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/prescriptions/drugs`);
      setDrugs(res.data);
      if (res.data.length) {
        setSelectedDrug(res.data[0].name);
      }
    } catch (err) {
      console.error("Error fetching master drug list:", err);
    }
  };

  // fetch current inventory
  const fetchInventory = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(
        `http://localhost:5001/api/pharmacy/inventory?user_id=${user_id}`
      );
      setInventory(res.data);
      // default the dropdown to the first drug, if any
      if (res.data.length && !selectedDrug) {
        setSelectedDrug(res.data[0].drug_name);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

// add to inventory
  const addInventoryItem = async () => {
    if (!user_id || !selectedDrug || !newQuantity) return;
    try {
      await axios.post(
        `http://localhost:5001/api/pharmacy/inventory/add`,
        {
          user_id,
          drug_name: selectedDrug,
          stock_quantity: parseInt(newQuantity, 10),
        }
      );
      setNewQuantity("");
      fetchInventory();
    } catch (err) {
      console.error("Error adding inventory:", err);
    }
  };

  // fetch queue by user_id
  const fetchQueue = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(
        `http://localhost:5001/api/pharmacy/queue?user_id=${user_id}`
      );
      setQueue(res.data);
    } catch (err) {
      console.error("Error fetching prescription queue:", err);
    }
  };

  // mark filled by user_id
  const markAsFilled = async (prescriptionId) => {
    if (!user_id) return;
    try {
      await axios.post(
        `http://localhost:5001/api/pharmacy/prescriptions/${prescriptionId}/fulfill?user_id=${user_id}`
      );
    } catch (err) {
      console.error("Error marking as filled:", err);
    } finally {
      fetchQueue();
    }
  };

  // reload queue whenever tab or user changes
  useEffect(() => {
    if (activeTab === "prescription-queue") {
      fetchQueue();
    }
    else if (activeTab === "dashboard") {
      fetchInventory();
    }
    if (drugs.length === 0) {
      fetchDrugs();
    }
  }, [activeTab, user_id]);

  const renderDashboardData = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="data-plane">
          <h1>Pharmacy Dashboard</h1>

          <h2>Current Inventory</h2>
          {inventory.length === 0 ? (
            <p>No inventory on hand.</p>
          ) : (
            <ul className="prescription-list">
              {inventory.map(item => (
                <li key={item.drug_name} className="appointment-card">
                  <p><strong>{item.drug_name}</strong></p>
                  <p>{item.stock_quantity} units</p>
                </li>
              ))}
            </ul>
          )}
          <div className="inventory-form-container">
            <h2>Add Stock</h2>
            <form className="inventory-form" onSubmit={e => { e.preventDefault(); addInventoryItem(); }}>
              <label>
                <span>Drug</span>
                <select
                  value={selectedDrug}
                  onChange={e => setSelectedDrug(e.target.value)}
                >
                  {drugs.map(d => (
                    <option key={d.drug_id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={e => setNewQuantity(e.target.value)}
                />
              </label>
              <button type="submit">Add to Inventory</button>
            </form>
          </div>
        </div>
      );
    } else if (activeTab === "prescription-queue") {
      return (
        <div className="prescription-queue data-plane">
          <h1>Prescription Queue</h1>

          {queue.length === 0 ? (
            <p>No pending prescriptions.</p>
          ) : (
            <div className="appointments-container">
              {queue.map((rx, idx) => (
                <div key={rx.prescription_id} className="appointment-card">
                  <h5>Prescription #{rx.prescription_id}</h5>
                  <p>
                    <strong>Patient:</strong> {rx.patient_name}
                  </p>
                  <p>
                    <strong>Medication:</strong> {rx.medication_name} ({rx.dosage})
                  </p>
                  <p>
                    <strong>Requested at:</strong>{" "}
                    {new Date(rx.requested_at).toLocaleString()}
                  </p>

                  {idx === 0 ? (
                    <button
                      className="start-appointment-button"
                      onClick={() => markAsFilled(rx.prescription_id)}
                    >
                      Mark as Filled
                    </button>
                  ) : (
                    <span className="pending-label">Pending</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <DashboardTopBar />
      <div className="flex-grow flex main-container">
        <div className="side-bar">
          <ul>
            <li>
              <button
                className={activeTab === "dashboard" ? "active-tab" : ""}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={activeTab === "prescription-queue" ? "active-tab" : ""}
                onClick={() => setActiveTab("prescription-queue")}
              >
                Prescription Queue
              </button>
            </li>
          </ul>
        </div>

        <main className="data-plane">{renderDashboardData()}</main>
      </div>
      <Footer />
    </div>
  );
}

export default PharmacyDashboard;
