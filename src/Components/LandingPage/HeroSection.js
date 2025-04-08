import './HeroSection.css';
import HeroImage from '../../Assets/Landing/Hero.png';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Find The Best Doctor For <span className="highlight">YOU</span></h1>
          <p>Use <strong>Smart EatZ</strong> to connect with qualified doctors who care about your health.</p>
          <button className="hero-btn">Get Started</button>
        </div>

        <div className="hero-image">
          <img src={HeroImage} alt="Healthy lifestyle" />
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-box"><h2>24/7</h2><p>Online Support</p></div>
        <div className="divider" />
        <div className="stat-box"><h2>100+</h2><p>Qualified Doctors</p></div>
        <div className="divider" />
        <div className="stat-box"><h2>1M+</h2><p>Active Patient</p></div>
        <div className="divider" />
        <div className="stat-box"><h2>5/5</h2><p>Star Reviews</p></div>
        <div className="divider" />
        <div className="stat-box"><h2>100%</h2><p>Health Guaranteed</p></div>
      </div>
    </section>
  );
}

export default HeroSection;