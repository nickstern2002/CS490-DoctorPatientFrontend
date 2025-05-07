import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostAppointment.css';

export default function PostAppointmentReview() {
    const navigate = useNavigate();
    const { appointment_id, doctor_id, patient_id } = useLocation().state || {};

    const [rating, setRating]         = useState(5);
    const [review, setReview]         = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            patient_id,
            doctor_id,
            appointment_id,
            rating: parseFloat(rating),
            review
        };

        const res = await fetch(
            `${window.API_BASE}/api/post-appointment/ratings/rate_doctor`,
            {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(payload)
            }
        );

        if (res.ok) {
            alert('Thanks for your feedback!');
            navigate('/patient');
        } else {
            const err = await res.json();
            alert('Error: ' + (err.error||'Unknown'));
            setSubmitting(false);
        }
    };

    return (
        <div className="review-page">
            <div className="review-card">
                <h2 className="review-title">Rate Your Appointment</h2>

                <form className="review-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Rating (0–5)</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Review (optional)</label>
                        <textarea
                            rows="4"
                            value={review}
                            onChange={e => setReview(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting…' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
}
