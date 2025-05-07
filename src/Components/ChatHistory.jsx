import { useState, useEffect } from 'react';

export default function ChatHistory({ doctorId, patientId, isDoctor }) {
    const fixed = Boolean(doctorId && patientId);
    const [targetId, setTargetId]           = useState('');
    const [appointments, setAppointments]   = useState([]);
    const [selectedAppt, setSelectedAppt]   = useState('');
    const [messages, setMessages]           = useState([]);

    const resolvedDoctorId  = fixed
        ? doctorId
        : isDoctor ? doctorId : targetId;
    const resolvedPatientId = fixed
        ? patientId
        : isDoctor ? targetId : patientId;

    // 1) Once we have both IDs, fetch the appointments list
    useEffect(() => {
        if (!resolvedDoctorId || !resolvedPatientId) return;

        fetch(
            `${window.API_BASE}/api/chat/appointments`
            + `?doctor_id=${resolvedDoctorId}`
            + `&patient_id=${resolvedPatientId}`
        )
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAppointments(data);
                    // Optionally auto‑select the most recent
                    if (data.length) setSelectedAppt(data[0].appointment_id);
                }
            })
            .catch(err => console.error('❌ Error loading appointments:', err));
    }, [resolvedDoctorId, resolvedPatientId]);

    // 2) Whenever the selected appointment changes, fetch its chat
    useEffect(() => {
        if (!selectedAppt) {
            setMessages([]);
            return;
        }

        fetch(
            `${window.API_BASE}/api/chat/history`
            + `?doctor_id=${resolvedDoctorId}`
            + `&patient_id=${resolvedPatientId}`
            + `&appointment_id=${selectedAppt}`
        )
            .then(r => r.json())
            .then(data => setMessages(Array.isArray(data) ? data : []))
            .catch(err => console.error('❌ Error loading chat history:', err));
    }, [selectedAppt, resolvedDoctorId, resolvedPatientId]);

    return (
        <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
            <h3>Chat History</h3>

            {/* Pick the “other” ID if not fixed */}
            {!fixed && (
                <div style={{ marginBottom: 10 }}>
                    <label>{isDoctor ? 'Patient ID:' : 'Doctor ID:'}</label>
                    <input
                        value={targetId}
                        onChange={e => setTargetId(e.target.value)}
                        placeholder={isDoctor ? 'Enter patient ID' : 'Enter doctor ID'}
                        style={{ marginLeft: 10 }}
                    />
                </div>
            )}

            {/* Appointment selector */}
            {appointments.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                    <label>Appointment:</label>
                    <select
                        value={selectedAppt}
                        onChange={e => setSelectedAppt(e.target.value)}
                        style={{ marginLeft: 10 }}
                    >
                        {appointments.map(app => (
                            <option key={app.appointment_id} value={app.appointment_id}>
                                #{app.appointment_id} — {new Date(app.appointment_time).toLocaleString()} ({app.status})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Messages pane */}
            <div style={{
                height: 200,
                overflowY: 'scroll',
                border: '1px solid #eee',
                padding: 10,
                backgroundColor: '#f9f9f9'
            }}>
                {messages.length > 0 ? (
                    messages.map((msg, i) => (
                        <div key={i} style={{ marginBottom: 8 }}>
                            <strong>
                                {msg.sender_type === 'doctor' ? '👨‍⚕️ Doctor' : '🧑 Patient'}:
                            </strong>{' '}
                            {msg.message}
                            <div style={{ fontSize: '0.8em', color: '#888' }}>
                                {new Date(msg.sent_at).toLocaleString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#888' }}>No messages for this appointment.</p>
                )}
            </div>
        </div>
    );
}
