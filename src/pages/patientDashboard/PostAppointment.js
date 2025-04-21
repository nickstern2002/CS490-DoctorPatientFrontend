// src/pages/PostAppointmentReview.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PostAppointmentReview() {
    const navigate = useNavigate();
    const { appointment_id, doctor_id, patient_id } = useLocation().state || {};
    const [rating, setRating] = useState(5);
    const [review, setReview]   = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await fetch('/api/ratings/rate_doctor', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ patient_id, doctor_id, appointment_id, rating, review })
        });
        if (res.ok) {
            alert('Thanks for your feedback!');
            navigate('/patient');   // or wherever your patient dashboard lives
        } else {
            const err = await res.json();
            alert('Error: ' + (err.error||'Unknown'));
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
            <h2>Rate Your Appointment</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Rating (0–5):
                    <input
                        type="number"
                        min="0" max="5" step="0.5"
                        value={rating}
                        onChange={e => setRating(e.target.value)}
                        required
                    />
                </label>
                <br/><br/>
                <label>
                    Review (optional):
                    <textarea
                        rows={4}
                        value={review}
                        onChange={e => setReview(e.target.value)}
                    />
                </label>
                <br/><br/>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}
