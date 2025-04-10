import './Testimonials.css';
import User1 from '../../Assets/Landing/Testimonial1.jpg';
import User2 from '../../Assets/Landing/Testimonial2.jpg';
import User3 from '../../Assets/Landing/Testimonial3.jpg';

function Testimonials() {
  return (
    <div className="testimonials-section">
      <h2 className="testimonials-title">Testimonials</h2>
      <p className="testimonials-subtitle">Read What Others Have To Say</p>

      <div className="testimonial-grid">
        <div className="testimonial-card">
          <div className="testimonial-profile">
            <img src={User1} alt="User 1" />
          </div>
          <h3>Joe Biden</h3>
          <p>
          Smart EatZ is a company that can be described in one word... Iwuzindfutmhmafut....
          </p>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-profile">
            <img src={User2} alt="User 2" />
          </div>
          <h3>Donald Trump</h3>
          <p>
            Nobody does health like Smart EatZ believe me. I've seen lots of doctors, great doctors, dumb doctos, but the ones on Smart EatZ? They're the best. Maybe the greatest doctors of all time
          </p>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-profile">
            <img src={User3} alt="User 3" />
          </div>
          <h3>Spingle Bingle</h3>
          <p>
            After suffering with PTSD from CS288 with Itani, I needed mental and physical help. Smart EatZ was able to help me recover thanks to their excellent doctors, pharmacists, and support. 
          </p>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;