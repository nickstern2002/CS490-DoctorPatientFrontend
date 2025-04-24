import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../Assets/Logo/logo.png'; // Adjust path if needed
import './DashboardTopBar.css';

function DashboardTopBar() {
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editableUser, setEditableUser] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone_number: ''
  });
  // Set Preferred Pharmacy
  const [preferredPharmacy, setPreferredPharmacy] = useState(null); // New state


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      fetch('http://localhost:5000/api/dashboard/user-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storedUser)
      })
        .then(res => res.json())
          .then(data => {
            setUserInfo(data);

            // 2) If the logged-in user is a patient, fetch their preferred pharmacy
            if (storedUser.user_type === 'patient') {
              fetch(`http://localhost:5000/api/patient-dashboard/preferred_pharmacy?user_id=${storedUser.user_id}`)
                  .then(r => r.json())
                  .then(pharm => setPreferredPharmacy(pharm))
                  .catch(err => console.error('Error loading preferred pharmacy:', err));
            }
          })
          .catch(err => console.error('Error fetching user info:', err));
    }

    const root = document.querySelector('.dashboard-root');
    if (localStorage.getItem('dashboardDarkMode') === 'true' && root) {
      root.classList.add('dark-mode');
    }
  }, []);

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const getDashboardTitle = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.user_type) return 'Loading Dashboard...';
    const type = storedUser.user_type.charAt(0).toUpperCase() + storedUser.user_type.slice(1);
    return `${type} Dashboard`;
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/update-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_type: storedUser.user_type,
          user_id: storedUser.user_id,
          first_name: editableUser.first_name,
          last_name: editableUser.last_name,
          address: editableUser.address,
          phone_number: editableUser.phone_number,
        })
      });
      if (response.ok) {
        setUserInfo(editableUser);
        setShowAccountModal(false);
      } else {
        console.error("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const toggleDarkMode = () => {
    const root = document.querySelector('.dashboard-root');
    if (root) {
      const isDark = root.classList.toggle('dark-mode');
      localStorage.setItem('dashboardDarkMode', isDark);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <img src={Logo} alt="Smart EatZ Logo" className="logo-image" />
      </div>

      <h2 className="dashboard-title">
        {getDashboardTitle()}
      </h2>

      {/* Only show for patients once we have the preferred pharmacy */}
      {JSON.parse(localStorage.getItem('user')).user_type === 'patient' && preferredPharmacy && (
          <div className="preferred-pharmacy-bar">
            <div>Preferred Pharmacy:&nbsp;</div>
            <strong>{preferredPharmacy.name}</strong>
            <span className="zip">({preferredPharmacy.zip_code})</span>
          </div>
      )}

      {userInfo && (
        <div className="profile-container">
          <div className="profile-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {getInitials(userInfo.first_name, userInfo.last_name)}
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <p><strong>{userInfo.first_name} {userInfo.last_name}</strong></p>
              <p>ID: {userInfo.patient_id || userInfo.doctor_id || userInfo.pharmacy_id}</p>
              <button className="dropdown-button" onClick={() => {
                setEditableUser({
                  ...userInfo,
                  user_id: JSON.parse(localStorage.getItem("user")).user_id,
                  user_type: JSON.parse(localStorage.getItem("user")).user_type,
                });
                setShowAccountModal(true);
              }}>
                Account
              </button>
              <button className="dropdown-button" onClick={() => setShowSettingsModal(true)}>
                Settings
              </button>
              <Link to="/" className="logout-button">Log Out</Link>
            </div>
          )}
        </div>
      )}

      {showAccountModal && (
        <div className="modal-overlay" onClick={() => setShowAccountModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>👤 Edit Account Details</h3>

            <div className="account-field">
              <label>First Name:</label>
              <input
                type="text"
                value={editableUser.first_name || ''}
                onChange={(e) => setEditableUser({ ...editableUser, first_name: e.target.value })}
              />
            </div>

            <div className="account-field">
              <label>Last Name:</label>
              <input
                type="text"
                value={editableUser.last_name || ''}
                onChange={(e) => setEditableUser({ ...editableUser, last_name: e.target.value })}
              />
            </div>

            <div className="account-field">
              <label>Address:</label>
              <input
                type="text"
                value={editableUser.address || ''}
                onChange={(e) => setEditableUser({ ...editableUser, address: e.target.value })}
              />
            </div>

            <div className="account-field">
              <label>Phone Number:</label>
              <input
                type="text"
                value={editableUser.phone_number || ''}
                onChange={(e) => setEditableUser({ ...editableUser, phone_number: e.target.value })}
              />
            </div>

            <div className="modal-buttons">
              <button className="modal-btn save-btn" onClick={handleSave}>Save</button>
              <button className="modal-btn cancel-btn" onClick={() => setShowAccountModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚙️ Settings</h3>
            <div className="settings-section">
              <label htmlFor="darkModeToggle" className="setting-label">
                <input
                  type="checkbox"
                  id="darkModeToggle"
                  defaultChecked={document.querySelector('.dashboard-root')?.classList.contains("dark-mode")}
                  onChange={toggleDarkMode}
                />
                Enable Dark Mode
              </label>
            </div>
            <button className="modal-btn cancel-btn" onClick={() => setShowSettingsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default DashboardTopBar;