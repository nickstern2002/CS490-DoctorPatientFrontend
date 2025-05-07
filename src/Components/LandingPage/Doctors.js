import React, { useEffect, useState } from 'react';
import './Doctors.css';
import Doctor1 from '../../Assets/Landing/Doctor1.png';
import Doctor2 from '../../Assets/Landing/Doctor2.png';
import Doctor3 from '../../Assets/Landing/Doctor3.png';

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch(`${window.API_BASE}/api/doctors/all`)
      .then(response => response.json())
      .then(data => {
        if (data.doctors) {
          const sortedDoctors = data.doctors.sort((a, b) => b.average_rating - a.average_rating);
          const topThreeDoctors = sortedDoctors.slice(0, 3);
          setDoctors(topThreeDoctors);
        }
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const doctorImages = [Doctor1, Doctor2, Doctor3];

  return (
    <div className="doctors-section">
      <h2 className="doctors-title">Our Top Doctors</h2>
      <p className="doctors-subtitle">See our highest-rated doctors ready to help you!</p>

      {/* ✅ Use doctor-grid so the CSS grid works */}
      <div className="doctor-grid">
        {doctors.map((doctor, index) => (
          <div key={doctor.doctor_id} className="doctor-card">
            {/* Top Section: Image and Rating */}
            <div className="doctor-top">
              <img
                src={doctorImages[index] || Doctor1}
                alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                className="doctor-image"
              />
              <div className="doctor-rating">
                {doctor.average_rating.toFixed(1)} ★
              </div>
            </div>

            {/* Name */}
            <h3 className="doctor-name">Dr. {doctor.first_name} {doctor.last_name}</h3>

            {/* Description */}
            <p className="doctor-description">{doctor.description}</p>

            {/* Location */}
            <p><strong>Location:</strong> {doctor.address}</p>

            {/* Phone */}
            <p><strong>Phone:</strong> {doctor.phone_number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;