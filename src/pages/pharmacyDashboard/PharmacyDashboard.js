import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import "./PharmacyDashboard.css"

function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [pharmacyId, setPharmacyId] = useState(null);

  useEffect(() => {
    const fetchPharmacyIdAndData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;

      try {
        const res = await axios.get(`http://localhost:5001/api/pharmacy/getPharmacyId?user_id=${userId}`);
        const id = res.data.pharmacy_id;
        setPharmacyId(id);

        fetchPrescriptions(id);
        fetchInventory(id);
        fetchTransactions(id);
      } catch (err) {
        console.error("Error getting pharmacy_id", err);
      }
    };

    fetchPharmacyIdAndData();
  }, []);

  const fetchPrescriptions = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/pharmacy/requests?pharmacy_id=${id}`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Failed to load prescriptions", err);
    }
  };

  const fetchInventory = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/pharmacy/inventory?pharmacy_id=${id}`);
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const fetchTransactions = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/pharmacy/logs?pharmacy_id=${id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  const fulfillPrescription = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5001/api/pharmacy/prescriptions/${id}/fulfill`);
      setMessage(res.data.message || "Success");
      if (pharmacyId) {
        fetchPrescriptions(pharmacyId);
        fetchInventory(pharmacyId);
        fetchTransactions(pharmacyId);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to fulfill prescription.");
    }
  };

  const [newMedName, setNewMedName] = useState("");
  const [newStock, setNewStock] = useState("");

  const addInventoryItem = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const pharmacy_id = user?.user_id;

    try {
      const res = await axios.post("http://localhost:5001/api/pharmacy/inventory/add", {
        pharmacy_id,
        drug_name: newMedName,
        stock_quantity: parseInt(newStock),
      });
      setMessage(res.data.message || "Inventory added");
      setNewMedName("");
      setNewStock("");
      if (pharmacyId) fetchInventory(pharmacyId);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding inventory");
    }
  };

  return (
    <div className="main-container">
      <div className="side-bar">
        <ul>
          <li><button onClick={() => fetchPrescriptions(pharmacyId)}>Refresh Prescriptions</button></li>
          <li><button onClick={() => fetchInventory(pharmacyId)}>Refresh Inventory</button></li>
          <li><button onClick={() => fetchTransactions(pharmacyId)}>Refresh Transactions</button></li>
        </ul>
      </div>

      <div className="data-plane">
        <h1>Pharmacy Dashboard</h1>
        {message && <p className="dashboard-message">{message}</p>}

        <h2>Active Prescription Requests</h2>
        <div className="drug-refill-requests">
          {prescriptions.length === 0 ? (
            <p>No active requests.</p>
          ) : (
            prescriptions.map((rx) => (
              <div key={rx.prescription_id}>
                <strong>{rx.patient_name}</strong><br />
                {rx.medication_name} ({rx.dosage})<br />
                {rx.inventory_conflict ? (
                  <span className="inventory-conflict">Inventory conflict</span>
                ) : (
                  <button className="respond-request-btn" onClick={() => fulfillPrescription(rx.prescription_id)}>
                    Fulfill
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <h2>Add Inventory</h2>
        <div className="drug-inventory-list">
          <input
            type="text"
            placeholder="Medication Name"
            value={newMedName}
            onChange={(e) => setNewMedName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
          />
          <button className="add-inventory" onClick={addInventoryItem}>
            Add Medication
          </button>
        </div>

        <h2>Current Inventory</h2>
        <div className="drug-inventory">
          {inventory.map((item, idx) => (
            <div key={idx} className="drug-inventory-list">
              {item.drug_name} — {item.stock_quantity} units
            </div>
          ))}
        </div>

        <h2>Completed Transactions</h2>
        <div className="payments-container">
          {transactions.length === 0 ? (
            <p>No past transactions found.</p>
          ) : (
            transactions.map((tx, idx) => (
              <div key={idx} className="payment-card">
                {tx.patient_name}<br />
                {tx.medication_name}<br />
                ${Number(tx.amount_billed).toFixed(2)}<br />
                {new Date(tx.timestamp).toLocaleString()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PharmacyDashboard;
