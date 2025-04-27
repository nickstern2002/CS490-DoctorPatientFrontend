import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostAppointment.css';

export default function PostAppointmentPage() {
    const navigate = useNavigate();
    const { appointment_id, doctor_id, patient_id } = useLocation().state || {};

    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [prescription, setPrescription] = useState('');
    const [mealPlan, setMealPlan] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    /* Meal Plan Const stuff*/
     // Assigns mealplan to patient
     const [selectedMealPlanId, setSelectedMealPlanId] = useState('');
     const [assignPatientId, setAssignPatientId] = useState('');
     const [officialMealPlans, setOfficialMealPlans] = useState([]);
     localStorage.setItem('user_id', '6');
 
     const fetchOfficialMealPlans = async () => {
         console.log("🛠 Entered fetchOfficialMealPlans"); // <- FIRST GUARANTEE
 
         try {
             const user_id = localStorage.getItem("user_id");
             console.log("🛠 user_id from localStorage:", user_id); // <- SECOND GUARANTEE
 
             if (!user_id) {
                 console.error("🛠 No user_id found. Cannot fetch mealplans.");
                 return;
             }
 
             const response = await fetch(`http://localhost:5000/doctor-dashboard/official/all?user_id=${user_id}`);
             console.log("🛠 Got fetch response:", response); // <- THIRD GUARANTEE
 
             const data = await response.json();
             console.log("🛠 Full fetched data:", data);
 
             if (response.ok) {
                 setOfficialMealPlans(data.mealplans || []);
             } else {
                 console.error("Error fetching official mealplans:", data.error);
             }
         } catch (err) {
             console.error("🛠 Caught fetch error:", err);
         }
     };
 
     useEffect(() => {
         console.log("🛠 useEffect running");
         fetchOfficialMealPlans();
     }, []);
 
    
            const assignMealPlanToPatient = async () => {
                const user_id = localStorage.getItem("user_id"); // fresh inside
            
                if (!selectedMealPlanId || !assignPatientId) {
                    alert("Please select a mealplan and enter a patient ID.");
                    return;
                }
            
                try {
                    const response = await fetch('http://localhost:5000/doctor-dashboard/assign-mealplan', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: user_id,
                            patient_id: assignPatientId,
                            meal_plan_id: selectedMealPlanId
                        })
                    });
            
                    const data = await response.json();
                    if (response.ok) {
                        alert("Mealplan assigned successfully!");
                        setSelectedMealPlanId('');
                        setAssignPatientId('');
                    } else {
                        alert("Error: " + data.error);
                    }
                } catch (err) {
                    console.error("Error assigning mealplan:", err);
                    alert("An error occurred while assigning the mealplan.");
                }
            };
    
            
            

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        // Only payment is wired for now:
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
            if (!res.ok) {
                setError(data.error || 'Failed to create payment.');
                setSubmitting(false);
                return;
            }
            // if we wanted to send notes/prescriptions later, we'd fire those off here too


            // *** confirmation popup ***
            const leave = window.confirm(
                'Resulted submitted successfully!\n\nPress OK to return to your dashboard.'
            );
            if (leave) navigate('/doctors');

        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred.');
            setSubmitting(false);
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

                <form className="form" onSubmit={handleSubmit}>
                    <div className="section">
                        <h3 className="section-title">Create Payment</h3>
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
                    </div>

                    <div className="section">
                        <h3 className="section-title">Notes</h3>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Enter any follow‑up notes..."
                            className="input"
                        />
                    </div>

                    <div className="section">
                        <h3 className="section-title">Prescribe Drug</h3>
                        <input
                            type="text"
                            value={prescription}
                            onChange={e => setPrescription(e.target.value)}
                            placeholder="e.g. Metformin 500mg"
                            className="input"
                        />
                    </div>

                    <div className="section">
                        <h1>Hello from PostAppointmentPage</h1> {/* 👈 THIS IS THE TEST LINE */}
                        
                        <h3 className="section-title">Assign Meal Plan</h3>

                        <select
                        value={selectedMealPlanId}
                        onChange={(e) => setSelectedMealPlanId(e.target.value)}
                        className="input"
                        >
                        <option value="">Select a mealplan...</option>
                        {officialMealPlans.map(plan => (
                            <option key={plan.meal_plan_id} value={plan.meal_plan_id}>
                            {plan.title}
                            </option>
                        ))}
                        </select>

                        <input
                        type="text"
                        placeholder="Enter Patient ID"
                        value={assignPatientId}
                        onChange={(e) => setAssignPatientId(e.target.value)}
                        className="input"
                        />

                        <button
                        onClick={assignMealPlanToPatient}
                        disabled={!selectedMealPlanId || !assignPatientId}
                        >
                        Assign Mealplan
                        </button>
                    </div>

                    {error && <p className="message" style={{ color: '#b91c1c' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="button button-submit"
                    >
                        {submitting ? 'Finishing...' : 'Finish Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
