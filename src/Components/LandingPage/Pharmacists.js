import './Pharmacists.css';
import { useState, useEffect } from 'react';
import BufoPainkillers from '../../Assets/Landing/BufoPainkillers.png';
import Pharmacist from '../../Assets/Landing/Pharmacist.png';

function Pharmacists() {
  const [showModal, setShowModal] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    if (showModal) {
      fetch('http://localhost:5000/api/pharmacies/all')
        .then(res => res.json())
        .then(data => setPharmacies(data.pharmacies || []))
        .catch(err => console.error('Error fetching pharmacies:', err));
    }
  }, [showModal]);

  return (
    <div className="pharmacists-section">
      <div className="pharmacists-content">
        {/* LEFT: Image */}
        <div className="pharmacists-image">
          <img src={Pharmacist} alt="Pharmacist" />
        </div>

        {/* RIGHT: Text content */}
        <div className="pharmacists-text">
          <h2>Pharmacists</h2>
          <h3>Trusted Pharmacist For Good Drugs</h3>
          <p>Use our built-in pharmacist database to find which drugs would best match your health needs!</p>
          <button className="pharmacists-btn" onClick={() => setShowModal(true)}>View Our Pharmacies</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Our Pharmacies</h3>
            <div className="pharmacy-grid">
              {pharmacies.map(pharm => (
                <div key={pharm.pharmacy_id} className="pharmacy-card">
                  <img src={BufoPainkillers} alt="Bufo" className="pharmacy-avatar" />
                  <div className="pharmacy-info">
                    <h4>{pharm.pharmacy_name}</h4>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharm.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pharmacy-address-link"
                    >
                      {pharm.address}
                    </a>
                    <p>{pharm.phone_number}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pharmacists;