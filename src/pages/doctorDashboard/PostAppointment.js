import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostAppointment.css';

export default function PostAppointmentPage() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const user_id = user ? user.user_id : null;
    const { appointment_id, doctor_id, patient_id } = useLocation().state || {};

    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [drugs, setDrugs] = useState([]);
    const [selectedDrug, setSelectedDrug] = useState('');
    const [dosage, setDosage] = useState('');
    const [instructions, setInstructions] = useState('');
    const [mealPlan, setMealPlan] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');


    /* Meal Plan Const stuff*/
     // Assigns mealplan to patient
     const [selectedMealPlanId, setSelectedMealPlanId] = useState('');
     const [assignPatientId, setAssignPatientId] = useState('');
     const [officialMealPlans, setOfficialMealPlans] = useState([]);
 
     const fetchOfficialMealPlans = async () => {
         console.log("🛠 Entered fetchOfficialMealPlans"); // <- FIRST GUARANTEE
 
         try {
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
    
            
            


    // Load the five weight-loss drugs
    useEffect(() => {
        fetch('http://localhost:5001/api/prescriptions/drugs')
          .then(res => res.json())
          .then(setDrugs)
          .catch(err => console.error('Error loading drugs:', err));
    }, []);

    const handleSubmit = async e => {

        e.preventDefault();
        setSubmitting(true);
        setError('');

        // 1) Create payment
        try {
            const payRes = await fetch(
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
            const payData = await payRes.json();
            if (!payRes.ok) {
                setError(payData.error || 'Failed to create payment.');
                setSubmitting(false);
                return;
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred creating payment.');
            setSubmitting(false);
            return;
        }

        // 2) Request prescription
        try {
            const presRes = await fetch(
              'http://localhost:5001/api/prescriptions/request',
              {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      doctor_id,
                      patient_id,
                      drug_id: parseInt(selectedDrug, 10),
                      dosage,
                      instructions,
                  }),
              }
            );
            const presData = await presRes.json();
            if (!presRes.ok) {
                setError(presData.error || 'Failed to request prescription.');
                setSubmitting(false);
                return;
            }
        } catch (err) {
            console.error('Prescription error:', err);
            setError('An unexpected error occurred requesting prescription.');
            setSubmitting(false);
            return;
        }

        // 3) Confirmation & redirect
        const leave = window.confirm(
          'All done! Appointment summary & prescription submitted.\n\nOK to return to your dashboard?'
        );
        if (leave) {
            navigate('/doctors');
        } else {
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
                        <div className="form-group">
                            <label>Drug</label>
                            <select
                              value={selectedDrug}
                              onChange={e => setSelectedDrug(e.target.value)}
                              required
                              className="input"
                            >
                                <option value="">— Select a drug —</option>
                                {drugs.map(drug => (
                                  <option key={drug.drug_id} value={drug.drug_id}>
                                      {drug.name}
                                  </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dosage</label>
                            <input
                              type="text"
                              value={dosage}
                              onChange={e => setDosage(e.target.value)}
                              placeholder="e.g. 500mg"
                              required
                              className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Instructions</label>
                            <textarea
                              rows={2}
                              value={instructions}
                              onChange={e => setInstructions(e.target.value)}
                              placeholder="e.g. Take twice daily"
                              className="input"
                            />
                        </div>
                    </div>

                    <div className="section">
                        <h1>Hello from PostAppointmentPage</h1> 
                        
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
