import React, { useState } from 'react';
import './BookAppointmentModal.css'; // Create your CSS for the modal

function BookAppointmentModal({ onBook, onClose }) {
    const [appointmentTime, setAppointmentTime] = useState("");

    const handleSubmit = () => {
        // The datetime-local input typically returns a value in the format "YYYY-MM-DDTHH:MM"
        // Append ":00" if seconds are missing.
        let formattedTime = appointmentTime;
        if (formattedTime && !formattedTime.includes(':', formattedTime.indexOf('T') + 1)) {
            formattedTime += ":00";
        }
        onBook(formattedTime);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Book Appointment</h3>
                <input
                    type="datetime-local"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default BookAppointmentModal;
