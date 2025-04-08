import './Doctors.css';
import Doctor1 from '../../Assets/Landing/Doctor1.png';
import Doctor2 from '../../Assets/Landing/Doctor2.png';
import Doctor3 from '../../Assets/Landing/Doctor3.png';

function Doctors() {
  return (
    <div className="doctors-section">
      <h2 className="doctors-title">Doctors</h2>
      <p className="doctors-subtitle">See our doctors right now!</p>

      <div className="doctor-grid">
        {/* Doctor 1 */}
        <div className="doctor-card">
          <div className="doctor-top">
            <img src={Doctor1} alt="Dr. Smith" className="doctor-image" />
            <div className="doctor-rating">⭐⭐⭐⭐⭐ 4.9</div>
          </div>
          <h3 className="doctor-name">Gregory House</h3>
          <p className="doctor-description">
            Extremely mean but gets results done. There has never been any deaths under him and he is worth trusting your life with if you don’t mind your emotions being hurt.
          </p>
        </div>

        {/* Doctor 2 */}
        <div className="doctor-card">
          <div className="doctor-top">
            <img src={Doctor2} alt="Dr. Johnson" className="doctor-image" />
            <div className="doctor-rating">⭐⭐⭐ 3.0</div>
          </div>
          <h3 className="doctor-name">Jeffery Dahmer</h3>
          <p className="doctor-description">
            Mostly good reviews with him. However, patients have been known to have parts of them missing after he is done treating them. Regardless, you’ll still be fine.... probably...
          </p>
        </div>

        {/* Doctor 3 */}
        <div className="doctor-card">
          <div className="doctor-top">
            <img src={Doctor3} alt="Dr. Kim" className="doctor-image" />
            <div className="doctor-rating">⭐⭐⭐⭐⭐ 4.8</div>
          </div>
          <h3 className="doctor-name">Morgan Freeman</h3>
          <p className="doctor-description">
            Very good doctor and has a very relaxing voice. If you’re nervous, he will calm your nerves down for sure. Honestly should be a voice actor but he’s a qualified doctor instead.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Doctors;