import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostAppointment.css';

export default function PostAppointmentPage() {
    const navigate = useNavigate();
    const { appointment_id, doctor_id, patient_id } = useLocation().state || {};

    const [amount, setAmount] = useState('');
    const [paymentMessage, setPaymentMessage] = useState('');
    const [creating, setCreating] = useState(false);

    const handlePaymentSubmit = async e => {
        e.preventDefault();
        if (!amount) return;
        setCreating(true);

        try {
            const res = await fetch(
                'http://localhost:5000/api/doctor-dashboard/payments/create',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        doctor_id,
                        patient_id,
                        appointment_id,
                        amount: parseFloat(amount),
                    }),
                }
            );
            const data = await res.json();
            if (res.ok) {
                setPaymentMessage('Payment created successfully.');
                setAmount('');
            } else {
                setPaymentMessage(data.error || 'Failed to create payment.');
            }
        } catch (err) {
            console.error('Error creating payment:', err);
            setPaymentMessage('An error occurred while creating payment.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="post-page">
            <div className="post-card">
                <h2 className="card-title">Post‑Appointment Summary</h2>

                <div className="appointment-info">
                    <p><strong>Appointment #:</strong> {appointment_id}</p>
                    <p><strong>Doctor ID:</strong> {doctor_id}</p>
                    <p><strong>Patient ID:</strong> {patient_id}</p>
                </div>

                <div className="section">
                    <h3 className="section-title">Create Payment</h3>
                    <form className="form" onSubmit={handlePaymentSubmit}>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={creating}
                            className="button button-submit"
                        >
                            {creating ? 'Creating...' : 'Create Payment'}
                        </button>
                        {paymentMessage && <p className="message">{paymentMessage}</p>}
                    </form>
                </div>

                <div className="section">
                    <h3 className="section-title">Notes</h3>
                    <p className="placeholder">(Placeholder for appointment notes UI)</p>
                </div>

                <div className="section">
                    <h3 className="section-title">Prescribe Drug</h3>
                    <p className="placeholder">(Placeholder for prescription UI)</p>
                </div>

                <div className="section">
                    <h3 className="section-title">Assign Meal Plan</h3>
                    <p className="placeholder">(Placeholder for meal plan assignment UI)</p>
                </div>

                <button
                    className="button-back"
                    onClick={() => navigate('/doctors')}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
